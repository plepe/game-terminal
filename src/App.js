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
    if (this.term) {
      return this.foreground()
    }

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
      content: (this.data.background ? ' C-c: Background -' : '') + ' C-c: Quit - C-f: Fullscreen '
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
    this.term.on('exit', (err) => {
      if (err) {
        return this.term.key('enter', () => this._close())
      }

      this.close()
    })

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

    if (this.data.background) {
      this.term.key(['C-b'], () => this.background())
    }

    this.term.key(['C-c'], () => {
      this.term.destroy()
    })
  }

  background () {
    this.screen.remove(this.term)
    this.elements.forEach(e => this.screen.remove(e))
    this.screen.render()
  }

  foreground () {
    this.screen.append(this.term)
    global.setTimeout(() => this.term.focus(), 0)
    this.elements.forEach(e => this.screen.append(e))
    this.screen.render()
  }

  close () {
    if (this.data.waitAfterExit) {
      this.term.key('enter', () => this._close())
    } else {
      this._close()
    }
  }

  _close () {
    this.term.destroy()
    this.elements.forEach(e => e.destroy())
    this.screen.render()
    this.term = null
  }
}
