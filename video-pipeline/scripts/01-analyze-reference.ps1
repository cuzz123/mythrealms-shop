param(
    [Parameter(Mandatory = $true)]
    [string]$Reference,
    [string]$JobName = "",
    [string]$JobDir = "",
    [double]$Threshold = 0.35,
    [double]$MinSceneSeconds = 0.8
)

$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent

$argsList = @(
    "$Root\src\analyze_reference.py",
    "--reference", $Reference,
    "--threshold", "$Threshold",
    "--min-scene-seconds", "$MinSceneSeconds"
)
if ($JobName -ne "") { $argsList += @("--job-name", $JobName) }
if ($JobDir -ne "") { $argsList += @("--job-dir", $JobDir) }

python @argsList
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
