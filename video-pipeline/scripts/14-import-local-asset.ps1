[CmdletBinding(DefaultParameterSetName = "Ingest")]
param(
    [Parameter(Mandatory = $true, ParameterSetName = "Init")]
    [switch]$Init,

    [Parameter(Mandatory = $true, ParameterSetName = "Ingest")]
    [string]$Source,

    [Parameter(Mandatory = $true, ParameterSetName = "Ingest")]
    [ValidateSet("storyboard-video", "edit-project", "edit-export", "final-video")]
    [string]$Type,

    [Parameter(Mandatory = $true, ParameterSetName = "Ingest")]
    [string]$Title,

    [Parameter(ParameterSetName = "Ingest")]
    [string]$AssetId,

    [Parameter(ParameterSetName = "Ingest")]
    [switch]$NoPreview,

    [string]$LibraryRoot,
    [string]$ObsidianVault
)

$ErrorActionPreference = "Stop"
$pipelineRoot = Split-Path -Parent $PSScriptRoot

if (-not $LibraryRoot) {
    $LibraryRoot = Join-Path $pipelineRoot "asset-library"
}
if (-not $ObsidianVault) {
    $ObsidianVault = Join-Path $LibraryRoot "obsidian-vault"
}

$arguments = @(
    "-m", "src.local_asset_library"
)

if ($Init) {
    $arguments += @(
        "init",
        "--root", $LibraryRoot,
        "--vault", $ObsidianVault
    )
}
else {
    $arguments += @(
        "ingest",
        "--source", $Source,
        "--type", $Type,
        "--title", $Title,
        "--root", $LibraryRoot,
        "--vault", $ObsidianVault
    )
    if ($AssetId) {
        $arguments += @("--asset-id", $AssetId)
    }
    if ($NoPreview) {
        $arguments += "--no-preview"
    }
}

Push-Location $pipelineRoot
try {
    & python @arguments
    if ($LASTEXITCODE -ne 0) {
        throw "本地资产导入失败，Python 退出码：$LASTEXITCODE"
    }
}
finally {
    Pop-Location
}
