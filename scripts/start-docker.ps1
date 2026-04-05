# Start Docker Desktop if not running, then bring up postgres
$dockerRunning = $false
try {
    docker info 2>&1 | Out-Null
    $dockerRunning = $LASTEXITCODE -eq 0
} catch {}

if (-not $dockerRunning) {
    Write-Host "Starting Docker Desktop..."
    $dockerPath = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    if (Test-Path $dockerPath) {
        Start-Process $dockerPath
    } else {
        Write-Error "Docker Desktop not found at $dockerPath. Please start it manually."
        exit 1
    }

    Write-Host "Waiting for Docker engine to be ready..."
    $timeout = 60
    $elapsed = 0
    do {
        Start-Sleep -Seconds 3
        $elapsed += 3
        docker info 2>&1 | Out-Null
        $dockerRunning = $LASTEXITCODE -eq 0
    } while (-not $dockerRunning -and $elapsed -lt $timeout)

    if (-not $dockerRunning) {
        Write-Error "Docker did not start within $timeout seconds."
        exit 1
    }
    Write-Host "Docker is ready."
}

docker compose up -d postgres

Write-Host "Waiting for postgres container health..."
$dbTimeout = 60
$dbElapsed = 0
$dbHealthy = $false
do {
    Start-Sleep -Seconds 3
    $dbElapsed += 3
    try {
        $status = docker inspect --format="{{.State.Health.Status}}" taste-of-aloha-db 2>$null
        $dbHealthy = $LASTEXITCODE -eq 0 -and $status -eq 'healthy'
    } catch {}
} while (-not $dbHealthy -and $dbElapsed -lt $dbTimeout)

if (-not $dbHealthy) {
    Write-Error "Postgres container did not become healthy within $dbTimeout seconds."
    exit 1
}

Write-Host "Postgres is healthy."
