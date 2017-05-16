var express = require('express')
var dbquery = require('../models/dbquery')

module.exports.showStats=function(req, res){

  //Australia is being as placeholder atm
  dbquery.findArticles('Australia', function(err, result){
    if(err){
      console.log('Error retrieving query values')
    }
    else{
      console.log(result)
      res.render('page.pug', {result:result})
    }
  })

}
