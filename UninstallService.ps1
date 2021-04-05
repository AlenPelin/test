$ServiceName = "habitat-site-next$env:DNS_SUFFIX"
# stop service
nssm stop $ServiceName

# uninstall service
nssm remove $ServiceName confirm

