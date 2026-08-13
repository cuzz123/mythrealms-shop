param(
    [Parameter(Mandatory = $true)][string]$Reference,
    [string]$JobName = "",
    [string]$JobDir = "",
    [double]$BeatInterval = 0.8,
    [string]$Registry = "",
    [string]$ObsidianVault = ""
)

$Root = Split-Path $PSScriptRoot -Parent
$argsList = @(
    "$Root\src\breakdown_reference.py",
    "--reference", $Reference,
    "--beat-interval", "$BeatInterval"
)

if ($JobName -ne "") { $argsList += @("--job-name", $JobName) }
if ($JobDir -ne "") { $argsList += @("--job-dir", $JobDir) }
if ($Registry -ne "") { $argsList += @("--registry", $Registry) }
if ($ObsidianVault -ne "") { $argsList += @("--obsidian-vault", $ObsidianVault) }

python @argsList
exit $LASTEXITCODE
