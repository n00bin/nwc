# Russian UI translation — pilot

**Goal:** translate the site's own words (menus, buttons, card labels, captions)
into proper human Russian, because the browser's auto-translator picks wrong
meanings — e.g. it renders the "Mounts" menu as **Крепления** (mounts as in
brackets/hardware) instead of **Скакуны** (rideable creatures), and "Campaign
Boosters" as "election-campaign supporters."

This does **not** translate item names (mounts, gear, artifacts). Those are kept
in English on purpose (`translate="no"`) so they match the game. Names are a
separate, later question.

## Live Google Sheet (the one Dark Lord fills in)
https://docs.google.com/spreadsheets/d/1TddKaUO1pjfEvyr4YxDyiP5ecF_VxL0Px47mj-RbCeA/edit
Created 2026-07-16: n00b imported ui_strings_pilot.xlsx through Google Sheets'
own File→Import, so it keeps the formatting (frozen header, tinted Russian
column). Link-sharing is on. When it comes back filled, read column B via the
Drive tools (read_file_content on this id) and feed it into the import step.
(An earlier plain CSV-import attempt, id 1VUkza…AEaQ, is superseded — can be
deleted from Drive.)

## Files here
- `ui_strings_pilot.xlsx` — offline copy of the same 43 strings (git-tracked).
- `ui_strings_pilot.csv` — same content, plain text (git-tracked source of truth,
  and what the live Google Sheet was generated from).

## For the translator (what to do)
1. Open `ui_strings_pilot.xlsx` in Google Sheets (or Excel).
2. For each row, type the Russian into **column B ("Russian (fill this in)")**.
   Leave **column A (English)** exactly as-is.
3. Column C tells you where each phrase appears on the site, for context.
4. Rows marked **"brand"** in column D are names (e.g. "Neverwinter Compendium",
   "YouTube"). Translate them only if there's an official Russian form you'd
   rather use — otherwise leave column B blank and they stay in English.
5. Blank rows are fine. Anything you don't fill in just shows in English; nothing
   breaks. You can send it back half-done and finish later.

## For n00b (round-trip)
- Regenerate the blank sheet any time:
  `G:/Python/python.exe scripts/i18n_export_pilot.py`
  (that interpreter has openpyxl; the others don't).
- The strings are hand-curated inside `scripts/i18n_export_pilot.py` — add pages
  there as the pilot grows (this batch = home page + nav + footer).
- When the filled sheet comes back, the next step is an import script that turns
  column B into a `data/i18n-ru.js` map, plus a small language toggle. **Not
  built yet** — deliberately waiting for real translations first, so we design
  the toggle around actual content.

## How the translation will work (planned)
The site will look up each English string in the Russian map and swap it when
Russian is selected; a missing entry falls back to the English text already on
the page. Keying by the English string means no fragile key names to maintain
and a half-filled sheet degrades gracefully.
