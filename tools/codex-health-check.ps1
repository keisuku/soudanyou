param(
    [string]$Root = (Get-Location).Path
)

$requiredFiles = @(
    "AGENTS.md",
    ".codex/config.toml",
    "PLAN.md",
    "ASSUMPTIONS.md",
    "CHANGELOG_LOCAL.md",
    "docs/codex/README.md",
    "docs/codex/OPERATING_SYSTEM.md",
    "docs/codex/PROMPT_LIBRARY.md",
    "docs/codex/MEMORY_ARCHITECTURE.md",
    "docs/codex/KPI_BENCHMARKS.md",
    ".codex/checklists/definition-of-done.md",
    "memory/prompts/registry.md",
    "package.json"
)

$requiredDirs = @(
    ".codex/prompts",
    ".codex/checklists",
    "docs/codex",
    "docs/specs",
    "docs/copy",
    "docs/kpi",
    "memory/canon",
    "memory/research",
    "memory/research/raw",
    "memory/metrics",
    "memory/prompts"
)

$missing = @()

foreach ($path in $requiredFiles) {
    $fullPath = Join-Path $Root $path
    if (Test-Path -LiteralPath $fullPath -PathType Leaf) {
        Write-Host "[OK] file $path"
    } else {
        Write-Host "[MISSING] file $path"
        $missing += $path
    }
}

foreach ($path in $requiredDirs) {
    $fullPath = Join-Path $Root $path
    if (Test-Path -LiteralPath $fullPath -PathType Container) {
        Write-Host "[OK] dir  $path"
    } else {
        Write-Host "[MISSING] dir  $path"
        $missing += $path
    }
}

if (Test-Path -LiteralPath (Join-Path $Root "package.json") -PathType Leaf) {
    $packageText = Get-Content -LiteralPath (Join-Path $Root "package.json") -Raw
    foreach ($script in @('"wines:build"', '"lint"', '"build"', '"dev"')) {
        if ($packageText.Contains($script)) {
            Write-Host "[OK] package script $script"
        } else {
            Write-Host "[WARN] package script $script not found"
        }
    }
}

if ($missing.Count -gt 0) {
    Write-Host ""
    Write-Host "Codex OS check failed. Missing $($missing.Count) item(s)."
    exit 1
}

Write-Host ""
Write-Host "Codex OS check passed."
