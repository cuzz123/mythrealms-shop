param(
  [Parameter(Mandatory=$true)]
  [string]$Board,

  [string]$Output = "work/storyboard-frames",
  [string]$Config = "storyboard.template.json",
  [string]$Prefix = "frame",
  [int]$Margin = 0,
  [int]$GapX = 0,
  [int]$GapY = 0,
  [int]$SafeInset = 0,
  [ValidateSet("cover", "contain", "contain-blur")]
  [string]$Mode = "contain-blur"
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

python src/storyboard_workflow.py crop-board `
  --board $Board `
  --output $Output `
  --config $Config `
  --prefix $Prefix `
  --margin $Margin `
  --gap-x $GapX `
  --gap-y $GapY `
  --safe-inset $SafeInset `
  --mode $Mode
