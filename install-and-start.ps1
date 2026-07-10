<#
Installs Node.js LTS using winget (if available) and starts the backend.
Run this in an elevated PowerShell (Run as Administrator).

Usage (Admin PowerShell from repo root):
  .\install-and-start.ps1
#>

param()

function Abort($msg) { Write-Host "ERROR: $msg" -ForegroundColor Red; exit 1 }

Write-Host "Checking for winget..." -ForegroundColor Cyan
$winget = Get-Command winget -ErrorAction SilentlyContinue
if ($winget) {
  Write-Host "winget found. Installing Node.js LTS..." -ForegroundColor Green
  try {
    winget install --id OpenJS.NodeJS.LTS -e --silent --accept-source-agreements --accept-package-agreements
  } catch {
    Write-Host "winget install failed or requires interaction. Error: $_" -ForegroundColor Yellow
  }
} else {
  Write-Host "winget not found. Please install Node.js manually from https://nodejs.org and re-run this script." -ForegroundColor Yellow
}

# Ensure node is on PATH for this session
$nodePath = 'C:\Program Files\nodejs'
if (Test-Path $nodePath) {
  if (-not ($env:Path -split ';' | Where-Object { $_ -eq $nodePath })) {
    $env:Path += ";$nodePath"
  }
}

Write-Host "Verifying Node and npm..." -ForegroundColor Cyan
try {
  $nv = node -v 2>$null
  $nv = $nv.Trim()
  $npmv = npm -v 2>$null
  $npmv = $npmv.Trim()
  Write-Host "Node: $nv" -ForegroundColor Green
  Write-Host "npm:  $npmv" -ForegroundColor Green
} catch {
  Write-Host "Node or npm still not found. If you just installed Node, close and reopen PowerShell and run this script again." -ForegroundColor Yellow
  Exit 1
}

Write-Host "Starting backend helper..." -ForegroundColor Cyan
.
\"$PSScriptRoot\"\start-backend.ps1
