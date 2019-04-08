const Fscompile = require('../lib/compile')
let compile = new Fscompile()
// const Ctrlinit = require('../lib/ctrl/init')
// let ctrlinit = new Ctrlinit()
// the bin/bdrelease.js used;
// const Fsclear = require('../lib/ctrl/clear')
// let clear = new Fsclear() 
// let fsstatic = require('../lib/ctrl/static')
// let static = new fsstatic()
// let fsconf = require('../lib/ctrl/readconf')
// let conf = new fsconf()
// require('./rob')
const path = require('path')
let pwd = path.dirname(__dirname)
let plugname = path.basename(pwd)
let outconf = path.resolve('./node_modules/' + plugname + '/config/sysconf.js')
let tpl = require(outconf)
const npmrun = require('../lib/run')
let run = new npmrun()

run.config()

let cmdlist = [
  {
    name: 'dev', desc: '开发编译',
    action: function () {
      if (tpl.plugintype === 'vue-webpack') {
        compile.dev()
      } else if (tpl.plugintype === 'vue-cli-service') {
        run.run('serve')
      }
    }
  }, {
    name: 'pub', desc: '发布编译',
    action: function () {
      if (tpl.plugintype === 'vue-webpack') {
        compile.pub()
      } else if (tpl.plugintype === 'vue-cli-service') {
        run.run('build')
      }
    }
  }, {
    name: 'wrap', desc: '编译wrapper',
    option: [{ cmd: '-p, --public', desc: 'build wrapper for public envs' }],
    action: function (cmd) {
      compile.wrap(cmd.public)
    }
  }, {
    name: 'inspect', desc: '检查webpack的配置', alias: 'ins',
    action: function () {
      run.run('inspect')
    }
  }, {
    name: 'conf', desc: '查看配置',
    action: function () {
      conf.conf(false)
    }
  }, {
    name: 'create', desc: 'create page', alias: 'crt',
    action: function () {
      ctrlinit.init()
    }
  }, {
    name: 'initconf', desc: 'init config.js', alias: 'inc',
    option: [{ cmd: '-a, --admin', desc: 'config.js for admin' }],
    action: function (cmd) {
      ctrlinit.initconf(cmd.admin) // true
    }
  }, {
    name: 'initrouter', desc: '初始化router', alias: 'inr',
    action: function () {
      ctrlinit.initrout()
    }
  }, {
    name: 'static', desc: '正静态', alias: 'stc',
    action: function () {
      console.log('This function is temporarily unavailable!'.red)
      // static.static(this, param)
    }
  }, {
    name: 'clear', desc: '文件清理', alias: 'clr',
    action: function () {
      // clear.checkrouter()
      clear.clear()
    }
  }
]

module.exports = cmdlist