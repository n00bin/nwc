#!/usr/bin/env node
/*
 * check-preview-link.js — every page with the site menu must load js/preview-config.js
 * BEFORE js/shared.js, or its menu silently drops the "Mod NN Preview" link
 * (renderNav only adds it when PREVIEW_ACTIVE is defined). Gap J-4, 2026-11-02.
 *
 * Usage: node scripts/check-preview-link.js   (exit 1 = a page is missing it)
 * Runs in .github/workflows/deploy.yml as its own job: a failure shows a red X on the
 * commit but never blocks the deploy.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const bad = [];
let checked = 0;
for (const name of fs.readdirSync(root).sort()) {
  if (!name.endsWith(".html") || name.startsWith("_")) continue;
  const html = fs.readFileSync(path.join(root, name), "utf8");
  const shared = html.search(/<script src="js\/shared\.js[^"]*"/);
  if (shared === -1 || !/class="navbar"/.test(html)) continue; // no shared menu on this page
  checked++;
  const cfg = html.search(/<script src="js\/preview-config\.js[^"]*"/);
  if (cfg === -1) bad.push(name + ": does not load js/preview-config.js");
  else if (cfg > shared) bad.push(name + ": loads js/preview-config.js AFTER js/shared.js");
}
if (bad.length) {
  console.error("Preview menu link check FAILED (" + bad.length + " of " + checked + " menu pages):");
  for (const b of bad) console.error("  - " + b);
  console.error('Fix: add <script src="js/preview-config.js"></script> on the line before js/shared.js.');
  process.exit(1);
}
console.log("Preview menu link check passed: " + checked + " menu pages load js/preview-config.js before js/shared.js.");
