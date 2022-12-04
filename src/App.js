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

    const text = blessed.Text({
      top: height,
      right: 2,
      content: ' C-c: Quit - C-f: Fullscreen '
    })

    if (height) {
      screen.append(instructions)
      screen.append(line)
      screen.append(text)
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
      text.destroy()
      instructions.destroy()
      screen.render()
    })

    if (height) {
      term.key(['C-f'], () => {
        if (term.top > 0) {
          term.top = 0
          screen.remove(instructions)
          screen.remove(line)
          screen.remove(text)
        } else {
          term.top = height + (height ? 1 : 0)
          screen.append(instructions)
          screen.append(line)
          screen.append(text)
        }
        term.emit('resize')
        screen.render()
      })
    }

    term.key(['C-c'], () => {
      term.destroy()
    })
  }
}
