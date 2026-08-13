param(
    [Parameter(Mandatory = $true)]
    [string]$Reference,
    [string]$Assets = "assets",
    [string]$JobName = "",
    [double]$SceneThreshold = 0.35,
    [double]$MinSceneSeconds = 0.8,
    [double]$MatchThreshold = 0.6,
    [string]$Voice = "",
    [string]$Script = "",
    [switch]$Draft
)

$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent

$resolvedReference = Resolve-Path -LiteralPath $Reference -ErrorAction SilentlyContinue
if (-not $resolvedReference) {
    Write-Host "ERROR: Reference video not found: $Reference" -ForegroundColor Red
    Write-Host "Replace the README placeholder with your real video path, for example:" -ForegroundColor Yellow
    Write-Host ".\scripts\04-run-workflow.ps1 -Reference `"D:\videos\reference.mp4`" -Assets `"assets`" -Draft" -ForegroundColor Yellow
    exit 1
}
$Reference = $resolvedReference.Path

$assetsPath = if ([IO.Path]::IsPathRooted($Assets)) { $Assets } else { Join-Path $Root $Assets }
if (-not (Test-Path -LiteralPath $assetsPath)) {
    Write-Host "ERROR: Assets directory not found: $Assets" -ForegroundColor Red
    Write-Host "Put reusable videos/images under: $Root\assets" -ForegroundColor Yellow
    exit 1
}

if ($JobName -eq "") {
    $stem = [IO.Path]::GetFileNameWithoutExtension($Reference) -replace '[^A-Za-z0-9._-]+', '-'
    if ($stem -eq "") { $stem = "edit" }
    $JobName = "$(Get-Date -Format 'yyyy-MM-dd-HHmm')-$stem"
}

$JobDir = Join-Path $Root "work\$JobName"
$Recipe = Join-Path $JobDir "recipe.json"
$Matches = Join-Path $JobDir "matches.json"
$Output = Join-Path $JobDir "remix.mp4"

Write-Host "Job: $JobName" -ForegroundColor Cyan
& "$PSScriptRoot\01-analyze-reference.ps1" `
    -Reference $Reference `
    -JobDir $JobDir `
    -Threshold $SceneThreshold `
    -MinSceneSeconds $MinSceneSeconds
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

& "$PSScriptRoot\02-match-materials.ps1" `
    -Recipe $Recipe `
    -Assets $Assets `
    -Output $JobDir `
    -Threshold $MatchThreshold
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$renderArgs = @{
    Recipe = $Recipe
    Matches = $Matches
    Output = $Output
}
if ($Voice -ne "") { $renderArgs.Voice = $Voice }
if ($Script -ne "") { $renderArgs.Script = $Script }
if ($Draft) { $renderArgs.Draft = $true }

& "$PSScriptRoot\03-render-remix.ps1" @renderArgs
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Done: $Output" -ForegroundColor Green
