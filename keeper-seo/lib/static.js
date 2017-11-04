/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')
let seoinfor = require('../config/seoinfor')

const Render = require('keeper-core/lib/render')
let render = new Render()
const Fscache = require('keeper-core/cache/cache')
const cache = new Fscache()
const Fslog = require('keeper-core')
let log = new Fslog()
const Mytime = require('keeper-core/lib/time')
let mytime = new Mytime()

// constructor
class InitJs {
  async staticpage (type, url, title) {
    return new Promise(async (resolve) => {
      let t = Date.now()
      let filterbox = ''
      const browser = await puppeteer.launch({
        ignoreHTTPSErrors: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })
      const page = await browser.newPage()

      try {
        // await page.setRequestInterceptionEnabled(true)
        page.on('response', async (result) => {
          let filter = result.url.indexOf('initItemDetail.htm') !== -1
          let filter2 = result.url.indexOf('sib.htm') !== -1
          if (filter || filter2) {
            filterbox += await result.text()
            // await page.cookies(result.url)
          }
          console.log(await page.cookies(result.url))
        })

        await page.goto(url, {waitUntil: 'networkidle', networkIdleTimeout: 1000})
        // await page.screenshot({path: 'example.png'})
        let cont = await page.content()
        // console.log(cont)
        let templine = '\n\n=====================================================================================================================\n\n'
        resolve(cont + templine + filterbox)

        // const mypageinfor = await page.evaluate(() => {
        //   return {
        //     title: document.title || '',
        //     keywords: document.getElementsByTagName('meta')[1].content || '',
        //     description: document.getElementsByTagName('meta')[2].content || '',
        //     content: document.getElementsByTagName('body').innerHTML || ''
        //   }
        // })
        // console.log(mypageinfor)

        // write date
        t = Date.now() - t
        // let str = '{"Loadingtime":"' + (t / 1000).toString() + 's","date":"' + mytime.mytime() + '","url":"' + url + '",'

        // let file = path.join(__dirname, '/../tpl/init/init.html')
        // const tpl = fs.readFileSync(file).toString()
        // let currpageinfor = seoinfor[type]
        // let data = {
        //   title: mypageinfor.title,
        //   keywords: mypageinfor.keywords,
        //   description: mypageinfor.description,
        //   loadjs: '/plugin/base/load.js',
        //   container: '<div id="container" style="opacity: 0;">' + mypageinfor.content + '</div>',
        //   wrapjs: currpageinfor.wrapjs,
        //   myjs: currpageinfor.myjs
        // }
        // let mystr = render.renderdata(tpl, data)
        // if (mypageinfor.title === 'Superbuy-Shopping Agent-self service') {
        //   console.log('Analysis failed! Product is missing!'.red)
        //   str += '"error":"Analysis error!",'
        //   resolve(false)
        // } else if (mypageinfor.title !== 'Superbuy-Shopping Agent') {
        //   str += cache.writecache(mystr, url, type)
        // cache.writecache(cont, url, type)
        //   resolve(mystr)
        // } else {
        //   console.log('Render failed!'.red)
        //   str += '"error":"Render error!",'
        //   resolve(false)
        // }

        // log.writelog('success', str + '"title":"' + mypageinfor.title + '"}', type)
        console.log('Loading time '.green + (t / 1000).toString().red + ' second'.green)
        browser.close()
      } catch (e) {
        resolve(false)
        console.log('System error! Can not analysis this page!'.red)
        browser.close()
      }
    })
  }
}

module.exports = InitJs
