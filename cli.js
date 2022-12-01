#!/usr/bin/env node
const blessed = require('reblessed')

// Create a screen object.
const screen = blessed.screen({
  smartCSR: true
})

screen.title = 'game-terminal'
