$ErrorActionPreference = 'Stop'; $ProgressPreference = 'SilentlyContinue';

Import-Module "$PSScriptRoot\..\..\scripts\Build.psm1" -Force

# create service
$ServiceName = "habitat-site-next$env:DNS_SUFFIX"
nssm install $ServiceName 'C:\Windows\system32\cmd.exe' '"cmd /C npm start"'
nssm set $ServiceName Start SERVICE_AUTO_START

nssm set $ServiceName AppEnvironmentExtra "DNS_SUFFIX=$env:DNS_SUFFIX"


# working dir
nssm set $ServiceName AppDirectory $PSScriptRoot

# logs
nssm set $ServiceName AppStdout "$PSScriptRoot\.stdout.log"
nssm set $ServiceName AppStderr "$PSScriptRoot\.stderr.log"
nssm set $ServiceName AppStdoutCreationDisposition 4
nssm set $ServiceName AppStderrCreationDisposition 4

# start service
nssm start $ServiceName

# wait for the service to start
Invoke-PingUrl -Url "https://habitat-uniform$($env:DNS_SUFFIX).unfrm.space$($env:TLD_HTTPS_SUFFIX)/uniform/api/service/status?uniform_token=12345" -TimeoutSec 180 
