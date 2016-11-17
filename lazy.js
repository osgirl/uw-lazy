#!/usr/bin/env node

var program = require('commander');

program
  .version('0.0.1')
  .command('react <name>', 'generate react component')
  .command('api <name> [dir]', 'generate API skeleton')
  .parse(process.argv);
