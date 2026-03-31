param(
    [ValidateSet("start", "stop", "status")]
    [string]$Action = "start"
)

$ErrorActionPreference = "Stop"

$frontendDir = Split-Path -Parent $PSScriptRoot
$workspaceDir = Split-Path -Parent $frontendDir
$backendRoot = Join-Path $workspaceDir "backend"
$runtimeDir = Join-Path $workspaceDir ".runtime\project-stack"
$logsDir = Join-Path $runtimeDir "logs"
$stateFile = Join-Path $runtimeDir "state.json"

function Ensure-RuntimeDirectories {
    New-Item -Path $runtimeDir -ItemType Directory -Force | Out-Null
    New-Item -Path $logsDir -ItemType Directory -Force | Out-Null
}

function Resolve-PythonExecutable {
    param([string]$backendDir)

    $candidates = @(
        (Join-Path $backendDir ".venv\Scripts\python.exe"),
        (Join-Path $backendDir "venv\Scripts\python.exe"),
        "python"
    )

    $firstExisting = $null

    foreach ($candidate in $candidates) {
        $candidateExists = $false

        if ($candidate -eq "python") {
            $candidateExists = $null -ne (Get-Command python -ErrorAction SilentlyContinue)
        }
        else {
            $candidateExists = Test-Path $candidate
        }

        if (-not $candidateExists) {
            continue
        }

        if ($null -eq $firstExisting) {
            $firstExisting = $candidate
        }

        try {
            & $candidate -c "import uvicorn" *> $null
            if ($LASTEXITCODE -eq 0) {
                return $candidate
            }
        }
        catch {
            continue
        }
    }

    if ($null -ne $firstExisting) {
        return $firstExisting
    }

    if ($null -ne (Get-Command python -ErrorAction SilentlyContinue)) {
        return "python"
    }

    foreach ($candidate in $candidates) {
        if ($candidate -ne "python" -and (Test-Path $candidate)) {
            return $candidate
        }
    }

    return "python"
}

function Test-UvicornAvailable {
    param([string]$pythonExe)

    try {
        & $pythonExe -c "import uvicorn" *> $null
        return $LASTEXITCODE -eq 0
    }
    catch {
        return $false
    }
}

function Ensure-UvicornAvailable {
    param([string]$pythonExe)

    if (Test-UvicornAvailable $pythonExe) {
        return $true
    }

    Write-Host "[setup] Installing FastAPI/Uvicorn/httpx for interpreter: $pythonExe"

    try {
        & $pythonExe -m pip install fastapi uvicorn httpx *> $null
    }
    catch {
        return $false
    }

    return Test-UvicornAvailable $pythonExe
}

function Load-State {
    if (-not (Test-Path $stateFile)) {
        return @()
    }

    $raw = Get-Content -Path $stateFile -Raw
    if ([string]::IsNullOrWhiteSpace($raw)) {
        return @()
    }

    $parsed = $raw | ConvertFrom-Json
    if ($null -eq $parsed.services) {
        return @()
    }

    return @($parsed.services)
}

function Save-State {
    param([array]$services)

    $state = [ordered]@{
        generatedAt = (Get-Date).ToString("o")
        services    = $services
    }

    $state | ConvertTo-Json -Depth 6 | Set-Content -Path $stateFile -Encoding UTF8
}

function Has-Key {
    param(
        [object]$dictionary,
        [string]$key
    )

    if ($dictionary -is [System.Collections.IDictionary]) {
        return $dictionary.Contains($key)
    }

    return $false
}

function Test-PortOpen {
    param(
        [int]$port,
        [string]$targetHost = "127.0.0.1"
    )

    try {
        $client = New-Object System.Net.Sockets.TcpClient
        $async = $client.BeginConnect($targetHost, $port, $null, $null)
        $connected = $async.AsyncWaitHandle.WaitOne(300)
        if (-not $connected) {
            $client.Close()
            return $false
        }

        $client.EndConnect($async)
        $client.Close()
        return $true
    }
    catch {
        return $false
    }
}

function Get-ServiceDefinitions {
    $deepfakeBackend = Join-Path $backendRoot "projects\Deepfake-Detection"
    $aiBackend = Join-Path $backendRoot "projects\AI-Research-assistant"
    $cabBackend = Join-Path $backendRoot "projects\Cab Demand Forecasting"
    $fakeNewsBackend = Join-Path $backendRoot "projects\Fake News Detector in Indian Languages"
    $humBackend = Join-Path $backendRoot "projects\Hum to Search"
    $signBackend = Join-Path $backendRoot "projects\Sign Language Translation"
    $portfolioBackend = $backendRoot

    return @(
        [ordered]@{
            Name          = "deepfake-backend"
            Dir           = $deepfakeBackend
            Exe           = Resolve-PythonExecutable $deepfakeBackend
            Args          = @("-m", "uvicorn", "app:app", "--host", "127.0.0.1", "--port", "8001")
            Url           = "http://127.0.0.1:8001"
            Port          = 8001
            EnsureUvicorn = $true
        },
        [ordered]@{
            Name          = "ai-research-backend"
            Dir           = $aiBackend
            Exe           = Resolve-PythonExecutable $aiBackend
            Args          = @("-m", "uvicorn", "app:app", "--host", "127.0.0.1", "--port", "8002")
            Url           = "http://127.0.0.1:8002"
            Port          = 8002
            EnsureUvicorn = $true
        },
        [ordered]@{
            Name          = "cab-forecast-backend"
            Dir           = $cabBackend
            Exe           = Resolve-PythonExecutable $cabBackend
            Args          = @("-m", "uvicorn", "app:app", "--host", "127.0.0.1", "--port", "8003")
            Url           = "http://127.0.0.1:8003"
            Port          = 8003
            EnsureUvicorn = $true
        },
        [ordered]@{
            Name          = "fake-news-backend"
            Dir           = $fakeNewsBackend
            Exe           = Resolve-PythonExecutable $fakeNewsBackend
            Args          = @("-m", "uvicorn", "app:app", "--host", "127.0.0.1", "--port", "8004")
            Url           = "http://127.0.0.1:8004"
            Port          = 8004
            EnsureUvicorn = $true
        },
        [ordered]@{
            Name          = "hum-search-backend"
            Dir           = $humBackend
            Exe           = Resolve-PythonExecutable $humBackend
            Args          = @("-m", "uvicorn", "app:app", "--host", "127.0.0.1", "--port", "8005")
            Url           = "http://127.0.0.1:8005"
            Port          = 8005
            EnsureUvicorn = $true
        },
        [ordered]@{
            Name          = "sign-language-backend"
            Dir           = $signBackend
            Exe           = Resolve-PythonExecutable $signBackend
            Args          = @("-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8006")
            Url           = "http://127.0.0.1:8006"
            Port          = 8006
            EnsureUvicorn = $true
        },
        [ordered]@{
            Name          = "portfolio-backend"
            Dir           = $portfolioBackend
            Exe           = Resolve-PythonExecutable $portfolioBackend
            Args          = @("-m", "uvicorn", "app:app", "--host", "127.0.0.1", "--port", "8000")
            Url           = "http://127.0.0.1:8000"
            Port          = 8000
            EnsureUvicorn = $true
        },
        [ordered]@{
            Name = "portfolio-frontend"
            Dir  = $frontendDir
            Exe  = "npm.cmd"
            Args = @("run", "dev", "--", "--host", "127.0.0.1", "--port", "5173", "--strictPort")
            Url  = "http://127.0.0.1:5173"
            Port = 5173
        }
    )
}

function Start-Service {
    param([hashtable]$service)

    if (-not (Test-Path $service.Dir)) {
        Write-Warning "Skipping $($service.Name) because directory does not exist: $($service.Dir)"
        return $null
    }

    $stdoutPath = Join-Path $logsDir "$($service.Name).out.log"
    $stderrPath = Join-Path $logsDir "$($service.Name).err.log"
    Remove-Item -Path $stdoutPath -ErrorAction SilentlyContinue
    Remove-Item -Path $stderrPath -ErrorAction SilentlyContinue

    if ((Has-Key -dictionary $service -key "EnsureUvicorn") -and $service.EnsureUvicorn) {
        if (-not (Ensure-UvicornAvailable $service.Exe)) {
            Write-Warning "Skipping $($service.Name): uvicorn is unavailable for interpreter $($service.Exe)."
            return $null
        }
    }

    try {
        $process = Start-Process `
            -FilePath $service.Exe `
            -ArgumentList $service.Args `
            -WorkingDirectory $service.Dir `
            -PassThru `
            -WindowStyle Hidden `
            -RedirectStandardOutput $stdoutPath `
            -RedirectStandardError $stderrPath
    }
    catch {
        Write-Warning "Failed to start $($service.Name): $($_.Exception.Message)"
        return $null
    }

    Start-Sleep -Milliseconds 250

    return [ordered]@{
        name      = $service.Name
        pid       = $process.Id
        dir       = $service.Dir
        url       = $service.Url
        port      = $service.Port
        managed   = $true
        stdoutLog = $stdoutPath
        stderrLog = $stderrPath
        startedAt = (Get-Date).ToString("o")
    }
}

function Stop-TrackedServices {
    param([array]$trackedServices)

    foreach ($tracked in $trackedServices) {
        if (($tracked.managed -eq $false) -or ([int]$tracked.pid -le 0)) {
            Write-Host "[external] $($tracked.name) was not started by the stack script."
            continue
        }

        $running = Get-Process -Id $tracked.pid -ErrorAction SilentlyContinue
        if ($null -eq $running) {
            Write-Host "[missing] $($tracked.name) (PID $($tracked.pid))"
            continue
        }

        Stop-Process -Id $tracked.pid -Force -ErrorAction SilentlyContinue
        Write-Host "[stopped] $($tracked.name) (PID $($tracked.pid))"
    }
}

function Show-Status {
    $tracked = Load-State

    if ($tracked.Count -eq 0) {
        Write-Host "No tracked stack services found."
        return
    }

    foreach ($trackedService in $tracked) {
        if ($trackedService.managed -eq $false) {
            $label = if (Test-PortOpen -port ([int]$trackedService.port)) { "running" } else { "stopped" }
            Write-Host "[$label] $($trackedService.name) -> $($trackedService.url) (external)"
            continue
        }

        $running = Get-Process -Id $trackedService.pid -ErrorAction SilentlyContinue
        $label = if ($null -ne $running) { "running" } else { "stopped" }
        Write-Host "[$label] $($trackedService.name) -> $($trackedService.url)"
    }
}

Ensure-RuntimeDirectories

switch ($Action) {
    "start" {
        $existing = Load-State
        $existingByName = @{}

        foreach ($tracked in $existing) {
            $running = Get-Process -Id $tracked.pid -ErrorAction SilentlyContinue
            if ($null -ne $running) {
                $existingByName[$tracked.name] = $tracked
            }
        }

        $definitions = Get-ServiceDefinitions
        $nextState = @()

        foreach ($definition in $definitions) {
            if ($existingByName.ContainsKey($definition.Name)) {
                $tracked = $existingByName[$definition.Name]
                Write-Host "[already-running] $($tracked.name) -> $($tracked.url)"
                $nextState += $tracked
                continue
            }

            if ((Has-Key -dictionary $definition -key "Port") -and (Test-PortOpen -port ([int]$definition.Port))) {
                $externalState = [ordered]@{
                    name      = $definition.Name
                    pid       = 0
                    dir       = $definition.Dir
                    url       = $definition.Url
                    port      = $definition.Port
                    managed   = $false
                    stdoutLog = $null
                    stderrLog = $null
                    startedAt = (Get-Date).ToString("o")
                }

                Write-Host "[already-listening] $($definition.Name) -> $($definition.Url)"
                $nextState += $externalState
                continue
            }

            $started = Start-Service $definition
            if ($null -ne $started) {
                Write-Host "[started] $($started.name) -> $($started.url)"
                $nextState += $started
            }
        }

        Save-State $nextState
        Write-Host ""
        Show-Status
    }

    "stop" {
        $tracked = Load-State
        if ($tracked.Count -eq 0) {
            Write-Host "No tracked stack services are running."
            break
        }

        Stop-TrackedServices $tracked
        Remove-Item -Path $stateFile -Force -ErrorAction SilentlyContinue
    }

    "status" {
        Show-Status
    }
}