var express = require('express')
var dbquery = require('../models/dbquery')
var Sync = require('sync')
var dataparser = require('../models/dataparser')

module.exports.getArticles=function(req, res){
  dbquery.getArticles(req, function(err, result){
    if(err){
      console.log('Error retrieving query values')
    }
    else{
        res.json(result);
    }
  })
}

module.exports.dbquery=function(req, res, next){
  var data = req.query.data
  if (data === "mostRevisions"){
      dbquery.mostRevisions(req, function(err, result){
        if(err){
          console.log('Error retrieving query values')
        }
        else{
          req.app.locals.result = result[0]
        }
        return next();
      })
  }
  else if (data === "leastRevisions"){
      dbquery.leastRevisions(req, function(err, result){
        if(err){
          console.log('Error retrieving query values')
        }
        else{
          req.app.locals.result = result[0]
        }
        return next();
      })
  }
  else if (data === "mostRegisteredUsers"){
      dbquery.mostRegisteredUsers(req, function(err, result){
        if(err){
          console.log('Error retrieving query values')
        }
        else{
          req.app.locals.result = result[0]
        }
        return next();
      })
  }

  else if (data === "leastRegisteredUsers"){
      dbquery.leastRegisteredUsers(req, function(err, result){
        if(err){
          console.log('Error retrieving query values')
        }
        else{
          req.app.locals.result = result[0]
        }
        return next();
      })
  }

  else if (data === "longestHistory"){
      dbquery.longestHistory(req, function(err, result){
        if(err){
          console.log('Error retrieving query values')
        }
        else{
          req.app.locals.result = result[0]
        }
        return next();
      })
  }

  else if (data === "shortestHistory"){
      dbquery.shortestHistory(req, function(err, result){
        if(err){
          console.log('Error retrieving query values')
        }
        else{
          req.app.locals.result = result[0]
        }
        return next();
      })
  }

  else {
    return next();
  }
}

module.exports.renderMain=function(req, res){
  console.log(req.app.locals.result)
  return res.render('page.ejs')
}

module.exports.sendJson=function(req, res){
  res.json(req.app.locals.result);
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
