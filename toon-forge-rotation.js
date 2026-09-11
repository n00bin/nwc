/* ============================================================
   Toon Forge — rotation simulator (ROT-1 / ROT-2, locked 2026-09-11)
   ------------------------------------------------------------
   A timeline over the fight (ROT-3, 2026-09-11): an OPENER list runs once, then a
   LOOP list repeats to the end. Both are scripts: every entry casts in order,
   at-wills included. A step on cooldown is waited for (the filler at-will is
   woven in) unless the wait would exceed 5 s, then it is skipped. Soul Scorch
   in a list casts at its turn with whatever sparks are held (min 6); the
   fire-at-N policy only auto-fires when Scorch is in no list. Artifact / mount
   powers cast at their list position, or on their own when up if not listed. Tracks cooldowns (charges, escalation, Recharge Speed),
   action points, cast times and channels, and the Hellbringer layers that the
   power review recorded as data blocks:
     - Curse (8 s, apply / consume / synergy tags, All-Consuming Curse,
       Deadly Curse, Parting Blasphemy)
     - Soul Sparks (soulSparks blocks, Soul Scorch spend at a fire-at-N policy,
       Double Scorch, Soul Spark Recovery, No Pity No Mercy, Dark Prayers,
       Dark One's Blessing)
     - Soul Puppet + Soul Investiture (summon block, Power of the Nine Hells,
       Soul Desecration)
     - standing DoTs (dotBlock, "AxB" pulse magnitudes, hazard fields, summon
       imps, Creeping Death)
   Pure: no DOM, no page globals. The page adapter builds `input` from the
   build; this file only simulates. Also loadable in node for tests.

   Output magnitudes are RAW power magnitudes (the same scale the rate model
   used); stat multipliers (Power, crit, Damage Bonus...) are applied later by
   computeDpsExpectedDamage. Stat-side mechanics (Warlock's Curse, Soul Spark
   stacks, Investiture stacks) come back as `derived` numbers for the engine.
   ============================================================ */
(function (root) {
  "use strict";

  function num(v, d) { const n = +v; return isFinite(n) ? n : (d || 0); }
  function parseMag(m) {
    if (typeof m === "number") return { per: m, count: 1, total: m };
    if (typeof m === "string") {
      const mm = m.match(/([\d.]+)\s*[x×]\s*(\d+)/i);
      if (mm) { const per = parseFloat(mm[1]), c = parseInt(mm[2], 10); return { per: per, count: c, total: per * c }; }
      const n = parseFloat(m); return { per: isNaN(n) ? 0 : n, count: 1, total: isNaN(n) ? 0 : n };
    }
    return { per: 0, count: 1, total: 0 };
  }
  function powerMagnitude(p, enemyHealthPct) {
    if (!p) return 0;
    if (p.magnitudeRange && p.magnitudeRange.min != null && p.magnitudeRange.max != null) {
      const miss = Math.max(0, Math.min(1, 1 - num(enemyHealthPct, 100) / 100));
      return num(p.magnitudeRange.min) + (num(p.magnitudeRange.max) - num(p.magnitudeRange.min)) * miss;
    }
    if (p.magnitude != null) return parseMag(p.magnitude).total;
    if (p.minMagnitude != null && p.maxMagnitude != null) return (num(p.minMagnitude) + num(p.maxMagnitude)) / 2;
    return 0;
  }

  // Default order when the player has not built a list: strongest per cast first
  // (encounters and dailies), at-wills last. The best at-will becomes the filler.
  function defaultSteps(powers) {
    const rows = [];
    ["encounter", "daily"].forEach(function (k) {
      (powers[k] || []).forEach(function (p) { rows.push({ kind: k, name: p.name, mag: powerMagnitude(p, 100) }); });
    });
    rows.sort(function (a, b) { return b.mag - a.mag; });
    const aws = (powers.atWill || []).slice().map(function (p) {
      const cast = num(p.castSeconds, 0) || 1; return { kind: "atWill", name: p.name, mps: powerMagnitude(p, 100) / cast };
    }).sort(function (a, b) { return b.mps - a.mps; });
    return rows.map(function (r) { return { kind: r.kind, name: r.name }; }).concat(aws.map(function (a) { return { kind: "atWill", name: a.name }; }));
  }

  function simulate(input) {
    const T = Math.max(10, num(input.fightSeconds, 120));
    const dt = num(input.dt, 0.1);
    const rsi = num(input.rechargePct, 0) / 100;
    const apg = num(input.apGainPct, 0) / 100;
    const AP_PER_SEC = num(input.apPerSec, 40) * (1 + apg);
    const cad = Object.assign({ daily: 60, artifact: 60, mountpower: 60 }, input.cadence || {});
    const feats = input.feats || {};
    const feats_ = function (n) { return !!feats[n]; };
    const features = input.features || {};
    const feature_ = function (n) { return !!features[n]; };
    const powers = { atWill: input.powers.atWill || [], encounter: input.powers.encounter || [], daily: input.powers.daily || [] };
    const byName = {};
    ["atWill", "encounter", "daily"].forEach(function (k) { powers[k].forEach(function (p) { byName[k + ":" + p.name] = p; }); });
    const scorch = input.scorch || null;               // { minSparks, maxSparks, magnitudePerSpark, dotMagnitudePerSpark, dotSeconds, castSeconds }
    const scorchAt = Math.max(6, Math.min(18, num(input.scorchAtSparks, 18)));
    const hasSparks = !!scorch || powers.atWill.concat(powers.encounter, powers.daily).some(function (p) { return p && p.soulSparks; });
    const puppetDef = input.puppet || null;            // { attackMagnitude, attacksPerSecond, durationSeconds }
    const enemyHp = num(input.enemyHealthPct, 100);

    const clean = function (a) { return Array.isArray(a) ? a.filter(function (s) { return s && s.kind && s.name; }) : []; };
    let opener = clean(input.opener);
    let loop = clean(input.loop).length ? clean(input.loop) : clean(input.steps);   // legacy `steps` = loop
    let defaultOrderUsed = false;
    if (!loop.length && opener.length) loop = opener.slice();           // no loop: the opener repeats
    if (!loop.length) { loop = defaultSteps(powers); defaultOrderUsed = true; }
    // "Listed" is judged against the list currently running: something in the opener
    // but not the loop fires on its own once the loop starts (artifact, mount, dailies).
    const listedIn = function (list, kind, name) { return list.some(function (s) { return s.kind === kind && (name == null || s.name === name); }); };
    const steps = loop;   // exposed in the result
    const MAX_WAIT = 5;   // seconds: wait (weaving the filler) for a step this close to ready, else skip it

    // ---- per-power runtime state ----
    const st = {};
    function pst(key) { if (!st[key]) st[key] = { ready: [0], uses: 0, lastUse: -1e9 }; return st[key]; }
    function cdSeconds(p, s, t) {
      let base = num(p.cooldownSeconds, 0) || num(p.rechargeSeconds, 0);
      if (base <= 0) return 0;
      if (p.cooldownEscalation) {
        const e = p.cooldownEscalation;
        if (t - s.lastUse > num(e.resetAfterSeconds, 10)) s.uses = 0;
        base = base + num(e.perUseSeconds, 2) * s.uses;
      } else if (base < 2) {
        base = 6;   // data guard (same as the rate model): sub-2 s cooldowns are capture errors
      }
      return base / (1 + rsi);
    }
    function chargesOf(p) { return Math.max(1, num(p.charges, 1)); }

    // ---- fight state ----
    let t = 0, busyUntil = 0, ap = 0, stepIdx = 0;
    let lastDaily = -1e9, artifactReady = 0, mountReady = 0;
    const events = [];                                   // {t, mag, source, kind, hit, sparks}
    let magTotal = 0;
    const bySource = {}, castCount = {}, mix = { atWill: 0, encounter: 0, daily: 0, other: 0 };
    const timeline = [];
    const TIMELINE_MAX = 80;

    // Curse layer
    let curseUntil = -1, curseTime = 0, curseApplies = 0, curseConsumes = 0, curseExpiries = 0;
    const allConsuming = feature_("All-Consuming Curse");
    function cursed() { return curseUntil > t; }
    function applyCurse(src) {
      if (!cursed()) { /* fresh */ }
      curseUntil = t + 8; curseApplies++;
      if (feature_("Deadly Curse")) addMag(25, "Deadly Curse", "feature", false);
    }
    function consumeCurse(src) {
      if (!cursed()) return false;
      curseUntil = -1; curseConsumes++;
      if (feats_("Parting Blasphemy")) addMag(85, "Parting Blasphemy", "feat", false);
      return true;
    }

    // Spark layer
    let sparks = 0, sparkTimeSum = 0, sparkMax = 0, scorchCasts = 0, sparksSpentTotal = 0;
    function addSparks(n) { if (!hasSparks || !(n > 0)) return; sparks = Math.min(30, sparks + n); if (sparks > sparkMax) sparkMax = sparks; }

    // Puppet / Investiture layer
    let puppetUntil = -1, puppetTime = 0, puppetNextAttack = 0, investiture = [], investSum = 0;
    const desecration = feats_("Soul Desecration");
    function puppetUp() { return desecration ? true : puppetUntil > t; }
    function summonPuppet(src) {
      if (!puppetDef) return;
      const dur = num(puppetDef.durationSeconds, 20);
      if (puppetUp() && (desecration || puppetUntil > t)) {
        investiture.push(t + 20);                       // re-summon = refresh + a stack
        if (!desecration) puppetUntil = t + dur;
      } else {
        puppetUntil = t + dur; puppetNextAttack = t + 1 / Math.max(0.1, num(puppetDef.attacksPerSecond, 1));
      }
    }
    function investStacks() { investiture = investiture.filter(function (x) { return x > t; }); return Math.min(5, investiture.length); }

    // Creeping Death
    let creeping = [], creepingSum = 0, creepingNextTick = 2;
    const creepingOn = feats_("Creeping Death");

    function addMag(mag, source, kind, isHit, extra) {
      if (!(mag > 0)) return;
      magTotal += mag; bySource[source] = (bySource[source] || 0) + mag;
      if (kind === "atWill" || kind === "encounter" || kind === "daily") mix[kind] += mag; else mix.other += mag;
      if (isHit) {
        if (creepingOn) { creeping = creeping.filter(function (x) { return x > t; }); if (creeping.length < 5) creeping.push(t + 10); }
        if (extra && extra.curseRefresh && cursed()) curseUntil = t + 8;
      }
    }
    function schedule(at, mag, source, kind, isHit, extra) { events.push({ t: at, mag: mag, source: source, kind: kind, hit: isHit, extra: extra || null }); }
    function flushEvents() {
      for (let i = events.length - 1; i >= 0; i--) {
        const e = events[i];
        if (e.t <= t) {
          let m = e.mag;
          if (e.extra && e.extra.synergyMult && cursed()) m *= e.extra.synergyMult;
          addMag(m, e.source, e.kind, e.hit, e.extra);
          if (e.extra && e.extra.sparks) addSparks(e.extra.sparks);
          events.splice(i, 1);
        }
      }
    }
    function pushTimeline(name, kind, mag, note) { if (timeline.length < TIMELINE_MAX) timeline.push({ t: Math.round(t * 10) / 10, name: name, kind: kind, mag: Math.round(mag), note: note || "" }); }

    // ---- casting ----
    function sparksFor(p, cursedNow) {
      const sp = p.soulSparks; if (!sp) return 0;
      if (feature_("No Pity, No Mercy") && p.name === "Hellish Rebuke") return 3;
      if (cursedNow && sp.perCastCursed != null) return num(sp.perCastCursed);
      return num(sp.perCast, 0);
    }
    function castPower(kind, p) {
      const s = pst(kind + ":" + p.name);
      const castSec = num(p.channelSeconds, 0) > 0 ? num(p.channelSeconds) : num(p.castSeconds, 0);
      busyUntil = t + Math.max(0.1, castSec);
      s.uses++; s.lastUse = t; castCount[p.name] = (castCount[p.name] || 0) + 1;
      const wasCursed = cursed();
      const curseTag = p.tags && p.tags.curse;
      let note = "";
      // Curse interactions decided at cast
      let consumed = false;
      if (kind !== "atWill" && curseTag === "consume") { consumed = consumeCurse(p.name); if (consumed) note = "Curse consumed"; }
      const synergyOn = (curseTag === "synergy") && wasCursed;
      // magnitude split
      const mag = powerMagnitude(p, enemyHp);
      let total = 0;
      if (p.name === "Curse Bite" && !wasCursed) { note = "no Cursed target - no damage"; }
      else if (p.dotBlock) {
        const hit = num(p.dotBlock.hitMagnitude, 0) + ((consumed && p.dotBlock.cursed) ? num(p.dotBlock.cursed.hitBonus, 0) : 0);
        const ticks = Math.max(1, num(p.dotBlock.ticks, 1)), dotSec = num(p.dotBlock.dotSeconds, ticks);
        schedule(t + castSec, hit, p.name, kind, true, { sparks: sparksFor(p, wasCursed) });
        const noDot = feature_("No Pity, No Mercy") && p.name === "Hellish Rebuke";
        if (!noDot) {
          const key = "dot:" + p.name; for (let ei = events.length - 1; ei >= 0; ei--) { if (events[ei].extra && events[ei].extra.dotKey === key) events.splice(ei, 1); }   // refresh, never stack (old ticks gone: no damage AND no sparks)
          const perTick = num(p.dotBlock.dotMagnitude, 0) / ticks;
          for (let i = 1; i <= ticks; i++) schedule(t + castSec + dotSec * i / ticks, perTick, p.name + " (burn)", kind, true, { dotKey: key, sparks: (p.soulSparks && p.soulSparks.perTick) ? num(p.soulSparks.perTick) : 0 });
        } else { total += 15; schedule(t + castSec, 15, p.name, kind, false); }
        total += hit;
      } else if (p.hazard) {
        schedule(t + castSec, num(p.hazard.blastMagnitude, 0), p.name, kind, true, { sparks: 1 });
        const n = num(p.hazard.fieldTicks, 5), per = num(p.hazard.fieldMagnitudePerTick, 0), sec = num(p.hazard.fieldSeconds, 5);
        for (let i = 1; i <= n; i++) schedule(t + castSec + sec * i / n, per, p.name + " (field)", kind, true, { sparks: 1 });
        total = num(p.hazard.blastMagnitude, 0) + per * n;
      } else if (p.summon && p.summon.imps) {
        schedule(t + castSec, num(p.summon.directHitMagnitude, 0), p.name, kind, true, { sparks: 1 });
        const n = num(p.summon.imps, 6), per = num(p.summon.impAttackMagnitude, 0), sec = num(p.summon.impSeconds, 10);
        for (let i = 1; i <= n; i++) schedule(t + castSec + sec * i / (n + 1), per, p.name + " (imps)", kind, true, { sparks: 1 });
        total = num(p.summon.directHitMagnitude, 0) + per * n;
      } else if (typeof p.magnitude === "string" && parseMag(p.magnitude).count > 1) {
        // "AxB" pulses spread over the duration / channel (Blades, Dreadtheft)
        const pm = parseMag(p.magnitude), sec = num(p.channelSeconds, 0) > 0 ? num(p.channelSeconds) : (num(p.durationSeconds, 0) || castSec);
        for (let i = 1; i <= pm.count; i++) schedule(t + (num(p.channelSeconds, 0) > 0 ? 0 : castSec) + sec * i / pm.count, pm.per, p.name, kind, true, { synergyMult: (curseTag === "synergy") ? 1.5 : 0, sparks: 1, curseRefresh: curseTag === "synergy" });
        total = pm.total;
      } else if (Array.isArray(p.comboMagnitudes) && p.comboMagnitudes.length) {
        const i = (s.uses - 1) % p.comboMagnitudes.length; const m = num(p.comboMagnitudes[i], mag);
        const sp = (p.soulSparks && p.soulSparks.perCombo != null && i === p.comboMagnitudes.length - 1) ? num(p.soulSparks.perCombo) : sparksFor(p, wasCursed) * (p.soulSparks && p.soulSparks.perCombo != null ? 0 : 1);
        schedule(t + castSec, m, p.name, kind, true, { sparks: sp }); total = m;
      } else {
        let m = mag;
        if (synergyOn && p.cursedMagnitude != null) { m = num(p.cursedMagnitude); note = "Cursed: " + m; }
        schedule(t + castSec, m, p.name, kind, true, { sparks: sparksFor(p, wasCursed) });
        total = m;
      }
      // apply / summon side effects
      if (kind !== "atWill" && curseTag === "apply") applyCurse(p.name);
      if (kind === "atWill" && allConsuming) applyCurse(p.name);
      if (consumed && p.dotBlock && p.dotBlock.cursed && p.dotBlock.cursed.summonPuppet) summonPuppet(p.name);
      if (kind === "daily" && p.name === "Soul Siphon") summonPuppet(p.name);
      if (kind !== "atWill" && curseTag === "apply" && feats_("Power of the Nine Hells")) summonPuppet(p.name);
      // cooldown / AP bookkeeping
      if (kind === "encounter") {
        const cd = cdSeconds(p, s, t);
        const n = chargesOf(p); while (s.ready.length < n) s.ready.push(0);
        // consume the earliest ready charge
        s.ready.sort(function (a, b) { return a - b; }); s.ready[0] = t + cd;
      } else if (kind === "daily") { ap -= num(p.actionPointCost, 1000); lastDaily = t; }
      pushTimeline(p.name, kind, total, note);
    }
    function castScorch() {
      const spend = Math.min(18, Math.floor(sparks));
      if (spend < num(scorch.minSparks, 6)) return false;
      busyUntil = t + Math.max(0.1, num(scorch.castSeconds, 1));
      sparks -= spend; sparksSpentTotal += spend; scorchCasts++;
      const perHit = num(scorch.magnitudePerSpark, 25) + (feats_("Double Scorch") ? 25 : 0);
      schedule(busyUntil, perHit * spend, "Soul Scorch", "encounter", true);
      const dotPer = num(scorch.dotMagnitudePerSpark, 25) * spend, dsec = num(scorch.dotSeconds, 6);
      for (let i = 1; i <= dsec; i++) schedule(busyUntil + i, dotPer / dsec, "Soul Scorch (burn)", "encounter", true);
      if (feats_("Soul Spark Recovery")) { const cut = spend / 6; Object.keys(st).forEach(function (k) { if (k.indexOf("encounter:") === 0) st[k].ready = st[k].ready.map(function (r) { return r - cut; }); }); }
      castCount["Soul Scorch"] = (castCount["Soul Scorch"] || 0) + 1;
      pushTimeline("Soul Scorch", "encounter", perHit * spend + dotPer, spend + " sparks");
      return true;
    }
    function isReady(step) {
      if (step.kind === "scorch") return !!scorch && sparks >= num(scorch.minSparks, 6);   // ROT-3: a listed Scorch is cast for the cooldown cut, with whatever is held
      if (step.kind === "artifact") return t >= artifactReady;
      if (step.kind === "mount") return t >= mountReady;
      const p = byName[step.kind + ":" + step.name]; if (!p) return false;
      if (step.kind === "atWill") return true;
      if (step.kind === "encounter") {
        if (p.name === "Curse Bite" && !cursed()) return false;
        const s = pst("encounter:" + p.name); const n = chargesOf(p); while (s.ready.length < n) s.ready.push(0);
        return s.ready.some(function (r) { return r <= t; });
      }
      if (step.kind === "daily") { const sd = pst("daily:" + p.name); return ap >= num(p.actionPointCost, 1000) && t >= sd.lastUse + cad.daily; }   // each daily has its own cooldown; the AP bar is shared
      return false;
    }
    // Seconds until a step could be cast (Infinity = unknown / far). Used by the
    // script rule: wait (weave the filler) if close, skip if far.
    function waitFor(step) {
      if (step.kind === "atWill") return 0;
      if (step.kind === "scorch") return (!!scorch && sparks >= num(scorch.minSparks, 6)) ? 0 : Infinity;
      if (step.kind === "artifact") return Math.max(0, artifactReady - t);
      if (step.kind === "mount") return Math.max(0, mountReady - t);
      const p = byName[step.kind + ":" + step.name]; if (!p) return Infinity;
      if (step.kind === "encounter") {
        if (p.name === "Curse Bite" && !cursed()) return Infinity;
        const s2 = pst("encounter:" + p.name); const n = chargesOf(p); while (s2.ready.length < n) s2.ready.push(0);
        return Math.max(0, Math.min.apply(null, s2.ready) - t);
      }
      if (step.kind === "daily") {
        const sd = pst("daily:" + p.name); const cost = num(p.actionPointCost, 1000);
        const apWait = ap >= cost ? 0 : (cost - ap) / Math.max(1, AP_PER_SEC);
        return Math.max(apWait, sd.lastUse + cad.daily - t, 0);
      }
      return Infinity;
    }
    function castStep(step) {
      if (step.kind === "scorch") return castScorch();
      if (step.kind === "artifact") { artifactReady = t + cad.artifact; busyUntil = t + 0.5; castCount["Artifact"] = (castCount["Artifact"] || 0) + 1; pushTimeline(step.name || "Artifact", "other", 0, "trigger only"); return true; }
      if (step.kind === "mount") { mountReady = t + cad.mountpower; busyUntil = t + 0.5; castCount["Mount power"] = (castCount["Mount power"] || 0) + 1; pushTimeline(step.name || "Mount power", "other", 0, "trigger only (mount burst layer scores it)"); return true; }
      const p = byName[step.kind + ":" + step.name]; if (!p) return false;
      castPower(step.kind, p); return true;
    }
    const fillerStep = loop.find(function (s) { return s.kind === "atWill"; }) || opener.find(function (s) { return s.kind === "atWill"; }) || (function () {
      const d = defaultSteps(powers).find(function (s) { return s.kind === "atWill"; }); return d || null;
    })();

    // Dark One's Blessing: 6 sparks on combat start
    if (feature_("Dark One's Blessing")) addSparks(6);
    if (desecration && puppetDef) { puppetUntil = 1e9; puppetNextAttack = 1; }

    // ---- main loop (script): opener once, then the loop repeats ----
    let phase = opener.length ? "opener" : "loop", ptr = 0;
    let cyclesDone = 0, firstCycleEnd = null;
    const curList = function () { return phase === "opener" ? opener : loop; };
    const advance = function () {
      ptr++;
      if (ptr >= curList().length) {
        if (phase === "opener") { phase = "loop"; ptr = 0; if (firstCycleEnd === null) firstCycleEnd = t; }
        else { ptr = 0; cyclesDone++; if (firstCycleEnd === null) firstCycleEnd = t; }
      }
    };
    while (t < T) {
      flushEvents();
      // time-weighted derived stats
      if (cursed()) curseTime += dt;
      if (hasSparks) sparkTimeSum += sparks * dt;
      if (puppetDef && puppetUp()) puppetTime += dt;
      investSum += investStacks() * dt;
      // expiries
      if (curseUntil > 0 && curseUntil <= t) { curseUntil = -1; curseExpiries++; if (feats_("Parting Blasphemy")) addMag(85, "Parting Blasphemy", "feat", false); }
      // puppet attacks
      if (puppetDef && puppetUp() && t >= puppetNextAttack) {
        puppetNextAttack = t + 1 / Math.max(0.1, num(puppetDef.attacksPerSecond, 1));
        const pm = num(puppetDef.attackMagnitude, 60) * (desecration ? 2 : 1) * (1 + 0.1 * investStacks());
        addMag(pm, "Soul Puppet", "other", false);
        if (feature_("Dark Prayers")) addSparks(1);
      }
      // creeping death ticks
      if (creepingOn && t >= creepingNextTick) { creepingNextTick += 2; creeping = creeping.filter(function (x) { return x > t; }); creepingSum += creeping.length; if (creeping.length) addMag(25 * creeping.length, "Creeping Death", "feat", false); }
      // act
      if (t >= busyUntil) {
        let acted = false;
        // things that fire on their own when not in the current list: Scorch at the
        // fire-at policy, artifact / mount when up, dailies when the bar is full
        const cur = curList();
        if (scorch && hasSparks && !listedIn(cur, "scorch") && sparks >= scorchAt) acted = castScorch();
        if (!acted && !listedIn(cur, "artifact") && input.artifactName && t >= artifactReady) acted = castStep({ kind: "artifact", name: input.artifactName });
        if (!acted && !listedIn(cur, "mount") && input.mountName && t >= mountReady) acted = castStep({ kind: "mount", name: input.mountName });
        if (!acted) for (let di = 0; di < powers.daily.length && !acted; di++) { const dp = powers.daily[di]; const ds = { kind: "daily", name: dp.name }; if (!listedIn(cur, "daily", dp.name) && isReady(ds)) acted = castStep(ds); }
        if (!acted) {
          // script rule: cast the current step; wait (weave the filler) if it is close; skip it if far
          let guard = 0;
          while (!acted && guard++ < 64) {
            const list = curList(); if (!list.length) break;
            const step = list[ptr];
            const w = waitFor(step);
            if (w <= 0 && isReady(step)) { acted = castStep(step); advance(); }
            else if (w <= MAX_WAIT) { break; }                 // close: weave one filler cast, then re-check this step
            else { advance(); }                                 // far: skip it
          }
        }
        if (!acted && fillerStep) { const p = byName["atWill:" + fillerStep.name]; if (p) castPower("atWill", p); else busyUntil = t + dt; }
        if (!acted && !fillerStep) busyUntil = t + dt;
      }
      ap += AP_PER_SEC * dt;
      t += dt;
    }
    flushEvents();

    const mps = magTotal / T;
    const derived = {
      curseUptime: Math.min(1, curseTime / T), curseApplies: curseApplies, curseConsumes: curseConsumes, curseExpiries: curseExpiries,
      sparksAvg: hasSparks ? sparkTimeSum / T : null, sparksMax: hasSparks ? sparkMax : null, scorchCasts: scorchCasts, sparksSpent: sparksSpentTotal,
      puppetUptime: puppetDef ? Math.min(1, puppetTime / T) : null, investitureAvg: puppetDef ? investSum / T : null,
      creepingDeathAvgStacks: creepingOn ? creepingSum / Math.max(1, Math.floor(T / 2)) : null
    };
    const totalMix = mix.atWill + mix.encounter + mix.daily + mix.other;
    return {
      fightSeconds: T, mps: mps, magnitudeTotal: magTotal, defaultOrderUsed: defaultOrderUsed, steps: steps, opener: opener, loop: loop,
      casts: castCount, bySource: bySource, timeline: timeline, firstCycleEnd: firstCycleEnd, cycles: cyclesDone,
      mix: { atWill: mix.atWill, encounter: mix.encounter, daily: mix.daily, other: mix.other, pct: totalMix > 0 ? { atWill: mix.atWill / totalMix * 100, encounter: mix.encounter / totalMix * 100, daily: mix.daily / totalMix * 100, other: mix.other / totalMix * 100 } : null },
      derived: derived
    };
  }

  const api = { simulate: simulate, defaultSteps: defaultSteps, powerMagnitude: powerMagnitude, parseMag: parseMag, VERSION: "2026-09-11a" };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.TF_ROTATION_SIM = api;
})(typeof window !== "undefined" ? window : globalThis);
