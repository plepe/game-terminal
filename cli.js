#!/usr/bin/env node
const fs = require('fs')
const blessed = require('reblessed')
const yaml = require('js-yaml')
const App = require('./src/App')
const Pager = require('./src/Pager')

// Create a screen object.
const screen = blessed.screen({
  smartCSR: true
})

// Disable on VT320 - will irritate screen
// screen.title = 'game-terminal'

const box = blessed.box({
  top: 'center',
  left: 'center',
  width: '50%',
  height: '50%',
  content: 'Hello {bold}world{/bold}!',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'magenta',
    border: {
      fg: '#f0f0f0'
    },
    hover: {
      bg: 'green'
    }
  }
})

screen.append(box)

screen.key(['escape', 'q', 'C-c'], function (ch, key) {
  return process.exit(0)
})

screen.key(['r'], function (ch, key) {
  app.exec(screen)
})

const list = [
  new App('tetris', yaml.load(fs.readFileSync('data/tetris.yaml').toString()))
]

const pager = new Pager({ list, fields: {}, screen })

screen.render()
