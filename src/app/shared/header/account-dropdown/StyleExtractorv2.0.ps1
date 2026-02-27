param(
    [string]$HtmlPath,
    [string]$CssPath,
    [string]$OutputCssPath
)

# Read files
$html = Get-Content $HtmlPath -Raw
$css  = Get-Content $CssPath -Raw

Write-Host "Extracting classes and tags from HTML..."

# Extract class names
$classMatches = [regex]::Matches($html, 'class\s*=\s*"([^"]+)"')
$classes = @()

foreach ($match in $classMatches) {
    $classList = $match.Groups[1].Value -split '\s+'
    $classes += $classList
}

$classes = $classes | Sort-Object -Unique

# Extract HTML tag names
$tagMatches = [regex]::Matches($html, '<\s*([a-zA-Z0-9\-]+)')
$tags = $tagMatches | ForEach-Object { $_.Groups[1].Value.ToLower() }
$tags = $tags | Sort-Object -Unique

Write-Host "Found $($classes.Count) classes"
Write-Host "Found $($tags.Count) tags"

# Split CSS into rule blocks (very simple parser)
$rulePattern = '(?s)([^{}]+)\{([^{}]+)\}'
$ruleMatches = [regex]::Matches($css, $rulePattern)

$matchedRules = @()

foreach ($rule in $ruleMatches) {

    $selector = $rule.Groups[1].Value.Trim()
    $body     = $rule.Groups[2].Value

    $isMatch = $false

    # Check class matches
    foreach ($class in $classes) {
        if ($selector -match "\.$class\b") {
            $isMatch = $true
            break
        }
    }

    # Check tag matches (if no class matched)
    if (-not $isMatch) {
        foreach ($tag in $tags) {
            if ($selector -match "\b$tag\b") {
                $isMatch = $true
                break
            }
        }
    }

    if ($isMatch) {
        $matchedRules += "$selector {`n$body`n}`n"
    }
}

# Write output
$matchedRules | Set-Content $OutputCssPath

Write-Host "Done. Extracted CSS written to $OutputCssPath"