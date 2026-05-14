$source = "C:\Users\N00Bin\OneDrive\Pictures\Screenshots\New folder (2)"
$legacy = "G:\ai_projects\nwcb\website\docs\calibration\inbox\warlock-gear-legacy-2026-05-13"
$bard = "G:\ai_projects\nwcb\website\docs\calibration\inbox\bard-powers-2026-05-13"

New-Item -ItemType Directory -Force -Path $legacy | Out-Null
New-Item -ItemType Directory -Force -Path $bard | Out-Null

$files = Get-ChildItem $source -File -Filter "*.png"
$movedLegacy = 0
$movedBard = 0

foreach ($file in $files) {
    # Extract HHMMSS from filename
    if ($file.Name -match "Screenshot 2026-05-13 (\d{6})\.png") {
        $time = [int]$matches[1]
        $newName = $file.Name -replace "Screenshot ", ""
        # 221713 to 222317 = Warlock legacy continuation; 222420 to 222831 = Bard
        if ($time -ge 222420) {
            $dst = Join-Path $bard ("2026-05-13_bard-powers_" + $newName)
            Move-Item -Path $file.FullName -Destination $dst -Force
            $movedBard++
        } else {
            $dst = Join-Path $legacy ("2026-05-13_warlock-gear-legacy2_" + $newName)
            Move-Item -Path $file.FullName -Destination $dst -Force
            $movedLegacy++
        }
    }
}

Write-Host ("Moved to bard-powers inbox: " + $movedBard)
Write-Host ("Moved to warlock-gear-legacy inbox: " + $movedLegacy)
