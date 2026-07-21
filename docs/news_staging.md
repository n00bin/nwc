# News Staging — Unpublished Changes

Add entries here as changes are made. When ready to publish, say "publish news" and these will be formatted and added to the News tab.

---

## Week of July 12, 2026

(Last published July 13, 2026: "Wizard Spell-Mastery Slot, the Full Cleric Weapon Set & a Clothing-Slot Overhaul")

### Features
- Russian language toggle now covers the whole Mounts page. The EN | RU switch
  (top-right of the navbar) previously only translated the home page; it now
  also does the Mounts page — the view tabs, search boxes, filters, tooltips,
  table headers, insignia quality/slot names, the empty-state messages, and the
  full Stable Planner (buttons, labels, and the how-to steps). Item names still
  stay in English so they keep matching the game. Thanks to community translator
  Dark Lord for the Russian.
- Item names now stay in English when you auto-translate the site. If you read
  the site through your browser's translator (Russian, German, Spanish —
  anything), it used to rewrite item names too: "Rimefire Salamander" came out
  as "Саламандра Инейного Огня", which matches nothing on your console, since
  Neverwinter only ships in English and French. Names are now marked
  "do not translate", so the guides and explanations still come through in your
  language while every mount, companion, gear, artifact, enchant, boon and
  insignia name stays exactly as it reads in-game. Covers the lookup pages, all
  8,200+ item database pages, and every Toon Forge picker.
- "Fill standard set" (Buffs → Assume support party) now **replaces** your ally
  support comps with the current community-meta set every time you click it —
  no need to clear slots first. Same set the optimizer's "Standard set" button
  uses, so both stay in sync.

### Bug Fixes
- Consumable detail pages now show vs-enemy damage bonuses. The Scroll of Dragon
  Slaying's "+10% vs Dragon" (and the Wondrous Dragon belts' dragon damage) were
  missing from their individual item pages — only the damage-reduction half showed.
  The full effect now appears.
- Wizard: Conduit of Ice magnitude corrected (550 → 350, in-game verified), and
  the Wizard class-feature picker now works — it was empty, so you couldn't slot
  class features on either paragon; both Arcanist and Thaumaturge now list their
  8 selectable features.
- Spelling corrections: "Pact of Vengeance" equip power on The Claw of Covetous
  Flame (was "Vengence") and the "Celestial Rubellite Tourmaline" enchant
  (was "Rubelite").

### Data Additions
- Wondrous Dragon belts split into their real color family. What we listed as one
  generic "Wonderous Dragon" is actually several different belt items — one per
  dragon color, each with its own bonus and a cosmetic dragon it summons. Corrected
  the name spelling and added five verified from in-game tooltips: White (+Damage &
  Damage Resistance vs Dragons), Red (+Action Point Gain), Green (+Damage Resistance
  vs Dragons), Blue (+Gold Gain & a chance at Rough Astral Diamonds), and the premium
  Gold (all three: +6% dragon damage/resistance, +3% Action Points, +6% Gold Gain), and
  Black (offensive — Damage vs Dragons). All six colors are now in the database.
- Crafted stat potions added (the +5,600 endgame ones). We were missing the top-rank
  Crafted Potion of [Stat] line players actually run — now in for Power, Accuracy,
  Critical Strike, Defense and Deflect (Rank 14, +1). One stat potion active at a time,
  1 hour, persists through death. Deflect verified in-game; the rest from the community
  sheet. (The old "Potion of Power Rank 13" was folded into this at its correct value.)
- Bard fully rebuilt from in-game tooltips — the character builder previously had
  only a handful of shared Bard powers and no paragon rosters. Now BOTH paths are
  complete: Songblade (DPS) — Con Elemento, Staccato, Ad Libitum, Contre, Volti
  Subito, the songs + Ballads, feats & features; and Minstrel (Healer) — Arpeggio,
  Serenade, Bassline, Curtain Call, Defender's Minuet, Warding Carol, Aurora
  Fantasia, Sheltering Etude, the Reprised Carols, and its 10-feat tree — all with
  verified magnitudes, cast times and cooldowns. Songs are now their own category.
- Companion gear database expanded from 36 → 221 entries — added the full
  mid- and lower-tier ladder (Starbound, Twinkling, Imperial, Blessed, and
  many more "of the Companion" pieces) so the database is complete, not just
  the endgame tiers. Values sourced from the community reference and flagged
  for in-game confirmation if they surface in a report.

### Features
- Toon Forge now shows the preferred-slot boost on insignias. In the game, an
  insignia slotted into its mount's matching "preferred" slot gets +20% to its
  item level and stats — so your in-game tooltip could read IL 900 / 1,350
  while the site's popup showed IL 750 / 1,125 for the same Celestial insignia,
  which looked like wrong data (it wasn't — the build math already applied the
  boost). The insignia detail popup now shows the boosted values with a ★
  "preferred +20%" tag when it applies, preferred slots get a ★ marker right
  in the stable (gold when your slotted insignia earns the boost), and the
  insignia picker flags which choices would activate it. What you see now
  matches your in-game tooltip. (Reports #222–224)
- Insignia picker overhaul: filter and pick everything in one place. The
  picker now has three controls — a type filter (Barbed, Crescent, Regal,
  Illuminated, Enlightened), a stat filter (Fortitude, Dominance, Brutality,
  and the rest of the "of X" families), and a "Rarity you own" dropdown, so
  you can narrow straight to e.g. Barbed + Fortitude + Celestial. The list
  previews every insignia at your chosen rarity (preferred-slot matches
  preview with their +20% boost included), and that rarity travels with your
  pick. The old rarity dropdown under each stable slot is now just a label
  showing what you picked — gold with "★ preferred" when the insignia is
  earning the preferred-slot boost — and clicking it re-opens the picker.
- Mobile navigation: on phones and narrow screens the top menu now collapses
  into a tap-to-open ☰ hamburger, instead of a crowded wall of links. Desktop
  is unchanged. Menu closes automatically when you pick a page.
- Home page glow-up: the section cards now show real in-game thumbnails
  (mount, companion, artifact & consumable icons) plus clear symbols on the
  rest, in a wider 3-across grid — the front page finally looks like a proper
  compendium instead of a text list.
