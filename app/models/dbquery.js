var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/wikiarticles', function () {
  console.log('mongodb connected')
})

var RevisionSchema = new mongoose.Schema()

RevisionSchema.statics.mostRevisions = function(req, callback){
  return this.aggregate([{$group:{_id:"$title",revisions:{$sum:1}}}, {$sort:{revisions:-1}}]).limit(1).exec(callback)
}

RevisionSchema.statics.leastRevisions = function(title, callback){
  return this.aggregate([{$group:{_id:"$title",revisions:{$sum:1}}}, {$sort:{revisions:1}}]).limit(1).exec(callback)
}

RevisionSchema.statics.mostRegisteredUsers = function(title, callback){
  return this.aggregate([{$group:{_id:"$title",uniqueCount:{$addToSet:"$user"}}}, {$project:{"CITY":1,uniqueUserCount:{$size:"$uniqueCount"}} }, {$sort:{uniqueUserCount:-1}}]).limit(1).exec(callback)
}

RevisionSchema.statics.leastRegisteredUsers = function(title, callback){
  return this.aggregate([{$group:{_id:"$title",uniqueCount:{$addToSet:"$user"}}}, {$project:{"CITY":1,uniqueUserCount:{$size:"$uniqueCount"}} }, {$sort:{uniqueUserCount:1}}]).limit(1).exec(callback)
}

RevisionSchema.statics.longestHistory = function(title, callback){
  return this.find({}, {title:1, timestamp:1}).sort({'timestamp':1}).limit(1).exec(callback)
}

RevisionSchema.statics.shortestHistory = function(title, callback){
  return this.find({}, {title:1, timestamp:1}).sort({'timestamp':-1}).limit(1).exec(callback)
}

RevisionSchema.statics.groupByYear = function(array, callback){
  return this.aggregate([{$match: {user: {$in: array}}}, {$group: {_id: {$substr:["$timestamp", 0, 4]}, revisions:{$sum:1}}}, {$sort:{_id:1}}]).exec(callback)
  // return this.aggregate([{$project:{year:{$substr:["$timestamp", 0, 4]}, user:1, anon:1}}]).limit(300000).exec(callback)
 }

RevisionSchema.statics.groupByAnon = function(array, callback){
 return this.aggregate([{$match: {anon: {$exists:true}}}, {$group: {_id: {$substr:["$timestamp", 0, 4]}, revisions:{$sum:1}}}, {$sort:{_id:1}}]).exec(callback) // return this.aggregate([{$project:{year:{$substr:["$timestamp", 0, 4]}, user:1, anon:1}}]).limit(300000).exec(callback)
}

RevisionSchema.statics.groupByTotalYear = function(array, callback){
  return this.aggregate([{$group: {_id: {$substr:["$timestamp", 0, 4]}, revisions:{$sum:1}}},{$sort:{_id:1}}]).exec(callback)
  // return this.aggregate([{$match: {anon: {$exists:false}, user: {$nin: array}, user: {$nin:array1}}}, {$group: {_id: {$substr:["$timestamp", 0, 4]}, revisions:{$sum:1}}},{$sort:{_id:1}}]).exec(callback)
}

RevisionSchema.statics.getArticles = function(article, callback){
  return this.distinct("title").exec(callback)
}

RevisionSchema.statics.getArticleRevisions = function(article, callback){
  return this.find({title:article}).count().exec(callback)
}

RevisionSchema.statics.getArticleTopUsers = function(article, admin, bot, callback){
  return this.aggregate([{$match: {title: article, user: {$nin: admin}, user: {$nin:bot}, anon: {$exists:false}}}, {$group: {_id: "$user", revisions:{$sum:1}}}, {$sort:{revisions:-1}}]).limit(5).exec(callback)
}

RevisionSchema.statics.groupArticleByYear = function(article, array, callback){
  return this.aggregate([{$match: {title:article, user: {$in: array}}}, {$group: {_id: {$substr:["$timestamp", 0, 4]}, revisions:{$sum:1}}}, {$sort:{_id:1}}]).exec(callback)
  // return this.aggregate([{$project:{year:{$substr:["$timestamp", 0, 4]}, user:1, anon:1}}]).limit(300000).exec(callback)
 }

RevisionSchema.statics.groupByArticleAnon = function(article, callback){
  return this.aggregate([{$match: {title: article, anon: {$exists:true}}}, {$group: {_id: {$substr:["$timestamp", 0, 4]}, revisions:{$sum:1}}}, {$sort:{_id:1}}]).exec(callback) // return this.aggregate([{$project:{year:{$substr:["$timestamp", 0, 4]}, user:1, anon:1}}]).limit(300000).exec(callback)
}

RevisionSchema.statics.groupByArticleUsers = function(article, array1, array2, callback){
 return this.aggregate([{$match: {title: article, user: {$nin: array1}, user: {$nin: array2}}}, {$group: {_id: {$substr:["$timestamp", 0, 4]}, revisions:{$sum:1}}}, {$sort:{_id:1}}]).exec(callback)
 // return this.aggregate([{$project:{year:{$substr:["$timestamp", 0, 4]}, user:1, anon:1}}]).limit(300000).exec(callback)
}

RevisionSchema.statics.groupByArticleTotal = function(article, callback){
 return this.aggregate([{$match: {title: article}}, {$group: {_id: {$substr:["$timestamp", 0, 4]}, revisions:{$sum:1}}}, {$sort:{_id:1}}]).exec(callback)
 // return this.aggregate([{$project:{year:{$substr:["$timestamp", 0, 4]}, user:1, anon:1}}]).limit(300000).exec(callback)
}

RevisionSchema.statics.getArticleUserYear = function(article, user, callback){
  return this.aggregate([{$match: {title: article, user: user}}, {$group: {_id: {$substr:["$timestamp", 0, 4]}, revisions:{$sum:1}}}]).exec(callback)
}

 var result = mongoose.model('result', RevisionSchema, 'revisions')

 module.exports = result
