$ErrorActionPreference = 'Stop'

$storyboard = Join-Path $PSScriptRoot 'blue-reliquary-60s-master-storyboard.md'
$productPath = 'D:\mythrealms-shop\public\images\products\1688-shop\pearl-series\pearl-series-04-detail1.webp'

if (-not (Test-Path -LiteralPath $storyboard)) { throw "Missing storyboard: $storyboard" }

$text = Get-Content -Raw -LiteralPath $storyboard
if ($text -notmatch 'clip_count: 15') { throw 'Expected 15 clips' }
if ($text -notmatch 'clip_duration_seconds: 4') { throw 'Expected 4-second clips' }
if ($text -notmatch [regex]::Escape($productPath)) { throw 'Missing product lock path' }

$shots = [regex]::Matches($text, '(?m)^## S(?:0[1-9]|1[0-5])A$')
if ($shots.Count -ne 15) { throw "Expected 15 shot contracts, got $($shots.Count)" }
foreach ($id in 1..15) {
  $label = 'S{0:D2}A' -f $id
  $match = [regex]::Match($text, "(?s)^## $label`r?`n(.*?)(?=^## S(?:0[1-9]|1[0-5])A$|^## 剪辑合同|\\z)", [System.Text.RegularExpressions.RegexOptions]::Multiline)
  if (-not $match.Success) { throw "Missing contract body for $label" }
  $section = $match.Groups[1].Value
  if ($section -notmatch 'All-mode prompt' -or $section -notmatch 'product proof') { throw "Incomplete ${label}: needs prompt and product proof" }
  if ($section -notmatch [regex]::Escape($productPath)) { throw "Missing product reference in $label" }
}

'constraints=ok; shots=15'
