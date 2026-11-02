#!/usr/bin/env node
/*
 * patch-rewrites-due.js — lists CONSOLE patch notes that have no "What it means for you"
 * rewrite yet (gap J-8, 2026-11-02). Run at the start of a session; if it lists anything,
 * tell n00b and offer to write them (data/patch-digests.js, our own words only).
 *
 * Usage: node scripts/patch-rewrites-due.js        (exit 0 always; prints "none due" when clear)
 * Only notes from REWRITES_START on count: older patches keep Arc's topic tags only (J-8 lock:
 * rewrites cover new patches from now on, not the 454 old ones).
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const WEB = path.resolve(__dirname, "..");
const REWRITES_START = new Date(2026, 9, 1); // Oct 1, 2026: the 10/08 patch was the first rewrite

const notes = JSON.parse(fs.readFileSync(path.join(WEB, "data", "patch-notes.json"), "utf8"));
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(WEB, "data", "patch-digests.js"), "utf8"), ctx);
const digests = ctx.window.PATCH_DIGESTS || {};

const due = [];
for (const n of notes) {
  if (!(n.tags || []).includes("nw-playstation")) continue;
  const m = n.title.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!m) continue;
  const date = new Date(+m[3], +m[1] - 1, +m[2]);
  if (date < REWRITES_START) continue;
  if (!digests[n.id]) due.push(n.title + "  (id " + n.id + ", https://www.playneverwinter.com/en/news-details/" + n.id + ")");
}
if (!due.length) console.log("Patch rewrites: none due.");
else {
  console.log("Patch rewrites due (" + due.length + "): console patch notes with no 'What it means for you' yet:");
  for (const d of due) console.log("  - " + d);
}
