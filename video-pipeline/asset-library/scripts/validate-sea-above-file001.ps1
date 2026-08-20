[CmdletBinding()]
param(
    [ValidateSet('package', 'anchors', 'takes', 'release')]
    [string]$Mode = 'package',
    [string]$PackageRoot = 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$repositoryRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..\..\..')).Path

function Resolve-InputPath {
    param(
        [Parameter(Mandatory = $true)]
        [string]$InputPath,
        [Parameter(Mandatory = $true)]
        [string]$BasePath
    )

    if ([System.IO.Path]::IsPathRooted($InputPath)) {
        return [System.IO.Path]::GetFullPath($InputPath)
    }

    return [System.IO.Path]::GetFullPath((Join-Path $BasePath $InputPath))
}

function Read-JsonFile {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path,
        [Parameter(Mandatory = $true)]
        [string]$Label
    )

    if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
        throw "Missing $Label dependency: $Path"
    }

    try {
        return (Get-Content -Raw -LiteralPath $Path -Encoding UTF8 | ConvertFrom-Json)
    }
    catch {
        throw "Invalid JSON in $Label ($Path): $($_.Exception.Message)"
    }
}

function Assert-ExactValue {
    param(
        [Parameter(Mandatory = $true)]
        [object]$Actual,
        [Parameter(Mandatory = $true)]
        [object]$Expected,
        [Parameter(Mandatory = $true)]
        [string]$Label
    )

    if ($Actual -ne $Expected) {
        throw "$Label mismatch (expected '$Expected', got '$Actual')"
    }
}

function Get-PositiveNumber {
    param(
        [Parameter(Mandatory = $false)]
        [object]$Value,
        [Parameter(Mandatory = $true)]
        [string]$Label
    )

    if ($null -eq $Value) {
        throw "$Label unavailable (null)"
    }

    [double]$number = 0
    $parsed = [double]::TryParse(
        [string]$Value,
        [System.Globalization.NumberStyles]::Float,
        [System.Globalization.CultureInfo]::InvariantCulture,
        [ref]$number
    )
    if (-not $parsed -or $number -le 0) {
        throw "$Label unavailable (numeric value must be greater than zero; got '$Value')"
    }

    return $number
}

function Convert-RationalToNumber {
    param(
        [Parameter(Mandatory = $false)]
        [object]$Value,
        [Parameter(Mandatory = $true)]
        [string]$Label
    )

    if ($null -eq $Value) {
        throw "$Label unavailable (null)"
    }

    $text = [string]$Value
    if ($text -match '^\s*(-?\d+(?:\.\d+)?)\s*/\s*(-?\d+(?:\.\d+)?)\s*$') {
        [double]$numerator = $matches[1]
        [double]$denominator = $matches[2]
        if ($denominator -eq 0) {
            throw "$Label unavailable (zero denominator)"
        }

        [double]$number = $numerator / $denominator
        if ($number -le 0) {
            throw "$Label unavailable (numeric value must be greater than zero; got '$Value')"
        }

        return $number
    }

    return (Get-PositiveNumber -Value $Value -Label $Label)
}

function Assert-FileAtRoot {
    param(
        [Parameter(Mandatory = $true)]
        [string]$RelativePath,
        [Parameter(Mandatory = $true)]
        [string]$RootPath,
        [Parameter(Mandatory = $true)]
        [string]$Label
    )

    if ([System.IO.Path]::IsPathRooted($RelativePath)) {
        $candidate = [System.IO.Path]::GetFullPath($RelativePath)
    }
    else {
        $candidate = [System.IO.Path]::GetFullPath((Join-Path $RootPath $RelativePath))
    }

    if (-not (Test-Path -LiteralPath $candidate -PathType Leaf)) {
        throw "Missing $Label dependency: $RelativePath"
    }

    return $candidate
}

function Assert-Contract {
    param(
        [Parameter(Mandatory = $true)]
        [object]$Contract
    )

    Assert-ExactValue -Actual $Contract.schema_version -Expected '1.0' -Label 'schema_version'
    Assert-ExactValue -Actual $Contract.id -Expected 'VID_MR_SEA_ABOVE_FILE_001' -Label 'contract id'
    Assert-ExactValue -Actual $Contract.title -Expected 'FILE 001 — THE PEARL THAT ANSWERED' -Label 'contract title'
    Assert-ExactValue -Actual $Contract.product_id -Expected 'PROD_MR_BAROQUE_ORBIT_EARRINGS_001' -Label 'product_id'
    Assert-ExactValue -Actual $Contract.character_id -Expected 'CHAR_MR_TIDE_ARCHIVIST_001' -Label 'character_id'
    Assert-ExactValue -Actual $Contract.environment_id -Expected 'ENV_MR_SEA_ABOVE_OLD_CITY_001' -Label 'environment_id'

    Assert-ExactValue -Actual $Contract.format.width -Expected 2160 -Label 'format.width'
    Assert-ExactValue -Actual $Contract.format.height -Expected 3840 -Label 'format.height'
    Assert-ExactValue -Actual $Contract.format.fps -Expected 24 -Label 'format.fps'
    Assert-ExactValue -Actual $Contract.format.min_seconds -Expected 28 -Label 'format.min_seconds'
    Assert-ExactValue -Actual $Contract.format.max_seconds -Expected 34 -Label 'format.max_seconds'

    if (($Contract.fx_ids -join ',') -ne 'FX_MR_REVERSE_RAIN_001,FX_MR_SKY_SEA_MOTHER_001') {
        throw 'fx_ids mismatch'
    }

    $expectedShotIds = 'S01,S02,S03,S04,S05,S06,S07,S08,S09'
    if (($Contract.shot_ids -join ',') -ne $expectedShotIds) {
        throw 'shot_ids mismatch'
    }

    Assert-ExactValue -Actual $Contract.seedance.seconds_per_take -Expected 4 -Label 'seedance.seconds_per_take'
    Assert-ExactValue -Actual $Contract.seedance.credits_per_take -Expected 44 -Label 'seedance.credits_per_take'
    Assert-ExactValue -Actual $Contract.seedance.approved_base_takes -Expected 13 -Label 'seedance.approved_base_takes'
    Assert-ExactValue -Actual $Contract.seedance.approved_base_credits -Expected 572 -Label 'seedance.approved_base_credits'
    Assert-ExactValue -Actual $Contract.seedance.max_rejected_takes_per_shot -Expected 3 -Label 'seedance.max_rejected_takes_per_shot'

    if (-not [bool]$Contract.release_gate.requires_blind_review -or
        -not [bool]$Contract.release_gate.requires_clean_loop -or
        -not [bool]$Contract.release_gate.requires_bilingual_exports) {
        throw 'release_gate mismatch'
    }
}

function Assert-Manifest {
    param(
        [Parameter(Mandatory = $true)]
        [object]$Manifest,
        [Parameter(Mandatory = $true)]
        [object]$Contract
    )

    Assert-ExactValue -Actual $Manifest.schema_version -Expected '1.0' -Label 'manifest schema_version'
    Assert-ExactValue -Actual $Manifest.id -Expected $Contract.id -Label 'manifest id'
    Assert-ExactValue -Actual $Manifest.title -Expected $Contract.title -Label 'manifest title'

    $expectedContractPath = 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/production-contract.json'
    Assert-ExactValue -Actual $Manifest.contract_path -Expected $expectedContractPath -Label 'manifest contract_path'

    $expectedShotIds = @($Contract.shot_ids)
    $manifestShots = @($Manifest.shots)
    if ($manifestShots.Count -ne $expectedShotIds.Count) {
        throw "manifest shots mismatch (expected $($expectedShotIds.Count), got $($manifestShots.Count))"
    }

    if (($manifestShots.id -join ',') -ne ($expectedShotIds -join ',')) {
        throw 'manifest shot ids mismatch'
    }

    foreach ($shotId in $expectedShotIds) {
        $shot = @($manifestShots | Where-Object { $_.id -eq $shotId })
        if ($shot.Count -ne 1) {
            throw "manifest shot record missing or duplicated: $shotId"
        }

        $record = $shot[0]
        Assert-ExactValue -Actual $record.first_frame_path -Expected "first-frames/$shotId.png" -Label "$shotId first_frame_path"
        Assert-ExactValue -Actual $record.prompt_path -Expected "prompts/seedance-$($shotId.ToLowerInvariant()).md" -Label "$shotId prompt_path"
        Assert-ExactValue -Actual $record.accepted_take_path -Expected "takes/accepted/$shotId.mp4" -Label "$shotId accepted_take_path"
    }

    $takesMedia = $Manifest.media_checks.takes
    [void](Get-PositiveNumber -Value $takesMedia.width -Label 'media_checks.takes.width')
    [void](Get-PositiveNumber -Value $takesMedia.height -Label 'media_checks.takes.height')
    [void](Get-PositiveNumber -Value $takesMedia.fps -Label 'media_checks.takes.fps')
    [void](Get-PositiveNumber -Value $takesMedia.duration_seconds -Label 'media_checks.takes.duration_seconds')
    [void](Get-PositiveNumber -Value $takesMedia.duration_tolerance_seconds -Label 'media_checks.takes.duration_tolerance_seconds')
    if (-not [bool]$takesMedia.requires_audio) {
        throw 'media_checks.takes.requires_audio must be true'
    }

    $audioMedia = $Manifest.media_checks.audio
    [void](Get-PositiveNumber -Value $audioMedia.sample_rate -Label 'media_checks.audio.sample_rate')
    [void](Get-PositiveNumber -Value $audioMedia.channels -Label 'media_checks.audio.channels')
    [void](Get-PositiveNumber -Value $audioMedia.min_seconds -Label 'media_checks.audio.min_seconds')
    [void](Get-PositiveNumber -Value $audioMedia.max_seconds -Label 'media_checks.audio.max_seconds')
}

function Get-FFProbeJson {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path,
        [Parameter(Mandatory = $true)]
        [string]$Label
    )

    if (-not (Get-Command ffprobe -ErrorAction SilentlyContinue)) {
        throw "ffprobe is required to inspect $Label"
    }

    $json = & ffprobe -v error -show_entries 'stream=codec_type,width,height,r_frame_rate,sample_rate,channels' -show_entries 'format=duration' -of json $Path 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "ffprobe failed for $($Label): $Path"
    }

    try {
        return ($json | ConvertFrom-Json)
    }
    catch {
        throw "ffprobe returned invalid JSON for $($Label): $($_.Exception.Message)"
    }
}

function Assert-VideoMedia {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path,
        [Parameter(Mandatory = $true)]
        [string]$Label,
        [Parameter(Mandatory = $true)]
        [object]$Expected
    )

    $probe = Get-FFProbeJson -Path $Path -Label $Label
    $streams = @($probe.streams)
    $video = @($streams | Where-Object { $_.codec_type -eq 'video' }) | Select-Object -First 1
    if ($null -eq $video) {
        throw "$Label has no video stream"
    }

    $width = Get-PositiveNumber -Value $video.width -Label "$Label width"
    $height = Get-PositiveNumber -Value $video.height -Label "$Label height"
    $fps = Convert-RationalToNumber -Value $video.r_frame_rate -Label "$Label fps"
    $duration = Get-PositiveNumber -Value $probe.format.duration -Label "$Label duration"

    if ($width -ne [double]$Expected.width) {
        throw "$Label width mismatch (expected $($Expected.width), got $width)"
    }
    if ($height -ne [double]$Expected.height) {
        throw "$Label height mismatch (expected $($Expected.height), got $height)"
    }
    if ([math]::Abs($fps - [double]$Expected.fps) -gt 0.001) {
        throw "$Label fps mismatch (expected $($Expected.fps), got $fps)"
    }

    if ($Expected.PSObject.Properties.Name -contains 'duration_seconds') {
        $tolerance = [double]$Expected.duration_tolerance_seconds
        if ([math]::Abs($duration - [double]$Expected.duration_seconds) -gt $tolerance) {
            throw "$Label duration mismatch (expected $($Expected.duration_seconds)±$tolerance seconds, got $duration)"
        }
    }
    else {
        if ($duration -lt [double]$Expected.min_seconds -or $duration -gt [double]$Expected.max_seconds) {
            throw "$Label duration outside $($Expected.min_seconds)-$($Expected.max_seconds) seconds (got $duration)"
        }
    }

    if ([bool]$Expected.requires_audio -and @($streams | Where-Object { $_.codec_type -eq 'audio' }).Count -eq 0) {
        throw "$Label has no audio stream"
    }
}

function Assert-AudioMedia {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path,
        [Parameter(Mandatory = $true)]
        [string]$Label,
        [Parameter(Mandatory = $true)]
        [object]$Expected
    )

    $probe = Get-FFProbeJson -Path $Path -Label $Label
    $streams = @($probe.streams)
    $audio = @($streams | Where-Object { $_.codec_type -eq 'audio' }) | Select-Object -First 1
    if ($null -eq $audio) {
        throw "$Label has no audio stream"
    }

    $sampleRate = Get-PositiveNumber -Value $audio.sample_rate -Label "$Label sample_rate"
    $channels = Get-PositiveNumber -Value $audio.channels -Label "$Label channels"
    $duration = Get-PositiveNumber -Value $probe.format.duration -Label "$Label duration"
    if ($sampleRate -ne [double]$Expected.sample_rate) {
        throw "$Label sample_rate mismatch (expected $($Expected.sample_rate), got $sampleRate)"
    }
    if ($channels -ne [double]$Expected.channels) {
        throw "$Label channels mismatch (expected $($Expected.channels), got $channels)"
    }
    if ($duration -lt [double]$Expected.min_seconds -or $duration -gt [double]$Expected.max_seconds) {
        throw "$Label duration outside $($Expected.min_seconds)-$($Expected.max_seconds) seconds (got $duration)"
    }
}

function Assert-AssetRoles {
    param(
        [Parameter(Mandatory = $true)]
        [object]$Manifest
    )

    foreach ($role in $Manifest.asset_roles.PSObject.Properties) {
        [void](Assert-FileAtRoot -RelativePath ([string]$role.Value) -RootPath $repositoryRoot -Label "anchor $($role.Name)")
    }
}

function Assert-ShotAnchors {
    param(
        [Parameter(Mandatory = $true)]
        [object]$Manifest
    )

    $firstFrameCount = 0
    $promptCount = 0
    foreach ($shot in @($Manifest.shots)) {
        [void](Assert-FileAtRoot -RelativePath ([string]$shot.first_frame_path) -RootPath $resolvedPackageRoot -Label "$($shot.id) first frame")
        [void](Assert-FileAtRoot -RelativePath ([string]$shot.prompt_path) -RootPath $resolvedPackageRoot -Label "$($shot.id) prompt")
        $firstFrameCount++
        $promptCount++
    }

    return @{ FirstFrames = $firstFrameCount; Prompts = $promptCount }
}

function Assert-RequiredPackageFiles {
    param(
        [Parameter(Mandatory = $true)]
        [object]$Manifest
    )

    $categories = @('markdown', 'json', 'images', 'audio', 'subtitles', 'takes', 'deliverables')
    foreach ($category in $categories) {
        $paths = @($Manifest.dependencies.package_files.$category)
        if ($paths.Count -eq 0) {
            throw "No required $category dependencies declared"
        }

        foreach ($path in $paths) {
            [void](Assert-FileAtRoot -RelativePath ([string]$path) -RootPath $resolvedPackageRoot -Label "$category file")
        }
    }
}

function Assert-AcceptedTakes {
    param(
        [Parameter(Mandatory = $true)]
        [object]$Contract,
        [Parameter(Mandatory = $true)]
        [object]$Manifest
    )

    foreach ($shotId in $Contract.shot_ids) {
        $take = Join-Path $resolvedPackageRoot "takes/accepted/$shotId.mp4"
        if (-not (Test-Path -LiteralPath $take -PathType Leaf)) {
            throw "Missing accepted take $shotId"
        }

        Assert-VideoMedia -Path $take -Label $shotId -Expected $Manifest.media_checks.takes
    }
}

function Assert-Deliverables {
    param(
        [Parameter(Mandatory = $true)]
        [object]$Manifest
    )

    $master = Join-Path $resolvedPackageRoot 'deliverables/file001-master-2160x3840-prores.mov'
    $english = Join-Path $resolvedPackageRoot 'deliverables/file001-en-1080x1920.mp4'
    $chinese = Join-Path $resolvedPackageRoot 'deliverables/file001-zh-1080x1920.mp4'
    Assert-VideoMedia -Path $master -Label 'master deliverable' -Expected $Manifest.media_checks.deliverables.master
    Assert-VideoMedia -Path $english -Label 'English deliverable' -Expected $Manifest.media_checks.deliverables.exports
    Assert-VideoMedia -Path $chinese -Label 'Chinese deliverable' -Expected $Manifest.media_checks.deliverables.exports
}

try {
    $resolvedPackageRoot = Resolve-InputPath -InputPath $PackageRoot -BasePath $repositoryRoot
    if (-not (Test-Path -LiteralPath $resolvedPackageRoot -PathType Container)) {
        throw "Missing package root: $PackageRoot"
    }

    $contractPath = Join-Path $resolvedPackageRoot 'production-contract.json'
    $manifestPath = Join-Path $resolvedPackageRoot 'asset-pack-manifest.json'
    $contract = Read-JsonFile -Path $contractPath -Label 'production contract'
    $manifest = Read-JsonFile -Path $manifestPath -Label 'asset-pack manifest'
    Assert-Contract -Contract $contract
    Assert-Manifest -Manifest $manifest -Contract $contract

    switch ($Mode) {
        'takes' {
            Assert-AcceptedTakes -Contract $contract -Manifest $manifest
            Write-Output 'takes: PASS; accepted_takes: 9/9'
        }
        'anchors' {
            Assert-AssetRoles -Manifest $manifest
            $anchorCounts = Assert-ShotAnchors -Manifest $manifest
            Write-Output "anchors: PASS; first_frames: $($anchorCounts.FirstFrames)/9; prompts: $($anchorCounts.Prompts)/9"
        }
        'release' {
            Assert-AcceptedTakes -Contract $contract -Manifest $manifest
            Assert-AssetRoles -Manifest $manifest
            [void](Assert-ShotAnchors -Manifest $manifest)
            Assert-RequiredPackageFiles -Manifest $manifest
            Assert-AudioMedia -Path (Join-Path $resolvedPackageRoot 'audio/mix-34s.wav') -Label 'audio mix' -Expected $manifest.media_checks.audio
            Assert-Deliverables -Manifest $manifest
            Write-Output 'release: PASS'
        }
        default {
            # Package mode is the complete dependency gate used before release work begins.
            # It intentionally fails fast while the package is still being assembled.
            Assert-AcceptedTakes -Contract $contract -Manifest $manifest
            Assert-AssetRoles -Manifest $manifest
            [void](Assert-ShotAnchors -Manifest $manifest)
            Assert-RequiredPackageFiles -Manifest $manifest
            Assert-AudioMedia -Path (Join-Path $resolvedPackageRoot 'audio/mix-34s.wav') -Label 'audio mix' -Expected $manifest.media_checks.audio
            Assert-Deliverables -Manifest $manifest
            Write-Output 'package: PASS'
        }
    }

    exit 0
}
catch {
    Write-Error $_.Exception.Message
    exit 1
}
