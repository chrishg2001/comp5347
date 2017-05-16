var express = require('express')
var path = require('path')
var bodyParser = require('body-parser');
var dbquery = require('./app/routes/dbquery.server.routes')

var app = express()

app.set('views', path.join(__dirname,'app','views'));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', dbquery)

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
