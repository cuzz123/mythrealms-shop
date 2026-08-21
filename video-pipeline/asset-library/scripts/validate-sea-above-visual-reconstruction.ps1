[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$repositoryRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..\..\..')).Path
$contractRelativePath = 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/reconstruction-contract.json'
$contractPath = Join-Path $repositoryRoot $contractRelativePath
$packageRoot = Split-Path -Parent $contractPath
$errors = [System.Collections.Generic.List[string]]::new()
$locationPushed = $false

function Add-ValidationError {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path,
        [Parameter(Mandatory = $true)]
        [string]$Reason
    )

    [void]$errors.Add("ERROR: $Path — $Reason")
}

function Get-RequiredProperty {
    param(
        [Parameter(Mandatory = $true)]
        [object]$Object,
        [Parameter(Mandatory = $true)]
        [string]$Name,
        [Parameter(Mandatory = $true)]
        [string]$Label
    )

    if ($null -eq $Object) {
        throw "$Label is missing because its parent value is null"
    }

    $property = $Object.PSObject.Properties[$Name]
    if ($null -eq $property) {
        throw "$Label is missing"
    }
    if ($null -eq $property.Value) {
        throw "$Label is null"
    }

    return $property.Value
}

function Get-RequiredString {
    param(
        [Parameter(Mandatory = $true)]
        [object]$Object,
        [Parameter(Mandatory = $true)]
        [string]$Name,
        [Parameter(Mandatory = $true)]
        [string]$Label
    )

    $value = Get-RequiredProperty -Object $Object -Name $Name -Label $Label
    if ($value -isnot [string] -or [string]::IsNullOrWhiteSpace($value)) {
        throw "$Label must be a non-empty string"
    }

    return [string]$value
}

function Get-RequiredPositiveInteger {
    param(
        [Parameter(Mandatory = $true)]
        [object]$Object,
        [Parameter(Mandatory = $true)]
        [string]$Name,
        [Parameter(Mandatory = $true)]
        [string]$Label
    )

    $value = Get-RequiredProperty -Object $Object -Name $Name -Label $Label
    if ($value -is [bool] -or $value -isnot [int] -and $value -isnot [long]) {
        throw "$Label must be a positive integer"
    }

    [long]$number = $value
    if ($number -le 0) {
        throw "$Label must be a positive integer"
    }

    return $number
}

function Get-RequiredArray {
    param(
        [Parameter(Mandatory = $true)]
        [object]$Object,
        [Parameter(Mandatory = $true)]
        [string]$Name,
        [Parameter(Mandatory = $true)]
        [string]$Label
    )

    $value = Get-RequiredProperty -Object $Object -Name $Name -Label $Label
    if ($value -is [string] -or $value -isnot [System.Collections.IEnumerable]) {
        throw "$Label must be an array"
    }

    $items = @($value)
    if ($items.Count -eq 0) {
        throw "$Label must not be empty"
    }

    return $items
}

function Join-ContractPath {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Directory,
        [Parameter(Mandatory = $true)]
        [string]$Child
    )

    return ((($Directory.TrimEnd('/', '\')) + '/' + $Child.TrimStart('/', '\')) -replace '\\', '/')
}

function Resolve-PackagePath {
    param(
        [Parameter(Mandatory = $true)]
        [string]$RelativePath,
        [Parameter(Mandatory = $true)]
        [string]$Label
    )

    if ([string]::IsNullOrWhiteSpace($RelativePath)) {
        throw "$Label must be a non-empty relative path"
    }
    if ([System.IO.Path]::IsPathRooted($RelativePath)) {
        throw "$Label must be relative to the reconstruction package"
    }

    $candidate = [System.IO.Path]::GetFullPath((Join-Path $packageRoot $RelativePath))
    $packagePrefix = $packageRoot.TrimEnd('\', '/') + [System.IO.Path]::DirectorySeparatorChar
    if (-not $candidate.StartsWith($packagePrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "$Label escapes the reconstruction package"
    }

    return $candidate
}

function Assert-ContractIdentity {
    param(
        [Parameter(Mandatory = $true)]
        [object]$Contract
    )

    $schemaVersion = Get-RequiredPositiveInteger -Object $Contract -Name 'schema_version' -Label 'schema_version'
    if ($schemaVersion -ne 1) {
        throw "schema_version must be 1 (got $schemaVersion)"
    }

    $packageId = Get-RequiredString -Object $Contract -Name 'package_id' -Label 'package_id'
    if ($packageId -ne 'VID_MR_SEA_ABOVE_FILE_001_VISUAL_RECONSTRUCTION') {
        throw "package_id mismatch (got '$packageId')"
    }

    $status = Get-RequiredString -Object $Contract -Name 'status' -Label 'status'
    if ($status -ne 'candidate_only') {
        throw "status must be candidate_only (got '$status')"
    }

    $promotionGate = Get-RequiredProperty -Object $Contract -Name 'forbid_promotion_without_user_selection' -Label 'forbid_promotion_without_user_selection'
    if ($promotionGate -isnot [bool] -or $promotionGate -ne $true) {
        throw 'forbid_promotion_without_user_selection must be the Boolean value true'
    }
}

function New-ImageDeclaration {
    param(
        [Parameter(Mandatory = $true)]
        [string]$RelativePath,
        [Parameter(Mandatory = $true)]
        [long]$Width,
        [Parameter(Mandatory = $true)]
        [long]$Height,
        [Parameter(Mandatory = $true)]
        [long]$Channels
    )

    if ($Width -le 0 -or $Height -le 0 -or $Channels -le 0) {
        throw "Invalid image declaration for $RelativePath"
    }
    if ([string]::IsNullOrWhiteSpace($RelativePath)) {
        throw 'Image declaration path must not be empty'
    }

    return [pscustomobject]@{
        RelativePath = $RelativePath
        FullPath = Resolve-PackagePath -RelativePath $RelativePath -Label "image path $RelativePath"
        Width = $Width
        Height = $Height
        Channels = $Channels
    }
}

function Assert-WorldFileDeclaration {
    param(
        [Parameter(Mandatory = $true)]
        [object]$WorldFile,
        [Parameter(Mandatory = $true)]
        [string]$Label,
        [Parameter(Mandatory = $true)]
        [string]$Directory,
        [Parameter(Mandatory = $true)]
        [long]$Channels
    )

    $path = Get-RequiredString -Object $WorldFile -Name 'path' -Label "$Label.path"
    $width = Get-RequiredPositiveInteger -Object $WorldFile -Name 'width' -Label "$Label.width"
    $height = Get-RequiredPositiveInteger -Object $WorldFile -Name 'height' -Label "$Label.height"
    $relativePath = Join-ContractPath -Directory $Directory -Child $path
    return New-ImageDeclaration -RelativePath $relativePath -Width $width -Height $height -Channels $Channels
}

function Invoke-SharpMetadata {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path,
        [Parameter(Mandatory = $true)]
        [string]$RelativePath
    )

    $nodeScript = @'
const sharp = require('sharp');
const imagePath = process.argv[1];
sharp(imagePath).metadata().then((metadata) => {
  process.stdout.write(JSON.stringify({
    format: metadata.format ?? null,
    width: metadata.width ?? null,
    height: metadata.height ?? null,
    channels: metadata.channels ?? null,
    space: metadata.space ?? null
  }));
}).catch((error) => {
  process.stderr.write(error && error.message ? error.message : String(error));
  process.exit(1);
});
'@

    $nodeOutput = & node -e $nodeScript $Path 2>&1
    $nodeExitCode = $LASTEXITCODE
    $metadataJson = (($nodeOutput | ForEach-Object { [string]$_ }) -join [Environment]::NewLine).Trim()
    if ($nodeExitCode -ne 0) {
        throw "sharp metadata failed: $metadataJson"
    }
    if ([string]::IsNullOrWhiteSpace($metadataJson)) {
        throw 'sharp returned empty metadata'
    }

    try {
        $metadata = $metadataJson | ConvertFrom-Json
    }
    catch {
        throw "sharp returned invalid metadata JSON: $($_.Exception.Message)"
    }

    Write-Host "METADATA: $RelativePath $metadataJson"
    return $metadata
}

function Test-ImageDeclaration {
    param(
        [Parameter(Mandatory = $true)]
        [object]$Declaration
    )

    $relativePath = [string]$Declaration.RelativePath
    if (-not (Test-Path -LiteralPath $Declaration.FullPath -PathType Leaf)) {
        Add-ValidationError -Path $relativePath -Reason 'missing file'
        return
    }

    $reasons = [System.Collections.Generic.List[string]]::new()
    try {
        $metadata = Invoke-SharpMetadata -Path $Declaration.FullPath -RelativePath $relativePath

        $formatProperty = $metadata.PSObject.Properties['format']
        if ($null -eq $formatProperty -or $null -eq $formatProperty.Value) {
            [void]$reasons.Add('format metadata missing')
        }
        elseif ([string]$formatProperty.Value -ne 'png') {
            [void]$reasons.Add("format mismatch (expected png, got $($formatProperty.Value))")
        }

        foreach ($dimension in @(
            [pscustomobject]@{ Name = 'width'; Expected = $Declaration.Width },
            [pscustomobject]@{ Name = 'height'; Expected = $Declaration.Height },
            [pscustomobject]@{ Name = 'channels'; Expected = $Declaration.Channels }
        )) {
            $property = $metadata.PSObject.Properties[$dimension.Name]
            if ($null -eq $property -or $null -eq $property.Value) {
                [void]$reasons.Add("$($dimension.Name) metadata missing")
            }
            elseif ($property.Value -ne $dimension.Expected) {
                [void]$reasons.Add("$($dimension.Name) mismatch (expected $($dimension.Expected), got $($property.Value))")
            }
        }

        $spaceProperty = $metadata.PSObject.Properties['space']
        if ($null -eq $spaceProperty -or $null -eq $spaceProperty.Value) {
            [void]$reasons.Add('RGB color-space metadata missing')
        }
        elseif ([string]$spaceProperty.Value -notin @('rgb', 'srgb')) {
            [void]$reasons.Add("color space mismatch (expected RGB/sRGB, got $($spaceProperty.Value))")
        }
    }
    catch {
        [void]$reasons.Add($_.Exception.Message)
    }

    if ($reasons.Count -gt 0) {
        Add-ValidationError -Path $relativePath -Reason ($reasons -join '; ')
    }
}

try {
    Push-Location -LiteralPath $repositoryRoot
    $locationPushed = $true

    if (-not (Test-Path -LiteralPath $contractPath -PathType Leaf)) {
        throw "Missing reconstruction contract: $contractRelativePath"
    }

    try {
        $contract = Get-Content -Raw -LiteralPath $contractPath -Encoding UTF8 | ConvertFrom-Json -Depth 20
    }
    catch {
        throw "Invalid reconstruction contract JSON: $($_.Exception.Message)"
    }

    Assert-ContractIdentity -Contract $contract

    $characters = Get-RequiredProperty -Object $contract -Name 'characters' -Label 'characters'
    $characterDirectory = Get-RequiredString -Object $characters -Name 'directory' -Label 'characters.directory'
    $characterWidth = Get-RequiredPositiveInteger -Object $characters -Name 'width' -Label 'characters.width'
    $characterHeight = Get-RequiredPositiveInteger -Object $characters -Name 'height' -Label 'characters.height'
    $characterChannels = Get-RequiredPositiveInteger -Object $characters -Name 'channels' -Label 'characters.channels'
    if ($characterChannels -ne 3) {
        throw "characters.channels must be 3 (got $characterChannels)"
    }

    $world = Get-RequiredProperty -Object $contract -Name 'world' -Label 'world'
    $worldDirectory = Get-RequiredString -Object $world -Name 'directory' -Label 'world.directory'
    $worldChannels = Get-RequiredPositiveInteger -Object $world -Name 'channels' -Label 'world.channels'
    if ($worldChannels -ne 3) {
        throw "world.channels must be 3 (got $worldChannels)"
    }

    $declarations = [System.Collections.Generic.List[object]]::new()
    $characterFiles = Get-RequiredArray -Object $characters -Name 'files' -Label 'characters.files'
    foreach ($characterFile in $characterFiles) {
        if ($characterFile -isnot [string] -or [string]::IsNullOrWhiteSpace($characterFile)) {
            throw 'characters.files entries must be non-empty strings'
        }

        $relativePath = Join-ContractPath -Directory $characterDirectory -Child ([string]$characterFile)
        $declarations.Add((New-ImageDeclaration -RelativePath $relativePath -Width $characterWidth -Height $characterHeight -Channels $characterChannels))
    }

    $characterOverview = Get-RequiredString -Object $characters -Name 'overview' -Label 'characters.overview'
    # The approved reconstruction plan fixes the three-board overview canvas at 3240x1920.
    $declarations.Add((New-ImageDeclaration -RelativePath $characterOverview -Width 3240 -Height 1920 -Channels $characterChannels))

    $worldFiles = Get-RequiredArray -Object $world -Name 'files' -Label 'world.files'
    foreach ($worldFileIndex in 0..($worldFiles.Count - 1)) {
        $worldFile = $worldFiles[$worldFileIndex]
        $declarations.Add((Assert-WorldFileDeclaration -WorldFile $worldFile -Label "world.files[$worldFileIndex]" -Directory $worldDirectory -Channels $worldChannels))
    }

    $worldOverview = Get-RequiredString -Object $world -Name 'overview' -Label 'world.overview'
    # The approved reconstruction plan fixes the five-scene overview canvas at 2560x1440.
    $declarations.Add((New-ImageDeclaration -RelativePath $worldOverview -Width 2560 -Height 1440 -Channels $worldChannels))

    $reports = Get-RequiredArray -Object $contract -Name 'reports' -Label 'reports'
    foreach ($report in $reports) {
        if ($report -isnot [string] -or [string]::IsNullOrWhiteSpace($report)) {
            throw 'reports entries must be non-empty strings'
        }

        $reportPath = Resolve-PackagePath -RelativePath ([string]$report) -Label "report path $report"
        if (-not (Test-Path -LiteralPath $reportPath -PathType Leaf)) {
            Add-ValidationError -Path ([string]$report) -Reason 'missing file'
        }
    }

    foreach ($declaration in $declarations) {
        Test-ImageDeclaration -Declaration $declaration
    }
}
catch {
    Add-ValidationError -Path $contractRelativePath -Reason $_.Exception.Message
}
finally {
    if ($locationPushed) {
        Pop-Location
    }
}

if ($errors.Count -gt 0) {
    foreach ($errorMessage in $errors) {
        Write-Output $errorMessage
    }
    exit 1
}

Write-Output 'PASS: visual reconstruction package'
exit 0
