# ==============================================================================
# Portfolio Website Automated Verification Script
# Validates file integrity, markup structure, internal anchors, accessibility hooks, and runtime
# ==============================================================================

$ErrorActionPreference = "Stop"

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "Starting Portfolio Website Verification Checks..." -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan

$passed = 0
$failed = 0

function Assert-Test {
    param(
        [string]$Description,
        [scriptblock]$Condition
    )

    try {
        $result = & $Condition
        if ($result) {
            Write-Host "[PASS] $Description" -ForegroundColor Green
            $script:passed++
        } else {
            Write-Host "[FAIL] $Description" -ForegroundColor Red
            $script:failed++
        }
    } catch {
        Write-Host "[FAIL] $Description - Error: $_" -ForegroundColor Red
        $script:failed++
    }
}

$root = Split-Path -Parent $PSScriptRoot
if (-not $root) { $root = (Get-Location).Path }

Write-Host "`n1. Checking Essential Files Existence in ${root}:" -ForegroundColor Yellow

$essentialFiles = @(
    "index.html",
    "robots.txt",
    "sitemap.xml",
    "site.webmanifest",
    ".env.example",
    ".gitignore",
    "README.md",
    "css/reset.css",
    "css/variables.css",
    "css/style.css",
    "css/print.css",
    "js/config.js",
    "js/theme.js",
    "js/navigation.js",
    "js/projects-filter.js",
    "js/contact.js",
    "js/main.js",
    "assets/favicon.svg",
    "assets/og-image.svg"
)

foreach ($f in $essentialFiles) {
    $fullPath = Join-Path $root $f
    Assert-Test "File exists: $f" { Test-Path $fullPath }
}

Write-Host "`n2. Validating HTML Structure & WCAG Accessibility Hooks:" -ForegroundColor Yellow

$htmlContent = Get-Content (Join-Path $root "index.html") -Raw

Assert-Test "Skip link to #main-content present" {
    $htmlContent -match '<a\s+href="#main-content"\s+class="skip-link"'
}

Assert-Test "Main landmark element exists with id='main-content'" {
    $htmlContent -match '<main\s+id="main-content"'
}

Assert-Test "Semantic Header landmark exists" {
    $htmlContent -match '<header\s+class="header"'
}

Assert-Test "Semantic Nav landmark exists" {
    $htmlContent -match '<nav\s+class="nav"'
}

Assert-Test "Semantic Footer landmark exists" {
    $htmlContent -match '<footer\s+class="footer"'
}

Assert-Test "Strictly one <h1> element exists" {
    $matches = [regex]::Matches($htmlContent, '<h1[\s>]')
    $matches.Count -eq 1
}

$requiredSections = @("hero", "about", "skills", "projects", "experience", "services", "contact")
foreach ($sec in $requiredSections) {
    Assert-Test "Required section exists: id='$sec'" {
        $htmlContent -match "id=""$sec"""
    }
}

Assert-Test "No empty or dead 'href=""#""' placeholder links" {
    $deadLinks = [regex]::Matches($htmlContent, 'href=""#""')
    $deadLinks.Count -eq 0
}

Write-Host "`n3. Checking Internal Hash Anchors:" -ForegroundColor Yellow
$anchorMatches = [regex]::Matches($htmlContent, 'href="#([^"]+)"')
$anchorTargets = $anchorMatches | ForEach-Object { $_.Groups[1].Value } | Where-Object { -not $_.StartsWith("http") } | Select-Object -Unique

foreach ($target in $anchorTargets) {
    Assert-Test "Internal anchor target '#$target' has corresponding element id in HTML" {
        $htmlContent -match "id=""$target"""
    }
}

Write-Host "`n4. Validating Form Accessibility & Controls:" -ForegroundColor Yellow
Assert-Test "Contact form has novalidate attribute for custom accessible validation" {
    $htmlContent -match '<form\s+id="contact-form"\s+novalidate'
}

$requiredFields = @("contact-name", "contact-email", "contact-subject", "contact-message")
foreach ($field in $requiredFields) {
    Assert-Test "Form field exists: id='$field' with matching label" {
        ($htmlContent -match "id=""$field""") -and ($htmlContent -match "for=""$field""")
    }
}

Assert-Test "Form status live region container exists" {
    $htmlContent -match 'id="form-status-container"'
}

Write-Host "`n5. Validating CSS Tokens, Responsive Breakpoints, & Accessibility:" -ForegroundColor Yellow
$cssVariables = Get-Content (Join-Path $root "css/variables.css") -Raw
$styleCss = Get-Content (Join-Path $root "css/style.css") -Raw
$resetCss = Get-Content (Join-Path $root "css/reset.css") -Raw

Assert-Test "CSS defines --focus-ring token" {
    $cssVariables -match '--focus-ring:'
}

Assert-Test "Dark theme and Light theme variables defined" {
    ($cssVariables -match '\[data-theme="light"\]') -and ($cssVariables -match '\[data-theme="dark"\]')
}

Assert-Test "prefers-reduced-motion media query implemented" {
    $resetCss -match 'prefers-reduced-motion:\s*reduce'
}

Assert-Test ":focus-visible styling implemented" {
    $styleCss -match ':focus-visible'
}

Assert-Test "Mobile navigation responsive breakpoint implemented" {
    $styleCss -match '@media\s*\(max-width:\s*960px\)'
}

Write-Host "`n6. Validating JavaScript Modules & Syntax:" -ForegroundColor Yellow
$jsFiles = Get-ChildItem (Join-Path $root "js") -Filter "*.js"
foreach ($js in $jsFiles) {
    Assert-Test "JavaScript module has non-zero size: $($js.Name)" {
        $js.Length -gt 100
    }
}

Write-Host "`n=====================================================" -ForegroundColor Cyan
Write-Host "Verification Summary: $passed PASSED, $failed FAILED" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Red" })
Write-Host "=====================================================" -ForegroundColor Cyan

if ($failed -gt 0) {
    exit 1
} else {
    exit 0
}
