# News Staging — Unpublished Changes

Add entries here as changes are made. When ready to publish, say "publish news" and these will be formatted and added to the News tab.

---

## Week of July 19, 2026

(Last published July 21, 2026: "Insignia Picker Overhaul, the Preferred-Slot +20%, Full Bard Rebuild & a Mobile Menu")

### Features

- **The Optimizer and the Forgemaster's Verdict are LIVE for Legendary Noob
  members.** The two premium tools have been sitting behind a "coming soon"
  button for a while — they're open now. The Optimizer rebuilds your gear,
  enchants, artifacts, companions, mounts, insignias and boons around your
  role in one click. The Forgemaster's Verdict is an AI that reviews any
  build, tells you what's wrong with it, and coaches you on how to actually
  play it. 30 runs a month. Click either button on Toon Forge and sign in
  with Discord — make sure your YouTube membership is linked under Discord
  Settings → Connections.

- **Toon Forge is out of Experimental — say hello to v1.0.** The orange
  "Experimental" tag on the builder is gone, replaced by a green **v1.0**
  badge. The stat engine has been calibrated against in-game sheets for all
  three roles, so the numbers you see are the numbers you get. The ✎ pencil
  isn't going anywhere — if something still doesn't match your character,
  fix it right there and your build uses your version immediately.

- **The "help us fix it" box now tells you about both routes.** It only ever
  mentioned the ✎ pencil for correcting a wrong number — it never told anyone
  they can also **add an item that isn't in the list at all**. It now shows
  both, each with a little copy of the actual button you're looking for (amber
  ✎ pencil, green dashed "+ Add Missing"), so you know what to hunt for once
  you open a picker. **Your submissions** is now a proper button instead of a
  line of text nobody realised was clickable.

- **Optimizer: Augment companions are off by default.** The optimizer used to
  pick an Augment (Ioun Stones and the like) as your summoned companion because
  it scores higher on paper — the companion enchantment feeds an Augment's bonus
  stats straight to your sheet. The current community meta treats a summoned
  Augment as a no-go, so builds nobody would invite you to run aren't much use.
  Augments are now excluded from the summoned slot by default, at every role.
  A new **"Allow Augment companions"** checkbox in the optimize dialog's Party
  meta section lets you run it both ways and compare the two builds yourself.
  The result screen tells you which way the run went either way.

- **The site now counts page views — and there's a line in the footer saying
  so.** Until now there was no way to tell which pages people actually use, so
  every decision about what to build next was a guess. Every page now counts
  how many times it was opened and which site you arrived from. No accounts,
  no ads, no personal data, no cookies — just counts, and they are never shown
  publicly anywhere on the site. If your browser sends a "Do Not Track"
  signal, nothing is counted at all.

### Bug Fixes

- **Collars: only one of each type, the way the game works.** The optimizer
  could hand you a stable wearing two or three **Sturdy** collars at once —
  "Sturdy Barbed", "Sturdy Crescent" and "Sturdy Regal" are three different
  items, so nothing stopped it, but in game they're all *Sturdy* and you can
  only wear one. Same for Wayfaring, Supportive, Practical and Unified. The
  optimizer now treats them as one per type, and the collar picker hides a
  type that's already on another mount. If you have an older build saved (or
  someone shares one with you) that breaks the rule, the affected collars now
  show a ⚠ so you know why the totals look high. Thanks n00b for spotting it.

- **Optimizer results: trimmed the reasoning wall.** The "Why these picks" box
  used to explain every choice the optimizer made (build order, why a companion
  was picked, etc.) — mostly noise. It's now a "⚠ Heads up" box that only shows
  when there's something you should actually act on: a locked companion that
  makes an illegal loadout, boon points over the cap, a party-meta pick, or the
  Augment compare hint. Most runs it won't appear at all.

- **Optimizer: tanks and healers could still get an Augment summon.** The
  tank/healer support meta was supposed to prevent this, but three paths walked
  around it — the ⚔ Damage objective on a tank/heal paragon, unticking the
  support-meta box, and the owned-companion fallback when you don't own any
  party-aura summon. The new Augment gate is role-independent, so all three are
  covered.

### Data Additions

- **Titanweave Harness family untangled (Reports #217, #221).** Two player
  reports of "missing" Wizard/Warlock shirts turned out to be our old
  shirt/pants mislabel: the Cracked, Veinlit (IL 4,350) and Runemarked
  Titanweave Harnesses were all filed as pants. Archived in-game tooltips
  confirmed the family rule (CA/Crit Strike/Power/Recharge = shirt;
  Accuracy/CA/Crit Severity/AP Gain = pants), so all three are shirts now —
  and the two genuine pants variants (Cracked with the stacking Ruthless
  Critical bonus, Veinlit with Critical Charge's 25 Action Points) were added
  from the same screenshots. Cracked's Corrupt Power downside also corrected
  to −7.5% Incoming Healing.

- **The whole Tiamat set is now in (Reports #226, #227).** Two pieces players
  kept reporting as missing really were missing, and they belong to a
  different set from the similarly-named Tiamat's Golden gear. Tiamat Sash
  (Belt) and the Amulet of Tiamat's Demise (Neck) are both in at item level
  1,000, and together with Tiamat's Orb of Majesty the 3-piece bonus (+5%
  Outgoing and +5% Incoming Healing) now completes in the builder.

### Features (Toon Forge)

- **You can now report ability scores (Report #230).** Items with "+2 WIS"
  style lines had nowhere to be reported: the Add Missing Item form had no
  ability fields, and the correction panel would only let you change an
  ability an item already had — never add one. Both are fixed. The Add
  Missing Item form has an Ability Scores section, and the correction panel
  now offers all six abilities on any item, including ones we currently list
  with none. This affected 316 items that carry ability scores plus every
  accessory that should have one.

### Bug Fixes (Toon Forge)

- **Add Missing Item: percent stats were being saved as ratings.** The four
  stats a tooltip shows with a "%" — Recharge Speed, Action Point Gain,
  Movement Speed and Stamina Regeneration — were all filed as ratings, so a
  submitted "+1.5% Recharge Speed" was read as a rating of 1.5 and did
  nothing. They now save as percentages, and the dropdown marks them "(%)"
  so it's clear you type 1.5 rather than 1500.

- **Correction card: mount equip-power stats now scale with the shown tier
  (Reports #218–#220).** The "suggest a correction" card showed a mount equip
  power's Celestial item level and Combined Rating next to its raw Mythic stat
  value, which read as a data error and drew three reports. The stat line now
  scales with the selected tier like everything else on the card.

- **Optimizer: the Pack-meta note no longer doubles up.** When the final
  stability sweep moved the "Part of the Pack" companion to a different slot,
  the results screen kept both messages — "slotted in Offense" AND "slotted in
  Universal" for the same companion, with two different costs. The note now
  updates itself, so you see one message that matches where the companion
  actually ended up. (The build itself was always legal — only the message
  doubled.)
