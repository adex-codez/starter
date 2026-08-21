#!/usr/bin/env pwsh
param(
    [Parameter(Position=0)]
    [string]$Task,

    [Parameter(Position=1)]
    [string]$Name
)

$scriptsDir = Join-Path $PSScriptRoot "scripts"

function Show-Help {
    Write-Host @"
Usage: .\task.ps1 <command> [options]

Commands:
  build                   Build the server binary
  run                     Run the server
  dev                     Run with hot reload (air)
  migrate-new -Name <n>   Create a new migration
  migrate-up              Run pending migrations
  migrate-down            Rollback the last migration
  migrate-status          Check migration status
  generate                Generate sqlc code
  tidy                    Tidy go modules

Examples:
  .\task.ps1 build
  .\task.ps1 migrate-new -Name create_users
  .\task.ps1 dev
"@
}

switch ($Task) {
    "build"          { & "$scriptsDir\build.ps1" }
    "run"            { & "$scriptsDir\run.ps1" }
    "dev"            { & "$scriptsDir\dev.ps1" }
    "migrate-new"    { & "$scriptsDir\migrate-new.ps1" -Name $Name }
    "migrate-up"     { & "$scriptsDir\migrate-up.ps1" }
    "migrate-down"   { & "$scriptsDir\migrate-down.ps1" }
    "migrate-status" { & "$scriptsDir\migrate-status.ps1" }
    "generate"       { & "$scriptsDir\generate.ps1" }
    "tidy"           { & "$scriptsDir\tidy.ps1" }
    default           { Show-Help }
}
