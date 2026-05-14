$dir = "C:\Users\N00Bin\OneDrive\Pictures\Screenshots\New folder (2)"
$files = @(Get-ChildItem $dir -File | Sort-Object Name)
Write-Host ("Files: " + $files.Count)
Write-Host ""
Write-Host "First 5:"
$files | Select-Object -First 5 | ForEach-Object { Write-Host ("  " + $_.Name) }
Write-Host "..."
Write-Host "Last 3:"
$files | Select-Object -Last 3 | ForEach-Object { Write-Host ("  " + $_.Name) }
