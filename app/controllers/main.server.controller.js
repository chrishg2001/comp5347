var express = require('express')
var dbquery = require('../models/dbquery')
var Sync = require('sync')
var dataparser = require('../models/dataparser')

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
  local = {}
  dbquery.groupByYear(req.app.locals.admin, function(err, result){
      for(var line in result){
        local[result[line]["_id"]] = [result[line]["revisions"]]
      }
      dbquery.groupByYear(req.app.locals.bot, function(err, result){
          for(var line in local){
            local[line][1] = 0
          }

          for(var line in result){
            local[result[line]["_id"]][1] = result[line]["revisions"]
          }
          dbquery.groupByAnon(null, function(err, result){
              for(var line in result){
                local[result[line]["_id"]][2] = result[line]["revisions"]
              }
              dbquery.groupByTotalYear(null, function(err, result){
                  for(var line in result){
                    local[result[line]["_id"]][3] = result[line]["revisions"] - local[result[line]["_id"]][2] - local[result[line]["_id"]][1] - local[result[line]["_id"]][0]
                  }
                  data = []
                  dataparser.arrayPush(data, local, function(result){
                    console.log(result)
                    res.json(result);
                  })
                  // res.json(local);
                })
            })
        })
    })
}
