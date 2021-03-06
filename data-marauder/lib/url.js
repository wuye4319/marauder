/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
const request = require('request')
const fs = require('fs')

// constructor
class InitJs {
  async getdata (apiurl, ref) {
    return new Promise(async (resolve) => {
      let options = {
        url: apiurl,
        headers: {
          'referer': ref
        }
      }

      request(options, function optionalCallback (error, resp, body) {
        if (error) { console.log('get url-data failed : '.red + error) } else {
          if (body) {
            resolve(body)
          } else {
            resolve(false)
          }
        }
      })
    })
  }

  async saveimg (imgurl, saveimg) {
    return new Promise(async (resolve) => {
      request.get(imgurl, {timeout: 8000}).on('response', function (response) {
        console.log('state : ' + response.statusCode, ', type : ' + response.headers['content-type']) // 200
      }).on('error', function (err) {
        console.log(err)
        console.log(imgurl, saveimg)
      }).pipe(fs.createWriteStream(saveimg))
    })
  }
}

module.exports = InitJs
