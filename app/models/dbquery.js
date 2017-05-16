var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/wikiarticles', function () {
  console.log('mongodb connected')
})

var RevisionSchema = new mongoose.Schema(
  {
    title: String,
    timestamp: String,
    user: String,
    anon: String
  },
  {
    versionKey:false
  }
)

RevisionSchema.statics.findArticles = function(title, callback){

	return this.find({'title':title}).sort({'timestamp':-1}).limit(1).exec(callback)
}

var result = mongoose.model('result', RevisionSchema, 'revisions')
console.log(result[0])

module.exports = result
