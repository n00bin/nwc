$source = "C:\Users\N00Bin\OneDrive\Pictures\Screenshots\New folder (2)"
$wardenDest = "G:\ai_projects\nwcb\website\docs\calibration\inbox\ranger-powers-2026-05-13"
$warlockDest = "G:\ai_projects\nwcb\website\docs\calibration\inbox\warlock-powers-2026-05-13"

New-Item -ItemType Directory -Force -Path $wardenDest | Out-Null
New-Item -ItemType Directory -Force -Path $warlockDest | Out-Null

# Warden extras (at-wills + encounters, paragon-perspective magnitudes)
$wardenMap = @{
    "Screenshot 2026-05-13 201548.png" = "warden_atwill_rapid-shot-and-strike.png"
    "Screenshot 2026-05-13 201549.png" = "warden_atwill_split-shot-and-strike.png"
    "Screenshot 2026-05-13 201551.png" = "warden_atwill_electric-shot-and-clear-the-ground.png"
    "Screenshot 2026-05-13 201553.png" = "warden_atwill_penetrating-arrows-and-storm-strike.png"
    "Screenshot 2026-05-13 201556.png" = "warden_encounter_hindering-shot-and-strike.png"
    "Screenshot 2026-05-13 201558.png" = "warden_encounter_marauders-escape-and-rush.png"
    "Screenshot 2026-05-13 201559.png" = "warden_encounter_constricting-arrow-and-steel-breeze.png"
    "Screenshot 2026-05-13 201601.png" = "warden_encounter_rain-of-arrows-and-swords.png"
    "Screenshot 2026-05-13 201603.png" = "warden_encounter_cordon-of-arrows-and-plant-growth.png"
    "Screenshot 2026-05-13 201605.png" = "warden_encounter_split-the-sky-and-throw-caution.png"
    "Screenshot 2026-05-13 201607.png" = "warden_encounter_boar-hide-and-charge.png"
    "Screenshot 2026-05-13 201609.png" = "warden_encounter_foxs-cunning-and-fox-shift.png"
    "Screenshot 2026-05-13 201611.png" = "warden_encounter_binding-arrow-and-oak-skin.png"
    "Screenshot 2026-05-13 201613.png" = "warden_encounter_thorn-ward-and-strike.png"
    "Screenshot 2026-05-13 201615.png" = "warden_daily_forest-ghost.png"
    "Screenshot 2026-05-13 201617.png" = "warden_daily_seismic-shot.png"
    "Screenshot 2026-05-13 201619.png" = "warden_daily_snipe.png"
}

# Warlock (Soulweaver first, then Hellbringer)
$warlockMap = @{
    # Soulweaver
    "Screenshot 2026-05-13 211027.png" = "soulweaver_atwill_dark-helix.png"
    "Screenshot 2026-05-13 211029.png" = "soulweaver_atwill_eldritch-blast.png"
    "Screenshot 2026-05-13 211030.png" = "soulweaver_atwill_soul-reconstruction.png"
    "Screenshot 2026-05-13 211032.png" = "soulweaver_atwill_infernal-sanction.png"
    "Screenshot 2026-05-13 211035.png" = "soulweaver_encounter_arms-of-hadar.png"
    "Screenshot 2026-05-13 211037.png" = "soulweaver_encounter_vampiric-embrace.png"
    "Screenshot 2026-05-13 211039.png" = "soulweaver_encounter_blades-of-vanquished-armies.png"
    "Screenshot 2026-05-13 211040.png" = "soulweaver_encounter_hadars-grasp.png"
    "Screenshot 2026-05-13 211042.png" = "soulweaver_encounter_dreadtheft.png"
    "Screenshot 2026-05-13 211044.png" = "soulweaver_encounter_revitalize.png"
    "Screenshot 2026-05-13 211046.png" = "soulweaver_encounter_pillar-of-power.png"
    "Screenshot 2026-05-13 211048.png" = "soulweaver_encounter_wraiths-shadow.png"
    "Screenshot 2026-05-13 211050.png" = "soulweaver_encounter_soulstorm.png"
    "Screenshot 2026-05-13 211051.png" = "soulweaver_encounter_warlocks-bargain.png"
    "Screenshot 2026-05-13 211054.png" = "soulweaver_daily_soul-siphon.png"
    "Screenshot 2026-05-13 211056.png" = "soulweaver_daily_brood-of-hadar.png"
    "Screenshot 2026-05-13 211057.png" = "soulweaver_daily_flames-of-phlegethos.png"
    "Screenshot 2026-05-13 211059.png" = "soulweaver_daily_soul-barrier.png"
    "Screenshot 2026-05-13 211101.png" = "soulweaver_daily_soul-pact.png"
    "Screenshot 2026-05-13 211104.png" = "soulweaver_mechanic_shadow-slip.png"
    "Screenshot 2026-05-13 211106.png" = "soulweaver_mechanic_lifelink.png"
    "Screenshot 2026-05-13 211107.png" = "soulweaver_mechanic_soul-manipulation.png"
    "Screenshot 2026-05-13 211109.png" = "soulweaver_mechanic_forte.png"
    "Screenshot 2026-05-13 211111.png" = "soulweaver_mechanic_lifespark.png"
    "Screenshot 2026-05-13 211113.png" = "soulweaver_mechanic_inspirit.png"
    "Screenshot 2026-05-13 211115.png" = "soulweaver_mechanic_lifemark.png"
    "Screenshot 2026-05-13 211116.png" = "soulweaver_mechanic_lifepact.png"
    "Screenshot 2026-05-13 211119.png" = "soulweaver_classfeature_borrowed-spirit.png"
    "Screenshot 2026-05-13 211121.png" = "soulweaver_classfeature_flowing-link.png"
    "Screenshot 2026-05-13 211122.png" = "soulweaver_classfeature_souleater.png"
    "Screenshot 2026-05-13 211124.png" = "soulweaver_classfeature_soulbond.png"
    "Screenshot 2026-05-13 211126.png" = "soulweaver_classfeature_shadow-walk.png"
    "Screenshot 2026-05-13 211127.png" = "soulweaver_classfeature_dust-to-dust.png"
    "Screenshot 2026-05-13 211129.png" = "soulweaver_classfeature_dark-ones-blessing.png"
    "Screenshot 2026-05-13 211131.png" = "soulweaver_classfeature_flames-of-empowerment.png"
    "Screenshot 2026-05-13 211133.png" = "soulweaver_feat_essence-of-time.png"
    "Screenshot 2026-05-13 211135.png" = "soulweaver_feat_focused-spark.png"
    "Screenshot 2026-05-13 211136.png" = "soulweaver_feat_oversoul.png"
    "Screenshot 2026-05-13 211138.png" = "soulweaver_feat_bright-spark.png"
    "Screenshot 2026-05-13 211140.png" = "soulweaver_feat_feypact.png"
    "Screenshot 2026-05-13 211142.png" = "soulweaver_feat_hellpact.png"
    "Screenshot 2026-05-13 211144.png" = "soulweaver_feat_from-the-brink.png"
    "Screenshot 2026-05-13 211146.png" = "soulweaver_feat_soultheft.png"
    "Screenshot 2026-05-13 211148.png" = "soulweaver_feat_soul-reclamation.png"
    "Screenshot 2026-05-13 211149.png" = "soulweaver_feat_essence-of-power.png"
    "Screenshot 2026-05-13 211151.png" = "soulweaver_general_elven-accuracy.png"
    "Screenshot 2026-05-13 211153.png" = "soulweaver_general_arcana.png"
    "Screenshot 2026-05-13 211155.png" = "soulweaver_general_wild-step.png"
    "Screenshot 2026-05-13 211157.png" = "soulweaver_general_demonic-vision.png"
    "Screenshot 2026-05-13 211158.png" = "soulweaver_general_devastating-critical.png"
    "Screenshot 2026-05-13 211200.png" = "soulweaver_general_vengeful-blades.png"
    # Hellbringer
    "Screenshot 2026-05-13 211212.png" = "hellbringer_atwill_dark-helix.png"
    "Screenshot 2026-05-13 211214.png" = "hellbringer_atwill_eldritch-blast.png"
    "Screenshot 2026-05-13 211216.png" = "hellbringer_atwill_hellish-rebuke.png"
    "Screenshot 2026-05-13 211218.png" = "hellbringer_atwill_hand-of-blight.png"
    "Screenshot 2026-05-13 211220.png" = "hellbringer_encounter_arms-of-hadar.png"
    "Screenshot 2026-05-13 211222.png" = "hellbringer_encounter_vampiric-embrace.png"
    "Screenshot 2026-05-13 211224.png" = "hellbringer_encounter_blades-of-vanquished-armies.png"
    "Screenshot 2026-05-13 211226.png" = "hellbringer_encounter_hadars-grasp.png"
    "Screenshot 2026-05-13 211227.png" = "hellbringer_encounter_dreadtheft.png"
    "Screenshot 2026-05-13 211229.png" = "hellbringer_encounter_fiery-bolt.png"
    "Screenshot 2026-05-13 211231.png" = "hellbringer_encounter_curse-bite.png"
    "Screenshot 2026-05-13 211233.png" = "hellbringer_encounter_infernal-spheres.png"
    "Screenshot 2026-05-13 211234.png" = "hellbringer_encounter_killing-flames.png"
    "Screenshot 2026-05-13 211236.png" = "hellbringer_encounter_hellfire-ring.png"
    "Screenshot 2026-05-13 211238.png" = "hellbringer_daily_soul-siphon.png"
    "Screenshot 2026-05-13 211240.png" = "hellbringer_daily_brood-of-hadar.png"
    "Screenshot 2026-05-13 211242.png" = "hellbringer_daily_flames-of-phlegethos.png"
    "Screenshot 2026-05-13 211244.png" = "hellbringer_daily_gates-of-hell.png"
    "Screenshot 2026-05-13 211246.png" = "hellbringer_daily_tyrannical-curse.png"
    "Screenshot 2026-05-13 211248.png" = "hellbringer_mechanic_soul-puppet.png"
    "Screenshot 2026-05-13 211250.png" = "hellbringer_mechanic_forte.png"
    "Screenshot 2026-05-13 211252.png" = "hellbringer_mechanic_curse.png"
    "Screenshot 2026-05-13 211254.png" = "hellbringer_mechanic_soul-spark.png"
    "Screenshot 2026-05-13 211255.png" = "hellbringer_mechanic_soul-scorch.png"
    "Screenshot 2026-05-13 211257.png" = "hellbringer_mechanic_shadow-slip.png"
    "Screenshot 2026-05-13 211259.png" = "hellbringer_classfeature_flames-of-empowerment.png"
    "Screenshot 2026-05-13 211301.png" = "hellbringer_classfeature_dark-ones-blessing.png"
    "Screenshot 2026-05-13 211303.png" = "hellbringer_classfeature_dust-to-dust.png"
    "Screenshot 2026-05-13 211304.png" = "hellbringer_classfeature_shadow-walk.png"
    "Screenshot 2026-05-13 211306.png" = "hellbringer_classfeature_deadly-curse.png"
    "Screenshot 2026-05-13 211308.png" = "hellbringer_classfeature_no-pity-no-mercy.png"
    "Screenshot 2026-05-13 211310.png" = "hellbringer_classfeature_dark-prayers.png"
    "Screenshot 2026-05-13 211312.png" = "hellbringer_classfeature_all-consuming-curse.png"
    "Screenshot 2026-05-13 211314.png" = "hellbringer_feat_double-scorch.png"
    "Screenshot 2026-05-13 211316.png" = "hellbringer_feat_power-of-the-nine-hells.png"
    "Screenshot 2026-05-13 211318.png" = "hellbringer_feat_warlocks-curse.png"
    "Screenshot 2026-05-13 211321.png" = "hellbringer_feat_soul-desecration.png"
    "Screenshot 2026-05-13 211323.png" = "hellbringer_feat_executioners-gift.png"
    "Screenshot 2026-05-13 211324.png" = "hellbringer_feat_wrathful-souls.png"
    "Screenshot 2026-05-13 211326.png" = "hellbringer_feat_soul-spark-recovery.png"
    "Screenshot 2026-05-13 211328.png" = "hellbringer_feat_creeping-death.png"
    "Screenshot 2026-05-13 211330.png" = "hellbringer_feat_risky-investment.png"
    "Screenshot 2026-05-13 211332.png" = "hellbringer_feat_parting-blasphemy.png"
    "Screenshot 2026-05-13 211336.png" = "hellbringer_general_elven-accuracy.png"
    "Screenshot 2026-05-13 211338.png" = "hellbringer_general_arcana.png"
    "Screenshot 2026-05-13 211340.png" = "hellbringer_general_wild-step.png"
    "Screenshot 2026-05-13 211342.png" = "hellbringer_general_demonic-vision.png"
    "Screenshot 2026-05-13 211345.png" = "hellbringer_general_devastating-critical.png"
    "Screenshot 2026-05-13 211347.png" = "hellbringer_general_vengeful-curse.png"
}

$moved = 0
$skipped = 0

foreach ($key in $wardenMap.Keys) {
    $src = Join-Path $source $key
    if (-not (Test-Path $src)) { Write-Host "MISSING (warden): $key"; $skipped++; continue }
    $dst = Join-Path $wardenDest ("2026-05-13_ranger-" + $wardenMap[$key])
    Move-Item -Path $src -Destination $dst -Force
    $moved++
}

foreach ($key in $warlockMap.Keys) {
    $src = Join-Path $source $key
    if (-not (Test-Path $src)) { Write-Host "MISSING (warlock): $key"; $skipped++; continue }
    $dst = Join-Path $warlockDest ("2026-05-13_warlock-" + $warlockMap[$key])
    Move-Item -Path $src -Destination $dst -Force
    $moved++
}

Write-Host ""
Write-Host ("Moved " + $moved + " files, skipped " + $skipped)

$leftover = Get-ChildItem $source -File -Filter "*.png" -ErrorAction SilentlyContinue
if ($leftover) {
    Write-Host ""
    Write-Host ("Unmapped files left in source (" + $leftover.Count + "):")
    $leftover | ForEach-Object { Write-Host ("  " + $_.Name) }
}
