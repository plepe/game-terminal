const child_process = require('child_process')
const iconv = require('iconv-lite')

let charmap = 'UTF-8'

module.exports = function (str) {
  if (charmap !== 'UTF-8') {
    return iconv.encode(str, charmap).toString()
  }

  return str
}

module.exports.init = (callback) => {
  child_process.exec("locale charmap", (err, stdout) => {
    if (err) { return callback(err) }

    charmap = stdout.trim()
    process.stdout.setDefaultEncoding(charmap === 'UTF-8' ? 'utf8' : 'binary')

    callback()
  })
}
