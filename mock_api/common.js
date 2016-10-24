// var proxyMidWare = require('./proxy').proxyMidWare
var Mock = require('mockjs')

module.exports = function(app) {
  var apiPrefix = app.get('apiPrefix')

  app.get(apiPrefix + '/news', function(req, res, next) {
    var data = Mock.mock({
      total: 100,
      'list|10': [{
        title: '@csentence(10,20)',
        origin: '@cword(4,8)',
        date: '@date("yyyy-MM-dd")',
        url: '@url("http")'
      }]
    })
    res.json(data)
  })
}
