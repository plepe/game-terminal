#!/usr/bin/env node
const fs = require('fs')
const blessed = require('reblessed')
const yaml = require('js-yaml')
const App = require('./src/App')

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
  const app = new App('tetris', yaml.load(fs.readFileSync('data/tetris.yaml').toString()))
  app.exec(screen)
})

screen.render()
