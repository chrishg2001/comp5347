var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/wikiarticles', function () {
  console.log('mongodb connected')
})

var RevisionSchema = new mongoose.Schema(
)

RevisionSchema.statics.mostRevisions = function(req, callback){
  return this.aggregate([{$group:{_id:"$title",revisions:{$sum:1}}}, {$sort:{revisions:-1}}]).limit(1).exec(callback)
  // //longest history
  // stats[4] = this.find({}, {title:1}).sort({'timestamp':1}).limit(1).exec(callback)
  // //smallest history
  // stats[5] = this.find({}, {title:1}).sort({'timestamp':-1}).limit(1).exec(callback)

  // stats[1] = this.find({'title':'Australia'}, {title: 1, timestamp:1, parsedcomment:1, user: 1}).sort({'timestamp':-1}).limit(10).exec(callback)
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
  return this.find({}, {title:1}).sort({'timestamp':1}).limit(1).exec(callback)
}

RevisionSchema.statics.shortestHistory = function(title, callback){
  return this.find({}, {title:1}).sort({'timestamp':-1}).limit(1).exec(callback)
}

RevisionSchema.statics.groupByYear = function(title, callback){
  return this.aggregate([{$group:{_id:{$substr:["$timestamp", 0, 4]},revisions:{$sum:1}}}, {$sort:{_id:1}}]).exec(callback)
}

var result = mongoose.model('result', RevisionSchema, 'revisions')

module.exports = result
