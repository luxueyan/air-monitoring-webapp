var proxyMidWare = require('./proxy').proxyMidWare

module.exports = function(app) {
  var apiPrefix = app.get('apiPrefix')

  app.get(apiPrefix + '/sessions', proxyMidWare)
  app.post(apiPrefix + '/sessions', proxyMidWare)
  app.all(apiPrefix + '/registrations', proxyMidWare)
  app.all(apiPrefix + '/registrations/:content', proxyMidWare)
  app.post(apiPrefix + '/sessions', proxyMidWare)
  app.all(apiPrefix + '/cards', proxyMidWare)
  app.put(apiPrefix + '/cards/confirm', proxyMidWare)
  app.all(apiPrefix + '/accounts/:content', proxyMidWare)
}
