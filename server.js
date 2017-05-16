var express = require('express');
var path = require('path');

// Extended functionality
//var favicon = require('serve-favicon');
//var logger = require('morgan');
//var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');
var dbquery = require('./app/routes/dbquery.server.routes')
var app = express()

app.set('views', path.join(__dirname,'app','views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', dbquery)
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
