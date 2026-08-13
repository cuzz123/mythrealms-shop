param(
    [Parameter(Mandatory = $true)]
    [string]$Recipe,
    [Parameter(Mandatory = $true)]
    [string]$Matches,
    [string]$Output = "",
    [string]$Voice = "",
    [string]$Script = "",
    [switch]$Draft,
    [string]$DraftName = ""
)

$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent

$argsList = @(
    "$Root\src\render_remix.py",
    "--recipe", $Recipe,
    "--matches", $Matches
)
if ($Output -ne "") { $argsList += @("--output", $Output) }
if ($Voice -ne "") { $argsList += @("--voice", $Voice) }
if ($Script -ne "") { $argsList += @("--script", $Script) }
if ($Draft) { $argsList += "--draft" }
if ($DraftName -ne "") { $argsList += @("--draft-name", $DraftName) }

python @argsList
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
