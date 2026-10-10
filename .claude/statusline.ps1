# Claude Code status line: model, session token usage, estimated cost.
$ErrorActionPreference = 'SilentlyContinue'
$data = [Console]::In.ReadToEnd() | ConvertFrom-Json
$root = Split-Path -Parent $PSScriptRoot
$usage = & (Join-Path $root 'scripts\session-usage.ps1') -TranscriptPath $data.transcript_path -Compact
$model = $data.model.display_name
$cost = '{0:0.00}' -f [double]$data.cost.total_cost_usd
# Save Claude Code's cost estimate so scripts/session-usage.ps1 -Json can report it.
if ($data.session_id) {
    $dir = Join-Path $env:TEMP 'claude-session-cost'
    New-Item -ItemType Directory -Force $dir | Out-Null
    Set-Content (Join-Path $dir "$($data.session_id).txt") ([string][double]$data.cost.total_cost_usd)
}
Write-Output "$model | $usage | ~`$$cost"
