/* ============================================================
   Built-in currency list for the Currency Tracker (dungeon-currency.html)
   HAND-EDITED (not built by build-data.py).

   Picking one of these names in the tracker fills in its source, source
   type, weekly cap and storage limit, so players don't have to type them.
   Entries here win over anything a player typed for the same name.

   Add a currency only from its in-game tooltip (the "Weekly Cap" and
   "Maximum" lines, and where it says it is earned). Fields:
     name        exact in-game name
     dungeon     where it is earned (the tracker calls this the source)
     sourceType  Dungeon | Trial | Campaign | Event | Other
     weeklyCap   0 = no weekly cap
     totalCap    the tooltip's "Maximum" (0 = unlimited)
     module      the module it arrived in
     verified    date + where the tooltip was read

   After editing, bump ?v= on the <script src="data/currency-catalog.js?v=...">
   tag in dungeon-currency.html, or returning players keep the old list.
   ============================================================ */
window.CURRENCY_CATALOG = [
  // Mod 34 (Biting Cold: Sleeping Gods Lie). Read from tooltips on the PC
  // preview server on 2026-10-22; re-check when the module reaches PS5.
  { name: "Devourer's Mark (Advanced)", dungeon: "The Devourer's Pit", sourceType: "Trial",
    weeklyCap: 500, totalCap: 10000, module: "Mod 34", verified: "2026-10-22 PC preview tooltip" },
  { name: "Unquiet Whispers", dungeon: "Reghed Crevasse", sourceType: "Campaign",
    weeklyCap: 0, totalCap: 20000, module: "Mod 34", verified: "2026-10-22 PC preview tooltip" },
  { name: "Maddening Whispers", dungeon: "Reghed Crevasse", sourceType: "Campaign",
    weeklyCap: 100, totalCap: 10000, module: "Mod 34", verified: "2026-10-22 PC preview tooltip" },
  { name: "Faint Whispers", dungeon: "Reghed Crevasse", sourceType: "Campaign",
    weeklyCap: 0, totalCap: 10000, module: "Mod 34", verified: "2026-10-22 PC preview tooltip" }
];
