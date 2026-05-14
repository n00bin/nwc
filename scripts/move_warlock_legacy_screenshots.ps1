$source = "C:\Users\N00Bin\OneDrive\Pictures\Screenshots\New folder (2)"
$dest = "G:\ai_projects\nwcb\website\docs\calibration\inbox\warlock-gear-legacy-2026-05-13"

New-Item -ItemType Directory -Force -Path $dest | Out-Null

# Move all remaining screenshots with their original timestamp-based names + prefix
$files = Get-ChildItem $source -File -Filter "*.png"
$moved = 0
foreach ($file in $files) {
    $newName = $file.Name -replace "Screenshot ", ""
    $dst = Join-Path $dest ("2026-05-13_warlock-gear-legacy_" + $newName)
    Move-Item -Path $file.FullName -Destination $dst -Force
    $moved++
}

Write-Host ("Moved " + $moved + " files to: " + $dest)

$leftover = Get-ChildItem $source -File -Filter "*.png" -ErrorAction SilentlyContinue
if ($leftover) {
    Write-Host ("Unmapped files left in source (" + $leftover.Count + "):")
    $leftover | ForEach-Object { Write-Host ("  " + $_.Name) }
}
