#!/usr/bin/env node
const blessed = require('reblessed')
const Pager = require('./src/Pager')
const loadList = require('./src/loadList')

// Create a screen object.
const screen = blessed.screen({
  smartCSR: true
})

// Disable on VT320 - will irritate screen
// screen.title = 'game-terminal'

screen.key(['escape', 'q', 'C-c'], function (ch, key) {
  return process.exit(0)
})

screen.key(['r'], function (ch, key) {
  app.exec(screen)
})

loadList()
  .then(list => {
    //    if (err) {
    //      console.log(err)
    //      process.exit(1)
    //    }

    const pager = new Pager({
      list,
      fields: [
        { pager: true, title: 'title' }
      ],
      screen
    })
    pager.show()

    screen.render()
  })
