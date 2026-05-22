# News Staging — Unpublished Changes

Add entries here as changes are made. When ready to publish, say "publish news" and these will be formatted and added to the News tab.

---

## Week of 2026-05-22

### Bug Fixes
- **Mounts — Insignia slots fixed for 5 mounts:** Ornate Apparatus of Gond, Red-Hued Apparatus of Gond, Carmine Bulette, Sienna Tribal Lion, and Blueforged Rage Drake were showing no valid insignia types in the slot calculator. Their universal slots are now correctly recognized and the insignia calculator works for them.
- **Gear — Corrupted text fixed in 3 item descriptions:** Two Pact Blade items (Durgarrn Thord Pactblade and Earthen Pact Blade) had a garbled arrow symbol (`→`) in their description text where a real arrow should appear. Fixed.
- **Companions — "Rothé" name display fixed:** The companion named Rothé had a double-encoded special character in its name, causing it to appear garbled in some browsers. The name now displays correctly.
- **Reports — Admin status change now refreshes the list immediately:** Previously, after an admin changed a report's status, the page had to be manually reloaded to see the update. The list now refreshes automatically.
- **Reports — Shadow variable bug fixed in sort logic:** An internal variable naming conflict in the reports sort code could silently break the Supabase connection under certain conditions. Fixed.
- **Reports — Reply section now shows a clear waiting message:** When a report hasn't been reviewed by an admin yet, the replies area now shows "Replies open once an admin has reviewed this report." instead of being blank, so players know it's not a glitch.
- **Insignia Tracker — Nav no longer highlights the wrong page:** The Insignia Tracker page was incorrectly highlighting "Creators & Tools" in the navigation bar. The nav bar now shows no active highlight when on that page.
- **Stat names — All stat names now display in plain English:** Throughout the site, internal stat names like "CriticalStrike" and "MaximumHitPoints" now display as "Critical Strike" and "Maximum Hit Points" wherever stats are shown (companion powers, mount powers, gear bonuses, etc.).
