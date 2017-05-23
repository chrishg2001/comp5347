var fs = require('fs')

module.exports.readFile = function(variable, filename){
  fs.readFile(filename, 'utf-8', function(err, data){
    variable = data;
    console.log(variable.parentNode());
  })
}
