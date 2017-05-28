var mongoose = require('mongoose')
var db = mongoose.connection;

module.exports.insertDocuments=function(documents, callback){
  var result = db.collection('revisions').insert(documents)
  callback(result)
}
