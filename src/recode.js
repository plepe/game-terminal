const child_process = require('child_process')

let charmap = 'UTF-8'

module.exports.init = (callback) => {
  child_process.exec("locale charmap", (err, stdout) => {
    if (err) { return callback(err) }

    charmap = stdout.trim()
    process.stdout.setDefaultEncoding(charmap === 'UTF-8' ? 'utf8' : 'binary')

    callback()
  })
}
