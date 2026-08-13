param(
    [Parameter(Mandatory = $true)]
    [string]$Recipe,
    [string]$Assets = "assets",
    [string]$Output = "",
    [double]$Threshold = 0.6
)

$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent

$argsList = @(
    "$Root\src\match_materials.py",
    "--recipe", $Recipe,
    "--assets", $Assets,
    "--threshold", "$Threshold"
)
if ($Output -ne "") { $argsList += @("--output", $Output) }

python @argsList
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
