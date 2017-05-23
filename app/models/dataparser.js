module.exports.arrayPush = function(data, local, callback){
  data.push(['Year', 'Admin', 'Bot', 'Anon', 'User'])
  for(var i in local){
    var array = []
    array.push(i)
    array.push(local[i][0])
    array.push(local[i][1])
    array.push(local[i][2])
    array.push(local[i][3])
    data.push(array)
  }
  callback(data)
}
