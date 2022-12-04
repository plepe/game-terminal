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
    const height = this.data.instructions ? this.data.instructions.split(/\n/).length - 1 : 0

    const instructions = blessed.box({
      top: 0,
      left: 0,
      right: 0,
      height,
      content: this.data.instructions
    })

    const line = blessed.Line({
      top: height,
      left: 0,
      right: 0,
      orientation: 'horizontal'
    })

    if (height) {
      screen.append(instructions)
      screen.append(line)
    }

    const term = blessed.terminal({
      parent: screen,
      label: 'test',
      top: height + (height ? 1 : 0),
      left: 0,
      right: 0,
      bottom: 0,
      shell: this.data.command || '/bin/bash',
      cursor: 'block'
    })
    term.focus()
    term.on('exit', () => {
      term.destroy()
      line.destroy()
      instructions.destroy()
      screen.render()
    })
  }
}
