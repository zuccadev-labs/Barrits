$file = 'packages/sdk/ts_js/src/barrits/sdk/contracts.ts'
$content = Get-Content -Path $file
$lines = $content -split "`r?`n"
$missing = @()
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match '^\s*export\s+(type|interface)\s+(\w+)') {
        $j = $i - 1
        while ($j -ge 0 -and $lines[$j].Trim() -eq '') { $j-- }
        if ($j -lt 0) {
            $missing += $i
        } else {
            $prev = $lines[$j].Trim()
            if (-not $prev.StartsWith('/**')) {
                $missing += $i
            }
        }
    }
}
$newLines = @()
$i = 0
while ($i -lt $lines.Length) {
    if ($missing -contains $i) {
        if ($lines[$i] -match 'export\s+(type|interface)\s+(\w+)') {
            $typeName = $matches[2]
            $newLines += '/**'
            $newLines += " * [EN] Type definition for $typeName."
            $newLines += " * [ES] Definición de tipo para $typeName."
            $newLines += ' */'
        }
    }
    $newLines += $lines[$i]
    $i++
}
$newContent = $newLines -join "`r`n"
Set-Content -Path $file -Value $newContent