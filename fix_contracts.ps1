 = 'packages/sdk/ts_js/src/barrits/sdk/contracts.ts'
 = Get-Content -Path  -Raw
 =  -split "?
"
 = @()
 = 0
while ( -lt .Length) {
     = []
     += 
    if ( -match '^\s*export\s+(type|interface)\s+(\w+)') {
        # We have just added the export line to .
        # Check the line before the export line (in , excluding the line we just added)
         = .Count - 2
        # Skip empty lines backwards
        while ( -ge 0 -and [].Trim() -eq '') {
            --
        }
         = False
        if ( -ge 0) {
             = []
             = .Trim()
            if (.StartsWith('/**')) {
                 = True
            }
        }
        if (-not ) {
            # Remove the export line we just added
            .RemoveAt(.Count - 1)
            if ( -match 'export\s+(type|interface)\s+(\w+)') {
                 = [2]
                 += '/**'
                 += " * [EN] Type definition for ."
                 += " * [ES] Definición de tipo para ."
                 += ' */'
                 += 
            }
        }
    }
    ++
}
 =  -join "
"
Set-Content -Path  -Value 
