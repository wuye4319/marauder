#!/usr/bin/env node
let colors = require('colors')
let fs = require('fs')
const Ready = require('./ready')
let ready = new Ready()

// check program running environment.
var iskeeper = fs.existsSync('./node_modules/keeper-seo/bin/main.js')
if (iskeeper) {
  var isready = fs.existsSync('./node_modules/keeper-core/config/sysconf.js')
  if (!isready) {
    ready.boot()
  } else {
    bootstrap()
  }
} else {
  console.log('Seo is running at wrong Environment!!!'.red)
}

function bootstrap () {
  require('./builder')
}
