$dir = "C:\Users\N00Bin\OneDrive\Pictures\Screenshots\New folder (2)"
Get-ChildItem $dir -File | Sort-Object Name | ForEach-Object { Write-Host $_.Name }
