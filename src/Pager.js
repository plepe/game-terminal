const blessed = require('reblessed')
const Events = require('events')
const fs = require('fs')

class Pager extends Events {
  constructor (options) {
    super()
    this.options = options

    this.list = this.options.list
    this.screen = this.options.screen
  }

  show () {
    let line = blessed.Line({
      top: 1,
      left: 0,
      right: 0,
      orientation: 'horizontal'
    })
    this.screen.append(line)

    line = blessed.Line({
      bottom: 1,
      left: 0,
      right: 0,
      orientation: 'horizontal'
    })
    this.screen.append(line)

    const items = this.list.map(a => a.title())

    this.table = blessed.list({
      items,
      top: 2,
      left: 0,
      right: 0,
      bottom: 2,
      bg: 'magenta',
      keys: true,
      mouse: true,
      scrollbar: true,
      align: 'left',
      style: {
        item: {
        },
        selected: {
          inverse: true
        },
        scrollbar: {
          bg: 'blue'
        }
      }
    })

    this.screen.append(this.table)
    this.table.focus()

    this.table.key(['pagedown'], () => {
      const height = this.table.height
      const toLast = height - this.table.childOffset - 1

      if (toLast === 0) {
        this.table.select(this.table.selected + height)
      } else {
        this.table.select(this.table.selected + toLast)
      }

      this.screen.render()
    })
    this.table.key(['pageup'], () => {
      const height = this.table.height
      const toFirst = this.table.childOffset

      if (this.table.selected <= 0) {
        // already at first
      } else if (toFirst === 0) {
        this.table.select(this.table.selected - height)
      } else {
        this.table.select(this.table.selected - toFirst)
      }

      this.screen.render()
    })
    this.table.key(['home'], () => {
      this.table.select(0)
      this.screen.render()
    })
    this.table.key(['end'], () => {
      this.table.select(this.table.items.length - 1)
      this.screen.render()
    })
    this.table.on('select', (data) => {
      const index = this.table.selected
      this.select(index)
    })
    this.table.key(['escape', 'q'], function (ch, key) {
      return process.exit(0)
    })
  }

  selectNextSearchResult () {
    if (this.searchResults.length === 0) {
      return
    }

    let index = this.table.selected - 1
    let turnAround = false

    do {
      if (++index >= this.database.length) {
        if (turnAround) {
          this.screen.render()
          return
        }

        index = 0
        turnAround = true
      }
    } while (this.searchResults.indexOf(this.database[index].id) === -1)

    this.table.select(index + 1)
    this.screen.render()
  }

  select (index) {
    const app = this.list[index]
    app.exec(this.screen)
  }

  close () {
    this.table.destroy()
    this.shortHelp.destroy()
    this.screen.render()

    this.emit('close')
  }
}

module.exports = Pager
