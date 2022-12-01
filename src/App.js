module.exports = class App {
  constructor (id, data) {
    this.id = id
    this.data = data
  }

  title () {
    return this.data.title
  }

  exec (screen) {
    screen.spawn(this.data.command, [], { stdio: 'inherit' })
  }
}
