[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [string]$ReferenceVideo,

    [Parameter(Mandatory)]
    [string]$CharactersDirectory,

    [string]$OutputRoot = (Join-Path $PSScriptRoot "..\work"),

    [string]$JobName = ("iclone-prep-" + (Get-Date -Format "yyyy-MM-dd-HHmmss"))
)

$ErrorActionPreference = "Stop"

function Resolve-ExistingPath {
    param(
        [Parameter(Mandatory)]
        [string]$Path,

        [Parameter(Mandatory)]
        [string]$Label
    )

    if (-not (Test-Path -LiteralPath $Path)) {
        throw "$Label does not exist: $Path"
    }

    return (Resolve-Path -LiteralPath $Path).Path
}

$referencePath = Resolve-ExistingPath -Path $ReferenceVideo -Label "Reference video"
$characterRoot = Resolve-ExistingPath -Path $CharactersDirectory -Label "Character directory"
$templatePath = Join-Path $PSScriptRoot "..\iclone-ai-studio\project.template.json"
$templatePath = Resolve-ExistingPath -Path $templatePath -Label "Project template"

$left = [string][char]0x5DE6
$right = [string][char]0x53F3
$center = [string][char]0x4F4D
$roleFiles = @{
    "left2_glasses" = ($left + "2.jpg")
    "left1_sage" = ($left + "1.jpg")
    "center_navy" = ("C" + $center + ".jpg")
    "right1_black" = ($right + "1.jpg")
    "right2_gold" = ($right + "2.jpg")
}

$resolvedCharacters = @{}
foreach ($roleId in $roleFiles.Keys) {
    $resolvedCharacters[$roleId] = Resolve-ExistingPath -Path (Join-Path $characterRoot $roleFiles[$roleId]) -Label "Character image"
}

if (-not (Test-Path -LiteralPath $OutputRoot)) {
    New-Item -ItemType Directory -Path $OutputRoot -Force | Out-Null
}

$outputDirectory = Join-Path (Resolve-Path -LiteralPath $OutputRoot).Path $JobName
if (Test-Path -LiteralPath $outputDirectory) {
    throw "Output directory already exists: $outputDirectory"
}
New-Item -ItemType Directory -Path $outputDirectory | Out-Null

$manifest = Get-Content -LiteralPath $templatePath -Raw -Encoding UTF8 | ConvertFrom-Json
$manifest.sourceVideo.path = $referencePath
$manifest | Add-Member -NotePropertyName "preparedAt" -NotePropertyValue (Get-Date -Format "o")
$manifest | Add-Member -NotePropertyName "outputDirectory" -NotePropertyValue $outputDirectory

foreach ($role in $manifest.roles) {
    $role.path = $resolvedCharacters[$role.id]
}

$manifestPath = Join-Path $outputDirectory "manifest.json"
$manifest | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath $manifestPath -Encoding UTF8

Write-Host "Prepared iClone AI Studio input package: $outputDirectory"
Write-Host "Manifest: $manifestPath"
Write-Host "Reference: $referencePath"
