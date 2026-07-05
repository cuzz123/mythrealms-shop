# =============================================================
# MythRealms Text Overlay — add cinematic titles to video
# Usage: .\add-text.ps1 -Input "output/mythrealms_video.mp4"
# =============================================================
param(
    [Parameter(Mandatory=$true)]
    [string]$Input,
    [string]$Output = "",
    [string]$Title1 = "Not Jewelry.",
    [string]$Title2 = "Relics from forgotten domains.",
    [string]$CTA = "MythRealms"
)

if ($Output -eq "") {
    $Output = $Input -replace '\.mp4$', '_titled.mp4'
}

$FFMPEG = "ffmpeg"

$filter = @"
drawtext=text='$Title1':fontsize=72:fontcolor=0xD4A84B:fontfile='C\:/Windows/Fonts/georgia.ttf':x=(w-text_w)/2:y=(h-text_h)/2-60:enable='between(t,0.5,5)':alpha='if(lt(t,1),t-0.5,if(lt(t,4.5),1,5-t))',
drawtext=text='$Title2':fontsize=32:fontcolor=0x8A7D6E:fontfile='C\:/Windows/Fonts/georgia.ttf':x=(w-text_w)/2:y=(h-text_h)/2+20:enable='between(t,1,4.5)':alpha='if(lt(t,1.5),t-1,if(lt(t,4),1,4.5-t))',
drawtext=text='$CTA':fontsize=48:fontcolor=0xD4A84B:fontfile='C\:/Windows/Fonts/georgia.ttf':x=(w-text_w)/2:y=h-200:enable='between(t,10,15)':alpha='if(lt(t,10),0,if(lt(t,10.5),t-10,if(lt(t,14.5),1,15-t)))'
"@

$cmd = "$FFMPEG -i `"$Input`" -vf `"$filter`" -codec:a copy `"$Output`" -y"
Write-Host "Adding cinematic text overlay..." -ForegroundColor Cyan
Invoke-Expression $cmd

Write-Host "Done: $Output" -ForegroundColor Green
