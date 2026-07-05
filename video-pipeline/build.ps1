# =============================================================
# MythRealms Video Builder v3 — reliable FFmpeg pipeline
# =============================================================
$ErrorActionPreference = "Continue"
$FFMPEG = "ffmpeg"
$W = 1080; $H = 1920; $FPS = 30; $DUR = 15;
$OUTPUT = "output/mythrealms_video.mp4"

cd "$PSScriptRoot"

$frames = Get-ChildItem "frames/frame-??.png" | Sort-Object Name
if ($frames.Count -lt 2) { Write-Host "Need >= 2 frames!" -ForegroundColor Red; exit 1 }

$N = $frames.Count
$clipSecs = $DUR / $N
$fadeSecs = 0.5
$totalPerClip = [Math]::Floor($clipSecs * $FPS) + [Math]::Floor($fadeSecs * $FPS)

Write-Host "MythRealms Video Builder v3" -ForegroundColor Cyan
Write-Host "  Frames: $N, ${clipSecs}s each, fade: ${fadeSecs}s" -ForegroundColor Green

# Clean and create dirs
Remove-Item -Recurse -Force "temp" -ErrorAction SilentlyContinue
New-Item -Force -ItemType Directory "temp" | Out-Null
New-Item -Force -ItemType Directory "output" | Out-Null

# Step 1: Generate clips
Write-Host "`nGenerating $N clips..." -ForegroundColor Yellow
$clipPaths = @()

for ($i = 0; $i -lt $N; $i++) {
    $out = "temp/clip_$($i.ToString('00')).mp4"
    $img = $frames[$i].FullName

    if ($i % 3 -eq 0)      { $zoom = "zoompan=z='min(zoom+0.0005,1.12)':d=$totalPerClip:s=${W}x${H}:fps=$FPS" }
    elseif ($i % 3 -eq 1)  { $zoom = "zoompan=z='min(max(zoom-0.0005,0.90),1.0)':d=$totalPerClip:s=${W}x${H}:fps=$FPS" }
    else                    { $zoom = "zoompan=z='1.06':x='iw/2+15*sin(on/120)':d=$totalPerClip:s=${W}x${H}:fps=$FPS" }

    if ($i -eq 0) { $fade = ",fade=t=in:st=0:d=$fadeSecs" }
    elseif ($i -eq ($N - 1)) { $fade = ",fade=t=out:st=$($clipSecs-$fadeSecs):d=$fadeSecs" }
    else { $fade = "" }

    $vf = "scale=${W}:${H}:force_original_aspect_ratio=decrease,pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2:black,$zoom$fade,format=yuv420p"

    Write-Host "  Clip $($i+1)/$N" -NoNewline
    $result = & $FFMPEG -y -loop 1 -i "$img" -t $clipSecs -vf $vf -c:v libx264 -preset fast -pix_fmt yuv420p "$out" 2>&1
    if (Test-Path "$out") { Write-Host " OK" -ForegroundColor Green; $clipPaths += $out }
    else { Write-Host " FAILED" -ForegroundColor Red; Write-Host $result; exit 1 }
}

# Step 2: Concat
Write-Host "`nConcatenating..." -ForegroundColor Yellow
$concatContent = ($clipPaths | ForEach-Object { "file '$_'" }) -join "`n"
$concatContent | Out-File -FilePath "temp/concat.txt" -Encoding ascii -Force
$result = & $FFMPEG -y -f concat -safe 0 -i "temp/concat.txt" -c copy "$OUTPUT" 2>&1

if (-not (Test-Path $OUTPUT)) { Write-Host "Concat failed!" -ForegroundColor Red; Write-Host $result; exit 1 }
Write-Host "  Concatenated OK" -ForegroundColor Green

# Step 3: Text
Write-Host "`nAdding text..." -ForegroundColor Yellow
$titled = "output/mythrealms_video_titled.mp4"

$text1 = "drawtext=text='Not Jewelry.':fontsize=72:fontcolor=0xD4A84B@0.8:fontfile='C\\:/Windows/Fonts/georgia.ttf':x=(w-text_w)/2:y=(h-text_h)/2-50:enable='between(t,0.5,5)':alpha='if(lt(t,1),t-0.5,if(lt(t,4.5),1,5-t))'"
$text2 = "drawtext=text='Relics from forgotten domains.':fontsize=30:fontcolor=0x8A7D6E@0.7:fontfile='C\\:/Windows/Fonts/georgia.ttf':x=(w-text_w)/2:y=(h-text_h)/2+30:enable='between(t,1,4.5)':alpha='if(lt(t,1.5),t-1,if(lt(t,4),1,4.5-t))'"
$text3 = "drawtext=text='MythRealms':fontsize=56:fontcolor=0xD4A84B@0.9:fontfile='C\\:/Windows/Fonts/georgia.ttf':x=(w-text_w)/2:y=h-250:enable='between(t,10,14)':alpha='if(lt(t,10),0,if(lt(t,10.5),t-10,if(lt(t,13.5),1,14-t)))'"
$textFilter = "$text1,$text2,$text3"

$result = & $FFMPEG -y -i "$OUTPUT" -vf $textFilter -c:v libx264 -preset fast -pix_fmt yuv420p -movflags +faststart "$titled" 2>&1
if (Test-Path $titled) { Write-Host "  Text overlay OK" -ForegroundColor Green }
else { Write-Host "  Text step failed (ignoring)" -ForegroundColor Yellow }

# Step 4: Clean
Remove-Item -Recurse -Force "temp" -ErrorAction SilentlyContinue

# Done
$final = if (Test-Path $titled) { $titled } else { $OUTPUT }
$item = Get-Item $final
$mb = [Math]::Round($item.Length / 1MB, 2)
Write-Host "`nDONE! ${mb}MB | ${DUR}s | ${W}x${H}" -ForegroundColor Green
Write-Host "File: $final" -ForegroundColor Green
