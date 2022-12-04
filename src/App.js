const blessed = require('reblessed')

module.exports = class App {
  constructor (id, data) {
    this.id = id
    this.data = data
  }

  title () {
    return this.data.title
  }

  exec (screen) {
    if (this.data.terminal) {
      const height = this.data.instructions.split(/\n/).length - 1
      const instructions = blessed.box({
        top: 0,
        left: 0,
        right: 0,
        height,
        content: this.data.instructions
      })
      screen.append(instructions)

      const line = blessed.Line({
        top: height,
        left: 0,
        right: 0,
        orientation: 'horizontal'
      })
      screen.append(line)

      const term = blessed.terminal({
        parent: screen,
        label: 'test',
        top: height + 1,
        left: 0,
        right: 0,
        bottom: 0,
        cursor: 'block'
      })
      term.focus()
      term.on('exit', () => {
        term.destroy()
        line.destroy()
        instructions.destroy()
        screen.render()
      })
    } else {
      screen.setTerminal(screen.program._terminal)
      screen.spawn(this.data.command, [], { stdio: 'inherit' })
    }
  }
}
