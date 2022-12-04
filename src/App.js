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
    this.screen = screen
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

    this.elements = [instructions, line, text]

    if (height) {
      this.elements.forEach(e => screen.append(e))
    }

    this.term = blessed.terminal({
      parent: screen,
      label: 'test',
      top: height + (height ? 1 : 0),
      left: 0,
      right: 0,
      bottom: 0,
      shell: this.data.command || '/bin/bash',
      cursor: 'block'
    })
    this.term.focus()
    this.term.on('exit', () => this.close())

    if (height) {
      this.term.key(['C-f'], () => {
        if (this.term.top > 0) {
          this.term.top = 0
          this.elements.forEach(e => screen.remove(e))
        } else {
          this.term.top = height + (height ? 1 : 0)
          this.elements.forEach(e => screen.append(e))
        }
        this.term.emit('resize')
        screen.render()
      })
    }

    this.term.key(['C-c'], () => {
      this.term.destroy()
    })
  }

  close () {
    this.term.destroy()
    this.elements.forEach(e => e.destroy())
    this.screen.render()
  }
}
