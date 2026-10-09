# Resets this repo to the starting baseline and clears Claude Code's saved
# memory and conversation history for this folder.
# Close Claude Code in this folder before running.
# Usage: powershell -ExecutionPolicy Bypass -File scripts\reset.ps1

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$repo = Split-Path -Leaf $root

Push-Location $root
try {
    git fetch --tags --force --quiet
    git reset --hard demo-start
    git clean -fd
} finally {
    Pop-Location
}

$projects = Join-Path $HOME '.claude\projects'
if (Test-Path $projects) {
    Get-ChildItem $projects -Directory -Filter "*-$repo" | ForEach-Object {
        Remove-Item $_.FullName -Recurse -Force
        Write-Host "Cleared Claude Code history: $($_.Name)"
    }
}

Write-Host "Reset $repo"
