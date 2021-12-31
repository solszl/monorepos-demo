const { exec } = require("shelljs");
const pkg = require("./package.json");

// const tagReg = /tag=(.+)/;
// const tag = process.argv[2].match(tagReg)[1];
const tag = `viewer-sdk-${pkg.version}`;

exec(`docker build --platform linux/amd64 -t hub.infervision.com/dev/viewer-sdk:${tag} .`);
exec(`docker push hub.infervision.com/dev/viewer-sdk:${tag}`);
