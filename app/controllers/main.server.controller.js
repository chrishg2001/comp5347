var express = require('express')
var dbquery = require('../models/dbquery')

module.exports.dbquery=function(req, res, next){
  dbquery.mostRevisions(req, function(err, result){
    if(err){
      console.log('Error retrieving query values')
    }
    else{
      req.app.locals.result[0] = result
    }
  })

  dbquery.leastRevisions(req, function(err, result){
    if(err){
      console.log('Error retrieving query values')
    }
    else{
      req.app.locals.result[1] = result
      dbquery.mostRevisions();
    }
  })

  dbquery.mostRegisteredUsers(req, function(err, result){
    if(err){
      console.log('Error retrieving query values')
    }
    else{
      req.app.locals.result[2] = result
      dbquery.leastRevisions();
    }
  })

  dbquery.leastRegisteredUsers(req, function(err, result){
    if(err){
      console.log('Error retrieving query values')
    }
    else{
      req.app.locals.result[3] = result
      dbquery.mostRegisteredUsers();
    }
  })

  dbquery.longestHistory(req, function(err, result){
    if(err){
      console.log('Error retrieving query values')
    }
    else{
      req.app.locals.result[4] = result
      dbquery.leastRegisteredUsers();
    }
  })

  dbquery.shortestHistory(req, function(err, result){
    if(err){
      console.log('Error retrieving query values')
    }
    else{
      req.app.locals.result[5] = result
      dbquery.shortestHistory();
      return next();
    }
  })
}

module.exports.renderMain=function(req, res){
  console.log(req.app.locals.result)
  return res.render('page.pug', {result:req.app.locals.result})
}

module.exports.yearStats=function(req,res){
  dbquery.groupByYear(req, function(err, result){
    var data = {}
    for (var line in result){
      data[result[line]['_id']] = result[line]['revisions']
    }
    res.json(data);
  })
}
