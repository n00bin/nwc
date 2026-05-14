$source = "C:\Users\N00Bin\OneDrive\Pictures\Screenshots\New folder (2)"
$destBase = "G:\ai_projects\nwcb\website\docs\calibration\inbox\paladin-powers-2026-05-13"

New-Item -ItemType Directory -Force -Path $destBase | Out-Null

# Map: source filename -> descriptive name based on what tooltip was shown
$map = @{
    "Screenshot 2026-05-13 200849.png" = "oathkeeper_atwill_radiant-slam.png"
    "Screenshot 2026-05-13 200851.png" = "oathkeeper_atwill_valorous-strike.png"
    "Screenshot 2026-05-13 200853.png" = "oathkeeper_atwill_cure-wounds.png"
    "Screenshot 2026-05-13 200855.png" = "oathkeeper_atwill_divine-fulmination.png"
    "Screenshot 2026-05-13 200858.png" = "oathkeeper_encounter_burning-light.png"
    "Screenshot 2026-05-13 200900.png" = "oathkeeper_encounter_sacred-weapon.png"
    "Screenshot 2026-05-13 200902.png" = "oathkeeper_encounter_divine-touch.png"
    "Screenshot 2026-05-13 200904.png" = "oathkeeper_encounter_smite.png"
    "Screenshot 2026-05-13 200905.png" = "oathkeeper_encounter_bane.png"
    "Screenshot 2026-05-13 200907.png" = "oathkeeper_encounter_divine-shelter.png"
    "Screenshot 2026-05-13 200909.png" = "oathkeeper_encounter_banishment.png"
    "Screenshot 2026-05-13 200911.png" = "oathkeeper_encounter_cleansing-touch.png"
    "Screenshot 2026-05-13 200912.png" = "oathkeeper_encounter_circle-of-divinity.png"
    "Screenshot 2026-05-13 200914.png" = "oathkeeper_encounter_bond-of-virtue.png"
    "Screenshot 2026-05-13 200916.png" = "oathkeeper_daily_divine-judgement.png"
    "Screenshot 2026-05-13 200918.png" = "oathkeeper_daily_shield-of-faith.png"
    "Screenshot 2026-05-13 200920.png" = "oathkeeper_daily_radiant-charge.png"
    "Screenshot 2026-05-13 200921.png" = "oathkeeper_daily_lay-on-hands.png"
    "Screenshot 2026-05-13 200923.png" = "oathkeeper_daily_sanctuary.png"
    "Screenshot 2026-05-13 200926.png" = "oathkeeper_mechanic_forte.png"
    "Screenshot 2026-05-13 200927.png" = "oathkeeper_mechanic_aura-of-divinity.png"
    "Screenshot 2026-05-13 200929.png" = "oathkeeper_mechanic_hand-of-divinity.png"
    "Screenshot 2026-05-13 200931.png" = "oathkeeper_mechanic_oath-of-devotion.png"
    "Screenshot 2026-05-13 200933.png" = "oathkeeper_mechanic_channel-divinity.png"
    "Screenshot 2026-05-13 200935.png" = "oathkeeper_mechanic_block.png"
    "Screenshot 2026-05-13 200937.png" = "oathkeeper_classfeature_aura-of-protection.png"
    "Screenshot 2026-05-13 200938.png" = "oathkeeper_classfeature_blessed-wanderer.png"
    "Screenshot 2026-05-13 200940.png" = "oathkeeper_classfeature_composure.png"
    "Screenshot 2026-05-13 200942.png" = "oathkeeper_classfeature_aura-of-wrath.png"
    "Screenshot 2026-05-13 200944.png" = "oathkeeper_classfeature_aura-of-restoration.png"
    "Screenshot 2026-05-13 200946.png" = "oathkeeper_classfeature_guarded-prayers.png"
    "Screenshot 2026-05-13 200948.png" = "oathkeeper_classfeature_timely-intervention.png"
    "Screenshot 2026-05-13 200949.png" = "oathkeeper_classfeature_aura-of-life.png"
    "Screenshot 2026-05-13 200952.png" = "oathkeeper_feat_critical-touch.png"
    "Screenshot 2026-05-13 200957.png" = "oathkeeper_feat_sheltred-healing.png"
    "Screenshot 2026-05-13 201000.png" = "oathkeeper_feat_battle-focus.png"
    "Screenshot 2026-05-13 201002.png" = "oathkeeper_feat_prayer-of-opportunity.png"
    "Screenshot 2026-05-13 201003.png" = "oathkeeper_feat_spirit-of-austerity.png"
    "Screenshot 2026-05-13 201005.png" = "oathkeeper_feat_enduring-spirit.png"
    "Screenshot 2026-05-13 201007.png" = "oathkeeper_feat_convalescence.png"
    "Screenshot 2026-05-13 201009.png" = "oathkeeper_feat_divine-intervention.png"
    "Screenshot 2026-05-13 201011.png" = "oathkeeper_feat_emissary-of-warding.png"
    "Screenshot 2026-05-13 201012.png" = "oathkeeper_feat_divine-vessel.png"
    "Screenshot 2026-05-13 201015.png" = "oathkeeper_general_divine-protection.png"
    "Screenshot 2026-05-13 201017.png" = "oathkeeper_general_marathon-runner.png"
    "Screenshot 2026-05-13 201018.png" = "oathkeeper_general_divine-meditation.png"
    "Screenshot 2026-05-13 201020.png" = "oathkeeper_general_honed-defenses.png"
    "Screenshot 2026-05-13 201022.png" = "oathkeeper_general_religion.png"
    "Screenshot 2026-05-13 201024.png" = "oathkeeper_general_faerie-fire.png"
    "Screenshot 2026-05-13 201033.png" = "justicar_atwill_radiant-slam.png"
    "Screenshot 2026-05-13 201035.png" = "justicar_atwill_valorous-strike.png"
    "Screenshot 2026-05-13 201037.png" = "justicar_atwill_oath-strike.png"
    "Screenshot 2026-05-13 201039.png" = "justicar_atwill_shielding-strike.png"
    "Screenshot 2026-05-13 201041.png" = "justicar_encounter_burning-light.png"
    "Screenshot 2026-05-13 201043.png" = "justicar_encounter_sacred-weapon.png"
    "Screenshot 2026-05-13 201047.png" = "justicar_encounter_divine-touch.png"
    "Screenshot 2026-05-13 201049.png" = "justicar_encounter_smite.png"
    "Screenshot 2026-05-13 201051.png" = "justicar_encounter_bane.png"
    "Screenshot 2026-05-13 201052.png" = "justicar_encounter_templars-wrath.png"
    "Screenshot 2026-05-13 201054.png" = "justicar_encounter_vow-of-enmity.png"
    "Screenshot 2026-05-13 201056.png" = "justicar_encounter_absolution.png"
    "Screenshot 2026-05-13 201057.png" = "justicar_encounter_binding-oath.png"
    "Screenshot 2026-05-13 201059.png" = "justicar_encounter_relentless-avenger.png"
    "Screenshot 2026-05-13 201102.png" = "justicar_daily_divine-judgement.png"
    "Screenshot 2026-05-13 201103.png" = "justicar_daily_shield-of-faith.png"
    "Screenshot 2026-05-13 201105.png" = "justicar_daily_radiant-charge.png"
    "Screenshot 2026-05-13 201107.png" = "justicar_daily_divine-protector.png"
    "Screenshot 2026-05-13 201109.png" = "justicar_daily_heroism.png"
    "Screenshot 2026-05-13 201111.png" = "justicar_mechanic_forte.png"
    "Screenshot 2026-05-13 201113.png" = "justicar_mechanic_divine-palisade.png"
    "Screenshot 2026-05-13 201115.png" = "justicar_mechanic_justicars-charge.png"
    "Screenshot 2026-05-13 201116.png" = "justicar_mechanic_oath-of-protection.png"
    "Screenshot 2026-05-13 201118.png" = "justicar_mechanic_divine-champion.png"
    "Screenshot 2026-05-13 201120.png" = "justicar_mechanic_block.png"
    "Screenshot 2026-05-13 201122.png" = "justicar_classfeature_aura-of-protection.png"
    "Screenshot 2026-05-13 201124.png" = "justicar_classfeature_blessed-wanderer.png"
    "Screenshot 2026-05-13 201126.png" = "justicar_classfeature_composure.png"
    "Screenshot 2026-05-13 201127.png" = "justicar_classfeature_aura-of-wrath.png"
    "Screenshot 2026-05-13 201129.png" = "justicar_classfeature_aura-of-valor.png"
    "Screenshot 2026-05-13 201131.png" = "justicar_classfeature_divine-retribution.png"
    "Screenshot 2026-05-13 201133.png" = "justicar_classfeature_divine-challenger.png"
    "Screenshot 2026-05-13 201135.png" = "justicar_classfeature_aura-of-vengeance.png"
    "Screenshot 2026-05-13 201137.png" = "justicar_feat_sacred-shield.png"
    "Screenshot 2026-05-13 201139.png" = "justicar_feat_divine-reciprocation.png"
    "Screenshot 2026-05-13 201141.png" = "justicar_feat_baneful-strikes.png"
    "Screenshot 2026-05-13 201143.png" = "justicar_feat_burning-vengeance.png"
    "Screenshot 2026-05-13 201145.png" = "justicar_feat_justicars-bulwark.png"
    "Screenshot 2026-05-13 201147.png" = "justicar_feat_divine-pursuit.png"
    "Screenshot 2026-05-13 201149.png" = "justicar_feat_sheltering-light.png"
    "Screenshot 2026-05-13 201151.png" = "justicar_feat_shield-of-the-gods.png"
    "Screenshot 2026-05-13 201152.png" = "justicar_feat_intimidating-presence.png"
    "Screenshot 2026-05-13 201154.png" = "justicar_feat_unyielding-champion.png"
    "Screenshot 2026-05-13 201157.png" = "justicar_general_divine-protection.png"
    "Screenshot 2026-05-13 201159.png" = "justicar_general_marathon-runner.png"
    "Screenshot 2026-05-13 201200.png" = "justicar_general_divine-meditation.png"
    "Screenshot 2026-05-13 201202.png" = "justicar_general_honed-defenses.png"
    "Screenshot 2026-05-13 201204.png" = "justicar_general_religion.png"
    "Screenshot 2026-05-13 201206.png" = "justicar_general_faerie-fire.png"
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
    $dst = Join-Path $destBase ("2026-05-13_paladin-" + $map[$key])
    Move-Item -Path $src -Destination $dst -Force
    $moved++
}

Write-Host ""
Write-Host ("Moved " + $moved + " files, skipped " + $skipped)
Write-Host ("Destination: " + $destBase)

# Any unmapped leftovers in source?
$leftover = Get-ChildItem $source -File -Filter "*.png" -ErrorAction SilentlyContinue
if ($leftover) {
    Write-Host ""
    Write-Host ("Unmapped files left in source (" + $leftover.Count + "):")
    $leftover | ForEach-Object { Write-Host ("  " + $_.Name) }
}
