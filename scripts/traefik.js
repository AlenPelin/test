const fs = require('fs');
require('../uniform.config')();

let serviceName = process.argv[2];
if (serviceName == '--') {
    serviceName = process.argv[3];
}

if (!serviceName) {
    throw new Error("traefik.js script expects an argument with the service name")
}

serviceName = serviceName.replace(/__DNS_SUFFIX__/gi, process.env.DNS_SUFFIX || '');

const traefikDir = process.env.SystemDrive + "/Users/Public/Documents/Traefik";
if (!fs.existsSync(traefikDir)) {
fs.mkdirSync(traefikDir);
}
const traefikConfigDir = traefikDir + "/config/";
const traefikConfigPath = traefikConfigDir + serviceName + "." + process.env.PORT + ".toml";
fs.readdirSync(traefikConfigDir).forEach(fileName => {
  if (fileName.toLowerCase().startsWith(serviceName.toLowerCase() + ".")) {
    const filePath = traefikConfigDir + fileName;
    console.log('Removing old traefik configuration file for this service: ' + filePath);
    fs.unlinkSync(filePath);
  }
});

console.log("Generating traefik configuration file: " + traefikConfigPath);
const hostIp = fs.readFileSync(traefikDir + "/.HOST_IP").toString();
const traefikConfigText = `
## Routers
[http.routers]

  [http.routers.${serviceName}]
    rule = "Host(\`${serviceName}.unfrm.space\`)"
    service = "${serviceName}"

## Services
[http.services]

[http.services.${serviceName}.loadBalancer]
[[http.services.${serviceName}.loadBalancer.servers]]
  url = "http://${hostIp}:${process.env.PORT}/"
`;

fs.writeFileSync(traefikConfigPath, traefikConfigText, { encoding: "utf-8"});
