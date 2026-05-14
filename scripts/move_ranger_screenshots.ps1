$source = "C:\Users\N00Bin\OneDrive\Pictures\Screenshots\New folder (2)"
$destBase = "G:\ai_projects\nwcb\website\docs\calibration\inbox\ranger-powers-2026-05-13"

New-Item -ItemType Directory -Force -Path $destBase | Out-Null

# Map: source filename -> descriptive name (no class prefix; that's added below)
$map = @{
    # --- Warden batch (201621 - 201718) ---
    "Screenshot 2026-05-13 201621.png" = "warden_daily_cold-steel-hurricane.png"
    "Screenshot 2026-05-13 201622.png" = "warden_daily_call-of-the-storm.png"
    "Screenshot 2026-05-13 201625.png" = "warden_mechanic_fighting-style-mastery.png"
    "Screenshot 2026-05-13 201626.png" = "warden_mechanic_forte.png"
    "Screenshot 2026-05-13 201628.png" = "warden_mechanic_ranged-stance.png"
    "Screenshot 2026-05-13 201630.png" = "warden_mechanic_melee-stance.png"
    "Screenshot 2026-05-13 201632.png" = "warden_mechanic_grasping-roots.png"
    "Screenshot 2026-05-13 201634.png" = "warden_mechanic_shift.png"
    "Screenshot 2026-05-13 201636.png" = "warden_classfeature_seekers-vengeance.png"
    "Screenshot 2026-05-13 201638.png" = "warden_classfeature_crushing-roots.png"
    "Screenshot 2026-05-13 201640.png" = "warden_classfeature_aspect-of-the-pack.png"
    "Screenshot 2026-05-13 201642.png" = "warden_classfeature_aspect-of-the-serpent.png"
    "Screenshot 2026-05-13 201644.png" = "warden_classfeature_blade-storm.png"
    "Screenshot 2026-05-13 201646.png" = "warden_classfeature_twin-blade-storm.png"
    "Screenshot 2026-05-13 201647.png" = "warden_classfeature_aspect-of-the-lone-wolf.png"
    "Screenshot 2026-05-13 201650.png" = "warden_feat_deft-strikes.png"
    "Screenshot 2026-05-13 201651.png" = "warden_feat_focused.png"
    "Screenshot 2026-05-13 201653.png" = "warden_feat_swiftness-of-the-fox.png"
    "Screenshot 2026-05-13 201655.png" = "warden_feat_storms-recovery.png"
    "Screenshot 2026-05-13 201657.png" = "warden_feat_blade-hurricane.png"
    "Screenshot 2026-05-13 201659.png" = "warden_feat_storm-conduit.png"
    "Screenshot 2026-05-13 201701.png" = "warden_feat_to-the-wind.png"
    "Screenshot 2026-05-13 201703.png" = "warden_feat_skirmishers-gambit.png"
    "Screenshot 2026-05-13 201705.png" = "warden_feat_enhanced-conductivity.png"
    "Screenshot 2026-05-13 201707.png" = "warden_feat_natures-envoy.png"
    "Screenshot 2026-05-13 201709.png" = "warden_skill_weapon-mastery.png"
    "Screenshot 2026-05-13 201711.png" = "warden_skill_stance-mastery.png"
    "Screenshot 2026-05-13 201713.png" = "warden_skill_lucky-skirmisher.png"
    "Screenshot 2026-05-13 201714.png" = "warden_general_wild-step.png"
    "Screenshot 2026-05-13 201716.png" = "warden_general_nature.png"
    "Screenshot 2026-05-13 201718.png" = "warden_general_elven-accuracy.png"

    # --- Hunter batch (201740 - 201916) ---
    "Screenshot 2026-05-13 201740.png" = "hunter_atwill_rapid-shot-and-strike.png"
    "Screenshot 2026-05-13 201742.png" = "hunter_atwill_split-shot-and-strike.png"
    "Screenshot 2026-05-13 201743.png" = "hunter_atwill_aimed-shot-and-strike.png"
    "Screenshot 2026-05-13 201745.png" = "hunter_atwill_hunters-teamwork-and-careful-attack.png"
    "Screenshot 2026-05-13 201748.png" = "hunter_encounter_hindering-shot-and-strike.png"
    "Screenshot 2026-05-13 201750.png" = "hunter_encounter_marauders-escape-and-rush.png"
    "Screenshot 2026-05-13 201751.png" = "hunter_encounter_constricting-arrow-and-steel-breeze.png"
    "Screenshot 2026-05-13 201753.png" = "hunter_encounter_rain-of-arrows-and-swords.png"
    "Screenshot 2026-05-13 201755.png" = "hunter_encounter_cordon-of-arrows-and-plant-growth.png"
    "Screenshot 2026-05-13 201757.png" = "hunter_encounter_ambush-and-bear-trap.png"
    "Screenshot 2026-05-13 201758.png" = "hunter_encounter_longstriders-shot-and-gushing-wound.png"
    "Screenshot 2026-05-13 201800.png" = "hunter_encounter_hawk-shot-and-hawkeye.png"
    "Screenshot 2026-05-13 201802.png" = "hunter_encounter_commanding-shot-and-stag-heart.png"
    "Screenshot 2026-05-13 201804.png" = "hunter_encounter_rapid-volley-and-windwalk-strike.png"
    "Screenshot 2026-05-13 201807.png" = "hunter_daily_forest-ghost.png"
    "Screenshot 2026-05-13 201809.png" = "hunter_daily_seismic-shot.png"
    "Screenshot 2026-05-13 201810.png" = "hunter_daily_snipe.png"
    "Screenshot 2026-05-13 201812.png" = "hunter_daily_slashers-mark.png"
    "Screenshot 2026-05-13 201817.png" = "hunter_daily_disruptive-shot.png"
    "Screenshot 2026-05-13 201822.png" = "hunter_mechanic_shift.png"
    "Screenshot 2026-05-13 201824.png" = "hunter_mechanic_grasping-roots.png"
    "Screenshot 2026-05-13 201826.png" = "hunter_mechanic_ranged-melee-stance.png"
    "Screenshot 2026-05-13 201828.png" = "hunter_mechanic_forte.png"
    "Screenshot 2026-05-13 201831.png" = "hunter_classfeature_seekers-vengeance.png"
    "Screenshot 2026-05-13 201833.png" = "hunter_classfeature_crushing-roots.png"
    "Screenshot 2026-05-13 201835.png" = "hunter_classfeature_aspect-of-the-pack.png"
    "Screenshot 2026-05-13 201837.png" = "hunter_classfeature_aspect-of-the-serpent.png"
    "Screenshot 2026-05-13 201839.png" = "hunter_classfeature_aspect-of-the-falcon.png"
    "Screenshot 2026-05-13 201841.png" = "hunter_classfeature_pathfinders-action.png"
    "Screenshot 2026-05-13 201842.png" = "hunter_classfeature_cruel-recovery.png"
    "Screenshot 2026-05-13 201844.png" = "hunter_classfeature_primal-instincts.png"
    "Screenshot 2026-05-13 201847.png" = "hunter_feat_longshot.png"
    "Screenshot 2026-05-13 201848.png" = "hunter_feat_critical-action.png"
    "Screenshot 2026-05-13 201850.png" = "hunter_feat_biting-snares.png"
    "Screenshot 2026-05-13 201852.png" = "hunter_feat_forestbond.png"
    "Screenshot 2026-05-13 201854.png" = "hunter_feat_more-than-disruptive.png"
    "Screenshot 2026-05-13 201857.png" = "hunter_feat_slashers-expertise.png"
    "Screenshot 2026-05-13 201858.png" = "hunter_feat_commander-in-chief.png"
    "Screenshot 2026-05-13 201901.png" = "hunter_feat_predator.png"
    "Screenshot 2026-05-13 201903.png" = "hunter_feat_thorned-roots.png"
    "Screenshot 2026-05-13 201904.png" = "hunter_feat_rate-of-change.png"
    "Screenshot 2026-05-13 201906.png" = "hunter_general_elven-accuracy.png"
    "Screenshot 2026-05-13 201908.png" = "hunter_general_nature.png"
    "Screenshot 2026-05-13 201910.png" = "hunter_general_wild-step.png"
    "Screenshot 2026-05-13 201912.png" = "hunter_skill_lucky-skirmisher.png"
    "Screenshot 2026-05-13 201914.png" = "hunter_skill_stance-mastery.png"
    "Screenshot 2026-05-13 201916.png" = "hunter_skill_weapon-mastery.png"
}

$moved = 0
$skipped = 0
foreach ($key in $map.Keys) {
    $src = Join-Path $source $key
    if (-not (Test-Path $src)) {
        Write-Host "MISSING: $key"
        $skipped++
        continue
    }
    $dst = Join-Path $destBase ("2026-05-13_ranger-" + $map[$key])
    Move-Item -Path $src -Destination $dst -Force
    $moved++
}

Write-Host ""
Write-Host ("Moved " + $moved + " files, skipped " + $skipped)
Write-Host ("Destination: " + $destBase)

# Any leftover in source?
$leftover = Get-ChildItem $source -File -Filter "*.png" -ErrorAction SilentlyContinue
if ($leftover) {
    Write-Host ""
    Write-Host ("Unmapped files left in source (" + $leftover.Count + "):")
    $leftover | ForEach-Object { Write-Host ("  " + $_.Name) }
}
