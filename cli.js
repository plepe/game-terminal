#!/usr/bin/env node
var blessed = require('reblessed');

// Create a screen object.
var screen = blessed.screen({
  smartCSR: true
});

screen.title = 'game-terminal';
