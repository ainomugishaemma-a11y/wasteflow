<#
PowerShell helper to install dependencies and start the backend in dev mode.
Usage: Run this from the repo root:
  .\start-backend.ps1

This script checks for Node/npm, installs backend dependencies, and starts the dev server.
#>

param()

function Abort($msg) {
  Write-Host "ERROR: $msg" -ForegroundColor Red
  exit 1
}

# Check for node and npm
$node = Get-Command node -ErrorAction SilentlyContinue
$npm = Get-Command npm -ErrorAction SilentlyContinue
if (-not $node) { Abort "Node.js is not installed or not in PATH. Install from https://nodejs.org (LTS)." }
if (-not $npm) { Abort "npm is not installed or not in PATH. Ensure Node.js installation includes npm." }

$backendDir = Join-Path $PSScriptRoot 'backend'
if (-not (Test-Path $backendDir)) { Abort "Backend folder not found at $backendDir" }

Write-Host "Using Node: $(node -v)" -ForegroundColor Green
Write-Host "Using npm:  $(npm -v)" -ForegroundColor Green

Push-Location $backendDir
try {
  Write-Host "Installing backend dependencies (this may take a minute)..." -ForegroundColor Cyan
  npm install --no-audit --no-fund

  Write-Host "Starting backend in dev mode (ts-node)..." -ForegroundColor Cyan
  npm run dev
} finally {
  Pop-Location
}
