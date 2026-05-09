// Toon Forge — stat aggregation engine (skeleton)
//
// Pure JS module. No DOM, no globals (other than TOON_FORGE_ENGINE).
// Depends on toon-forge-stats.js (TOON_FORGE_STATS, TOON_FORGE_STAT_BY_NAME, etc.)
//
// Public API:
//   TOON_FORGE_ENGINE.computeStats(character) -> result
//
// All sub-functions are stubbed in this skeleton — they return empty
// or zero values. Steps 3-5 fill them in (rating aggregation, percent
// aggregation, cap clamping, forte distribution).
//
// Input shape (the "character state"):
//   {
//     totalItemLevel: 89000,
//     class: "Wizard",
//     paragon: "Arcanist",
//     role: "DPS",
//     race: "Sun Elf",
//     abilityScores: { STR, DEX, CON, INT, WIS, CHA },
//     gear:          { Head: gearObj, Armor: gearObj, ... },  // 12 slots
//     artifacts:     { primary: artifactObj, secondary: [a, b] },
//     companionGear: { Neck: x, Waist: y, Ring: z },
//     campaignBoons: { tier1: [...], ..., master: [...] },
//     guildBoons:    [...],
//     buffs:         [...]
//   }
//
// Output shape:
//   {
//     totalItemLevel,
//     stats: {
//       <statName>: {
//         ratingTotal,        // sum across rating sources
//         ratingContribPct,   // 50 + (rating - TIL)/1000, clamped to ratingCap
//         percentTotal,       // sum of non-rating % sources
//         finalPct,           // ratingContribPct + percentTotal, clamped to total cap
//         flat,               // for kind:"flat" stats (Max HP, Class Resource Max)
//         cap,                // total cap %, null = no cap
//         capReached,
//         contributors        // [] for now; filled in Phase 3
//       }
//     },
//     warnings: [],
//     buildScore: 0
//   }

(function() {
  "use strict";

  // ---------------------------------------------------------------
  // Result initializer
  // ---------------------------------------------------------------

  function emptyStatResult(statDef) {
    return {
      ratingTotal: 0,
      ratingContribPct: 0,
      percentTotal: 0,
      finalPct: 0,
      flat: 0,
      cap: statDef.cap,
      capReached: false,
      contributors: []
    };
  }

  function initResult(character) {
    var stats = {};
    for (var i = 0; i < TOON_FORGE_STATS.length; i++) {
      var s = TOON_FORGE_STATS[i];
      stats[s.name] = emptyStatResult(s);
    }
    // Class Resource Max gets its base value baked in
    if (stats["Class Resource Max"]) {
      stats["Class Resource Max"].flat = 1000;
    }
    return {
      totalItemLevel: character.totalItemLevel || 0,
      stats: stats,
      warnings: [],
      buildScore: 0
    };
  }

  // ---------------------------------------------------------------
  // Stage 1: rating aggregation
  // ---------------------------------------------------------------
  //
  // Walks every source that contributes rating values (gear, artifacts,
  // companion gear) and sums into result.stats[stat].ratingTotal.
  // Also seeds the contributors list so we can show source breakdown.
  //
  // Race fixed bonuses (ability scores) are NOT rating contributions —
  // they're handled separately by ability-score scaling.

  function addRating(result, statName, amount, sourceLabel) {
    var statResult = result.stats[statName];
    if (!statResult) {
      // Unknown stat — skip, but record warning once
      var key = "unknown-stat:" + statName;
      if (result.warnings.indexOf(key) === -1) {
        result.warnings.push(key);
      }
      return;
    }
    statResult.ratingTotal += amount;
    statResult.contributors.push({
      source: sourceLabel,
      amount: amount,
      type: "rating"
    });
  }

  function ingestRatingStats(result, ratingStats, sourceLabel) {
    if (!ratingStats) return;
    for (var statName in ratingStats) {
      if (!Object.prototype.hasOwnProperty.call(ratingStats, statName)) continue;
      addRating(result, statName, ratingStats[statName], sourceLabel);
    }
  }

  function aggregateRatings(character, result) {
    // 1. Gear — 12 slots
    var gear = character.gear || {};
    for (var slot in gear) {
      if (!Object.prototype.hasOwnProperty.call(gear, slot)) continue;
      var item = gear[slot];
      if (!item) continue;
      ingestRatingStats(result, item.ratingStats, "Gear: " + (item.name || slot));
    }

    // 2. Artifacts — primary + secondary[]
    var artifacts = character.artifacts || {};
    if (artifacts.primary) {
      ingestRatingStats(result, artifacts.primary.ratingStats,
        "Artifact: " + artifacts.primary.name + " (primary)");
    }
    var secondary = artifacts.secondary || [];
    for (var i = 0; i < secondary.length; i++) {
      var a = secondary[i];
      if (!a) continue;
      ingestRatingStats(result, a.ratingStats,
        "Artifact: " + a.name + " (secondary)");
    }

    // 3. Companion gear — Neck / Waist / Ring
    var compGear = character.companionGear || {};
    for (var cslot in compGear) {
      if (!Object.prototype.hasOwnProperty.call(compGear, cslot)) continue;
      var citem = compGear[cslot];
      if (!citem) continue;
      ingestRatingStats(result, citem.ratingStats,
        "Companion Gear: " + (citem.name || cslot));
    }

    return result;
  }

  // ---------------------------------------------------------------
  // Stage 2: percent aggregation
  // ---------------------------------------------------------------
  //
  // Walks every source that contributes flat percentage values:
  //   - gear[slot].percentStats
  //   - artifacts (primary + secondary[]).percentStats
  //   - companionGear[slot].percentStats
  //   - race.traits[*].percentStats
  //   - campaignBoons.tier1..tier5 (each entry: { boon, points })
  //   - campaignBoons.master (each entry: { boon, ranks })
  //   - guildBoons (each entry: { boon, level }) — TODO when shape known
  //   - buffs (each entry: { buff, active }) — TODO when shape known
  //
  // Adds into result.stats[stat].percentTotal.

  function addPercent(result, statName, amount, sourceLabel) {
    // Route Class Resource Regen aliases to the canonical name
    if (CLASS_RESOURCE_REGEN_ALIASES.indexOf(statName) !== -1) {
      statName = "Class Resource Regen";
    }
    var statResult = result.stats[statName];
    if (!statResult) {
      // Bonus stats that aren't core combat stats — silently ignore
      if (TOON_FORGE_BONUS_STATS.indexOf(statName) !== -1) return;
      var key = "unknown-stat:" + statName;
      if (result.warnings.indexOf(key) === -1) {
        result.warnings.push(key);
      }
      return;
    }
    statResult.percentTotal += amount;
    statResult.contributors.push({
      source: sourceLabel,
      amount: amount,
      type: "percent"
    });
  }

  function ingestPercentStats(result, percentStats, sourceLabel) {
    if (!percentStats) return;
    for (var statName in percentStats) {
      if (!Object.prototype.hasOwnProperty.call(percentStats, statName)) continue;
      addPercent(result, statName, percentStats[statName], sourceLabel);
    }
  }

  function aggregatePercents(character, result) {
    // 1. Gear percentStats
    var gear = character.gear || {};
    for (var slot in gear) {
      if (!Object.prototype.hasOwnProperty.call(gear, slot)) continue;
      var item = gear[slot];
      if (!item) continue;
      ingestPercentStats(result, item.percentStats,
        "Gear: " + (item.name || slot) + " (%)");
    }

    // 2. Artifact percentStats
    var artifacts = character.artifacts || {};
    if (artifacts.primary) {
      ingestPercentStats(result, artifacts.primary.percentStats,
        "Artifact: " + artifacts.primary.name + " (primary %)");
    }
    var secondary = artifacts.secondary || [];
    for (var i = 0; i < secondary.length; i++) {
      var a = secondary[i];
      if (!a) continue;
      ingestPercentStats(result, a.percentStats,
        "Artifact: " + a.name + " (secondary %)");
    }

    // 3. Companion gear percentStats
    var compGear = character.companionGear || {};
    for (var cslot in compGear) {
      if (!Object.prototype.hasOwnProperty.call(compGear, cslot)) continue;
      var citem = compGear[cslot];
      if (!citem) continue;
      ingestPercentStats(result, citem.percentStats,
        "Companion Gear: " + (citem.name || cslot) + " (%)");
    }

    // 4. Race traits' percentStats
    var race = character.race;
    if (race && race.traits) {
      for (var t = 0; t < race.traits.length; t++) {
        var trait = race.traits[t];
        ingestPercentStats(result, trait.percentStats,
          "Race: " + race.name + " / " + trait.name);
      }
    }

    // 5. Campaign boons — tier 1 through 5 (linear: stat × points × perPoint)
    var cb = character.campaignBoons || {};
    var tierKeys = ["tier1", "tier2", "tier3", "tier4", "tier5"];
    for (var ti = 0; ti < tierKeys.length; ti++) {
      var tier = cb[tierKeys[ti]] || [];
      for (var bi = 0; bi < tier.length; bi++) {
        var entry = tier[bi];
        if (!entry || !entry.boon) continue;
        var b = entry.boon;
        var pts = Math.min(entry.points || 0, b.maxPoints || 0);
        if (pts <= 0 || !b.stat || !b.perPoint) continue;
        addPercent(result, b.stat, pts * b.perPoint,
          "Boon: Campaign/" + (b.name || "?") + " (" + pts + " pts)");
      }
    }

    // 6. Master tier — each rank stacks all perRankEffects of type:"percent"
    var master = cb.master || [];
    for (var mi = 0; mi < master.length; mi++) {
      var mentry = master[mi];
      if (!mentry || !mentry.boon) continue;
      var mboon = mentry.boon;
      var ranks = Math.min(mentry.ranks || 0, mboon.maxRanks || 0);
      if (ranks <= 0) continue;
      var effects = mboon.perRankEffects || [];
      for (var ei = 0; ei < effects.length; ei++) {
        var eff = effects[ei];
        if (!eff || eff.type !== "percent") continue;
        // Skip enemy-scoped effects (e.g. Blood Lust R1 -1% target Def)
        if (eff.scope === "enemy") continue;
        addPercent(result, eff.stat, ranks * eff.amount,
          "Boon: Master/" + mboon.name + " R" + ranks);
      }
    }

    // 7. Guild boons — TODO once shape is finalized

    // 8. Buffs (any active effect with percentStats/ratingStats).
    //    Currently used for: summoned-companion party buffs.
    var buffs = character.buffs || [];
    for (var bi = 0; bi < buffs.length; bi++) {
      var buff = buffs[bi];
      if (!buff) continue;
      var label = "Buff: " + (buff.source || buff.name || "?");
      ingestPercentStats(result, buff.percentStats, label);
      ingestRatingStats(result, buff.ratingStats, label);
    }

    return result;
  }

  // ---------------------------------------------------------------
  // Stage 2.5: ability score → stat conversions
  // ---------------------------------------------------------------
  //
  // Per NW Hub canonical formula: each ability score grants
  //   primary stat:   +0.5% per absolute point
  //   secondary stat: +0.25% per absolute point
  // (NOT "+1% per point above 10" as some sources state.)
  //
  // Verified from in-game NW Hub character editor: a Wizard with
  // base STR 8 shows Stamina Regen 4.0% (8 × 0.5).

  var ABILITY_CONVERSIONS = {
    STR: [{stat: "Stamina Regeneration", rate: 0.5},
          {stat: "Physical Damage",      rate: 0.25}],
    CON: [{stat: "Maximum Hit Points",   rate: 0.5},
          {stat: "Action Point Gain",    rate: 0.25}],
    DEX: [{stat: "Critical Severity",    rate: 0.5},
          {stat: "Movement Speed",       rate: 0.25}],
    INT: [{stat: "Control Bonus",        rate: 0.5},
          {stat: "Magical Damage",       rate: 0.25}],
    WIS: [{stat: "Control Resist",       rate: 0.5},
          {stat: "Outgoing Healing",     rate: 0.25}],
    CHA: [{stat: "Forte",                rate: 0.5},
          {stat: "Recharge Speed",       rate: 0.25}]
  };

  function aggregateAbilityScores(character, result) {
    var scores = character.abilityScores || {};
    for (var ability in ABILITY_CONVERSIONS) {
      if (!Object.prototype.hasOwnProperty.call(ABILITY_CONVERSIONS, ability)) continue;
      var key = ability.toLowerCase();
      var score = +scores[key] || 0;
      if (score <= 0) continue;
      var conversions = ABILITY_CONVERSIONS[ability];
      for (var i = 0; i < conversions.length; i++) {
        var c = conversions[i];
        var amt = score * c.rate;
        addPercent(result, c.stat, amt, "Ability: " + ability + " " + score);
      }
    }
    return result;
  }

  // ---------------------------------------------------------------
  // Stage 3: forte distribution
  // ---------------------------------------------------------------
  //
  // Forte rating converts to a % contribution via the standard
  // formula (capped at Forte's own rating cap of 60%). That % is
  // then distributed across 3 stats per the paragon's percentStats
  // (typically 50/25/25 for primary/offensive/defensive).
  //
  // Forte BYPASSES the rating cap of the fed stats — so the
  // distributed portion lands in their percentTotal (not
  // ratingContribPct), letting them push past their rating cap.
  // The total cap on those stats still applies (handled in finalize).
  //
  // Requires character.paragonDef to be the resolved paragon object:
  //   { name, percentStats: { "<statName>": <pct>, ... }, ... }

  function applyForte(character, result) {
    var paragon = character.paragonDef;
    if (!paragon || !paragon.percentStats) return result;

    var forte = result.stats["Forte"];
    if (!forte) return result;

    var TIL = result.totalItemLevel || 0;
    var rawForte = (forte.ratingTotal === 0) ? 0 : ratingToPercent(forte.ratingTotal, TIL);
    var fortePct = Math.max(0, Math.min(60, rawForte));   // Forte rating cap = 60%
    var totalForte = fortePct + forte.percentTotal;        // include % bonuses to Forte itself
    if (totalForte > 120) totalForte = 120;                // Forte total cap = 120%

    if (totalForte <= 0) return result;

    var dist = paragon.percentStats;
    for (var statName in dist) {
      if (!Object.prototype.hasOwnProperty.call(dist, statName)) continue;
      var pctOfForte = dist[statName];
      var portion = totalForte * pctOfForte / 100;

      // Route Class Resource Regen aliases (e.g. "Performance Regen")
      var routedName = statName;
      if (CLASS_RESOURCE_REGEN_ALIASES.indexOf(routedName) !== -1) {
        routedName = "Class Resource Regen";
      }

      addPercent(result, routedName, portion,
        "Forte: " + paragon.name + " (" + pctOfForte + "% of Forte)");
    }

    return result;
  }

  // ---------------------------------------------------------------
  // Stage 4: rating-to-% conversion + cap clamping (Step 4)
  // ---------------------------------------------------------------

  function ratingToPercent(rating, totalItemLevel) {
    // mekaniks.html:182 — Rating contribution = 50 + (Rating - TIL)/1000
    return 50 + (rating - totalItemLevel) / 1000;
  }

  function ratingCapForStat(statDef) {
    // 90% total cap → rating cap 50% (rating = TIL)
    // 120% total cap → rating cap 60% (rating = TIL + 10000)
    if (statDef.cap === 90) return 50;
    if (statDef.cap === 120) return 60;
    return null;  // unverified or no cap
  }

  function finalize(result) {
    var TIL = result.totalItemLevel || 0;

    for (var i = 0; i < TOON_FORGE_STATS.length; i++) {
      var def = TOON_FORGE_STATS[i];
      var s = result.stats[def.name];
      if (!s) continue;

      // ----- kind: "flat" -----
      // Maximum HP / Class Resource Max — ratingTotal is treated as
      // a flat addition. percentTotal is a multiplier on top.
      // Engine surfaces both; UI computes final = (base + flat) × (1 + pct/100).
      if (def.kind === "flat") {
        s.flat = (s.flat || 0) + s.ratingTotal;
        s.ratingContribPct = 0;
        s.finalPct = 0;
        s.capReached = false;
        continue;
      }

      // ----- kind: "fixed" -----
      // Action Point Gain / Recharge Speed — fixed rating-to-% ratio.
      if (def.kind === "fixed" && def.flatRating) {
        s.ratingContribPct = s.ratingTotal / def.flatRating;
        s.finalPct = s.ratingContribPct + s.percentTotal;
        s.capReached = false;
        continue;
      }

      // ----- kind: "rating" -----
      // Standard rating-to-% formula with cap clamping.
      // When TIL is 0 (no gear picked yet), the rating-to-% formula
      // is degenerate (treats any positive rating as near-cap). Skip it
      // and show 0% rating contribution — percent bonuses still apply.
      var ratingCap = ratingCapForStat(def);
      var rawContrib = (s.ratingTotal === 0 || TIL === 0)
        ? 0
        : ratingToPercent(s.ratingTotal, TIL);

      // Clamp rating contribution to [0, ratingCap] (or [0, ∞) if cap is null/unverified).
      var clampedContrib = Math.max(0, rawContrib);
      if (ratingCap !== null && clampedContrib > ratingCap) {
        // Rating overcap — record wasted rating warning
        var ratingExcess = (rawContrib - ratingCap) * 1000;  // % back to rating points
        result.warnings.push(
          "Rating overcap on " + def.name + ": +" +
          Math.round(ratingExcess) + " rating wasted (cap = " + ratingCap + "%)"
        );
        clampedContrib = ratingCap;
      }
      s.ratingContribPct = clampedContrib;

      // Sum rating contribution with percent bonuses.
      var combined = clampedContrib + s.percentTotal;

      // Clamp to total cap if numeric.
      if (typeof def.cap === "number") {
        if (combined > def.cap) {
          var totalExcess = combined - def.cap;
          result.warnings.push(
            "Total cap on " + def.name + ": " +
            totalExcess.toFixed(1) + "% over cap (" + def.cap + "%)"
          );
          combined = def.cap;
          s.capReached = true;
        } else if (combined === def.cap) {
          s.capReached = true;
        }
      }

      s.finalPct = combined;
    }

    return result;
  }

  // ---------------------------------------------------------------
  // Public entry
  // ---------------------------------------------------------------

  function computeStats(character) {
    var result = initResult(character);
    aggregateRatings(character, result);
    aggregatePercents(character, result);
    aggregateAbilityScores(character, result);
    applyForte(character, result);
    finalize(result);
    return result;
  }

  // ---------------------------------------------------------------
  // Helpers exposed for testing / debugging
  // ---------------------------------------------------------------

  window.TOON_FORGE_ENGINE = {
    computeStats: computeStats,
    // exposed internals (handy for unit tests)
    _ratingToPercent: ratingToPercent,
    _ratingCapForStat: ratingCapForStat,
    _initResult: initResult,
  };
})();
