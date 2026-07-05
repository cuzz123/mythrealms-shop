# =============================================================
# MythRealms Video Pipeline — FFmpeg composer
# Usage: .\compose.ps1 [-Output "output/video.mp4"] [-Duration 15] [-FPS 30]
# =============================================================

param(
    [string]$Output = "output/mythrealms_video.mp4",
    [int]$Duration = 15,
    [int]$FPS = 30,
    [string]$AudioFile = "",         # optional audio track
    [string]$Ext = "png"             # image format: png, jpg, webp
)

$ErrorActionPreference = "Stop"
$FFMPEG = "ffmpeg"
$FFPROBE = "ffprobe"

# --- Configuration ---
$WIDTH  = 1080
$HEIGHT = 1920
$RESOLUTION = "${WIDTH}x${HEIGHT}"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " MythRealms Video Pipeline"            -ForegroundColor Cyan
Write-Host " Output: $Output"                       -ForegroundColor Cyan
Write-Host " Duration: ${Duration}s @ ${FPS}fps"     -ForegroundColor Cyan
Write-Host " Resolution: $RESOLUTION"               -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# --- Discover frames ---
$frameFiles = Get-ChildItem "frames/frame-*.$Ext" | Sort-Object Name
if ($frameFiles.Count -eq 0) {
    Write-Host "ERROR: No frames found in frames/ directory." -ForegroundColor Red
    Write-Host "Place your images as: frame-01.$Ext, frame-02.$Ext, etc." -ForegroundColor Yellow
    exit 1
}

Write-Host "`nFound $($frameFiles.Count) frames:" -ForegroundColor Green
$frameFiles | ForEach-Object { Write-Host "  $_" }

# --- Calculate timing ---
$totalFrames = $Duration * $FPS
$crossfadeFrames = $FPS * 0.5  # 0.5 second crossfade
$frameCount = $frameFiles.Count

if ($frameCount -lt 2) {
    Write-Host "ERROR: Need at least 2 frames." -ForegroundColor Red
    exit 1
}

# Each frame gets equal time minus crossfade
$framesPerClip = [Math]::Floor($totalFrames / $frameCount)
$clipDuration = $framesPerClip / $FPS

Write-Host "`nTiming: $clipDuration seconds per frame (${framesPerClip} frames)" -ForegroundColor Green
Write-Host "Crossfade: 0.5 seconds" -ForegroundColor Green

# --- Generate individual video clips with Ken Burns ---
Write-Host "`n--- Generating clips with Ken Burns effect ---" -ForegroundColor Yellow

$clipFiles = @()
$tempDir = "temp_clips"
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null

for ($i = 0; $i -lt $frameCount; $i++) {
    $clipFile = "$tempDir/clip_$($i.ToString('00')).mp4"
    $clipFiles += $clipFile
    $inFile = $frameFiles[$i].FullName

    # Varied Ken Burns: alternating zoom-in / zoom-out / pan
    switch ($i % 4) {
        0 { $zoomFilter = "zoompan=z='min(zoom+0.0005,1.12)':d=$($framesPerClip+$crossfadeFrames):s=${WIDTH}x${HEIGHT}:fps=$FPS,xfade=transition=fade:duration=0.5:offset=$($framesPerClip-$crossfadeFrames)" }
        1 { $zoomFilter = "zoompan=z='min(max(zoom-0.0005,0.92),1.0)':d=$($framesPerClip+$crossfadeFrames):s=${WIDTH}x${HEIGHT}:fps=$FPS,xfade=transition=fade:duration=0.5:offset=$($framesPerClip-$crossfadeFrames)" }
        2 { $zoomFilter = "zoompan=z='1.04':d=$($framesPerClip+$crossfadeFrames):x='iw/2+10*sin(on/100)':s=${WIDTH}x${HEIGHT}:fps=$FPS,xfade=transition=fade:duration=0.5:offset=$($framesPerClip-$crossfadeFrames)" }
        3 { $zoomFilter = "zoompan=z='min(zoom+0.0003,1.10)':d=$($framesPerClip+$crossfadeFrames):s=${WIDTH}x${HEIGHT}:fps=$FPS,xfade=transition=fade:duration=0.5:offset=$($framesPerClip-$crossfadeFrames)" }
    }

    Write-Host "  Clip $($i+1)/${frameCount}: $inFile"
    $cmd = @(
        "-y", "-loop", "1", "-i", "`"$inFile`"",
        "-t", "$clipDuration",
        "-vf", "scale=${WIDTH}:${HEIGHT}:force_original_aspect_ratio=decrease,pad=${WIDTH}:${HEIGHT}:(ow-iw)/2:(oh-ih)/2:black,$zoomFilter",
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "fast",
        "`"$clipFile`""
    )
    $cmdStr = "$FFMPEG $cmd 2>&1 | Select-Object -Last 1"
    Invoke-Expression $cmdStr
}
Write-Host "  All clips generated." -ForegroundColor Green

# --- Concatenate with crossfade ---
Write-Host "`n--- Compositing with crossfade transitions ---" -ForegroundColor Yellow

$filterComplex = ""
$inputs = ""
for ($i = 0; $i -lt $frameCount; $i++) {
    $inputs += "-i `"$($clipFiles[$i])`" "
}

# Build filter complex for sequential crossfade
# First stream is [0:v], then [v1], [v2], etc.
$filterComplex = ""
for ($i = 1; $i -lt $frameCount; $i++) {
    $prevLabel = if ($i -eq 1) { "[0:v]" } else { "[v$($i-1)]" }
    $filterComplex += "${prevLabel}[$($i):v]xfade=transition=fade:duration=0.5:offset=$($clipDuration-0.5)[v${i}]"
    if ($i -lt ($frameCount - 1)) { $filterComplex += ";" }
}

# === Add audio if provided ===
$audioArgs = ""
if ($AudioFile -ne "" -and (Test-Path $AudioFile)) {
    Write-Host "Adding audio: $AudioFile" -ForegroundColor Green
    $inputs += "-i `"$AudioFile`" -shortest"
    $outLabel = if ($frameCount -eq 1) { "[0:v]" } else { "[v$($frameCount-1)]" }
    $filterComplex += ";${outLabel}[2:a]concat=n=1:v=1:a=1[vout][aout]"
    $mapArgs = "-map `"[vout]`" -map `"[aout]`""
} else {
    Write-Host "No audio track provided. Generating silent video." -ForegroundColor Yellow
    $outLabel = if ($frameCount -eq 1) { "[0:v]" } else { "[v$($frameCount-1)]" }
    $mapArgs = "-map `"[${outLabel}]`""
}

$compositeCmd = "$FFMPEG $inputs -filter_complex `"$filterComplex`" $mapArgs -c:v libx264 -preset medium -pix_fmt yuv420p -movflags +faststart `"$Output`" -y"
Write-Host "  Running composition..."
Invoke-Expression $compositeCmd

# --- Cleanup ---
Write-Host "`n--- Cleanup ---" -ForegroundColor Yellow
Remove-Item -Recurse -Force $tempDir -ErrorAction SilentlyContinue

# --- Done ---
$outputFile = Get-Item $Output
$sizeMB = [Math]::Round($outputFile.Length / 1MB, 1)
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " VIDEO COMPLETE" -ForegroundColor Green
Write-Host " File: $($outputFile.FullName)" -ForegroundColor Green
Write-Host " Size: ${sizeMB}MB | ${Duration}s | ${WIDTH}x${HEIGHT}" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
