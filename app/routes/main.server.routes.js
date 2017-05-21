var express = require('express')
var router = express.Router()
var controller = require('../controllers/main.server.controller.js')
router.get('/', controller.dbquery, controller.renderMain)
router.get('/data', controller.yearStats)
module.exports = router
