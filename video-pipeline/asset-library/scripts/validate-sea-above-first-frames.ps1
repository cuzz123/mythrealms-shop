[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$contractRelativePath = 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_SEA_ABOVE_FILE_001/visual-reconstruction/first-frames/first-frame-contract.json'
$contractPath = $null
$repositoryRoot = $null
$errorByPath = [ordered]@{}

function Add-ValidationError {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path,
        [Parameter(Mandatory = $true)]
        [string]$Reason
    )

    if ([string]::IsNullOrWhiteSpace($Path)) {
        $Path = '<unknown path>'
    }

    if (-not $errorByPath.Contains($Path)) {
        $errorByPath[$Path] = [System.Collections.Generic.List[string]]::new()
    }

    if (-not $errorByPath[$Path].Contains($Reason)) {
        [void]$errorByPath[$Path].Add($Reason)
    }
}

function Get-PropertyValue {
    param(
        [Parameter(Mandatory = $false)]
        [AllowNull()]
        [object]$Object,
        [Parameter(Mandatory = $true)]
        [string]$Name
    )

    if ($null -eq $Object) {
        return $null
    }

    $property = $Object.PSObject.Properties[$Name]
    if ($null -eq $property) {
        return $null
    }

    # Preserve JSON arrays as one value when the function result travels through
    # PowerShell's pipeline; otherwise a one-item array becomes a scalar string.
    return ,$property.Value
}

function Test-NonEmptyString {
    param(
        [Parameter(Mandatory = $false)]
        [AllowNull()]
        [object]$Value
    )

    return $Value -is [string] -and -not [string]::IsNullOrWhiteSpace([string]$Value)
}

function Test-PositiveInteger {
    param(
        [Parameter(Mandatory = $false)]
        [AllowNull()]
        [object]$Value
    )

    if ($null -eq $Value -or $Value -is [bool]) {
        return $false
    }

    if ($Value -isnot [int] -and $Value -isnot [long]) {
        return $false
    }

    return [long]$Value -gt 0
}

function Test-Sha256 {
    param(
        [Parameter(Mandatory = $false)]
        [AllowNull()]
        [object]$Value
    )

    return $Value -is [string] -and [string]$Value -match '^[0-9A-Fa-f]{64}$'
}

function Resolve-RepositoryPath {
    param(
        [Parameter(Mandatory = $false)]
        [AllowNull()]
        [object]$RelativePath,
        [Parameter(Mandatory = $true)]
        [string]$Label
    )

    if (-not (Test-NonEmptyString -Value $RelativePath)) {
        Add-ValidationError -Path $Label -Reason 'missing or empty repository-relative path'
        return $null
    }

    $pathText = ([string]$RelativePath).Replace('\', '/')
    if ([System.IO.Path]::IsPathRooted($pathText)) {
        Add-ValidationError -Path $Label -Reason 'path must be relative to the repository root'
        return $null
    }

    try {
        $candidate = [System.IO.Path]::GetFullPath((Join-Path -Path $repositoryRoot -ChildPath ($pathText -replace '/', '\')))
    }
    catch {
        Add-ValidationError -Path $Label -Reason "path cannot be resolved: $($_.Exception.Message)"
        return $null
    }

    $root = [System.IO.Path]::GetFullPath($repositoryRoot).TrimEnd('\', '/')
    $rootPrefix = $root + [System.IO.Path]::DirectorySeparatorChar
    if (-not $candidate.Equals($root, [System.StringComparison]::OrdinalIgnoreCase) -and
        -not $candidate.StartsWith($rootPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
        Add-ValidationError -Path $Label -Reason 'path escapes the repository root'
        return $null
    }

    return $candidate
}

function Resolve-PackagePath {
    param(
        [Parameter(Mandatory = $false)]
        [AllowNull()]
        [object]$RelativePath,
        [Parameter(Mandatory = $true)]
        [string]$Label
    )

    if (-not (Test-NonEmptyString -Value $RelativePath)) {
        Add-ValidationError -Path $Label -Reason 'missing or empty package-relative path'
        return $null
    }

    $pathText = ([string]$RelativePath).Replace('\', '/')
    if ([System.IO.Path]::IsPathRooted($pathText)) {
        Add-ValidationError -Path $Label -Reason 'path must be relative to the first-frames package'
        return $null
    }

    try {
        $candidate = [System.IO.Path]::GetFullPath((Join-Path -Path $packageRoot -ChildPath ($pathText -replace '/', '\')))
    }
    catch {
        Add-ValidationError -Path $Label -Reason "path cannot be resolved: $($_.Exception.Message)"
        return $null
    }

    $packagePrefix = $packageRoot.TrimEnd('\', '/') + [System.IO.Path]::DirectorySeparatorChar
    if (-not $candidate.StartsWith($packagePrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
        Add-ValidationError -Path $Label -Reason 'path escapes the first-frames package'
        return $null
    }

    return $candidate
}

function Assert-ContractValue {
    param(
        [Parameter(Mandatory = $false)]
        [AllowNull()]
        [object]$Actual,
        [Parameter(Mandatory = $true)]
        [object]$Expected,
        [Parameter(Mandatory = $true)]
        [string]$Path
    )

    if ($null -eq $Actual) {
        Add-ValidationError -Path $Path -Reason 'missing or null contract value'
        return
    }

    if ($Actual -ne $Expected) {
        Add-ValidationError -Path $Path -Reason "contract value mismatch (expected '$Expected', got '$Actual')"
    }
}

function Assert-ContractInteger {
    param(
        [Parameter(Mandatory = $false)]
        [AllowNull()]
        [object]$Value,
        [Parameter(Mandatory = $true)]
        [long]$Expected,
        [Parameter(Mandatory = $true)]
        [string]$Path
    )

    if (-not (Test-PositiveInteger -Value $Value)) {
        Add-ValidationError -Path $Path -Reason "missing or invalid positive integer (expected $Expected)"
        return
    }

    if ([long]$Value -ne $Expected) {
        Add-ValidationError -Path $Path -Reason "contract value mismatch (expected '$Expected', got '$Value')"
    }
}

function Validate-HashedInput {
    param(
        [Parameter(Mandatory = $false)]
        [AllowNull()]
        [object]$Entry,
        [Parameter(Mandatory = $true)]
        [string]$Label
    )

    if ($null -eq $Entry) {
        Add-ValidationError -Path $Label -Reason 'missing input declaration'
        return
    }

    $pathValue = Get-PropertyValue -Object $Entry -Name 'path'
    $hashValue = Get-PropertyValue -Object $Entry -Name 'sha256'
    $resolvedPath = $null

    if (-not (Test-NonEmptyString -Value $pathValue)) {
        Add-ValidationError -Path "$Label.path" -Reason 'missing or empty input path'
    }
    else {
        $resolvedPath = Resolve-RepositoryPath -RelativePath $pathValue -Label ([string]$pathValue)
    }

    if (-not (Test-Sha256 -Value $hashValue)) {
        Add-ValidationError -Path "$Label.sha256" -Reason 'missing or invalid SHA-256 field'
    }

    if ($null -eq $resolvedPath) {
        return
    }

    if (-not (Test-Path -LiteralPath $resolvedPath -PathType Leaf)) {
        Add-ValidationError -Path ([string]$pathValue) -Reason 'missing input file'
        return
    }

    if (-not (Test-Sha256 -Value $hashValue)) {
        return
    }

    try {
        $actualHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $resolvedPath).Hash
    }
    catch {
        Add-ValidationError -Path ([string]$pathValue) -Reason "SHA-256 unavailable: $($_.Exception.Message)"
        return
    }

    if (-not $actualHash.Equals([string]$hashValue, [System.StringComparison]::OrdinalIgnoreCase)) {
        Add-ValidationError -Path ([string]$pathValue) -Reason "input hash drift (expected $hashValue, got $actualHash)"
    }
}

function Invoke-SharpMetadata {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path,
        [Parameter(Mandatory = $true)]
        [string]$RepositoryRoot
    )

    $nodeScript = @'
const repositoryRoot = process.argv[1];
const imagePath = process.argv[2];
const sharp = require(require.resolve('sharp', { paths: [repositoryRoot] }));
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

    $nodeOutput = & node -e $nodeScript -- $RepositoryRoot $Path 2>&1
    $nodeExitCode = $LASTEXITCODE
    $metadataText = (($nodeOutput | ForEach-Object { [string]$_ }) -join [Environment]::NewLine).Trim()

    if ($nodeExitCode -ne 0) {
        throw "sharp metadata failed: $metadataText"
    }
    if ([string]::IsNullOrWhiteSpace($metadataText)) {
        throw 'sharp returned empty metadata'
    }

    try {
        return ($metadataText | ConvertFrom-Json -Depth 10)
    }
    catch {
        throw "sharp returned invalid metadata JSON: $($_.Exception.Message)"
    }
}

function Validate-Image {
    param(
        [Parameter(Mandatory = $true)]
        [string]$RelativePath,
        [Parameter(Mandatory = $false)]
        [AllowNull()]
        [object]$FullPath,
        [Parameter(Mandatory = $true)]
        [long]$ExpectedWidth,
        [Parameter(Mandatory = $true)]
        [long]$ExpectedHeight,
        [Parameter(Mandatory = $true)]
        [long]$ExpectedChannels,
        [Parameter(Mandatory = $true)]
        [string]$ExpectedFormat,
        [Parameter(Mandatory = $true)]
        [string]$ExpectedColourSpace,
        [Parameter(Mandatory = $false)]
        [bool]$RequireDimensions = $true
    )

    if ($null -eq $FullPath -or -not (Test-Path -LiteralPath ([string]$FullPath) -PathType Leaf)) {
        Add-ValidationError -Path $RelativePath -Reason 'missing file'
        return
    }

    $metadata = $null
    try {
        $metadata = Invoke-SharpMetadata -Path ([string]$FullPath) -RepositoryRoot $repositoryRoot
    }
    catch {
        Add-ValidationError -Path $RelativePath -Reason $_.Exception.Message
        return
    }

    $reasons = [System.Collections.Generic.List[string]]::new()
    $format = Get-PropertyValue -Object $metadata -Name 'format'
    $width = Get-PropertyValue -Object $metadata -Name 'width'
    $height = Get-PropertyValue -Object $metadata -Name 'height'
    $channels = Get-PropertyValue -Object $metadata -Name 'channels'
    $space = Get-PropertyValue -Object $metadata -Name 'space'

    if (-not (Test-NonEmptyString -Value $format)) {
        [void]$reasons.Add('format metadata missing or unavailable')
    }
    elseif (-not [string]$format -ieq $ExpectedFormat) {
        [void]$reasons.Add("format mismatch (expected $ExpectedFormat, got $format)")
    }

    if ($RequireDimensions) {
        if (-not (Test-PositiveInteger -Value $width)) {
            [void]$reasons.Add('width metadata missing or unavailable')
        }
        elseif ([long]$width -ne $ExpectedWidth) {
            [void]$reasons.Add("width mismatch (expected $ExpectedWidth, got $width)")
        }

        if (-not (Test-PositiveInteger -Value $height)) {
            [void]$reasons.Add('height metadata missing or unavailable')
        }
        elseif ([long]$height -ne $ExpectedHeight) {
            [void]$reasons.Add("height mismatch (expected $ExpectedHeight, got $height)")
        }
    }
    else {
        if (-not (Test-PositiveInteger -Value $width)) {
            [void]$reasons.Add('width metadata missing or unavailable')
        }
        if (-not (Test-PositiveInteger -Value $height)) {
            [void]$reasons.Add('height metadata missing or unavailable')
        }
    }

    if (-not (Test-PositiveInteger -Value $channels)) {
        [void]$reasons.Add('channel metadata missing or unavailable')
    }
    elseif ([long]$channels -ne $ExpectedChannels) {
        [void]$reasons.Add("channel count mismatch (expected $ExpectedChannels, got $channels)")
    }

    if (-not (Test-NonEmptyString -Value $space)) {
        [void]$reasons.Add('colour-space metadata missing or unavailable')
    }
    elseif (-not [string]$space -ieq $ExpectedColourSpace) {
        [void]$reasons.Add("colour space mismatch (expected $ExpectedColourSpace, got $space)")
    }

    if ($reasons.Count -gt 0) {
        Add-ValidationError -Path $RelativePath -Reason ($reasons -join '; ')
    }
}

function Get-MarkdownSections {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Text
    )

    $sections = [ordered]@{}
    $currentId = $null
    $currentLines = [System.Collections.Generic.List[string]]::new()

    foreach ($line in ($Text -split "`r?`n")) {
        $heading = [regex]::Match($line, '^\s*#{2,6}\s+(S\d{2})(?:\s|$|[|｜—:])')
        if ($heading.Success) {
            if ($null -ne $currentId) {
                if ($sections.Contains($currentId)) {
                    Add-ValidationError -Path "v1/reports/generation.md#$currentId" -Reason 'duplicate shot section'
                }
                $sections[$currentId] = ($currentLines -join [Environment]::NewLine)
            }

            $currentId = $heading.Groups[1].Value.ToUpperInvariant()
            $currentLines = [System.Collections.Generic.List[string]]::new()
            continue
        }

        if ($null -ne $currentId) {
            [void]$currentLines.Add($line)
        }
    }

    if ($null -ne $currentId) {
        if ($sections.Contains($currentId)) {
            Add-ValidationError -Path "v1/reports/generation.md#$currentId" -Reason 'duplicate shot section'
        }
        $sections[$currentId] = ($currentLines -join [Environment]::NewLine)
    }

    return $sections
}

function Test-ReportShaField {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Section
    )

    $pattern = '(?im)^\s*(?:[-*]\s*)?[^\r\n]*SHA[-\s]?256\s*[:：]\s*[`"'']?([0-9A-Fa-f]{64})[`"'']?\s*$'
    return [regex]::IsMatch($Section, $pattern)
}

function Test-ReportReferenceRoleField {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Section
    )

    $pattern = '(?im)^\s*(?:[-*]\s*)?(?:positive\s+references?(?:\s+[^:：]*)?|reference(?:[_\-\s]+)roles?|reference(?:[_\-\s]+)role(?:\s+map)?)\s*[:：]\s*(.*)$'
    $lines = $Section -split "`r?`n"
    for ($index = 0; $index -lt $lines.Count; $index++) {
        $line = $lines[$index]
        $match = [regex]::Match($line, $pattern)
        if (-not $match.Success) {
            continue
        }

        if (-not [string]::IsNullOrWhiteSpace($match.Groups[1].Value)) {
            return $true
        }

        for ($childIndex = $index + 1; $childIndex -lt $lines.Count; $childIndex++) {
            $childLine = $lines[$childIndex]
            if ([string]::IsNullOrWhiteSpace($childLine)) {
                continue
            }
            if ($childLine -match '^\s+[-*]\s+\S') {
                return $true
            }
            break
        }
    }

    return $false
}

function Mask-NegativeHistoryExclusions {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Text
    )

    $maskedLines = [System.Collections.Generic.List[string]]::new()
    $inNegativeBlock = $false
    $lines = $Text -split "`r?`n"

    foreach ($line in $lines) {
        $isNegativeMarker = $line -match '(?i)^\s*(?:[-*]\s*)?(?:\|\s*)?(?:negative[-\s]?history|rejected[-\s]?history|historical\s+exclusions?|negative\s+inputs?)(?:\s+exclusions?)?[^:：|]*[:：|]'
        if ($isNegativeMarker) {
            [void]$maskedLines.Add(($line -replace '[^\r\n]', ' '))
            $inNegativeBlock = $line.TrimEnd().EndsWith(':') -or $line.TrimEnd().EndsWith('|')
            continue
        }

        if ($inNegativeBlock) {
            if ([string]::IsNullOrWhiteSpace($line)) {
                [void]$maskedLines.Add(($line -replace '[^\r\n]', ' '))
                continue
            }
            if ($line -match '^\s*#{1,6}\s+' -or $line -match '^\s*(?:[-*]\s*)?[A-Za-z][A-Za-z0-9 _-]*\s*[:：]') {
                $inNegativeBlock = $false
            }
            elseif ($line -match '^\s*(?:[-*]\s+|`|\|)') {
                [void]$maskedLines.Add(($line -replace '[^\r\n]', ' '))
                continue
            }
            else {
                $inNegativeBlock = $false
            }
        }

        [void]$maskedLines.Add($line)
    }

    return ($maskedLines -join "`n")
}

function Find-ForbiddenPositivePrefix {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Text,
        [Parameter(Mandatory = $true)]
        [object[]]$Prefixes
    )

    $hits = [System.Collections.Generic.List[object]]::new()
    $seen = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
    $scanText = Mask-NegativeHistoryExclusions -Text $Text
    $lines = $scanText -split "`r?`n"

    for ($lineIndex = 0; $lineIndex -lt $lines.Count; $lineIndex++) {
        $line = $lines[$lineIndex].Replace('\', '/')
        foreach ($prefixValue in $Prefixes) {
            if (-not (Test-NonEmptyString -Value $prefixValue)) {
                continue
            }

            $prefix = ([string]$prefixValue).Replace('\', '/')
            $pattern = '(?i)(?<![A-Za-z0-9_.-])' + [regex]::Escape($prefix) + '[^\s`"''<>()[\]|,;]+'
            foreach ($match in [regex]::Matches($line, $pattern)) {
                $candidatePath = $match.Value.TrimEnd([char[]]".!?:;")
                if ([string]::IsNullOrWhiteSpace($candidatePath)) {
                    continue
                }

                if ($prefix -ieq 'first-frames/') {
                    $beforeMatch = $line.Substring(0, $match.Index)
                    $afterPrefix = $match.Value.Substring($prefix.Length)
                    $isV1Namespace = $beforeMatch -match '(?i)(?:^|/)visual-reconstruction/$' -and $afterPrefix -match '(?i)^v1/'
                    if ($isV1Namespace) {
                        continue
                    }
                }

                $key = "$prefix|$($lineIndex + 1)|$candidatePath"
                if ($seen.Add($key)) {
                    [void]$hits.Add([pscustomobject]@{
                        Prefix = $prefix
                        Path = $candidatePath
                        Line = $lineIndex + 1
                    })
                }
            }
        }
    }

    return @($hits)
}

function Write-ValidationResult {
    if ($errorByPath.Count -gt 0) {
        foreach ($path in $errorByPath.Keys) {
            Write-Output ("ERROR: {0} — {1}" -f $path, ($errorByPath[$path] -join '; '))
        }
        exit 1
    }

    Write-Output 'PASS: Sea Above first-frame v1 package'
    exit 0
}

try {
    $repositoryRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..\..\..')).Path
}
catch {
    Add-ValidationError -Path 'repository root' -Reason "cannot resolve repository root from PSScriptRoot: $($_.Exception.Message)"
    Write-ValidationResult
}

$contractPath = Join-Path -Path $repositoryRoot -ChildPath ($contractRelativePath -replace '/', '\')
if (-not (Test-Path -LiteralPath $contractPath -PathType Leaf)) {
    Add-ValidationError -Path $contractRelativePath -Reason 'missing contract file'
    Write-ValidationResult
}

$contract = $null
try {
    $contract = Get-Content -Raw -LiteralPath $contractPath -Encoding UTF8 | ConvertFrom-Json -Depth 50
}
catch {
    Add-ValidationError -Path $contractRelativePath -Reason "invalid contract JSON: $($_.Exception.Message)"
    Write-ValidationResult
}

$packageRoot = Split-Path -Parent $contractPath
$master = Get-PropertyValue -Object $contract -Name 'master'
Assert-ContractInteger -Value (Get-PropertyValue -Object $contract -Name 'schema_version') -Expected 1 -Path "$contractRelativePath.schema_version"
Assert-ContractValue -Actual (Get-PropertyValue -Object $contract -Name 'package_id') -Expected 'VID_MR_SEA_ABOVE_FILE_001_FIRST_FRAMES_V1' -Path "$contractRelativePath.package_id"
Assert-ContractValue -Actual (Get-PropertyValue -Object $contract -Name 'status') -Expected 'candidate_awaiting_user_approval' -Path "$contractRelativePath.status"
Assert-ContractInteger -Value (Get-PropertyValue -Object $master -Name 'width') -Expected 2160 -Path "$contractRelativePath.master.width"
Assert-ContractInteger -Value (Get-PropertyValue -Object $master -Name 'height') -Expected 3840 -Path "$contractRelativePath.master.height"
Assert-ContractValue -Actual (Get-PropertyValue -Object $master -Name 'format') -Expected 'png' -Path "$contractRelativePath.master.format"
Assert-ContractInteger -Value (Get-PropertyValue -Object $master -Name 'channels') -Expected 3 -Path "$contractRelativePath.master.channels"
Assert-ContractValue -Actual (Get-PropertyValue -Object $master -Name 'colour_space') -Expected 'srgb' -Path "$contractRelativePath.master.colour_space"

$selectedCharacter = Get-PropertyValue -Object $contract -Name 'selected_character'
if ($null -eq $selectedCharacter) {
    Add-ValidationError -Path "$contractRelativePath.selected_character" -Reason 'missing selected character declaration'
}
else {
    Assert-ContractValue -Actual (Get-PropertyValue -Object $selectedCharacter -Name 'id') -Expected 'B' -Path "$contractRelativePath.selected_character.id"
    Validate-HashedInput -Entry $selectedCharacter -Label "$contractRelativePath.selected_character"
}

foreach ($collection in @(
    [pscustomobject]@{ Name = 'product_truth'; ExpectedCount = 3 },
    [pscustomobject]@{ Name = 'approved_world'; ExpectedCount = 6 }
)) {
    $collectionPath = "$contractRelativePath.$($collection.Name)"
    $entriesValue = Get-PropertyValue -Object $contract -Name $collection.Name
    if ($null -eq $entriesValue -or $entriesValue -is [string] -or $entriesValue -isnot [System.Collections.IEnumerable]) {
        Add-ValidationError -Path $collectionPath -Reason 'missing or invalid input declaration array'
        continue
    }

    $entries = @($entriesValue)
    if ($entries.Count -ne $collection.ExpectedCount) {
        Add-ValidationError -Path $collectionPath -Reason "expected $($collection.ExpectedCount) entries, got $($entries.Count)"
    }

    for ($index = 0; $index -lt $entries.Count; $index++) {
        Validate-HashedInput -Entry $entries[$index] -Label "$collectionPath[$index]"
    }
}

$versionDirectory = Get-PropertyValue -Object $contract -Name 'version_directory'
Assert-ContractValue -Actual $versionDirectory -Expected 'v1' -Path "$contractRelativePath.version_directory"
$shotsValue = Get-PropertyValue -Object $contract -Name 'shots'
$shotIds = @()
if ($null -eq $shotsValue -or $shotsValue -is [string] -or $shotsValue -isnot [System.Collections.IEnumerable]) {
    Add-ValidationError -Path "$contractRelativePath.shots" -Reason 'missing or invalid shot array'
}
else {
    $shotIds = @($shotsValue)
    $expectedShotIds = @('S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08', 'S09')
    if ($shotIds.Count -ne $expectedShotIds.Count -or (($shotIds -join ',') -cne ($expectedShotIds -join ','))) {
        Add-ValidationError -Path "$contractRelativePath.shots" -Reason "expected ordered shots $($expectedShotIds -join ', '), got $($shotIds -join ', ')"
    }
    foreach ($shotId in $shotIds) {
        if (-not (Test-NonEmptyString -Value $shotId)) {
            Add-ValidationError -Path "$contractRelativePath.shots" -Reason 'shot IDs must be non-empty strings'
        }
    }
}

$continuityValue = Get-PropertyValue -Object $contract -Name 'continuity_assets'
$continuityAssets = @()
if ($null -eq $continuityValue -or $continuityValue -is [string] -or $continuityValue -isnot [System.Collections.IEnumerable]) {
    Add-ValidationError -Path "$contractRelativePath.continuity_assets" -Reason 'missing or invalid continuity asset array'
}
else {
    $continuityAssets = @($continuityValue)
    if ($continuityAssets.Count -eq 0) {
        Add-ValidationError -Path "$contractRelativePath.continuity_assets" -Reason 'continuity asset array must not be empty'
    }
}

$overviewValue = Get-PropertyValue -Object $contract -Name 'overview'
if (-not (Test-NonEmptyString -Value $overviewValue)) {
    Add-ValidationError -Path "$contractRelativePath.overview" -Reason 'missing or empty overview path'
}

$reportsValue = Get-PropertyValue -Object $contract -Name 'reports'
$reportPaths = @()
if ($null -eq $reportsValue -or $reportsValue -is [string] -or $reportsValue -isnot [System.Collections.IEnumerable]) {
    Add-ValidationError -Path "$contractRelativePath.reports" -Reason 'missing or invalid report array'
}
else {
    $reportPaths = @($reportsValue)
    foreach ($reportPathValue in $reportPaths) {
        if (-not (Test-NonEmptyString -Value $reportPathValue)) {
            Add-ValidationError -Path "$contractRelativePath.reports" -Reason 'report paths must be non-empty strings'
            continue
        }

        $resolvedReportPath = Resolve-PackagePath -RelativePath ([string]$reportPathValue) -Label ([string]$reportPathValue)
        if ($null -eq $resolvedReportPath) {
            continue
        }

        if (-not (Test-Path -LiteralPath $resolvedReportPath -PathType Leaf)) {
            Add-ValidationError -Path ([string]$reportPathValue) -Reason 'missing report file'
        }
    }
}

$forbiddenValue = Get-PropertyValue -Object $contract -Name 'forbidden_positive_input_prefixes'
$forbiddenPrefixes = @()
if ($null -eq $forbiddenValue -or $forbiddenValue -is [string] -or $forbiddenValue -isnot [System.Collections.IEnumerable]) {
    Add-ValidationError -Path "$contractRelativePath.forbidden_positive_input_prefixes" -Reason 'missing or invalid forbidden-prefix array'
}
else {
    $forbiddenPrefixes = @($forbiddenValue)
    $expectedForbiddenPrefixes = @('first-frames/', '05-characters/CHAR_MR_TIDE_', '03-scene-kits/ENV_MR_SEA_ABOVE_OLD_CITY_001', '08-fx/FX_MR_')
    if ($forbiddenPrefixes.Count -ne $expectedForbiddenPrefixes.Count -or (($forbiddenPrefixes -join '|') -cne ($expectedForbiddenPrefixes -join '|'))) {
        Add-ValidationError -Path "$contractRelativePath.forbidden_positive_input_prefixes" -Reason "expected exact forbidden prefixes $($expectedForbiddenPrefixes -join ', ')"
    }
}

$masterWidth = Get-PropertyValue -Object $master -Name 'width'
$masterHeight = Get-PropertyValue -Object $master -Name 'height'
$masterChannels = Get-PropertyValue -Object $master -Name 'channels'
$masterFormat = Get-PropertyValue -Object $master -Name 'format'
$masterColourSpace = Get-PropertyValue -Object $master -Name 'colour_space'

if ((Test-PositiveInteger -Value $masterWidth) -and (Test-PositiveInteger -Value $masterHeight) -and
    (Test-PositiveInteger -Value $masterChannels) -and (Test-NonEmptyString -Value $masterFormat) -and
    (Test-NonEmptyString -Value $masterColourSpace)) {
    $versionDirectoryText = [string]$versionDirectory
    foreach ($shotId in $shotIds) {
        if (-not (Test-NonEmptyString -Value $shotId)) {
            continue
        }

        $relativePath = "$versionDirectoryText/$shotId.png"
        $fullPath = Resolve-PackagePath -RelativePath $relativePath -Label $relativePath
        Validate-Image -RelativePath $relativePath -FullPath $fullPath -ExpectedWidth ([long]$masterWidth) -ExpectedHeight ([long]$masterHeight) -ExpectedChannels ([long]$masterChannels) -ExpectedFormat ([string]$masterFormat) -ExpectedColourSpace ([string]$masterColourSpace)
    }

    foreach ($continuityValueItem in $continuityAssets) {
        if (-not (Test-NonEmptyString -Value $continuityValueItem)) {
            Add-ValidationError -Path "$contractRelativePath.continuity_assets" -Reason 'continuity asset paths must be non-empty strings'
            continue
        }

        $continuityRelativePath = ([string]$continuityValueItem).Replace('\', '/')
        $continuityFullPath = Resolve-PackagePath -RelativePath $continuityRelativePath -Label $continuityRelativePath
        Validate-Image -RelativePath $continuityRelativePath -FullPath $continuityFullPath -ExpectedWidth ([long]$masterWidth) -ExpectedHeight ([long]$masterHeight) -ExpectedChannels ([long]$masterChannels) -ExpectedFormat ([string]$masterFormat) -ExpectedColourSpace ([string]$masterColourSpace)
    }

    if (Test-NonEmptyString -Value $overviewValue) {
        $overviewRelativePath = ([string]$overviewValue).Replace('\', '/')
        $overviewFullPath = Resolve-PackagePath -RelativePath $overviewRelativePath -Label $overviewRelativePath
        Validate-Image -RelativePath $overviewRelativePath -FullPath $overviewFullPath -ExpectedWidth 1 -ExpectedHeight 1 -ExpectedChannels ([long]$masterChannels) -ExpectedFormat ([string]$masterFormat) -ExpectedColourSpace ([string]$masterColourSpace) -RequireDimensions:$false
    }
}

$generationReportValue = $reportPaths | Where-Object { [string]$_ -ieq 'v1/reports/generation.md' } | Select-Object -First 1
if (Test-NonEmptyString -Value $generationReportValue) {
    $generationReportPath = Resolve-PackagePath -RelativePath ([string]$generationReportValue) -Label ([string]$generationReportValue)
    if ($null -ne $generationReportPath -and (Test-Path -LiteralPath $generationReportPath -PathType Leaf)) {
        $generationText = $null
        try {
            $generationText = Get-Content -Raw -LiteralPath $generationReportPath -Encoding UTF8
        }
        catch {
            Add-ValidationError -Path ([string]$generationReportValue) -Reason "cannot read report: $($_.Exception.Message)"
        }

        if ($null -ne $generationText) {
            $sections = Get-MarkdownSections -Text ([string]$generationText)
            foreach ($shotId in $shotIds) {
                if (-not (Test-NonEmptyString -Value $shotId)) {
                    continue
                }

                $sectionPath = "v1/reports/generation.md#$shotId"
                if (-not $sections.Contains([string]$shotId)) {
                    Add-ValidationError -Path $sectionPath -Reason 'missing shot section in generation.md'
                    continue
                }

                $sectionText = [string]$sections[[string]$shotId]
                if (-not (Test-ReportShaField -Section $sectionText)) {
                    Add-ValidationError -Path $sectionPath -Reason 'missing SHA-256 field'
                }
                if (-not (Test-ReportReferenceRoleField -Section $sectionText)) {
                    Add-ValidationError -Path $sectionPath -Reason 'missing reference-role field'
                }

            }

            $forbiddenHits = Find-ForbiddenPositivePrefix -Text ([string]$generationText) -Prefixes $forbiddenPrefixes
            foreach ($forbiddenHit in $forbiddenHits) {
                Add-ValidationError -Path ([string]$generationReportValue) -Reason "forbidden positive-input path at generation.md line $($forbiddenHit.Line): $($forbiddenHit.Path) (prefix $($forbiddenHit.Prefix))"
            }
        }
    }
}

Write-ValidationResult
