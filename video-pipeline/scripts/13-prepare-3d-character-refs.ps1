[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$CharactersDirectory,

    [string]$OutputDirectory = (Join-Path $PSScriptRoot "..\\work\\3d-character-refs"),

    [string]$ViewOrderTemplate = (Join-Path $PSScriptRoot "..\\3d-character-pipeline\\character-view-order.template.json")
)

$ErrorActionPreference = "Stop"

function Assert-Path([string]$Path, [string]$Label) {
    if (-not (Test-Path -LiteralPath $Path)) {
        throw "$Label not found: $Path"
    }
}

Assert-Path $CharactersDirectory "Characters directory"
Assert-Path $ViewOrderTemplate "View-order template"

Add-Type -AssemblyName System.Drawing

$template = Get-Content -LiteralPath $ViewOrderTemplate -Raw | ConvertFrom-Json
$outRoot = [System.IO.Path]::GetFullPath($OutputDirectory)
$viewsRoot = Join-Path $outRoot "views"
New-Item -ItemType Directory -Force -Path $viewsRoot | Out-Null

$characters = @()
foreach ($character in $template.characters) {
    $source = Join-Path $CharactersDirectory $character.source_file
    Assert-Path $source "Character source"

    $image = [System.Drawing.Image]::FromFile($source)
    try {
        $characterDir = Join-Path $viewsRoot $character.id
        New-Item -ItemType Directory -Force -Path $characterDir | Out-Null
        $views = @()

        for ($index = 0; $index -lt 3; $index++) {
            $x = [math]::Round($image.Width * $index / 3.0)
            $right = [math]::Round($image.Width * ($index + 1) / 3.0)
            $width = $right - $x
            $panelName = [string]$character.panels[$index]
            $target = Join-Path $characterDir ("{0}-{1}.jpg" -f $character.id, $panelName)

            $bitmap = [System.Drawing.Bitmap]::new([int]$width, [int]$image.Height)
            $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
            try {
                $destination = [System.Drawing.Rectangle]::new(0, 0, [int]$width, [int]$image.Height)
                $sourceRectangle = [System.Drawing.Rectangle]::new([int]$x, 0, [int]$width, [int]$image.Height)
                $graphics.DrawImage($image, $destination, $sourceRectangle, [System.Drawing.GraphicsUnit]::Pixel)
                $bitmap.Save($target, [System.Drawing.Imaging.ImageFormat]::Jpeg)
            }
            finally {
                $graphics.Dispose()
                $bitmap.Dispose()
            }

            $views += [pscustomobject]@{
                label = $panelName
                path = [System.IO.Path]::GetFullPath($target)
                width = $width
                height = $image.Height
            }
        }

        $primaryView = $views | Where-Object { $_.label -eq "front" } | Select-Object -First 1
        if ($null -eq $primaryView) {
            $primaryView = $views | Where-Object { $_.label -eq "three_quarter" } | Select-Object -First 1
        }
        if ($null -eq $primaryView) {
            $primaryView = $views | Select-Object -First 1
        }

        $characters += [pscustomobject]@{
            id = $character.id
            source = [System.IO.Path]::GetFullPath($source)
            meshy_primary_view = $primaryView.path
            extra_views = @($views | Where-Object { $_.path -ne $primaryView.path } | ForEach-Object { $_.path })
            views = $views
        }
    }
    finally {
        $image.Dispose()
    }
}

$manifest = [pscustomobject]@{
    created_at = (Get-Date).ToUniversalTime().ToString("o")
    source_directory = [System.IO.Path]::GetFullPath($CharactersDirectory)
    target = "Meshy 6 Image-to-3D Multi-View or Tripo Image-to-3D"
    export_target = "FBX"
    characters = $characters
}
$manifestPath = Join-Path $outRoot "manifest.json"
$manifest | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $manifestPath -Encoding utf8

Write-Host "Prepared $($characters.Count) character reference sets."
Write-Host "Manifest: $manifestPath"
