param(
    [string]$HtmlPath,
    [string]$CssPath,
    [string]$OutputPath = "extracted-styles.css"
)

$html = Get-Content $HtmlPath -Raw
$css  = Get-Content $CssPath -Raw

# 1️⃣ Extract class names
$classMatches = [regex]::Matches($html, 'class\s*=\s*"([^"]+)"')
$classNames = @()

foreach ($match in $classMatches) {
    $classes = $match.Groups[1].Value -split '\s+'
    $classNames += $classes
}

$classNames = $classNames | Sort-Object -Unique

Write-Host "Found $($classNames.Count) classes."

# 2️⃣ Parse CSS safely with brace depth tracking

$results = @()
$depth = 0
$currentBlock = ""
$insideBlock = $false

for ($i = 0; $i -lt $css.Length; $i++) {

    $char = $css[$i]
    $currentBlock += $char

    if ($char -eq "{") {
        $depth++
        $insideBlock = $true
    }
    elseif ($char -eq "}") {
        $depth--

        if ($depth -eq 0 -and $insideBlock) {

            # Block completed safely
            foreach ($class in $classNames) {
                if ($currentBlock -match "\.$class([\s\.\:#>\[]|$)") {
                    $results += $currentBlock
                    break
                }
            }

            $currentBlock = ""
            $insideBlock = $false
        }
    }
}

# Remove duplicates
$results = $results | Sort-Object -Unique

# Write output
$results -join "`n`n" | Set-Content $OutputPath

Write-Host "Extraction complete."