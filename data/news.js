// Site news entries — newest first
var NEWS_DATA = [
  {
    date: "May 4, 2026",
    title: "Loadout Planner, Insignias Reference + Combat Formulas",
    tags: ["Feature", "Fix", "Data"],
    body: "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-feature'>Feature</span></div>" +
      "<ul>" +
      "<li>New <strong>Loadout Planner</strong> tab on the Mounts page: define your loadouts (name + role + desired insignia bonuses) and the planner finds every mount whose 4 (or 3) slots can host each bonus. Mounts where a preferred slot can be filled with its preferred type are listed first. The Sharing Plan summary tells you exactly which mounts to pick across loadouts to stop upgrading duplicate insignias — with a concrete \"save N upgrades\" estimate per bonus. Per-mount exclude (× to skip mounts you don't own — picks the next best). Saved per browser via localStorage.</li>" +
      "<li>New <strong>Insignias</strong> tab on the Mounts page: browseable reference of all 16 stat templates × 6 quality tiers (Uncommon → Celestial), with stats auto-scaled per tier and slot-type badges showing which insignia categories carry each template. Filter by name, quality, or slot type. Cross-checked against external sources — every value verified.</li>" +
      "<li>Mount detail panel now shows compatible bonuses with their required insignias <strong>in slot order</strong> (matching the mount's actual slot layout) instead of canonical order. Makes it visible at a glance which slot each insignia would land in.</li>" +
      "<li>Gold ★ markers on bonuses that activate a preferred slot (+20% IL & stats), and on slot boxes themselves with a preferred type. Tooltips on hover.</li>" +
      "</ul>" +
      "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-fix'>Fix</span></div>" +
      "<ul>" +
      "<li>Fixed mount name typo: \"Legendary Barigura\" → \"Legendary Barlgura\" (matches the regular Barlgura spelling and D&D source).</li>" +
      "<li>Mekaniks: corrected 3 wrong rows in the Forte distribution table — Cleric Arbiter primary (Divinity Regen → Power), Fighter Vanguard secondaries (CritStrike/DeflectSev → Accuracy/CritAvoid), Paladin Oathkeeper secondaries (Accuracy/Awareness → CritStrike/DeflectSev).</li>" +
      "<li>Mekaniks: removed incorrect \"At 0 rating: ~45% base\" line from the Rating-to-Percentage card (formula returns 0%/clamped at 0 rating, not 45%).</li>" +
      "</ul>" +
      "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-data'>Data</span></div>" +
      "<ul>" +
      "<li>Mekaniks: added <strong>Control Bonus</strong> and <strong>Control Resist</strong> as full stat cards under a new \"Control Stats\" section.</li>" +
      "<li>Mekaniks: rating cap vs. total cap distinction now explained — rating contribution alone caps at 50% (for 90% stats) or 60% (for 120% stats); the rest comes from non-rating sources.</li>" +
      "<li>Mekaniks: documented Forte's special property of <strong>bypassing individual rating caps</strong> (contributes directly to total percentage).</li>" +
      "<li>Mekaniks: added \"1 IL ≈ 15 stat rating points\" rule of thumb and a worked rating-to-percent example.</li>" +
      "<li>Mekaniks: new <strong>Base Damage & Base HP by Role</strong> card on the Damage tab, showing the inverted role multipliers (DPS ×1.2 dmg / ×1.0 HP, Healer ×1.1 / ×1.1, Tank ×1.0 / ×1.2).</li>" +
      "<li>Mekaniks: renamed the <strong>Damage</strong> tab to <strong>Combat Formulas</strong> and added three theorycraft cards (collapsed by default): <strong>Full Expected-Value Damage Formula</strong> (13-term formula with variable glossary; insights on CA uptime, multiplicative damage-boost categories, additive within-category bonuses), <strong>Full Expected-Value Healing Formula</strong> (6-term formula with healer crit-severity penalty ÷2; insights on heals not reduced by defensive stats, IH stacking on tanks, Power/OH balance), and <strong>Full Expected-Value EHP Formula</strong> (defender's mirror with three EHP cases Min/Avg/Max; insights on multiplicative defensive stat compounding, Awareness vs Defense above 45%, Crit Avoidance preventing tank one-shots, stat investment beating flat HP at scale).</li>" +
      "</ul>"
  },
  {
    date: "May 2, 2026",
    title: "Mod 33 Preview, Dungeon Guides + New Tools",
    tags: ["Feature", "Fix", "Data"],
    body: "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-feature'>Feature</span></div>" +
      "<ul>" +
      "<li>Added <strong>Mod 33 Preview page</strong>: rotating section for upcoming module content (gear, companions, mounts) with lightbox for full-size screenshots</li>" +
      "<li>Added Content Roadmap banner to home page linking to the Mod 33 preview</li>" +
      "<li>Added Mod 33 Warlock preview gear, grouped by slot with filterable buttons</li>" +
      "<li>Added <strong>Dungeons tab to the Mekaniks page</strong>: embedded video guide system for trials and dungeons</li>" +
      "<li>Added <strong>Creators & Tools page</strong>: friends and community members making Neverwinter content, tools, and resources</li>" +
      "<li>Added <strong>Celestial Insignia Tracker</strong> tool under Creators & Tools: track every non-Celestial-Account-Bound insignia across your roster and see which to upgrade first for maximum payoff (saved to browser with export/import backup)</li>" +
      "<li>Added per-rarity proc-chance scaling to companion powers — Chance line on the detail panel now updates with the selected rarity</li>" +
      "<li>Added insignia bonus stacking badges to the mount page (Report #21)</li>" +
      "</ul>" +
      "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-fix'>Fix</span></div>" +
      "<ul>" +
      "<li>Fixed Blue Fire Eye: power was incorrectly showing Movement Speed, corrected to damage versus Kabal's minions with full rarity scaling (Report #22)</li>" +
      "<li>Fixed Abyssal Guidance: chance to summon Abyssal Chicken now scales with rarity (1.50%/3.00%/5.00%/7.50%/11.00%/15.00%/18.00%) instead of a flat 2.5%</li>" +
      "</ul>" +
      "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-data'>Data</span></div>" +
      "<ul>" +
      "<li>Added 13 dungeon/trial video walkthroughs: Vault of Stars Maze (Mod 20), Crown of Keldegonn (Master) (Mod 22), Rise of Tiamat (Mod 23), Temple of the Spider (Master) (Mod 24), Defense of the Moondancer (Mod 27), Demogorgon (Master), Soul Harvest, Shackles of Divinity, Dread Sanctum, Lair of the Mad Dragon, Imperial Citadel, Demonweb Pits, Gzemnid's Reliquary</li>" +
      "<li>Added Mod 33 preview content: upcoming companions, mounts, and Warlock gear screenshots</li>" +
      "</ul>"
  },
  {
    date: "March 28, 2026",
    title: "Bug Reports Resolved + New Data",
    tags: ["Feature", "Fix", "Data"],
    body: "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-feature'>Feature</span></div>" +
      "<ul>" +
      "<li>Companion proc effects now scale with rarity (heal %, magnitude, etc. update when switching rarity)</li>" +
      "<li>Rarity selector now shows on all companion powers, not just stat-scaling ones</li>" +
      "<li>Admin notes on reports: admins can post status updates visible to everyone</li>" +
      "<li>Community replies on reports: when admin requests help, users can reply with text and screenshots</li>" +
      "<li>Added collaboration contact email to site footer</li>" +
      "<li>Renamed YouTube links to The N00bin Network / Join on YouTube</li>" +
      "</ul>" +
      "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-fix'>Fix</span></div>" +
      "<ul>" +
      "<li>Fixed Hank's Aim: magnitude scales 30x single stat, was incorrectly listed as fixed 225 (Report #3)</li>" +
      "<li>Fixed Elminster's Chain Lightning: scales 10x/2x single stat, old values 66/16.5 were wrong (Report #7)</li>" +
      "<li>Fixed Doom and Bloom: heal % scales ~3.33x single stat, was showing 10% at all rarities (Report #10)</li>" +
      "<li>Confirmed Ox Stot, Chickenmancer, Eric the Cavalier as intentionally fixed effects (Reports #6, #8, #9)</li>" +
      "<li>Fixed Ox Stot base rarity from Mythic to Uncommon (was showing wrong rarity buttons)</li>" +
      "</ul>" +
      "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-data'>Data</span></div>" +
      "<ul>" +
      "<li>Added mount: Cactus the Hedgehog (Vigilance + Stabby Stabs) (Report #19)</li>" +
      "<li>Added 6 companions: Soradiel, Kingfisher Intern, Elite Intern, Archmage's Apprentice, Crimson Crystal Golem, Proud Pink Yeti (Report #18)</li>" +
      "<li>Added new enhancement: Deflecting Shards (Accuracy + companion Crit Avoidance)</li>" +
      "</ul>"
  },
  {
    date: "March 27, 2026",
    title: "Major Site Update",
    tags: ["Feature", "Fix", "Data"],
    body: "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-feature'>Feature</span></div>" +
      "<ul>" +
      "<li>Added companion rarity scaling system (Common through Celestial) with rarity selector buttons</li>" +
      "<li>Added 4-Slot Only filter for mounts</li>" +
      "<li>Reports page: Active/Resolved split, In Progress priority sorting, resolved reports can't be upvoted</li>" +
      "<li>Added admin delete button for reports</li>" +
      "<li>Mounts list now sorted alphabetically</li>" +
      "<li>Added artifact icons to All Artifacts list view</li>" +
      "<li>Added News tab on the landing page</li>" +
      "<li>Added YouTube and N00bin Network links across the site</li>" +
      "</ul>" +
      "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-fix'>Fix</span></div>" +
      "<ul>" +
      "<li>Fixed insignia bonus matching: 3-slot bonuses now correctly check only the first 3 mount slots (Report #13)</li>" +
      "<li>Fixed multiple mount insignia slot and preferred data errors (Maltese Tiger, Demonic Gravehound, Red Mountain Fox, Space Guppy School, Brain Stealer Dragon, Phantom Panther, Golden Rage Drake, Pink Yeti, Golden Goose)</li>" +
      "<li>Removed Vision of Lolth from artifacts (it's a mount combat power)</li>" +
      "<li>Removed duplicate Fire Eye companion (was Blue Fire Eye)</li>" +
      "<li>Fixed Phasespider power assignment and added Little White companion</li>" +
      "<li>Fixed Celeste power: was Divine Answers, now Celeste's Wisdom</li>" +
      "<li>Fixed multiple companion name errors (Wailer, Portalerhound, Undying Overbound, etc.)</li>" +
      "</ul>" +
      "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-data'>Data</span></div>" +
      "<ul>" +
      "<li>Filled in power data for all 256 companions</li>" +
      "<li>Added 177 companion sources</li>" +
      "<li>Added all 28 companion enhancement icons</li>" +
      "<li>Added 241 companion icons</li>" +
      "<li>Added 92+ artifact icons and 50+ consumable icons</li>" +
      "<li>Added 4 new Mod 26 artifacts: Demon Skull, Nightflame Censer, Marilith Mask, Xeleth's Blast Scepter</li>" +
      "<li>Added new companions: Demonic Servant, Little White</li>" +
      "<li>Added new mount: Balgora (Hell's Impact + Seeing Red)</li>" +
      "<li>Added 9 new foods including Menzoberranzan vendor foods</li>" +
      "<li>Expanded Campaign Boosters page with 10+ new entries including Gravity Orb gadget</li>" +
      "</ul>"
  }
];
