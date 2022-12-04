const child_process = require('child_process')

let charmap = 'UTF-8'

module.exports = function (str) {
  return str
}

module.exports.init = (callback) => {
  child_process.exec("locale charmap", (err, stdout) => {
    charmap = stdout.trim()
    callback(err)
  })
}
