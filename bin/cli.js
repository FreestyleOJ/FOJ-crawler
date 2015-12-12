#!/usr/bin/env node
'use strict';
var program = require('commander');
var agent = require('../lib/agent');
// console.log('please specify an Online Judge');
program
    .version('1.0.0')
    .usage('Visit github/FreestyleOJ/crawler for more details');
program
  .command('get <cmd>')
  .description('get an Online Judge')
  // .option()
  // no option yet
  .action(function(cmd) {
    if (cmd == 'poj.org'){
      agent.get('poj');
    } else if (cmd == 'codevs.cn') {
      agent.get('codevs');
    } else {
      console.log('This is not supported yet.');
    }
  })
if (process.argv.length > 2) program.parse(process.argv);
else console.log('use \'foj-crawler --help\' for info.');
