$source = "C:\Users\N00Bin\OneDrive\Pictures\Screenshots\New folder (2)"
$destCleric = "G:\ai_projects\nwcb\website\docs\calibration\inbox\cleric-powers-2026-05-16"
$destBard   = "G:\ai_projects\nwcb\website\docs\calibration\inbox\bard-gear-2026-05-16"

New-Item -ItemType Directory -Force -Path $destCleric | Out-Null
New-Item -ItemType Directory -Force -Path $destBard | Out-Null

# Cleric powers: 123209 through 123602
$clericCutoff = "Screenshot 2026-05-16 123602.png"
$bardStart    = "Screenshot 2026-05-16 123827.png"

$movedC = 0; $movedB = 0
Get-ChildItem -LiteralPath $source -File -Filter '*.png' | ForEach-Object {
    $name = $_.Name
    if ($name -le $clericCutoff) {
        $newName = $name -replace "Screenshot ", ""
        Move-Item -LiteralPath $_.FullName -Destination (Join-Path $destCleric ("2026-05-16_cleric-powers_" + $newName)) -Force
        $movedC++
    } elseif ($name -ge $bardStart) {
        $newName = $name -replace "Screenshot ", ""
        Move-Item -LiteralPath $_.FullName -Destination (Join-Path $destBard ("2026-05-16_bard-gear_" + $newName)) -Force
        $movedB++
    }
}
Write-Host ("Moved " + $movedC + " Cleric power screenshots to: " + $destCleric)
Write-Host ("Moved " + $movedB + " Bard gear screenshots to: " + $destBard)
$remaining = (Get-ChildItem -LiteralPath $source -File -Filter '*.png' -ErrorAction SilentlyContinue | Measure-Object).Count
Write-Host ("Remaining in source folder: " + $remaining)
