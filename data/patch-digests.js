// "What it means for you" rewrites of CONSOLE patch notes (gap J-8, 2026-11-02).
// Hand-written, edited directly (NOT built by build-data.py), newest first.
//
// Rules:
//  - Our own words only. Facts (what changed, the new numbers) are retold; Arc's sentences are
//    never copied. Players tap the title for Arc's full note.
//  - Keyed by the Arc note id (the "id" in data/patch-notes.json).
//  - siteCheck says whether the patch touches numbers on this site; check our stored values
//    against the change before writing it.
//  - `node scripts/patch-rewrites-due.js` lists console notes that still need one.
//
// Shape: { short, tags[], siteCheck: { label, text }, sections: [ { h, items[], table? } ] }
//        table = { head: [..], rows: [[..], ..] }
window.PATCH_DIGESTS = {
  "11583365": {
    short: "Cheaper Red Harvest trial gear and artifact upgrades, a Bard mount fix, and Lion's Presence now gives its Combined Rating.",
    tags: ["Bard", "Gear & stores", "Artifacts", "Fixes"],
    siteCheck: {
      label: "✓ Checked against this site",
      text: "Lion's Presence (Companions) already lists its Combined Rating, and our Flash Freeze enchantment shows the normal damage reduction, so both already match the fix. No numbers on this site change. Store prices aren't tracked here."
    },
    sections: [
      { h: "Classes", items: [
        "Bards stay on their mount when swapping between their DPS and Healer loadouts."
      ] },
      { h: "Red Harvest trial store (Shackles of Divinity)",
        table: { head: ["", "Coins", "Hex Coins", "AD"], rows: [
          ["Legendary gear", "240 Zulkir Skull", "25", "200k"],
          ["Mythic gear", "180 Zulkirate Halo", "50", "400k"],
          ["Celestial armor", "420 Zulkirate Halo", "150", "800k"]
        ] },
        items: [
          "You can now earn 500 Zulkirate Halo Coins a week.",
          "Broken Halo artifact: 350 Halo Coins; its neck and waist pieces: 250 Halo Coins.",
          "Rings drop about twice as often; shirts and pants a little less.",
          "New Celestial armor and Broken Halo drops stay account-bound until you equip them, so they can go to an alt.",
          "The trial's vanity pets moved from drops to the trial store."
        ] },
      { h: "Red Harvest II (Soul Harvest) and artifact weapons", items: [
        "Legendary and Mythic store gear costs the same as above, paid in Lich's Judgment / Lich's Hourglasses and Thayan Plaques.",
        "Mythic artifact weapon upgrade (both pieces): 1,300 research tokens (was 2,000) and 200 Lich's Judgment (was 400).",
        "Celestial upgrade: 1,200 research tokens (was 2,000) and 550 Dimensional Dust (was 800).",
        "Lich's Hourglass cap is now 500 a week; the last boss drops more Dimensional Dust, and the end chests add 4.",
        "The zone event starts after 50 named enemies instead of 100, and Dimensional Dust now moves between your characters 1 : 1."
      ] },
      { h: "Fixes that touch your build", items: [
        "Flash Freeze Guard was cutting enemy damage to almost nothing; it now gives its normal reduction.",
        "Celestial Lion's Presence was giving no Combined Rating; it now does.",
        "Owlbear Figurine no longer swaps places when you change loadouts."
      ] }
    ]
  }
};
