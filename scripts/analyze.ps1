$ancestryPath = "data\ancestry Boss Family Tree.ged"
$fsPath = "data\ged from familysearch.ged"

function Analyze-Gedcom($path, $label) {
    Write-Host "================== $label =================="
    if (-not (Test-Path $path)) {
        Write-Host "File not found: $path"
        return
    }
    
    $lines = Get-Content $path -Encoding UTF8
    Write-Host "Total lines: $($lines.Count)"
    
    $indiCount = 0
    $famCount = 0
    $tags = @{}
    $occupations = @()
    $notes = 0
    $fsids = 0
    $places = @{}
    $births = 0
    $deaths = 0
    $events = @{}
    
    foreach ($line in $lines) {
        if ($line -match '^0 @\w+@ INDI') { $indiCount++ }
        elseif ($line -match '^0 @\w+@ FAM') { $famCount++ }
        elseif ($line -match '^1 ([A-Z_]+)(?:\s+(.*))?') {
            $tag = $matches[1]
            $val = $matches[2]
            $tags[$tag] = [int]$tags[$tag] + 1
            if ($tag -eq 'OCCU' -and $val) { $occupations += $val }
            if ($tag -eq '_FSID' -or $tag -eq '_FSFTID') { $fsids++ }
            if ($tag -eq 'NOTE') { $notes++ }
            if ($tag -eq 'BIRT') { $births++ }
            if ($tag -eq 'DEAT') { $deaths++ }
            if ($tag -eq 'EVEN') { $events[$val] = [int]$events[$val] + 1 }
        }
        elseif ($line -match '^2 PLAC\s+(.*)') {
            $plac = $matches[1].Trim()
            $places[$plac] = [int]$places[$plac] + 1
        }
    }
    
    Write-Host "Individuals (INDI): $indiCount"
    Write-Host "Families (FAM): $famCount"
    Write-Host "FamilySearch IDs found: $fsids"
    Write-Host "Notes count: $notes"
    Write-Host "Occupations recorded: $($occupations.Count)"
    if ($occupations.Count -gt 0) {
        Write-Host "Sample occupations: $(($occupations | Select-Object -First 10) -join ', ')"
    }
    Write-Host "Top Tags:"
    $tags.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 15 | ForEach-Object {
        Write-Host "  $($_.Key): $($_.Value)"
    }
    Write-Host "Unique Places: $($places.Count)"
    Write-Host "Sample Places:"
    $places.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 8 | ForEach-Object {
        Write-Host "  $($_.Key) ($($_.Value))"
    }
}

Analyze-Gedcom $ancestryPath "Ancestry Export"
Analyze-Gedcom $fsPath "FamilySearch / RootsMagic Export"
