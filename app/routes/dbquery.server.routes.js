var express = require('express')
var router = express.Router()
var controller = require('../controllers/dbquery.server.controller.js')
router.get('/', controller.showStats)
module.exports = router
