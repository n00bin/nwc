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
   used). The page's damage score does not multiply them; the optimizer scales
   its per-hit score by magnitude/s. PT2 step 2.4: simulateFx can also score
   every hit through input.scoreHit (the page passes dpsHitDamage with the
   buffs up at that moment) and returns damageTotal / dps. Stat-side mechanics (Warlock's Curse, Soul Spark
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


  /* ------------------------------------------------------------------
     POWER-TAGS-2 step 2.3: the tag-driven simulator. Same fight script as
     simulate() (opener once, loop repeats, wait <= 5 s else skip, filler
     at-will, dailies / artifact / mount / spender on their own when not
     listed), but every effect comes from the `fx` records
     (docs/plans/effect_vocabulary.md). No power, feat or class name is
     written in this function: names come only from the data.

     input = simulate()'s input plus
       kit: { powers: {atWill, encounter, daily}, mechanics: [], features: [], feats: [], always: [] }
            (the objects themselves, so their fx travel with them)
       paragon, caps {stack: max}, modes {powerName: modeName}, fight {beingAttacked: bool, ...},
       spendAt (the fire-at-N policy for a spender mechanic; legacy scorchAtSparks)
     Output = simulate()'s shape (mps, bySource, casts, timeline, mix, derived)
       plus byOwner and stacksAvg / buffUptime for every name the data uses.
     Magnitudes stay RAW (step 2.4 adds per-hit stat multipliers).
     ------------------------------------------------------------------ */
  function simulateFx(input) {
    const T = Math.max(10, num(input.fightSeconds, 120));
    const dt = num(input.dt, 0.1);
    const rsi = num(input.rechargePct, 0) / 100;
    const AP_PER_SEC = num(input.apPerSec, 40) * (1 + num(input.apGainPct, 0) / 100);
    const cad = Object.assign({ daily: 60, artifact: 60, mountpower: 60 }, input.cadence || {});
    const kit = input.kit || {};
    const paragon = input.paragon || null;
    // stack rules: class fxStacks {name: {max, seconds, refresh}}; legacy input.caps = max only
    const rules = {};
    Object.keys(input.caps || {}).forEach(function (n) { rules[n] = { max: input.caps[n] }; });
    Object.keys(input.stackRules || {}).forEach(function (n) { rules[n] = Object.assign({}, rules[n] || {}, input.stackRules[n]); });
    const caps = {};
    const picks = input.picks || {};
    const pickValues = {};   // PT2 2.9-C: every value a pick:<setting>:<value> gate names, per setting (filled once the owners exist)
    const smPower = input.spellMasteryPower || null;
    const fight = input.fight || {};
    const modes = input.modes || {};
    const enemyHp = num(input.enemyHealthPct, 100);
    const featOn = {}, featureOn = {};
    (kit.feats || []).forEach(function (f) { if (f && f.name) featOn[f.name] = true; });
    (kit.features || []).concat(kit.always || []).forEach(function (f) { if (f && f.name) featureOn[f.name] = true; });
    const powers = { atWill: (kit.powers && kit.powers.atWill) || [], encounter: (kit.powers && kit.powers.encounter) || [], daily: (kit.powers && kit.powers.daily) || [] };
    const songs = (kit.songs || []).filter(function (p) { return p && p.name; });
    // songs in a quick play slot (n00b 2026-10-06: Songblade 1, Minstrel 2) skip the "not in a quick play slot" bonuses
    const quickplay = Array.isArray(input.quickplay) ? input.quickplay : [];
    const byName = {};
    ["atWill", "encounter", "daily"].forEach(function (k) { powers[k].forEach(function (p) { byName[k + ":" + p.name] = p; }); });
    songs.forEach(function (p) { byName["song:" + p.name] = p; });

    // ---- record filters ----
    function recOn(r, owner) {
      if (!r) return false;
      if (r.slot) { const inSM = !!(owner && smPower && owner.name === smPower); if ((r.slot === "spellMastery") !== inSM) return false; }
      if (r.paragon && paragon && r.paragon !== paragon) return false;
      if (r.requiresFeat && !featOn[r.requiresFeat]) return false;
      if (r.requiresFeature && !featureOn[r.requiresFeature]) return false;
      if (r.role && input.role && String(r.role).toLowerCase() !== String(input.role).toLowerCase()) return false;
      return true;
    }
    function fxOf(owner) {
      let list = (owner && Array.isArray(owner.fx)) ? owner.fx.slice() : [];
      const md = owner && owner.modes && modes[owner.name] && owner.modes[modes[owner.name]];
      const mdDefault = owner && owner.modes && !modes[owner.name] ? (owner.modes.melee || owner.modes[Object.keys(owner.modes).filter(function (k) { return k !== "spellMastery"; })[0]]) : null;
      const m = md || mdDefault;
      if (m && Array.isArray(m.fx)) list = list.concat(m.fx);
      return list.filter(function (r) { return recOn(r, owner); });
    }

    // ---- owners: everything that can carry fx ----
    const owners = [];   // {obj, type: atWill|encounter|daily|mechanic|feature|feat, name}
    (kit.mechanics || []).forEach(function (o) { if (o && o.name) owners.push({ obj: o, type: "mechanic", name: o.name }); });
    (kit.always || []).forEach(function (o) { if (o && o.name) owners.push({ obj: o, type: "feature", name: o.name }); });
    (kit.features || []).forEach(function (o) { if (o && o.name) owners.push({ obj: o, type: "feature", name: o.name }); });
    (kit.feats || []).forEach(function (o) { if (o && o.name) owners.push({ obj: o, type: "feat", name: o.name }); });
    ["atWill", "encounter", "daily"].forEach(function (k) { powers[k].forEach(function (p) { owners.push({ obj: p, type: k, name: p.name }); }); });
    songs.forEach(function (p) { owners.push({ obj: p, type: "song", name: p.name }); });

    (function collectPicks(list) { list.forEach(function (r) {
      [].concat(r.gate || []).forEach(function (g) { const k = g && g.key; if (typeof k === "string" && k.indexOf("pick:") === 0) { const ps = k.split(":"); (pickValues[ps[1]] = pickValues[ps[1]] || []).indexOf(ps[2]) < 0 && pickValues[ps[1]].push(ps[2]); } });
      if (r.effects) collectPicks(r.effects);
    }); })([].concat.apply([], owners.map(function (ow) { return fxOf(ow.obj); })));
    // ---- mods (feats / features / mechanics / powers change other owners) ----
    const mods = [];
    owners.forEach(function (ow) { fxOf(ow.obj).forEach(function (r) { if (r.kind === "mod") mods.push(r); }); });
    function oneOf(want, have) { return Array.isArray(want) ? want.indexOf(have) >= 0 : want === have; }
    function tagsMatch(want, tags) { tags = tags || {}; return Object.keys(want || {}).every(function (k) { return oneOf(want[k], tags[k]); }); }
    function filterMatch(f, ow) {
      if (!f) return true;
      if (f.type) { const ts = Array.isArray(f.type) ? f.type : [f.type]; if (ts.indexOf("any") < 0 && ts.indexOf(ow.type) < 0) return false; }
      if (f.names && f.names.indexOf(ow.name) < 0) return false;
      if (f.notNames && f.notNames.indexOf(ow.name) >= 0) return false;
      if (f.tags && !tagsMatch(f.tags, ow.obj && ow.obj.tags)) return false;
      const tg = (ow.obj && ow.obj.tags) || {};
      if (f.element && !oneOf(f.element, tg.element)) return false;
      if (f.hasControl && !(Array.isArray(tg.control) && tg.control.length)) return false;
      if (f.damageType && !oneOf(f.damageType, tg.damageType || (ow.obj && ow.obj.damageType))) return false;
      if (f.manual && quickplay.indexOf(ow.name) >= 0) return false;
      return true;
    }
    function modsFor(ow) {
      return mods.filter(function (m) {
        const tg = m.target || {};
        if (tg.power) return tg.power === ow.name && ow.type !== "mechanic";
        if (tg.mechanic) return tg.mechanic === ow.name && ow.type === "mechanic";
        if (tg.filter) return filterMatch(tg.filter, ow);
        return false;
      });
    }
    function asProc(ow) { return ow.proc ? ow : Object.assign({}, ow, { proc: true }); }
    function isPower(ow) { return ow.type === "atWill" || ow.type === "encounter" || ow.type === "daily"; }
    // record-targeted value mods, read at the moment a listener fires
    function withRecMods(ow, r) {
      const rr = Object.assign({}, r);
      modsFor(ow).forEach(function (md) {
        const tg = md.target || {};
        if (!tg.record || tg.record !== r.name || md.field === "magnitudePct" || md.field === "dropFx" || md.field === "fx") return;
        if (md.missing && md.missing.indexOf("value") >= 0) return;
        if (gateFrac(md.gate) <= 0) return;
        setPath(rr, md.field, md.op, md.value);
      });
      return rr;
    }
    function matches(rec, matcher) { return Object.keys(matcher).every(function (k) { return rec[k] === matcher[k]; }); }
    function setPath(o, path, op, v) {
      const ks = path.split("."); let cur = o;
      for (let i = 0; i < ks.length - 1; i++) { cur[ks[i]] = Object.assign({}, cur[ks[i]] || {}); cur = cur[ks[i]]; }
      const k = ks[ks.length - 1], old = num(cur[k], 0);
      cur[k] = op === "add" ? old + num(v) : op === "mult" ? old * num(v) : v;
    }
    // An owner's effective records: its own fx, plus addFx, minus dropFx, with magnitude mods applied.
    // Gated mods are read at the moment the records are built (cast time / trigger time), except
    // magnitudePct, which is a per-hit multiplier read when each hit lands.
    function effective(ow, opts) {
      let recs = fxOf(ow.obj).filter(function (r) { return r.kind !== "mod"; }).map(function (r) { return Object.assign({}, r); });
      const ms = modsFor(ow);
      ms.forEach(function (m) {
        if (m.field === "dropFx" && gateFrac(m.gate) > 0) recs = recs.filter(function (r) { return !(m.value || []).some(function (mt) { return matches(r, mt); }); });
      });
      ms.forEach(function (m) {
        if (m.addFx && gateFrac(m.gate) > 0) recs = recs.concat(m.addFx.filter(function (r) { return recOn(r, ow.obj); }).map(function (r) { return Object.assign({}, r); }));
      });
      const mainMods = [];
      ms.forEach(function (m) {
        if (m.field === "dropFx" || m.field === "fx" || m.field === "magnitudePct" || m.field === "permanent") return;
        if (m.missing && m.missing.indexOf("value") >= 0) return;
        if (gateFrac(m.gate) <= 0) return;
        const tg = m.target || {};
        if (tg.record) { if (!(opts && opts.noRecordMods)) recs.forEach(function (r) { if (r.name === tg.record) setPath(r, m.field, m.op, m.value); }); }
        else mainMods.push(m);
      });
      return { recs: recs, mainMods: mainMods };
    }
    function pctModsFor(ownerName, ownerType, recName) {
      let pct = 0;
      mods.forEach(function (m) {
        if (m.field !== "magnitudePct") return;
        const tg = m.target || {};
        const ownerHit = (tg.power && tg.power === ownerName && ownerType !== "mechanic") || (tg.mechanic && tg.mechanic === ownerName && ownerType === "mechanic");
        if (!ownerHit || (tg.record && tg.record !== recName)) return;
        pct += num(m.value) * gateFrac(m.gate);
      });
      return pct;
    }
    mods.forEach(function (m) {   // feats that change a stack's rules (A Step Above Mastery)
      if (!m.target || !m.target.stack || gateFrac(m.gate) <= 0) return;
      const r0 = rules[m.target.stack] = Object.assign({}, rules[m.target.stack] || {});
      r0[m.field] = m.op === "add" ? num(r0[m.field], 0) + num(m.value) : m.op === "mult" ? num(r0[m.field], 0) * num(m.value) : m.value;
    });
    Object.keys(rules).forEach(function (n) { if (rules[n].max != null) caps[n] = num(rules[n].max); });
    const permanentBuff = {};
    mods.forEach(function (m) { if (m.field === "permanent" && m.target && m.target.buff && m.value) permanentBuff[m.target.buff] = true; });

    // ---- stacks and buffs ----
    const stacks = {};   // name -> { n: untimed count, timers: [expiry] }
    function stk(name) { if (!stacks[name]) stacks[name] = { n: 0, timers: [] }; return stacks[name]; }
    function stackCount(name) { const s = stacks[name]; if (!s) return 0; const live = s.timers.filter(function (x) { return x > t; }).length; const c = s.n + live; return caps[name] != null ? Math.min(caps[name], c) : c; }
    const buffs = {};    // name -> until
    const buffWasUp = {};
    const echoes = [];   // {name, pct, until, deliver, targets, acc}
    const traceRows = [];
    function buffUp(name) { return permanentBuff[name] ? buffs[name] != null : (buffs[name] != null && buffs[name] > t); }
    function keyValue(key) {
      if (key.indexOf("stack:") === 0) return stackCount(key.slice(6));
      if (key.indexOf("buff:") === 0) return buffUp(key.slice(5)) ? 1 : 0;
      if (key.indexOf("pick:") === 0) { const ps = key.split(":"); if (picks[ps[1]] == null && pickValues[ps[1]]) return 1 / pickValues[ps[1]].length; return picks[ps[1]] === ps[2] ? 1 : 0; }
      if (key.indexOf("quickplay:") === 0) return quickplay.indexOf(key.slice(10)) >= 0 ? 1 : 0;
      if (key === "enemyHealthPct") return enemyHp;
      if (key === "enemyCount") return num(input.enemyCount, 1);
      if (key === "otherEnemies") return Math.max(0, num(input.enemyCount, 1) - 1);
      if (key === "pool:apPct") return Math.max(0, Math.min(100, ap / 10));
      return (fight[key] === true) ? 1 : (typeof fight[key] === "number" ? fight[key] : 0);
    }
    // A gate (or a list of gates, all of which apply) as a 0..1+ fraction - the PT2-2 shapes, same fields as Stage 1.
    function gateFrac(g) {
      if (!g) return 1;
      if (Array.isArray(g)) return g.reduce(function (a, x) { return a * gateFrac(x); }, 1);
      // a fight input the page does not set yet (e.g. average Divinity level) uses the gate's default
      const v = (g.default != null && fight[g.key] === undefined && (g.key || "").indexOf(":") < 0 && ["enemyHealthPct", "enemyCount", "otherEnemies"].indexOf(g.key) < 0) ? num(g.default) : keyValue(g.key || "");
      const cl = function (x) { return Math.max(0, Math.min(1, x)); };
      let f = 1;
      if (g.shape === "toggle") f = v > 0 ? 1 : 0;
      else if (g.shape === "perStack") f = Math.min(num(g.maxStacks, 1e9), v) * num(g.perStack, 0);
      else if (g.shape === "linear") {
        if (g.fullAt != null && g.zeroAt != null) f = cl((v - g.zeroAt) / (g.fullAt - g.zeroAt));
        else { const a0 = num(g.at0, 0), a100 = num(g.at100, 1); f = cl(a0 + (a100 - a0) * v / 100); }
      } else if (g.shape === "threshold") {
        const x = num(g.value, 0);
        f = (g.op === "<=" ? v <= x : g.op === ">=" ? v >= x : g.op === "<" ? v < x : g.op === ">" ? v > x : g.op === "==" ? v === x : v > 0) ? 1 : 0;
      } else if (g.shape === "count") f = Math.min(num(g.maxUnits, 1), v) * num(g.perUnit, 0);
      else if (g.shape === "dutyCycle" && g.uptime != null) f = num(g.uptime);   // a ruled uptime share (e.g. Divine Champion 50%)
      return g.invert ? (f > 0 ? 0 : 1) : f;
    }

    // ---- listeners (records that fire on events) ----
    const listeners = [];   // {rec, ow, count, nextAt}
    function buildListeners() {
      listeners.length = 0;
      owners.forEach(function (ow) {
        effective(ow, { noRecordMods: true }).recs.forEach(function (r) {
          if (!r.when) return;
          if (r.when.on !== "cast") listeners.push({ rec: r, ow: ow, count: 0, nextAt: null, lastFire: -1e9 });
          else if (r.when.from || !isPower(ow)) listeners.push({ rec: r, ow: ow, count: 0, nextAt: null, lastFire: -1e9, castListener: true });
        });
      });
    }

    // ---- fight state ----
    let t = 0, busyUntil = 0, ap = 0;
    let artifactReady = 0, mountReady = 0;
    const events = [];
    const dotStacks = {};
    const castEvery = {};
    let magTotal = 0;
    const bySource = {}, byOwner = {}, castCount = {}, mix = { atWill: 0, encounter: 0, daily: 0, other: 0 };
    // PT2 step 2.4: per-hit damage. input.scoreHit(mag, hit, active) -> damage; without it nothing below runs.
    const scoreHit = typeof input.scoreHit === "function" ? input.scoreHit : null;
    let dmgTotal = 0; const dmgByOwner = {}, dmgInByOwner = {};
    // PT2 step 2.5: the fight script's call window. input.callWindow {every, seconds}: the first window opens when the
    // first full rotation ends, then one every `every` s. At the window start the call fires: input.call.artifact
    // (its callFx, when off cooldown) and input.call.mount (its records, when off cooldown); input.call.triggered are
    // records fired by the artifact / mount power / daily (insignia bonuses, 2.5-D). Without callWindow: unchanged.
    const CW = input.callWindow || null, CALL = input.call || {};
    const windows = [];
    let nextWindowAt = null, callArtReady = 0, callMountReady = 0, dmgIn = 0, magIn = 0;
    let pendArt = false, pendMount = false;   // the call waits inside its window for a cooldown that is a moment late
    const trigLast = {};
    function inWindow() { for (let i = windows.length - 1; i >= 0; i--) if (t >= windows[i][0] - 1e-9 && t < windows[i][1]) return true; return false; }
    const statUp = new Map();   // key -> {rec, until, f}: timed buff / debuff records carrying stats, while up
    const statOwnersOn = {};    // owners whose stat records were on at least once (2.4-G: the rest are listed)
    let lastPCrit = null;       // crit chance of the hit being landed (2.6)
    const timeline = []; const TIMELINE_MAX = 80;
    const stackTimeSum = {}, buffTime = {};
    const st = {};
    function pst(key) { if (!st[key]) st[key] = { ready: [0], uses: 0, lastUse: -1e9 }; return st[key]; }
    function cdSeconds(p, s) {
      let base = num(p.cooldownSeconds, 0) || num(p.rechargeSeconds, 0);
      if (base <= 0) return 0;
      if (p.cooldownEscalation) { const e = p.cooldownEscalation; if (t - s.lastUse > num(e.resetAfterSeconds, 10)) s.uses = 0; base = base + num(e.perUseSeconds, 2) * s.uses; }
      else if (base < 2) base = 6;
      return base / (1 + rsi);
    }
    function chargesOf(p) { return Math.max(1, num(p.charges, 1)); }
    function pushTimeline(name, kind, mag, note) { if (timeline.length < TIMELINE_MAX) timeline.push({ t: Math.round(t * 10) / 10, name: name, kind: kind, mag: Math.round(mag), note: note || "" }); }
    function schedule(at, fn, tag) { events.push({ t: at, fn: fn, tag: tag || null }); }
    function flushEvents() {
      for (let i = events.length - 1; i >= 0; i--) { const e = events[i]; if (e.t <= t) { events.splice(i, 1); e.fn(); } }
    }

    // ---- damage ----
    function mixKind(ow) { return (ow.type === "atWill" || ow.type === "encounter" || ow.type === "daily") ? ow.type : (ow.spender ? "encounter" : "other"); }
    function addEcho(name, m, d) {
      if (!(m > 0)) return;
      magTotal += m; bySource[name] = (bySource[name] || 0) + m; byOwner[name] = (byOwner[name] || 0) + m; mix.other += m;
      if (CW && inWindow()) magIn += m;
      if (scoreHit && d > 0) { dmgTotal += d; dmgByOwner[name] = (dmgByOwner[name] || 0) + d; if (CW && inWindow()) { dmgIn += d; dmgInByOwner[name] = (dmgInByOwner[name] || 0) + d; } }
    }
    // ---- stat records (buffs and debuffs with stats) ----
    // timed (seconds) or triggered: counted while up, from the moment they are applied;
    // conditional (no seconds, a gate, no trigger): counted on every hit by the gate's value then;
    // passive (no seconds, no gate, no trigger) on a feature / feat / mechanic: the engine owns it, never here.
    const condStatRecs = [];
    function statKey(ow, r) { return ow.name + "|" + r.kind + "|" + (r.name || "") + "|" + JSON.stringify(r.stats || null) + "|" + JSON.stringify(r.ratingStats || null) + "|" + JSON.stringify(r.appliesTo || null); }
    function statApply(ow, r) {
      if (!(scoreHit || input.liveRecharge) || !(r.stats || r.ratingStats) || r.seconds == null && r.gate && !r.when) return;
      if (r.seconds == null && !r.gate && !r.when && !isPower(ow) && ow.type !== "song") return;
      const f = (r.gate && !(r.gate.shape === "toggle" && !Array.isArray(r.gate))) ? gateFrac(r.gate) : 1;
      statUp.set(statKey(ow, r), { rec: r, until: r.seconds != null ? t + num(r.seconds) : 1e12, f: f, owner: ow.name, all: debuffAll(r, ow) });
      if (f > 0) statOwnersOn[ow.name] = true;
    }
    // 2.7-C: a debuff covers every enemy when it (or, untagged, its power) is area; otherwise the main target only
    function debuffAll(r, ow) {
      if (r.kind !== "debuff") return true;
      const tg = r.targets || ((isPower(ow) || ow.type === "song") && ow.obj && ow.obj.tags ? ow.obj.tags.targets : null);
      return tg === "area" || tg === "others";
    }
    function statRemove(name) { statUp.forEach(function (v) { if (v.rec.name === name) v.until = -1; }); }
    function hitMatches(af, hit, ow) {
      if (!af) return true;
      const rest = Object.assign({}, af); delete rest.damageType;
      if (af.damageType && !oneOf(af.damageType, hit.damageType) && !oneOf(af.damageType, hit.element)) return false;
      return filterMatch(rest, ow);
    }
    function activeStats(hit, ow) {
      const out = [];
      statUp.forEach(function (v) { if (v.until > t && v.f > 0 && !(input.areaTargets && hit.offMain && !v.all) && hitMatches(v.rec.appliesTo, hit, ow)) out.push({ kind: v.rec.kind, name: v.rec.name || v.owner, stats: v.rec.stats || {}, ratingStats: v.rec.ratingStats || null, f: v.f }); });
      condStatRecs.forEach(function (c) { const f = gateFrac(c.rec.gate); if (f > 0) statOwnersOn[c.owner] = true; if (f > 0 && !(input.areaTargets && hit.offMain && !c.all) && hitMatches(c.rec.appliesTo, hit, ow)) out.push({ kind: c.rec.kind, name: c.rec.name || c.owner, stats: c.rec.stats || {}, ratingStats: c.rec.ratingStats || null, f: f }); });
      return out;
    }
    // Recharge Speed from buffs up now (timed and gated), in % points
    function rechargeBonusNow() {
      let b = 0;
      statUp.forEach(function (v) { if (v.until > t && v.rec.kind === "buff" && v.rec.stats && v.rec.stats["Recharge Speed"]) b += num(v.rec.stats["Recharge Speed"]) * v.f; });
      condStatRecs.forEach(function (c) { if (c.rec.kind === "buff" && c.rec.stats && c.rec.stats["Recharge Speed"]) b += num(c.rec.stats["Recharge Speed"]) * gateFrac(c.rec.gate); });
      return b;
    }
    function scoreLanded(ow, recName, m, isTick, offMain, rec) {
      const tg = (ow.obj && ow.obj.tags) || {};
      const hit = { type: ow.type, name: ow.name, recName: recName, tags: tg, element: (rec && rec.element) || tg.element || null,
        damageType: (rec && rec.damageType) || tg.damageType || (ow.obj && ow.obj.damageType) || null,
        targets: (rec && rec.targets) || tg.targets || null, isTick: !!isTick, offMain: !!offMain, proc: !!ow.proc };
      const d = scoreHit(m, hit, activeStats(hit, ow));
      if (hit.pCrit != null) lastPCrit = hit.pCrit;   // the scorer reports the crit chance it used for this hit
      if (d > 0) { dmgTotal += d; dmgByOwner[ow.name] = (dmgByOwner[ow.name] || 0) + d; if (CW && inWindow()) { dmgIn += d; dmgInByOwner[ow.name] = (dmgInByOwner[ow.name] || 0) + d; } }
      return d;
    }
    function land(ow, recName, mag, isTick, offMain, rec) {
      const pct = pctModsFor(ow.name, ow.type, recName);
      let m = mag * (1 + pct / 100);
      lastPCrit = null;
      const d = (scoreHit && m > 0) ? scoreLanded(ow, recName, m, isTick, offMain, rec) : 0;
      if (m > 0 && !offMain) {
        for (let ei = 0; ei < echoes.length; ei++) {
          const E = echoes[ei]; if (E.until <= t) continue;
          if (E.deliver === "end") { E.acc += m; E.dacc = (E.dacc || 0) + d; }
          else { const k = E.pct / 100 * (E.targets === "others" ? Math.max(0, num(input.enemyCount, 1) - 1) : 1); addEcho(E.name, m * k, d * k); }
        }
      }
      if (m > 0) {
        magTotal += m; if (CW && inWindow()) magIn += m;
        const label = recName && recName !== ow.name ? ow.name + " · " + recName : ow.name;
        bySource[label] = (bySource[label] || 0) + m; byOwner[ow.name] = (byOwner[ow.name] || 0) + m;
        mix[mixKind(ow)] += m;
      }
      fire("hit", { ow: ow, recName: recName });
      if (isTick) fire("dotTick", { ow: ow, recName: recName });
      if (input.expectedProcs && m > 0) { const pc = lastPCrit != null ? lastPCrit : num(input.critChance, 0); if (pc > 0) fire("crit", { ow: ow, recName: recName, share: Math.min(1, pc) }); }
    }
    // PT2 step 2.7 (input.areaTargets; locks 2.7-A/B): an area hit lands once per enemy up to the enemy count
    // (a stored cap where there is one); a record with no tag follows its power; "mixed" with one magnitude = single.
    function hitTargets(r, ow) {
      const tg = r.targets || (input.areaTargets && ow && ow.obj && ow.obj.tags && ow.obj.tags.targets) || "single";
      if (tg === "others") {
        const n = Math.max(0, num(input.enemyCount, 1) - 1);
        return r.maxTargets != null ? Math.min(num(r.maxTargets), n) : n;
      }
      if (tg === "area" && input.areaTargets) {
        const n = Math.max(1, Math.round(num(input.enemyCount, 1))), cap = r.maxTargets != null ? r.maxTargets : (ow && ow.obj ? ow.obj.maxTargets : null);
        return cap != null ? Math.max(1, Math.min(num(cap), n)) : n;
      }
      return 1;
    }
    // Schedule a hit / dot record. `spent` = stacks this cast consumed (scalesWith).
    function scheduleDamage(ow, r, start, spent, magOverride) {
      const n = hitTargets(r, ow) * (r.gate && !(r.gate.shape === "toggle" && !Array.isArray(r.gate)) ? gateFrac(r.gate) : 1); if (n <= 0) return 0;
      const sw = r.scalesWith ? num(r.scalesWith.per) * num(spent[r.scalesWith.resource], 0) : 0;
      if (r.kind === "hit") {
        const m = (magOverride != null ? magOverride : num(r.magnitude, 0)) + sw;
        const c = Math.max(1, num(r.count, 1));
        for (let i = 0; i < c; i++) schedule(start + num(r.delaySeconds, 0), function () { for (let k = 0; k < n; k++) land(ow, r.name || ow.name, m * Math.min(1, n - k), false, k > 0 || r.targets === "others", r); });
        return m * c * n;
      }
      if (r.kind === "dot") {
        const ticks = Math.max(1, num(r.ticks, 1)), sec = num(r.seconds, ticks);
        const total = (r.perTick != null ? num(r.perTick) * ticks : num(r.magnitude, 0)) + sw;
        const per = total / ticks;
        const key = "dot:" + ow.name + ":" + (r.name || "");
        if (r.stacking === "stack") {
          const liveSt = (dotStacks[key] || []).filter(function (x) { return x > t; });
          if (r.maxStacks != null && liveSt.length >= num(r.maxStacks)) { dotStacks[key] = liveSt; return 0; }
          liveSt.push(start + sec); dotStacks[key] = liveSt;
        }
        if (r.stacking === "refresh") { for (let ei = events.length - 1; ei >= 0; ei--) if (events[ei].tag === key) events.splice(ei, 1); }
        for (let i = 1; i <= ticks; i++) schedule(start + sec * i / ticks, function () { for (let k = 0; k < n; k++) land(ow, r.name || ow.name, per * Math.min(1, n - k), true, k > 0 || r.targets === "others", r); }, key);
        return total * n;
      }
      return 0;
    }

    // ---- non-damage records ----
    function applyBuff(r) {
      const name = r.name || "(buff)";
      const wasUp = buffUp(name);
      if (r.op === "remove") { if (wasUp) { buffs[name] = -1; buffWasUp[name] = false; fire("buffEnded", { name: name }); } return; }
      buffs[name] = (permanentBuff[name] || r.seconds == null) ? 1e12 : t + num(r.seconds);
      if (wasUp) fire("buffRefreshed", { name: name });
      else {
        listeners.forEach(function (L) { if (L.rec.when.on === "periodic" && L.rec.when.name === name) L.nextAt = t + num(L.rec.when.every, 1); });
        fire("buffApplied", { name: name });
      }
    }
    function applyStack(r, spent) {
      const name = r.resource, s = stk(name);
      s.timers = s.timers.filter(function (x) { return x > t; });
      const op = r.op;
      if (op === "add" || op === "set") {
        let amt = num(r.amount, 0) + (r.scalesWith ? num(r.scalesWith.per) * num((spent || {})[r.scalesWith.resource], 0) : 0);
        if (op === "set") { s.n = 0; s.timers = []; }
        if (!(amt > 0)) return;
        const rule = rules[name] || {};
        const secs = r.seconds != null ? num(r.seconds) : (rule.seconds != null ? num(rule.seconds) : null);
        if (secs != null) {
          for (let i = 0; i < amt; i++) s.timers.push(t + secs);
          if (rule.refresh === "all") s.timers = s.timers.map(function () { return t + secs; });
        } else { s.n = caps[name] != null ? Math.min(caps[name], s.n + amt) : s.n + amt; }
        fire("stackApplied", { resource: name, amount: amt });
      } else if (op === "refresh") {
        const rsec = r.seconds != null ? num(r.seconds) : ((rules[name] || {}).seconds != null ? num(rules[name].seconds) : null);
        if (stackCount(name) > 0 && rsec != null) s.timers = s.timers.map(function () { return t + rsec; });
      } else if (op === "consume") {
        // whole-stack spenders (a minimum to spend, e.g. Soul Scorch) spend whole stacks; meters spend fractions
        const have = r.min != null ? Math.floor(stackCount(name)) : stackCount(name);
        if (!(have > 1e-9)) return 0;
        const want = r.amount != null ? Math.min(num(r.amount), have) : have;
        if (r.min != null && want < num(r.min)) return 0;
        let left = want;
        const fromN = Math.min(s.n, left); s.n -= fromN; left -= fromN;
        if (s.n < 1e-9) s.n = 0;
        s.timers.sort(function (a, b) { return a - b; }); s.timers.splice(0, left);
        fire("stackSpent", { resource: name, amount: want });
        fire("stackRemoved", { resource: name });
        return want;
      }
      return 0;
    }
    function applyCooldown(r, times) {
      const cut = num(r.seconds, 0) * times;
      Object.keys(st).forEach(function (k) {
        const kind = k.split(":")[0], nm = k.slice(kind.length + 1);
        const f = r.targets || {};
        if (f.names) { if (f.names.indexOf(nm) < 0) return; }
        else { const ts = f.type ? (Array.isArray(f.type) ? f.type : [f.type]) : ["encounter"]; if (ts.indexOf(kind) < 0) return; }
        if (f.tags) { const pw = byName[kind + ":" + nm]; if (!pw || !tagsMatch(f.tags, pw.tags)) return; }
        st[k].ready = r.op === "reset" ? st[k].ready.map(function () { return t; })
          : r.pct != null ? st[k].ready.map(function (x) { return x > t ? t + (x - t) * (1 - num(r.pct) / 100) : x; })
          : st[k].ready.map(function (x) { return x - cut; });
      });
    }
    function runRecord(ow, r, spent, castEnd, skipGate) {
      if (!skipGate && gateFrac(r.gate) <= 0) return 0;
      switch (r.kind) {
        case "hit": case "dot": return scheduleDamage(ow, r, castEnd != null ? castEnd : t, spent || {});
        case "buff": if (r.op === "remove" && r.name) statRemove(r.name); else statApply(ow, r); if (r.name) applyBuff(r); return 0;
        case "debuff": statApply(ow, r); if (r.name) buffs[r.name] = r.seconds != null ? t + num(r.seconds) : 1e12; return 0;
        case "stack": applyStack(r, spent); return 0;
        case "cooldown": applyCooldown(r, 1); return 0;
        case "echo": echoes.push({ name: r.name || ow.name, pct: num(r.pct, 0), until: t + num(r.seconds, 0), deliver: r.deliver || "end", targets: r.targets || "single", acc: 0 }); return 0;
        case "resource":
          if (r.pool === "actionPoints" && (r.op === "gain" || r.op === "set")) {
            const g = r.pctOfBar != null ? num(r.pctOfBar) * 10 : num(r.amount, 0);
            // gain over time (Sigil of the Cleric: 25% of the bar over 15 s): one share per second
            if (r.op === "gain" && num(r.seconds, 0) > 0) { const n = Math.max(1, Math.round(num(r.seconds))); for (let i = 1; i <= n; i++) schedule(t + i * num(r.seconds) / n, function () { ap += g / n; }); }
            else ap = r.op === "set" ? g : ap + g;
          }
          return 0;
        case "proc": (r.effects || []).filter(function (e) { return recOn(e, ow.obj); }).forEach(function (e) { runRecord({ obj: ow.obj, type: "proc", name: r.name || ow.name }, e, spent, null); }); return 0;
        default: return 0;   // resource / control / heal / shield: recorded, not scored by the damage simulator
      }
    }

    // ---- events ----
    function fromMatch(L, ctx) {
      const w = L.rec.when, f = w.from;
      // a hit made by a proc / triggered record never triggers effects that filter by power type (no chains);
      // a listener that names the owner (Dark Prayers: Soul Puppet) still sees it
      if (ctx.ow && ctx.ow.proc && !(f && f.names && !f.type && !f.tags && !f.element && !f.hasControl)) return false;
      if (!f) {
        if (L.ow.type === "atWill" || L.ow.type === "encounter" || L.ow.type === "daily") return ctx.ow && ctx.ow.name === L.ow.name && ctx.ow.type === L.ow.type;
        return ctx.ow && ["atWill", "encounter", "daily", "mechanic"].indexOf(ctx.ow.type) >= 0;   // your powers; pets and procs only by name
      }
      return !!ctx.ow && filterMatch(f, ctx.ow);
    }
    function fire(ev, ctx) {
      for (let i = 0; i < listeners.length; i++) {
        const L = listeners[i], w = L.rec.when;
        if (w.on !== ev || L.castListener) continue;
        if (ev === "hit" || ev === "dotTick" || ev === "crit") {
          if (!fromMatch(L, ctx)) continue;
          if (w.name && ctx.recName !== w.name) continue;
        }
        if ((ev === "stackApplied" || ev === "stackRemoved") && w.resource !== ctx.resource) continue;
        if (ev === "stackApplied" && w.every) { const times = Math.floor(num(ctx.amount, 1) / num(w.every)); for (let k = 0; k < times; k++) runRecord(asProc(L.ow), withRecMods(L.ow, L.rec), null, null); continue; }
        if ((ev === "buffRefreshed" || ev === "buffApplied" || ev === "buffEnded") && w.name !== ctx.name) continue;
        if (ev === "stackSpent") {
          if (w.resource !== ctx.resource) continue;
          const every = num(w.every, 1); const times = Math.floor(num(ctx.amount) / every);
          if (times <= 0) continue;
          if (L.rec.kind === "cooldown") { if (gateFrac(L.rec.gate) > 0) applyCooldown(L.rec, times); continue; }
          for (let k = 0; k < times; k++) runRecord(asProc(L.ow), withRecMods(L.ow, L.rec), null, null);
          continue;
        }
        if (w.every && (ev === "hit" || ev === "dotTick")) { L.count++; if (L.count % num(w.every) !== 0) continue; }
        procFire(L, ev === "crit" ? num(ctx.share, 0) : 1);
      }
    }
    // PT2 step 2.6 (input.expectedProcs; lock 2.6-A): a trigger with a chance below 100% (or a crit, whose share is the
    // hit's crit chance) plays out as its expected value, no dice. Damage with no lockout adds its share on every
    // event; anything else (and anything with a lockout) adds its chance to a running share and fires whole at 100%.
    // Events inside a lockout add nothing. Without expectedProcs a chance below 100% never fires (as before).
    function isDamageRec(r) { return r.kind === "hit" || r.kind === "dot" || (r.kind === "proc" && (r.effects || []).length > 0 && r.effects.every(isDamageRec)); }
    function scaleRec(r, f) {
      const c = Object.assign({}, r);
      if (c.magnitude != null) c.magnitude = num(c.magnitude) * f;
      if (c.perTick != null) c.perTick = num(c.perTick) * f;
      if (c.kind === "proc") c.effects = (c.effects || []).map(function (e) { return scaleRec(e, f); });
      return c;
    }
    function procFire(L, eventShare) {
      const w = L.rec.when;
      if (w.icdSeconds && t - L.lastFire < num(w.icdSeconds)) return;
      let share = (w.chance != null ? num(w.chance) / 100 : 1) * eventShare;
      [].concat(L.rec.gate || []).forEach(function (g) { if (g && typeof g.key === "string" && g.key.indexOf("pick:") === 0) share *= keyValue(g.key); });   // 2.9-C: a random pick's share
      if (share <= 0) return;
      if (share >= 1 - 1e-9) { L.lastFire = t; runRecord(asProc(L.ow), withRecMods(L.ow, L.rec), null, null); return; }
      if (!input.expectedProcs) return;
      const r = withRecMods(L.ow, L.rec);
      if (!w.icdSeconds && isDamageRec(r)) { runRecord(asProc(L.ow), scaleRec(r, share), null, null); return; }
      L.acc = (L.acc || 0) + share;
      if (L.acc >= 1 - 1e-9) { L.acc -= 1; L.lastFire = t; runRecord(asProc(L.ow), r, null, null); }
    }
    function fireCast(ow) {
      for (let i = 0; i < listeners.length; i++) {
        const L = listeners[i]; if (!L.castListener) continue;
        const w = L.rec.when;
        if (!filterMatch(w.from, ow)) continue;
        if (w.every) { L.count++; if (L.count % num(w.every) !== 0) continue; }
        procFire(L, 1);
      }
    }

    // ---- casting ----
    function mainMagnitude(p) {
      if (smPower && p.name === smPower && p.modes && p.modes.spellMastery && p.modes.spellMastery.magnitude != null) return p.modes.spellMastery.magnitude;
      const mbp = p.magnitudeByParagon && paragon && p.magnitudeByParagon[paragon] != null ? p.magnitudeByParagon[paragon] : null;
      return mbp != null ? mbp : null;
    }
    function untriggeredDamage(recs) { return recs.filter(function (r) { return (r.kind === "hit" || r.kind === "dot") && (!r.when || (r.when.on === "cast" && !r.when.from)); }); }
    // A cast is useful when it would deal damage or do something; a power whose only damage is gated off
    // (e.g. a Curse Consume hit with no Curse up) is not cast.
    function castUseful(ow) {
      const e = effective(ow); const dmg = untriggeredDamage(e.recs);
      if (!dmg.length) return true;
      return dmg.some(function (r) { return gateFrac(r.gate) > 0; });
    }
    function castOwner(ow, kind) {
      // field mods on the power itself (Stealth Blade Flurry: no cooldown; Path of the Blade: 3 s) - read at cast
      let p = ow.obj;
      const fieldMods = effective(ow).mainMods.filter(function (md) { return md.field !== "magnitude"; });
      if (fieldMods.length) { p = Object.assign({}, p); fieldMods.forEach(function (md) { setPath(p, md.field, md.op, md.value); }); }
      const castSec = num(p.channelSeconds, 0) > 0 ? num(p.channelSeconds) : num(p.castSeconds, 0);
      busyUntil = t + Math.max(0.1, castSec);
      const castEnd = t + castSec;
      castCount[p.name] = (castCount[p.name] || 0) + 1;
      if (RB && firstCycleEnd === null && powers.encounter.every(function (e) { return castCount[e.name] > 0; })) firstCycleEnd = t;
      const s = kind === "spender" ? null : pst(kind + ":" + ow.name);
      if (s) { s.uses++; }
      // 1. gates read now (records are built with this moment's state)
      const e = effective(ow);
      const own = function (r) { return !r.when || (r.when.on === "cast" && !r.when.from); };
      const everyOk = function (r) {
        if (!(r.when && r.when.every)) return true;
        const k = ow.name + "|" + r.kind + "|" + (r.name || "") + "|" + (r.resource || "");
        castEvery[k] = (castEvery[k] || 0) + 1;
        return castEvery[k] % num(r.when.every) === 0;
      };
      const live = e.recs.filter(function (r) { return own(r) && everyOk(r) && gateFrac(r.gate) > 0; });
      // 2. consumes first: they decide scalesWith and must see the state before triggers change it
      const spent = {};
      live.forEach(function (r) { if (r.kind === "stack" && r.op === "consume") spent[r.resource] = (spent[r.resource] || 0) + applyStack(r, spent); });
      if (kind === "spender" && !(Object.keys(spent).some(function (k) { return spent[k] > 0; }))) { castCount[p.name]--; busyUntil = t; return false; }
      // 3. cast-triggered records elsewhere (Curse apply / consume by tags, at-will Curse ...)
      fireCast(ow);
      // 4. damage and the rest of the power's own records
      let total = 0;
      const dmg = untriggeredDamage(live);
      if (dmg.length) {
        const firstHit = dmg.find(function (r) { return r.kind === "hit"; });
        dmg.forEach(function (r) {
          let mo = null;
          if (r === firstHit && e.mainMods.length) { mo = num(r.magnitude, 0); e.mainMods.forEach(function (md) { if (md.field !== "magnitude") return; mo = md.op === "add" ? mo + num(md.value) : md.op === "mult" ? mo * num(md.value) : num(md.value); }); }
          total += scheduleDamage(ow, r, castEnd, spent, mo);
        });
      }
      else if (kind !== "song") total = scheduleTopLevel({ obj: p, type: ow.type, name: ow.name, spender: ow.spender }, kind, castSec, e.mainMods, s);
      live.forEach(function (r) { if (r.kind !== "hit" && r.kind !== "dot" && !(r.kind === "stack" && r.op === "consume")) runRecord(ow, r, spent, castEnd, true); });
      if (s) s.lastUse = t;
      if (kind === "encounter") { const cd = cdSeconds(p, s); const n = chargesOf(p); while (s.ready.length < n) s.ready.push(0); s.ready.sort(function (a, b) { return a - b; }); s.ready[0] = t + cd; }
      else if (kind === "mechanic") { s.ready = [t + num(p.cooldownSeconds, 0)]; }
      else if (kind === "daily") { ap -= num(p.actionPointCost, 1000); if (num(p.cooldownSeconds, 0) > 0) s.ready = [t + num(p.cooldownSeconds)]; if (CW) callTrigger("daily"); }
      pushTimeline(p.name, kind === "spender" ? "encounter" : kind, total, kind === "spender" ? Object.keys(spent).map(function (k) { return spent[k] + " " + k; }).join(", ") : "");
      return true;
    }
    // Powers with no hit / dot records: the top-level magnitude, in the same shapes simulate() used
    // ("AxB" pulses over the channel or duration, combo steps, a missing-health range, one hit).
    function scheduleTopLevel(ow, kind, castSec, mainMods, s) {
      const p = ow.obj;
      const nT = (input.areaTargets && p.tags && p.tags.targets === "area") ? hitTargets({ targets: "area" }, ow) : 1;
      const landAll = function (m) { for (let k = 0; k < nT; k++) land(ow, ow.name, m, false, k > 0); };
      let magRaw = mainMagnitude(p); if (magRaw == null) magRaw = p.magnitude;
      const pm = parseMag(magRaw);
      const applyMain = function (m) { mainMods.forEach(function (md) { if (md.field !== "magnitude") return; m = md.op === "add" ? m + num(md.value) : md.op === "mult" ? m * num(md.value) : num(md.value); }); return m; };
      if (pm.count > 1) {
        const ch = num(p.channelSeconds, 0) > 0, sec = ch ? num(p.channelSeconds) : (num(p.durationSeconds, 0) || castSec);
        const per = applyMain(pm.per);
        if (per <= 0) return 0;
        for (let i = 1; i <= pm.count; i++) schedule(t + (ch ? 0 : castSec) + sec * i / pm.count, function () { landAll(per); });
        return per * pm.count * nT;
      }
      if (Array.isArray(p.comboMagnitudes) && p.comboMagnitudes.length) {
        const i = ((s ? s.uses : 1) - 1) % p.comboMagnitudes.length; const m = applyMain(num(p.comboMagnitudes[i], 0));
        schedule(t + castSec, function () { landAll(m); }); return m * nT;
      }
      const m = applyMain(magRaw != null && mainMagnitude(p) != null ? pm.total : powerMagnitude(p, enemyHp));
      if (m > 0) schedule(t + castSec, function () { landAll(m); });
      return m * nT;
    }

    // ---- the spender mechanic (a mechanic whose fx consumes a stack with a minimum) ----
    const spenderOw = (function () {
      for (let i = 0; i < owners.length; i++) { const ow = owners[i]; if (ow.type !== "mechanic") continue; const c = fxOf(ow.obj).find(function (r) { return r.kind === "stack" && r.op === "consume" && r.min != null && !r.when; }); if (c) { ow.spender = c; return ow; } }
      return null;
    })();
    const spendAt = spenderOw ? Math.max(num(spenderOw.spender.min), Math.min(num(spenderOw.spender.amount, 1e9), num(input.spendAt != null ? input.spendAt : input.scorchAtSparks, num(spenderOw.spender.amount, 0)))) : 0;
    function spenderReady() { return !!spenderOw && stackCount(spenderOw.spender.resource) >= num(spenderOw.spender.min); }

    // ---- script (same rules as simulate()) ----
    const clean = function (a) { return Array.isArray(a) ? a.filter(function (x) { return x && x.kind && x.name; }) : []; };
    let opener = clean(input.opener);
    let loop = clean(input.loop).length ? clean(input.loop) : clean(input.steps);
    let defaultOrderUsed = false;
    if (!loop.length && opener.length) loop = opener.slice();
    if (!loop.length) { loop = defaultSteps(powers); defaultOrderUsed = true; }
    const listedIn = function (list, kind, name) { return list.some(function (x) { return x.kind === kind && (name == null || x.name === name); }); };
    const MAX_WAIT = 5;
    function owOf(kind, name) { const p = byName[kind + ":" + name]; return p ? owners.find(function (o) { return o.obj === p; }) : null; }
    function mechOw(name) { return owners.find(function (o) { return o.type === "mechanic" && o.name === name; }) || null; }
    // a mechanic is castable when it has own records (no trigger) - e.g. entering Stealth; ready when one of them would apply
    function mechReady(ow) {
      if (!ow) return false;
      const own = effective(ow).recs.filter(function (r) { return !r.when; });
      if (!own.length || !own.some(function (r) { return gateFrac(r.gate) > 0; })) return false;
      const sm = pst("mechanic:" + ow.name); return sm.ready.every(function (x) { return x <= t; });
    }
    function isReady(step) {
      if (step.kind === "mechanic") return mechReady(mechOw(step.name));
      if (step.kind === "song") return !!owOf("song", step.name) && !buffUp(step.name);
      if (step.kind === "scorch") return spenderReady();
      if (step.kind === "artifact") return !CW && t >= artifactReady;
      if (step.kind === "mount") return !CW && t >= mountReady;
      const ow = owOf(step.kind, step.name); if (!ow) return false;
      if (step.kind === "atWill") return true;
      if (step.kind === "encounter") {
        if (!castUseful(ow)) return false;
        const s = pst("encounter:" + ow.name); const n = chargesOf(ow.obj); while (s.ready.length < n) s.ready.push(0);
        return s.ready.some(function (r) { return r <= t; });
      }
      if (step.kind === "daily") { const sd = pst("daily:" + ow.name); return ap >= num(ow.obj.actionPointCost, 1000) && t >= sd.lastUse + cad.daily && sd.ready.every(function (x) { return x <= t; }); }
      return false;
    }
    function waitFor(step) {
      if (step.kind === "atWill") return 0;
      if (step.kind === "scorch") return spenderReady() ? 0 : Infinity;
      if (step.kind === "mechanic") return mechReady(mechOw(step.name)) ? 0 : Infinity;
      if (step.kind === "song") return !owOf("song", step.name) ? Infinity : (!buffUp(step.name) ? 0 : (permanentBuff[step.name] ? Infinity : Math.max(0, buffs[step.name] - t)));
      if (step.kind === "artifact") return CW ? Infinity : Math.max(0, artifactReady - t);
      if (step.kind === "mount") return CW ? Infinity : Math.max(0, mountReady - t);
      const ow = owOf(step.kind, step.name); if (!ow) return Infinity;
      if (step.kind === "encounter") {
        if (!castUseful(ow)) return Infinity;
        const s2 = pst("encounter:" + ow.name); const n = chargesOf(ow.obj); while (s2.ready.length < n) s2.ready.push(0);
        return Math.max(0, Math.min.apply(null, s2.ready) - t);
      }
      if (step.kind === "daily") {
        const sd = pst("daily:" + ow.name); const cost = num(ow.obj.actionPointCost, 1000);
        const apWait = ap >= cost ? 0 : (cost - ap) / Math.max(1, AP_PER_SEC);
        return Math.max(apWait, sd.lastUse + cad.daily - t, Math.max.apply(null, sd.ready) - t, 0);
      }
      return Infinity;
    }
    function castStep(step) {
      if (step.kind === "mechanic") { const mo = mechOw(step.name); return mo ? castOwner(mo, "mechanic") : false; }
      if (step.kind === "scorch") return spenderOw ? castOwner(spenderOw, "spender") : false;
      if (step.kind === "artifact") { artifactReady = t + cad.artifact; busyUntil = t + 0.5; castCount["Artifact"] = (castCount["Artifact"] || 0) + 1; pushTimeline(step.name || "Artifact", "other", 0, "trigger only"); return true; }
      if (step.kind === "mount") { mountReady = t + cad.mountpower; busyUntil = t + 0.5; castCount["Mount power"] = (castCount["Mount power"] || 0) + 1; pushTimeline(step.name || "Mount power", "other", 0, "trigger only (mount burst layer scores it)"); return true; }
      const ow = owOf(step.kind, step.name); if (!ow) return false;
      return castOwner(ow, step.kind);
    }
    const fillerStep = loop.find(function (x) { return x.kind === "atWill"; }) || opener.find(function (x) { return x.kind === "atWill"; }) || (function () {
      const d = defaultSteps(powers).find(function (x) { return x.kind === "atWill"; }); return d || null;
    })();

    // ===== PT2 step 2.8: rule-built rotation (input.ruleBuilt; locks 2.8-A/B) =====
    // A priority list built from the records, no names in code: castable mechanics, then refreshers (powers whose own
    // records put up a timed buff / debuff / stack: cast when it is down or about to drop), the spender, encounters and
    // dailies strongest per cast first, the best at-will as filler. At every free moment the first entry that is ready
    // and useful casts. input.hold {encounter, daily}: outside the call window a power waits when casting it now would
    // leave it still cooling down (an encounter) or the Action Point bar not refilled (a daily) when the window opens.
    const RB = !!input.ruleBuilt;
    const HOLD = input.hold || {};
    let rbInvalid = 0;
    function rbOwnDamage(ow) {
      const recs = fxOf(ow.obj).filter(function (r) { return (r.kind === "hit" || r.kind === "dot") && !r.when; });
      if (!recs.length) return num(powerMagnitude(ow.obj, enemyHp), 0);
      return recs.reduce(function (a, r) { return a + (r.kind === "dot" ? (r.perTick != null ? num(r.perTick) * Math.max(1, num(r.ticks, 1)) : num(r.magnitude, 0)) : num(r.magnitude, 0) * Math.max(1, num(r.count, 1))); }, 0);
    }
    function rbEffects(ow) {   // what a cast of this owner puts up and keeps up (timed)
      const out = [];
      fxOf(ow.obj).forEach(function (r) {
        if (r.when || r.op === "remove") return;
        if ((r.kind === "buff" || r.kind === "debuff") && r.seconds != null && (r.stats || r.ratingStats || r.name)) out.push({ rec: r, name: r.name || null });
        if (r.kind === "stack" && (r.op === "add" || r.op === "set") && (r.seconds != null || (rules[r.resource] && rules[r.resource].seconds != null))) out.push({ stack: r.resource });
      });
      return out;
    }
    const rbList = [];
    if (RB) {
      owners.forEach(function (ow) {
        if (ow.type !== "mechanic" || ow === spenderOw) return;
        // castable = it has a cast time and its own records do something for damage (passive stack mechanics such as Arcane
        // Mastery have no cast time; heal-only ones such as Light of Divinity do nothing for damage)
        if (ow.obj.castSeconds == null) return;
        const own = fxOf(ow.obj).filter(function (r) { return !r.when; });
        if (!own.some(function (r) { return ["buff", "debuff", "stack", "hit", "dot"].indexOf(r.kind) >= 0; })) return;
        const named = own.filter(function (r) { return (r.kind === "buff" || r.kind === "debuff") && r.name && r.op !== "remove"; }).map(function (r) { return r.name; });
        rbList.push({ kind: "mechanic", name: ow.name, ow: ow, named: named, reason: "castable mechanic: cast when ready and its effect is down" });
      });
      owners.filter(function (ow) { return isPower(ow) || ow.type === "song"; }).forEach(function (ow) {
        const ef = rbEffects(ow); if (!ef.length) return;
        rbList.push({ kind: ow.type, name: ow.name, ow: ow, refresh: ef, reason: "keeps its buff / debuff / stacks up: cast when down or about to drop" });
      });
      if (spenderOw) rbList.push({ kind: "spender", name: spenderOw.name, ow: spenderOw, reason: "spender: at " + spendAt + " " + spenderOw.spender.resource });
      ["encounter", "daily"].forEach(function (k) {
        owners.filter(function (ow) { return ow.type === k; }).map(function (ow) { return { ow: ow, d: rbOwnDamage(ow) }; })
          .filter(function (x) { return !(x.d <= 0 && rbEffects(x.ow).length); })   // a buff-only power is cast by its refresh entry, not for damage
          .filter(function (x) { return (input.noDamageCast || []).indexOf(x.ow.name) < 0; })   // the search found the fight does better without casting it for damage
          .sort(function (a, b) { return b.d - a.d; })
          .forEach(function (x) { rbList.push({ kind: k, name: x.ow.name, ow: x.ow, reason: (k === "encounter" ? "encounter" : "daily") + ": strongest per cast first (" + Math.round(x.d) + ")" }); });
      });
    }
    // the filler: input.filler (the choice search tries each at-will), else the best stored damage per second of casting
    const rbFiller = RB ? (owners.filter(function (ow) { return ow.type === "atWill"; }).map(function (ow) { const c = num(ow.obj.castSeconds, 0) || 1; return { ow: ow, mps: rbOwnDamage(ow) / c }; })
      .sort(function (a, b) { return (input.filler ? (b.ow.name === input.filler) - (a.ow.name === input.filler) : 0) || b.mps - a.mps; })[0] || null) : null;
    function rbRemaining(e) {   // seconds left on the effects this entry keeps up (0 = down)
      let left = Infinity;
      e.refresh.forEach(function (x) {
        let l = 0;
        if (x.stack) { const sk = stk(x.stack); sk.timers = sk.timers.filter(function (y) { return y > t; }); l = sk.timers.length ? Math.max.apply(null, sk.timers) - t : 0; }
        else if (x.name && buffs[x.name] != null) l = buffUp(x.name) ? (permanentBuff[x.name] ? 1e9 : buffs[x.name] - t) : 0;
        else { statUp.forEach(function (v) { if (v.owner === e.name && v.rec === x.rec || (v.owner === e.name && JSON.stringify(v.rec.stats) === JSON.stringify(x.rec.stats))) l = Math.max(l, v.until - t); }); }
        left = Math.min(left, l);
      });
      return left === Infinity ? 0 : left;
    }
    function rbReady(e) {
      if (e.kind === "mechanic") return mechReady(e.ow);
      if (e.kind === "spender") return stackCount(spenderOw.spender.resource) >= spendAt && spenderReady();
      if (e.kind === "atWill") return true;
      return isReady({ kind: e.kind, name: e.name });
    }
    function rbHeld(e) {
      if (!CW || nextWindowAt == null || inWindow()) return false;
      const W = nextWindowAt - t; if (W <= 0) return false;
      if (e.kind === "encounter" && HOLD.encounter) return W < cdSeconds(e.ow.obj, pst("encounter:" + e.name));
      if (e.kind === "daily" && HOLD.daily) return W < num(e.ow.obj.actionPointCost, 1000) / Math.max(1, AP_PER_SEC);
      return false;
    }
    function rbAct() {
      for (let i = 0; i < rbList.length; i++) {
        const e = rbList[i];
        if (!rbReady(e) || rbHeld(e)) continue;
        if (e.named && e.named.length && e.named.every(function (n) { return buffUp(n) && (permanentBuff[n] || buffs[n] - t > num(e.ow.obj.castSeconds, 0) + 0.5); })) continue;
        if (e.refresh) { const c = num(e.ow.obj.castSeconds, 0); if (rbRemaining(e) > c + 0.5) continue; }
        if (e.kind !== "mechanic" && e.kind !== "spender" && !isReady({ kind: e.kind, name: e.name })) { rbInvalid++; continue; }
        if (e.kind === "mechanic") return castOwner(e.ow, "mechanic");
        if (e.kind === "spender") return castOwner(spenderOw, "spender");
        return castStep({ kind: e.kind, name: e.name });
      }
      if (rbFiller) return castOwner(rbFiller.ow, "atWill");
      busyUntil = t + dt; return false;
    }
    function callTrigger(on) {
      (CALL.triggered || []).forEach(function (x, i) {
        if (x.on !== on || !x.rec) return;
        if (x.icdSeconds && trigLast[i] != null && t - trigLast[i] < num(x.icdSeconds)) return;
        trigLast[i] = t;
        runRecord({ obj: { name: x.name, fx: [x.rec] }, type: "insignia", name: x.name }, x.rec, {}, t);
      });
    }
    function callFire(c, type, label, trig) {
      const ow = { obj: { name: c.name, fx: c.fx || [] }, type: type, name: c.name };
      (c.fx || []).filter(function (r) { return recOn(r, ow.obj); }).forEach(function (r) { runRecord(ow, r, {}, t); });
      castCount[c.name] = (castCount[c.name] || 0) + 1;
      pushTimeline(c.name, "other", 0, label);
      callTrigger(trig);
    }
    function openWindow() {
      const len = num(CW.seconds, 10);
      windows.push([t, t + len]);
      pushTimeline("Call window", "other", 0, len + " s");
      pendArt = !!CALL.artifact; pendMount = !!CALL.mount;
      const busy = callPending();
      while (nextWindowAt <= t) nextWindowAt += Math.max(1, num(CW.every, 60));
      busyUntil = t + Math.max(dt, busy);
    }
    // fire whatever part of the call is off cooldown; inside the window it keeps waiting for the rest
    function callPending() {
      let busy = 0;
      if (pendArt && t >= callArtReady) { callFire(CALL.artifact, "artifact", "artifact call", "artifact"); callArtReady = t + num(CALL.artifact.cooldown, 60); pendArt = false; busy += 0.5; }
      if (pendMount && t >= callMountReady) { callFire(CALL.mount, "mount", "mount combat power", "mountpower"); callMountReady = t + num(CALL.mount.cooldown, 60); pendMount = false; busy += 0.5; }
      return busy;
    }
    buildListeners();
    if (scoreHit || input.liveRecharge) owners.forEach(function (ow) { fxOf(ow.obj).forEach(function (r) {
      if ((r.kind === "buff" || r.kind === "debuff") && (r.stats || r.ratingStats) && r.seconds == null && r.gate && !r.when && r.op !== "remove") condStatRecs.push({ rec: r, owner: ow.name, all: debuffAll(r, ow) });
    }); });
    // combat start: mechanics first (they set resources), then features, feats, powers
    fire("combatStart", {});

    let phase = opener.length ? "opener" : "loop", ptr = 0, cyclesDone = 0, firstCycleEnd = null;
    const curList = function () { return phase === "opener" ? opener : loop; };
    const advance = function () {
      ptr++;
      if (ptr >= curList().length) {
        if (phase === "opener") { phase = "loop"; ptr = 0; if (firstCycleEnd === null) firstCycleEnd = t; }
        else { ptr = 0; cyclesDone++; if (firstCycleEnd === null) firstCycleEnd = t; }
      }
    };
    const watchedStacks = {}; const watchedBuffs = {};
    owners.forEach(function (ow) { fxOf(ow.obj).forEach(function (r) {
      (r.addFx || []).concat([r]).forEach(function (x) { if (x.kind === "stack") watchedStacks[x.resource] = true; if ((x.kind === "buff" || x.kind === "debuff") && x.name) watchedBuffs[x.name] = true; });
      if (r.gate && /^stack:/.test(r.gate.key || "")) watchedStacks[r.gate.key.slice(6)] = true;
    }); });
    while (t < T) {
      flushEvents();
      Object.keys(watchedStacks).forEach(function (n) { stackTimeSum[n] = (stackTimeSum[n] || 0) + stackCount(n) * dt; });
      Object.keys(watchedBuffs).forEach(function (n) { if (buffUp(n)) buffTime[n] = (buffTime[n] || 0) + dt; });
      Object.keys(buffs).forEach(function (n) {
        const up = buffUp(n);
        if (buffWasUp[n] && !up) { buffWasUp[n] = false; fire("buffEnded", { name: n }); }
        else buffWasUp[n] = up;
      });
      // echoes whose window closed deal their stored share now (no triggers, never echoed)
      for (let ei = echoes.length - 1; ei >= 0; ei--) {
        const E = echoes[ei];
        if (E.until <= t) { echoes.splice(ei, 1); if (E.deliver === "end" && E.acc > 0) addEcho(E.name, E.acc * E.pct / 100, (E.dacc || 0) * E.pct / 100); }
      }
      if (input.trace && Math.abs(t - Math.round(t)) < dt / 2) traceRows.push({ t: Math.round(t), stacks: Object.fromEntries(Object.keys(stacks).map(function (n) { return [n, Math.round(stackCount(n) * 10) / 10]; })), up: Object.keys(buffs).filter(buffUp) });
      // expiries: a timed stack running out fires stackRemoved
      Object.keys(stacks).forEach(function (n) {
        const s = stacks[n]; const before = s.timers.length;
        s.timers = s.timers.filter(function (x) { return x > t; });
        if (s.timers.length < before && s.timers.length === 0 && s.n === 0) fire("stackRemoved", { resource: n });
      });
      // periodic records (pets): every N s, only while their named buff is up
      for (let i = 0; i < listeners.length; i++) {
        const L = listeners[i], w = L.rec.when; if (w.on !== "periodic") continue;
        if (w.name && !buffUp(w.name)) continue;
        if (L.nextAt == null) L.nextAt = num(w.every, 1);
        if (t >= L.nextAt) { L.nextAt = t + num(w.every, 1); if (gateFrac(L.rec.gate) > 0) runPeriodic(L); }
      }
      if (CW && nextWindowAt == null && (firstCycleEnd != null || t >= num(CW.every, 60))) nextWindowAt = firstCycleEnd != null ? firstCycleEnd : t;
      if (t >= busyUntil) {
        let acted = false;
        const cur = curList();
        if (CW && nextWindowAt != null && t >= nextWindowAt) { openWindow(); acted = true; }
        else if (CW && (pendArt || pendMount)) {
          if (!inWindow()) { pendArt = false; pendMount = false; }   // still on cooldown when the window closed: skipped this call
          else { const b = callPending(); if (b > 0) { busyUntil = t + b; acted = true; } }
        }
        if (!acted && RB) { rbAct(); acted = true; }
        if (!acted && spenderOw && !listedIn(cur, "scorch") && stackCount(spenderOw.spender.resource) >= spendAt) acted = castOwner(spenderOw, "spender");
        if (!acted && !CW && !listedIn(cur, "artifact") && input.artifactName && t >= artifactReady) acted = castStep({ kind: "artifact", name: input.artifactName });
        if (!acted && !CW && !listedIn(cur, "mount") && input.mountName && t >= mountReady) acted = castStep({ kind: "mount", name: input.mountName });
        if (!acted) for (let di = 0; di < powers.daily.length && !acted; di++) { const dp = powers.daily[di]; const ds = { kind: "daily", name: dp.name }; if (!listedIn(cur, "daily", dp.name) && isReady(ds)) acted = castStep(ds); }
        if (!acted) {
          let guard = 0;
          while (!acted && guard++ < 64) {
            const list = curList(); if (!list.length) break;
            const step = list[ptr];
            const w = waitFor(step);
            if (w <= 0 && isReady(step)) { acted = castStep(step); advance(); }
            else if (w <= MAX_WAIT) break;
            else advance();
          }
        }
        if (!acted && fillerStep) { const ow = owOf("atWill", fillerStep.name); if (ow) castOwner(ow, "atWill"); else busyUntil = t + dt; }
        if (!acted && !fillerStep) busyUntil = t + dt;
      }
      ap += AP_PER_SEC * dt;
      // 2.4-E: a running encounter cooldown loses dt x bonus of base time while a Recharge Speed buff is up
      if (input.liveRecharge) {
        const rb = rechargeBonusNow();
        if (rb > 0) Object.keys(st).forEach(function (k) { if (k.indexOf("encounter:") === 0) st[k].ready = st[k].ready.map(function (r) { return r > t ? Math.max(t, r - dt * rb / 100 / (1 + rsi)) : r; }); });
      }
      t += dt;
    }
    flushEvents();
    function runPeriodic(L) {
      const r = withRecMods(L.ow, L.rec);
      if (r.kind === "hit") { land(asProc(L.ow), r.name || L.ow.name, num(r.magnitude, 0) * (r.gate && !(r.gate.shape === "toggle" && !Array.isArray(r.gate)) ? gateFrac(r.gate) : 1), false, false, r); return; }
      runRecord(asProc(L.ow), r, null, null);
    }

    const avg = {}; Object.keys(stackTimeSum).forEach(function (n) { avg[n] = stackTimeSum[n] / T; });
    const up = {}; Object.keys(buffTime).forEach(function (n) { up[n] = Math.min(1, buffTime[n] / T); });
    const totalMix = mix.atWill + mix.encounter + mix.daily + mix.other;
    return {
      engine: "fx", fightSeconds: T, mps: magTotal / T, magnitudeTotal: magTotal, defaultOrderUsed: defaultOrderUsed && !RB, steps: loop, opener: opener, loop: loop,
      casts: castCount, bySource: bySource, byOwner: byOwner, timeline: timeline, firstCycleEnd: firstCycleEnd, cycles: cyclesDone,
      mix: { atWill: mix.atWill, encounter: mix.encounter, daily: mix.daily, other: mix.other, pct: totalMix > 0 ? { atWill: mix.atWill / totalMix * 100, encounter: mix.encounter / totalMix * 100, daily: mix.daily / totalMix * 100, other: mix.other / totalMix * 100 } : null },
      stacksAvg: avg, buffUptime: up,
      damageTotal: scoreHit ? dmgTotal : undefined, dps: scoreHit ? dmgTotal / T : undefined, damageByOwner: scoreHit ? dmgByOwner : undefined,
      ruleBuilt: RB ? { list: rbList.map(function (e) { return { kind: e.kind, name: e.name, reason: e.reason }; }).concat(rbFiller ? [{ kind: "atWill", name: rbFiller.ow.name, reason: input.filler ? "filler: the at-will that gave the most damage" : "filler: best at-will per second of casting" }] : []),
        hold: { encounter: !!HOLD.encounter, daily: !!HOLD.daily }, filler: rbFiller ? rbFiller.ow.name : null, spendAt: spenderOw ? spendAt : null, invalidCasts: rbInvalid } : undefined,
      callWindow: CW ? { windows: windows.map(function (w) { return [Math.round(w[0] * 10) / 10, Math.round(w[1] * 10) / 10]; }), magnitudeInside: magIn, magnitudeOutside: magTotal - magIn,
        damageInside: scoreHit ? dmgIn : undefined, damageOutside: scoreHit ? dmgTotal - dmgIn : undefined, damageInsideByOwner: scoreHit ? dmgInByOwner : undefined } : undefined, statOwnersOn: scoreHit ? Object.keys(statOwnersOn) : undefined,
      derived: { stacksAvg: avg, buffUptime: up, spenderCasts: spenderOw ? (castCount[spenderOw.name] || 0) : 0 },
      trace: input.trace ? traceRows : undefined
    };
  }

  // ===== PT2 step 2.8: the rule-built rotation's choices (locks 2.8-B/C/D) =====
  // With input.ruleBuilt, try the choices one after another and keep the most total fight damage (magnitude when no
  // scorer): hold for the call window (none / dailies / encounters / both), each player-choice mode (tap or full charge,
  // Contre stances, early or enhanced detonation, melee or ranged), the spender's stack count (its minimum to the most it
  // spends). input.choices {hold, modes, spendAt} skips the search and runs those. result.choices says what won and by how much.
  const MODE_META = { keyedOn: 1, "default": 1, autoDetonateSeconds: 1, base: 1, stealth: 1, behind: 1, spellMastery: 1 };
  function choiceModes(p) {
    const m = p && p.modes; if (!m || typeof m !== "object" || m.keyedOn === "activeSong") return null;
    const names = Object.keys(m).filter(function (k) { return !MODE_META[k] && m[k] && typeof m[k] === "object" && (m[k].magnitude != null || Array.isArray(m[k].fx)); });
    return names.length > 1 ? names : null;
  }
  function withMode(p, name) {
    const md = p.modes[name]; if (Array.isArray(md.fx)) return p;   // fx modes (melee / ranged) go through input.modes
    const c = Object.assign({}, p);
    if (md.castSeconds != null) c.castSeconds = md.castSeconds;   // a mode with no cast time of its own keeps the power's (guaranteed minimum)
    const hits = (p.fx || []).filter(function (r) { return r.kind === "hit" && !r.when; });
    if (hits.length) {
      const first = hits[0];
      c.fx = p.fx.map(function (r) { return r === first ? Object.assign({}, r, { magnitude: md.magnitude, targets: md.targets || r.targets, delaySeconds: num(r.delaySeconds, 0) + num(md.waitSeconds, 0) }) : r; });
    } else {
      c.magnitude = md.magnitude;
      if (md.targets) c.tags = Object.assign({}, p.tags || {}, { targets: md.targets });
    }
    return c;
  }
  function kitWithModes(kit, sel) {
    const L = function (a) { return (a || []).map(function (p) { const m = sel[p.name]; return (m && p.modes && p.modes[m]) ? withMode(p, m) : p; }); };
    return Object.assign({}, kit, { powers: { atWill: L(kit.powers.atWill), encounter: L(kit.powers.encounter), daily: L(kit.powers.daily) } });
  }
  function simulateFxBest(input) {
    if (!input.ruleBuilt) return simulateFx(input);
    const kit = input.kit || { powers: {} };
    const run = function (ch) {
      const fxModes = Object.assign({}, input.modes || {});
      Object.keys(ch.modes).forEach(function (n) { const all = [].concat(kit.powers.atWill || [], kit.powers.encounter || [], kit.powers.daily || []); const p = all.find(function (x) { return x.name === n; }); if (p && p.modes[ch.modes[n]] && Array.isArray(p.modes[ch.modes[n]].fx)) fxModes[n] = ch.modes[n]; });
      const k2 = kitWithModes(kit, ch.modes);
      k2.songs = (kit.songs || []).filter(function (sg) { return (ch.songs || []).indexOf(sg.name) >= 0; });
      if (ch.sm) { const smo = (input.smCandidates || []).find(function (x) { return x.name === ch.sm; }); if (smo) k2.powers = Object.assign({}, k2.powers, { encounter: (k2.powers.encounter || []).concat([smo]) }); }
      const r = simulateFx(Object.assign({}, input, { spellMasteryPower: ch.sm || input.spellMasteryPower || null, kit: k2, hold: ch.hold, spendAt: ch.spendAt, modes: fxModes, filler: ch.filler || null, noDamageCast: ch.skip || [], quickplay: ch.quickplay || [] }));
      r._score = r.damageTotal != null ? r.damageTotal : r.magnitudeTotal; return r;
    };
    if (input.choices) { const r = run(input.choices); r.choices = Object.assign({ gains: [] }, input.choices); return r; }
    const ch = { hold: {}, modes: {}, spendAt: input.spendAt != null ? input.spendAt : input.scorchAtSparks, filler: null, skip: [], songs: [], quickplay: [] };
    let best = run(ch); const gains = [];
    const tryAll = function (label, opts, apply) {
      const base = best._score; let win = null;
      opts.forEach(function (o) { const c = apply(o); const r = run(c); if (r._score > best._score + 1e-9) { best = r; win = { o: o, c: c }; } });
      if (win) { Object.assign(ch, win.c); gains.push({ choice: label, picked: win.o.label, pct: base > 0 ? (best._score - base) / base * 100 : 0 }); }
      else gains.push({ choice: label, picked: opts.length ? "default" : "n/a", pct: 0 });
    };
    // PT2 step 2.9-A: songs - the search plays at most one elemental song and one ballad (elemental songs cancel each
    // other); heal and utility songs do nothing for the damage score
    const songsOf = function (type) { return (kit.songs || []).filter(function (sg) { return sg.tags && sg.tags.songType === type; }).map(function (sg) { return sg.name; }); };
    const els = songsOf("elemental"), bals = songsOf("ballad");
    // PT2 2.9-C: an empty Spell Mastery slot (Wizard encounter slot 4) - try each paragon encounter there
    if (!input.spellMasteryPower && Array.isArray(input.smCandidates) && input.smCandidates.length)
      tryAll("Spell Mastery slot", input.smCandidates.map(function (p) { return { label: p.name, n: p.name }; }), function (o) { return Object.assign({}, ch, { sm: o.n }); });
    if (els.length) tryAll("elemental song", els.map(function (n) { return { label: n, n: n }; }), function (o) { return Object.assign({}, ch, { songs: (ch.songs || []).filter(function (x) { return els.indexOf(x) < 0; }).concat([o.n]) }); });
    if (bals.length) tryAll("ballad", bals.map(function (n) { return { label: n, n: n }; }), function (o) { return Object.assign({}, ch, { songs: (ch.songs || []).filter(function (x) { return bals.indexOf(x) < 0; }).concat([o.n]) }); });
    const aws = (kit.powers.atWill || []).map(function (p) { return p.name; });
    if (aws.length > 1) tryAll("at-will filler", aws.filter(function (n) { return n !== (best.ruleBuilt && best.ruleBuilt.filler); }).map(function (n) { return { label: n, n: n }; }),
      function (o) { return Object.assign({}, ch, { filler: o.n }); });
    // "spend cooldowns as they come up" is not always right: an encounter that comes back fast can crowd out a stronger
    // filler. Each encounter is tried left out of the damage casts (refresh casts still happen); kept only when it gains.
    (kit.powers.encounter || []).forEach(function (p) {
      tryAll(p.name + " for damage", [{ label: "leave it to the filler", n: p.name }], function (o) { return Object.assign({}, ch, { skip: (ch.skip || []).concat([o.n]) }); });
    });
    if (input.callWindow) tryAll("hold for the call", [{ label: "hold dailies", h: { daily: true } }, { label: "hold encounters", h: { encounter: true } }, { label: "hold both", h: { daily: true, encounter: true } }],
      function (o) { return Object.assign({}, ch, { hold: o.h }); });
    [].concat(kit.powers.atWill || [], kit.powers.encounter || [], kit.powers.daily || []).forEach(function (p) {
      const names = choiceModes(p); if (!names) return;
      tryAll(p.name + " mode", names.map(function (n) { return { label: n, n: n }; }), function (o) { const m = Object.assign({}, ch.modes); m[p.name] = o.n; return Object.assign({}, ch, { modes: m }); });
    });
    const sp = (kit.mechanics || []).map(function (m) { return (m.fx || []).find(function (r) { return r.kind === "stack" && r.op === "consume" && r.min != null && !r.when; }); }).filter(Boolean)[0];
    if (sp) { const opts = []; for (let k = num(sp.min); k <= num(sp.amount, sp.min); k++) opts.push({ label: k + " " + sp.resource, k: k });
      tryAll("spend " + sp.resource + " at", opts, function (o) { return Object.assign({}, ch, { spendAt: o.k }); }); }
    const qpSongs = (kit.songs || []).filter(function (sg) { return (ch.songs || []).indexOf(sg.name) >= 0 && sg.quickplay !== false; }).map(function (sg) { return sg.name; });
    const qpSlots = 1 + ((kit.mechanics || []).some(function (m) { return /quickplay slot/i.test(String(m.notes || "") + String(m.modeledBy || "")); }) ? 1 : 0);
    const qpCosts = [];
    if (qpSongs.length) {
      const opts = qpSongs.map(function (n) { return [n]; }); if (qpSlots >= 2 && qpSongs.length >= 2) opts.push(qpSongs.slice(0, 2));
      const base = best._score;
      opts.forEach(function (q) { const r = run(Object.assign({}, ch, { quickplay: q })); qpCosts.push({ songs: q, pct: base > 0 ? (r._score - base) / base * 100 : 0 });
        if (r._score > best._score + 1e-9) { best = r; ch.quickplay = q; } });
      gains.push({ choice: "quick play", picked: ch.quickplay.length ? ch.quickplay.join(" + ") : "none (play songs by hand)", pct: 0 });
    }
    best.choices = { hold: ch.hold, modes: ch.modes, spendAt: ch.spendAt, filler: ch.filler, skip: ch.skip, songs: ch.songs, quickplay: ch.quickplay, quickplayCosts: qpCosts, spellMastery: ch.sm || null, gains: gains };
    return best;
  }

  const api = { simulate: simulate, simulateFx: simulateFx, simulateFxBest: simulateFxBest, choiceModes: choiceModes, defaultSteps: defaultSteps, powerMagnitude: powerMagnitude, parseMag: parseMag, VERSION: "2026-09-11a" };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.TF_ROTATION_SIM = api;
})(typeof window !== "undefined" ? window : globalThis);
