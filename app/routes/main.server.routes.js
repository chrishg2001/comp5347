var express = require('express')
var router = express.Router()
var controller = require('../controllers/main.server.controller.js')
router.get('/', controller.renderMain)
router.get('/getarticledata', controller.dbquery, controller.sendJson)
router.get('/data', controller.yearStats)
router.get('/articleList', controller.getArticles)
router.get('/getIndArticleData', controller.getIndArticleData)
router.get('/groupByArticleUser', controller.groupByArticleUser)
router.get('/topUserYear/:articleName/:user', controller.topUserYear)
module.exports = router
