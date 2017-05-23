var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var fs = require('fs')

var main = require('./app/routes/main.server.routes')
var fr = require('./app/controllers/filereader.controller.js')

var app = express()

app.locals.result = {}
app.locals.admin = {}
app.locals.bot = {}

app.set('views', path.join(__dirname,'app','views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', main)

app.listen(3000, function () {
  //read admin usernames
  fs.readFile("admin.txt", 'utf8', function(err, data){
    app.locals.admin = data.split("\n")
  });
  //read bot usernames
  fs.readFile("bot.txt", 'utf8', function(err, data){
    app.locals.bot = data.split("\n")
  });

  console.log('Example app listening on port 3000!')
})
