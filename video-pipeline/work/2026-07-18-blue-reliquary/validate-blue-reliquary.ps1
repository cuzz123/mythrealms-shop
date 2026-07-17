$ErrorActionPreference = 'Stop'

$storyboard = Join-Path $PSScriptRoot 'blue-reliquary-60s-master-storyboard.md'
$productPath = 'D:\mythrealms-shop\public\images\products\1688-shop\pearl-series\pearl-series-04-detail1.webp'

if (-not (Test-Path -LiteralPath $storyboard)) { throw "Missing storyboard: $storyboard" }

$text = Get-Content -Raw -LiteralPath $storyboard
if ($text -notmatch 'clip_count: 15') { throw 'Expected 15 clips' }
if ($text -notmatch 'clip_duration_seconds: 4') { throw 'Expected 4-second clips' }
if ($text -notmatch [regex]::Escape($productPath)) { throw 'Missing product lock path' }

'constraints=ok'
