$wizFolder = "G:\ai_projects\nwcb\website\docs\calibration\inbox\wizard-powers-2026-05-16"
$figFolder = "G:\ai_projects\nwcb\website\docs\calibration\inbox\fighter-powers-2026-05-16"
$barbFolder = "G:\ai_projects\nwcb\website\docs\calibration\inbox\barbarian-powers-2026-05-16"

New-Item -ItemType Directory -Force -Path $figFolder | Out-Null
New-Item -ItemType Directory -Force -Path $barbFolder | Out-Null

# Fighter range: ~022740 to ~023159
# Barbarian range: 023300 to end
$figStart = "2026-05-16_wizard-powers_2026-05-16 022740.png"
$figEnd   = "2026-05-16_wizard-powers_2026-05-16 023159.png"
$barbStart = "2026-05-16_wizard-powers_2026-05-16 023300.png"

$movedF = 0; $movedB = 0
Get-ChildItem -LiteralPath $wizFolder -File -Filter '*.png' | ForEach-Object {
    $name = $_.Name
    if ($name -ge $figStart -and $name -le $figEnd) {
        $newName = $name -replace "wizard-powers", "fighter-powers"
        Move-Item -LiteralPath $_.FullName -Destination (Join-Path $figFolder $newName) -Force
        $movedF++
    } elseif ($name -ge $barbStart) {
        $newName = $name -replace "wizard-powers", "barbarian-powers"
        Move-Item -LiteralPath $_.FullName -Destination (Join-Path $barbFolder $newName) -Force
        $movedB++
    }
}
Write-Host ("Moved " + $movedF + " Fighter screenshots to: " + $figFolder)
Write-Host ("Moved " + $movedB + " Barbarian screenshots to: " + $barbFolder)
$wizCount = (Get-ChildItem -LiteralPath $wizFolder -File -Filter '*.png' | Measure-Object).Count
Write-Host ("Remaining Wizard screenshots: " + $wizCount)
