/**
 * Created by nero on 2017/5/22.
 */
const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')()
const Fslog = require('../../base/logger')
let logger = new Fslog()

app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  let myurl = ctx.url.substr(0, ctx.url.indexOf('http'))
  // ctx.response.set('Access-Control-Allow-Origin', 'http://www.dev.com:8011')
  // ctx.response.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE')
  // ctx.response.set('Access-Control-Max-Age', '0')
  // ctx.response.set('Access-Control-Allow-Headers', 'X-Requested-With,X_Requested_With')
  // ctx.response.set('Access-Control-Allow-Credentials', 'true')
})

app.use(router.routes()).use(router.allowedMethods())

// error
// app.on('error', function (err, ctx) {
//   logger.myconsole('server error', err, ctx)
// })
var lis = app.listen(80)
logger.myconsole('Launcher 80 is started!!!')
// logger.myconsole('http://localhost/')

var server = {
  addrouter: (url, fn) => {
    router.get(url, fn).post(url, fn)
  },
  close: () => {
    lis.close()
  }
}

module.exports = server
