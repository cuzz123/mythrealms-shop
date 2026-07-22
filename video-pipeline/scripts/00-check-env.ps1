param()

$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent

function Test-Command {
    param([string]$Name)
    $cmd = Get-Command $Name -ErrorAction SilentlyContinue
    if ($cmd) {
        Write-Host "[OK] $Name -> $($cmd.Source)" -ForegroundColor Green
        return $true
    }
    Write-Host "[MISSING] $Name" -ForegroundColor Red
    return $false
}

Write-Host "Checking video workflow environment..." -ForegroundColor Cyan
$ok = $true
$ok = (Test-Command "ffmpeg") -and $ok
$ok = (Test-Command "ffprobe") -and $ok
$ok = (Test-Command "python") -and $ok

if ($ok) {
    python --version
    @'
import importlib.util
required = ["cv2", "numpy", "PIL"]
optional = ["pyJianYingDraft"]
ok = True
for name in required:
    exists = importlib.util.find_spec(name) is not None
    print(("[OK] " if exists else "[MISSING] ") + name)
    ok = ok and exists
for name in optional:
    exists = importlib.util.find_spec(name) is not None
    print(("[OK] " if exists else "[OPTIONAL MISSING] ") + name)
raise SystemExit(0 if ok else 1)
'@ | python -
    if ($LASTEXITCODE -ne 0) { $ok = $false }
}

$jianyingPaths = @(
    "$env:LOCALAPPDATA\JianyingPro",
    "$env:LOCALAPPDATA\CapCut",
    "$env:APPDATA\JianyingPro",
    "$env:USERPROFILE\Documents\JianyingPro Drafts"
)
$foundJianying = $false
foreach ($path in $jianyingPaths) {
    if (Test-Path $path) {
        Write-Host "[OK] Jianying/CapCut path -> $path" -ForegroundColor Green
        $foundJianying = $true
    }
}
if (-not $foundJianying) {
    Write-Host "[WARN] Jianying/CapCut was not found in common locations." -ForegroundColor Yellow
}

if (-not $ok) {
    Write-Host "Install dependencies with: python -m pip install -r `"$Root\requirements.txt`"" -ForegroundColor Yellow
    exit 1
}

Write-Host "Environment is ready." -ForegroundColor Green
