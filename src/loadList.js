const fs = require('fs/promises')
const yaml = require('js-yaml')
const App = require('./App')

module.exports = function loadList () {
  return new Promise((resolve, reject) =>
    fs.readdir('data')
      .then(filenames => resolve(Promise.all(
        filenames
          .filter(filename => filename.match(/^\w.*\.yaml$/))
          .map(filename => new Promise((resolve, reject) =>
            fs.readFile('data/' + filename)
              .then(content => {
                const id = filename.substr(0, filename.length - 5)
                const data = yaml.load(content.toString())
                resolve(new App(id, data))
              }, err => reject(err))
          ))
        , err => reject(err)))
      ))
}
