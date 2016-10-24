var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var app = express()

var mockApi = require('./mock_api').mockApi
app.set('apiPrefix', '/api/v1')

/*
 * mockapi中间件放到bodyparser前面，否则由于代理的问题导致请求被挂起，类似的相关问题：
 * https://github.com/nodejitsu/node-http-proxy/issues/1˜80
 * https://github.com/nodejitsu/node-http-proxy/issues/168#issuecomment-3289492
 */
mockApi(app)

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// load the cookie-parsing middleware
app.use(cookieParser())

var server = app.listen(3030, function() {
  var host = server.address().address
  var port = server.address().port

  console.log('Mock server listening at http://%s:%s', host, port)
})
