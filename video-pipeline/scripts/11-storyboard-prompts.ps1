param(
  [Parameter(Mandatory=$true)]
  [string]$Frames,

  [string]$Output = "work/storyboard-prompts.md",
  [string]$Config = "storyboard.template.json",
  [string]$Prefix = "frame",
  [ValidateSet("seedance", "xiaoyunque")]
  [string]$Provider = "seedance"
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

python src/storyboard_workflow.py prompts `
  --frames $Frames `
  --output $Output `
  --config $Config `
  --prefix $Prefix `
  --provider $Provider
