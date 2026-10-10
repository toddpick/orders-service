# Prints the token usage of the current AI coding session in this repo.
# Reads the session files Claude Code and Codex already keep locally; nothing
# is estimated.
#
# Usage:
#   powershell -NoProfile -ExecutionPolicy Bypass -File scripts/session-usage.ps1              # Claude Code
#   powershell -NoProfile -ExecutionPolicy Bypass -File scripts/session-usage.ps1 -Tool codex  # Codex
# Add -Json to print the totals as JSON (the shape a session's `done` usage takes).
param(
    [ValidateSet('claude', 'codex')] [string] $Tool = 'claude',
    [string] $TranscriptPath,
    [switch] $Compact,
    [switch] $Json
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$repo = Split-Path -Leaf $root

# Session files are still open in the tool that writes them, so read with full sharing.
function Read-SharedLines([string] $path) {
    $stream = [IO.FileStream]::new($path, [IO.FileMode]::Open, [IO.FileAccess]::Read,
        [IO.FileShare]::ReadWrite -bor [IO.FileShare]::Delete)
    $reader = [IO.StreamReader]::new($stream)
    try { while ($null -ne ($line = $reader.ReadLine())) { $line } } finally { $reader.Dispose() }
}

function Format-Count([double] $n) {
    if ($n -ge 1000000) { return ('{0:0.00}M' -f ($n / 1000000)) }
    if ($n -ge 1000) { return ('{0:0.0}k' -f ($n / 1000)) }
    return ('{0:0}' -f $n)
}

function Get-ClaudeUsage([string] $path) {
    if (-not $path) {
        $dir = Get-ChildItem (Join-Path $HOME '.claude\projects') -Directory -Filter "*-$repo" -ErrorAction SilentlyContinue |
            Select-Object -First 1
        if (-not $dir) { return $null }
        $latest = Get-ChildItem $dir.FullName -Filter '*.jsonl' -File | Sort-Object LastWriteTime -Descending | Select-Object -First 1
        if (-not $latest) { return $null }
        $path = $latest.FullName
    }
    if (-not (Test-Path $path)) { return $null }

    # The main transcript plus any subagent transcripts for the same session.
    $files = @($path)
    $sessionDir = Join-Path (Split-Path -Parent $path) ([IO.Path]::GetFileNameWithoutExtension($path))
    $subagents = Join-Path $sessionDir 'subagents'
    if (Test-Path $subagents) { $files += (Get-ChildItem $subagents -Filter '*.jsonl' -File).FullName }

    # One API response is written as several lines sharing a message id, so keep one usage per id.
    $byId = @{}
    foreach ($file in $files) {
        foreach ($line in (Read-SharedLines $file)) {
            if ($line -notlike '*"usage"*') { continue }
            try { $entry = $line | ConvertFrom-Json } catch { continue }
            $msg = $entry.message
            if (-not $msg -or -not $msg.usage -or -not $msg.id) { continue }
            $prev = $byId[$msg.id]
            if (-not $prev -or $msg.usage.output_tokens -ge $prev.output_tokens) { $byId[$msg.id] = $msg.usage }
        }
    }

    $u = [ordered]@{ input = 0.0; cacheWrite = 0.0; cacheRead = 0.0; output = 0.0; responses = $byId.Count }
    foreach ($usage in $byId.Values) {
        $u.input += [double]$usage.input_tokens
        $u.cacheWrite += [double]$usage.cache_creation_input_tokens
        $u.cacheRead += [double]$usage.cache_read_input_tokens
        $u.output += [double]$usage.output_tokens
    }
    $u.total = $u.input + $u.cacheWrite + $u.cacheRead + $u.output
    $u.sessionId = [IO.Path]::GetFileNameWithoutExtension($path)
    return $u
}

function Get-CodexUsage {
    $sessions = Join-Path $HOME '.codex\sessions'
    if (-not (Test-Path $sessions)) { return $null }
    # Newest Codex session whose working folder is this repo.
    $candidates = Get-ChildItem $sessions -Recurse -Filter 'rollout-*.jsonl' -File |
        Sort-Object LastWriteTime -Descending | Select-Object -First 20
    foreach ($file in $candidates) {
        $first = Read-SharedLines $file.FullName | Select-Object -First 1
        if ($first -notlike "*$repo*") { continue }
        $last = $null
        foreach ($line in (Read-SharedLines $file.FullName)) {
            if ($line -like '*"total_token_usage"*') { $last = $line }
        }
        if (-not $last) { return $null }
        $t = ($last | ConvertFrom-Json).payload.info.total_token_usage
        return [ordered]@{
            input = [double]$t.input_tokens; cached = [double]$t.cached_input_tokens
            output = [double]$t.output_tokens; reasoning = [double]$t.reasoning_output_tokens
            total = [double]$t.total_tokens
        }
    }
    return $null
}

if ($Tool -eq 'codex') {
    $u = Get-CodexUsage
    if (-not $u) { Write-Output 'Codex session usage: not found'; exit 0 }
    if ($Json) {
        [ordered]@{ tool = 'Codex'; input_tokens = [long]($u.input - $u.cached); output_tokens = [long]$u.output; cached_tokens = [long]$u.cached } |
            ConvertTo-Json -Compress
        exit 0
    }
    Write-Output ('Codex session usage: {0} new input + {1} output tokens (plus {2} re-read from cache; output includes {3} reasoning)' -f
        (Format-Count ($u.input - $u.cached)), (Format-Count $u.output), (Format-Count $u.cached), (Format-Count $u.reasoning))
    exit 0
}

$u = Get-ClaudeUsage $TranscriptPath
if (-not $u) { Write-Output 'Claude Code session usage: not found'; exit 0 }
if ($Json) {
    $out = [ordered]@{ tool = 'Claude Code'; input_tokens = [long]($u.input + $u.cacheWrite); output_tokens = [long]$u.output; cached_tokens = [long]$u.cacheRead }
    # Claude Code's own cost estimate, saved by the status line for this session.
    $costFile = Join-Path $env:TEMP "claude-session-cost\$($u.sessionId).txt"
    if (Test-Path $costFile) { $out.cost_usd = [math]::Round([double](Get-Content $costFile -TotalCount 1), 4) }
    $out | ConvertTo-Json -Compress
    exit 0
}
if ($Compact) {
    Write-Output ('in {0} / out {1} tokens (+{2} cached)' -f (Format-Count ($u.input + $u.cacheWrite)), (Format-Count $u.output), (Format-Count $u.cacheRead))
} else {
    Write-Output ('Claude Code session usage: {0} new input + {1} output tokens over {2} responses (plus {3} re-read from cache)' -f
        (Format-Count ($u.input + $u.cacheWrite)), (Format-Count $u.output), $u.responses, (Format-Count $u.cacheRead))
}
