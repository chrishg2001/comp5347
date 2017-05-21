var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var main = require('./app/routes/main.server.routes')

var app = express()

app.locals.result = {}

app.set('views', path.join(__dirname,'app','views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', main)

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
