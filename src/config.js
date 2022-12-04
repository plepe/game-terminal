const fs = require('fs')
const yaml = require('js-yaml')
const config = yaml.load(fs.readFileSync('config.yaml'))
if (!('apps' in config)) {
  config.apps = {}
}
module.exports = config


