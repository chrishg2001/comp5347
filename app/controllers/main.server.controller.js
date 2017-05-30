var express = require('express')
var dbquery = require('../models/dbquery')
var Sync = require('sync')
var dataparser = require('../models/dataparser')
var mediaWiki = require('../models/mediawiki')

module.exports.pullRequest=function(req, res){
  var article = req.query.article;
  var data = {}
  dbquery.articleLatestRevision(article, function(err, result){
    data["latestRevision"] = result[0]["_doc"]["timestamp"]
    console.log(result[0]["_doc"]["timestamp"])
    console.log(new Date())
    console.log(new Date() - Date.parse(result[0]["_doc"]["timestamp"]))
    if((new Date() - Date.parse(result[0]["_doc"]["timestamp"])) < 86400000){
      data["update"] = 0
      res.json(data)
    }
    else {
      // var revisionData = mediaWiki.updateRevisions(article, data["latestRevision"])
      mediaWiki.updateRevisions(article, data["latestRevision"], result[0]["_doc"]["timestamp"], function(revisionData){
        for(var i in revisionData){
          data[i] = revisionData[i]
          console.log(data[i])
        }
      console.log(revisionData)
      res.json(data)
      })
    }
  })
}

module.exports.getIndArticleData=function(req,res){
  var article = req.query.article
  var data = {}
  dbquery.getArticleRevisions(article, function(err, result){
    data['revisions'] = result
    dbquery.getArticleTopUsers(article, req.app.locals.admin, req.app.locals.bot, function(err, result){
      var topUsers = []
      for (var i in result){
        var user = result[i]["_id"]
        var revisions = result[i]["revisions"]
        topUsers.push([user, revisions])
      }
      data["topUsers"] = topUsers
      res.json(data)
    })
  })
}

module.exports.topUserYear=function(req, res){
  var articleName = req.params["articleName"]
  var user = req.params["user"]
  dbquery.getArticleUserYear(articleName, user, function(err, result){
    var array = []
    array.push(user)
    var revisionUser = {}
    for(var year in result){
      revisionUser[result[year]["_id"]] = result[year]["revisions"]
    }
    array.push(revisionUser)
    console.log(array)
    res.json(array)
  })
}

module.exports.groupByArticleUser=function(req, res){
  var article = req.query.article
  var data = {}
  dbquery.groupArticleByYear(article, req.app.locals.admin, function(err, result){
    console.log(result)
    var admin = {}
    for(var i in result){
      var year = result[i]["_id"]
      var revisions = result[i]["revisions"]
      admin[year] = revisions
    }
    data['admin'] = admin
    dbquery.groupArticleByYear(article, req.app.locals.bot, function(err, result){
      var bot = {}
      for(var i in result){
        var year = result[i]["_id"]
        var revisions = result[i]["revisions"]
        bot[year] = revisions
      }
      data['bot'] = bot
      dbquery.groupByArticleAnon(article, function(err, result){
        var anon = {}
        for(var i in result){
          var year = result[i]["_id"]
          var revisions = result[i]["revisions"]
          anon[year] = revisions
        }
        data['anon'] = anon
        dbquery.groupByArticleUsers(article, req.app.locals.admin, req.app.locals.bot, function(err, result){
          var users = {}
          for(var i in result){
            var year = result[i]["_id"]
            var revisions = result[i]["revisions"]
            users[year] = revisions
          }
          data['users'] = users
          dbquery.groupByArticleTotal(article, function(err, result){
            var total = {}
            for(var i in result){
              var year = result[i]["_id"]
              var revisions = result[i]["revisions"]
              total[year] = revisions
            }
            data['total'] = total
            res.json(data)
          })
        })
      })
    })
  })
}

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
