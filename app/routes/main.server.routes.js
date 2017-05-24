var express = require('express')
var router = express.Router()
var controller = require('../controllers/main.server.controller.js')
router.get('/', controller.renderMain)
router.get('/getarticledata', controller.dbquery, controller.sendJson)
router.get('/data', controller.yearStats)
module.exports = router
