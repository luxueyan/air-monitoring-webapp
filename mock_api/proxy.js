var proxy = require('express-http-proxy')
var parse = require('url').parse
var proxyHost = 'http://dev-pano.ktjr.com'

exports.proxyMidWare = proxy(proxyHost, {
  forwardPath: function(req, res) {
    return parse(req.url).path
  }
  // decorateRequest: setProxyAgent,
})
