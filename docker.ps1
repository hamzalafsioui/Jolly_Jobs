param(
    [Parameter(Position=0)]
    [string]$Command = 'help',

    [Parameter(Position=1)]
    [string]$Arg = ''
)

$DC = 'docker compose'
$DC_PROD = 'docker compose -f docker-compose.yml -f docker-compose.prod.yml'

function Write-Color($msg, $color = 'Cyan') {
    Write-Host $msg -ForegroundColor $color
}

switch ($Command) {
    'help' {
        Write-Color ''
        Write-Color '  Jolly Jobs - Docker commands (PowerShell)' 'Yellow'
        Write-Color '  -----------------------------------------------------' 'DarkGray'
        Write-Color '  .\docker.ps1 up              Start all containers'
        Write-Color '  .\docker.ps1 down            Stop containers'
        Write-Color '  .\docker.ps1 restart         Restart all containers'
        Write-Color '  .\docker.ps1 build           Rebuild images'
        Write-Color '  .\docker.ps1 logs            Follow all logs'
        Write-Color '  .\docker.ps1 shell           Bash in backend container'
        Write-Color '  .\docker.ps1 migrate         Run migrations'
        Write-Color '  .\docker.ps1 fresh           migrate:fresh --seed'
        Write-Color '  .\docker.ps1 seed            Run seeders'
        Write-Color '  .\docker.ps1 tinker          Laravel Tinker REPL'
        Write-Color '  .\docker.ps1 test            Run PHPUnit tests'
        Write-Color '  .\docker.ps1 cache-clear     Clear all caches'
        Write-Color '  .\docker.ps1 artisan <cmd>   Any artisan command'
        Write-Color '  .\docker.ps1 prod-build      Build production images'
        Write-Color '  .\docker.ps1 prod-up         Start production stack'
        Write-Color ''
    }
    'up' {
        Invoke-Expression "$DC up -d"
        Write-Color ''
        Write-Color '  [OK] Jolly Jobs is running!' 'Green'
        Write-Color '  API:        http://localhost:8001' 'White'
        Write-Color '  Frontend:   http://localhost:5173' 'White'
        Write-Color '  Reverb WS:  ws://localhost:8080' 'White'
        Write-Color '  Mailpit:    http://localhost:8025' 'White'
        Write-Color '  Postgres:   localhost:5432' 'White'
        Write-Color ''
    }
    'down'    { Invoke-Expression "$DC down" }
    'restart' { Invoke-Expression "$DC restart" }
    'build'   { Invoke-Expression "$DC build --no-cache" }
    'logs'    { Invoke-Expression "$DC logs -f" }
    'shell'   { Invoke-Expression "$DC exec backend bash" }
    'shell-db' {
        $db   = if ($env:DB_DATABASE) { $env:DB_DATABASE } else { 'jolly_jobs' }
        $user = if ($env:DB_USERNAME) { $env:DB_USERNAME } else { 'postgres' }
        Invoke-Expression "$DC exec db psql -U $user -d $db"
    }
    'migrate' { Invoke-Expression "$DC exec backend php artisan migrate" }
    'fresh' {
        Write-Color 'This will WIPE the database and reseed. Ctrl+C to cancel...' 'Red'
        Start-Sleep -Seconds 3
        Invoke-Expression "$DC exec backend php artisan migrate:fresh --seed"
    }
    'seed'    { Invoke-Expression "$DC exec backend php artisan db:seed" }
    'tinker'  { Invoke-Expression "$DC exec backend php artisan tinker" }
    'test'    { Invoke-Expression "$DC exec backend php artisan test" }
    'cache-clear' {
        Invoke-Expression "$DC exec backend php artisan config:clear"
        Invoke-Expression "$DC exec backend php artisan route:clear"
        Invoke-Expression "$DC exec backend php artisan view:clear"
        Invoke-Expression "$DC exec backend php artisan cache:clear"
    }
    'artisan' {
        if (-not $Arg) {
            Write-Color "Usage: .\docker.ps1 artisan '<command>'" 'Red'
            exit 1
        }
        Invoke-Expression "$DC exec backend php artisan $Arg"
    }
    'prod-build' { Invoke-Expression "$DC_PROD build --no-cache" }
    'prod-up'    { Invoke-Expression "$DC_PROD up -d" }
    default {
        Write-Color "Unknown command: $Command" 'Red'
        Write-Color "Run .\docker.ps1 help for available commands." 'Yellow'
        exit 1
    }
}
