var db = require('./dbinsert')
var mongoose = require('mongoose')

module.exports.updateRevisions=function(article, start, callback){
  var https = require('https')
  var wikiEndpointHost = "en.wikipedia.org",
    path = "/w/api.php"
    parameters = ["action=query",
    "format=json",
    "prop=revisions",
    "titles="+ encodeURIComponent(article),
    "rvstart="+start,
    "rvdir=newer",
    "rvlimit=max",
    "rvprop=timestamp|userid|user|ids|sha1|parsedcomment|size|minor|anon"],

  headers = {
    Accept: 'application/json',
    'Accept-Charset': 'utf-8'
  }

  var response = {}

  var full_path = path + "?" + parameters.join("&")
  var options = {
    host: wikiEndpointHost,
    path: full_path,
    headers: headers}

  https.get(options,function(res){
    var data ='';
    res.on('data',function(chunk){
      data += chunk
    })
    res.on('end',function(){
      json = JSON.parse(data);
      pages = json.query.pages
      revisions = pages[Object.keys(pages)[0]].revisions
      for(var revision in revisions){
        revisions[revision]["title"] = article
        // console.log(revisions[revision])
      }
      // console.log("There are " + revisions.length + " revisions.");
      response["updatedRevisions"] = revisions.length
      var users=[]
      for (revid in revisions){
        users.push(revisions[revid].user);
      }
      uniqueUsers = new Set(users);
      // console.log("The revisions are made by " + uniqueUsers.size + " unique users");
      response["uniqueUsers"] = uniqueUsers.size
      console.log(response)
      db.insertDocuments(revisions, function(err, result){
        callback(response);
      })
    })
  }).on('error',function(e){
    console.log(e)
  })
}
