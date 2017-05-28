google.charts.load('current', {packages: ['bar']});
google.charts.load('current', {packages: ['corechart']});

var optionsBar = {'title':"Revisions by Year  ",
        'width':600,
        'height':450};

var options = {'title':"Revisions by Type  ",
        'width':600,
        'height':450};

var optionsArticleBar = {'title':"Revisions by Year and User Type ",
        'width':600,
        'height':450};

var optionsArticlePie = {'title':"Revisions by User Type ",
        'width':600,
        'height':450};

var optionsArticleUsers = {'title':"Revisions by User and Year ",
        'width':600,
        'height':450};

var data = [];
var articleData;
var topUsers;
var topUserData;
var articleName;
var selectedUsers = [];

function drawPie(){
  graphData = new google.visualization.DataTable();
  graphData.addColumn('string', 'Type');
  graphData.addColumn('number', 'Revisions');
  var admin = 0
  var bot = 0
  var anon = 0
  var user = 0
  for (var row in data){
    if(row === "0") {continue; }
    var admin = admin + data[row][1];
    var bot = bot + data[row][2];
    var anon = anon + data[row][3];
    var user = user + data[row][4];
  }

  graphData.addRow(["Admin", admin]);
  graphData.addRow(["Bot", bot]);
  graphData.addRow(["Anon", anon]);
  graphData.addRow(["User", user]);

  var chart = new google.visualization.PieChart($("#myChart")[0]);
  chart.draw(graphData, options);
}

function drawBar(){
  graphData = new google.visualization.arrayToDataTable(data);
  var chart = new google.charts.Bar($("#myChart")[0]);
  chart.draw(graphData, google.charts.Bar.convertOptions(optionsBar));
}

function drawArticleBar(rdata){
  var articleUserYear = [["Year", "Admin", "Bot", "Anon", "User"]];
  for(var year in rdata["users"]){
    var array = []
    array.push(year)
    if(rdata["admin"][year]) array.push(rdata["admin"][year]);
    else array.push(0);
    if(rdata["bot"][year]) array.push(rdata["bot"][year]);
    else array.push(0);
    if(rdata["anon"][year]) array.push(rdata["anon"][year]);
    else array.push(0);
    array.push(rdata["users"][year])
    articleUserYear.push(array)
  }

  graphData = new google.visualization.arrayToDataTable(articleUserYear);
  var chart = new google.charts.Bar($("#articleChart")[0]);
  chart.draw(graphData, google.charts.Bar.convertOptions(optionsArticleBar));
}

function drawArticlePie(articleData){
  graphData = new google.visualization.DataTable();
  graphData.addColumn('string', 'Type');
  graphData.addColumn('number', 'Revisions');
  var admin = 0
  var bot = 0
  var anon = 0
  var user = 0
  for (var year in articleData["admin"]){
    admin = parseInt(admin) + parseInt(articleData["admin"][year])
  }
  for (var year in articleData["bot"]){
    bot = parseInt(bot) + parseInt(articleData["bot"][year])
  }
  for (var year in articleData["anon"]){
    anon = parseInt(anon) + parseInt(articleData["anon"][year])
  }
  for (var year in articleData["users"]){
    user = parseInt(user) + parseInt(articleData["users"][year])
  }

  graphData.addRow(["Admin", admin]);
  graphData.addRow(["Bot", bot]);
  graphData.addRow(["Anon", anon]);
  graphData.addRow(["User", user]);

  var chart = new google.visualization.PieChart($("#articleChart")[0]);
  chart.draw(graphData, optionsArticlePie);
}

function drawArticleUsersBar(topUsers){
  var userData = [["Year"]];
  for(var user in topUsers){
    userData[0].push(topUsers[user])
  }

  dict = {}

  for(var user in topUserData){
    for(var topUser in topUsers){
      if(topUsers[topUser] === user){
        for(var year in topUserData[user]){
          if(dict[year] === undefined){
            dict[year] = []
            for(var i = 0; i < topUsers.length; i++){
              dict[year].push(0)
            }
          }
          dict[year][topUser] = topUserData[user][year]
        }
      }
    }
  }

  console.log(dict)

  for(var indexk in Object.keys(dict).sort()){
    var key = Object.keys(dict)[indexk]
    var row = [key]
    for(var index in dict[key]){
      row.push(dict[key][index])
    }
    console.log(row);
    userData.push(row);
  }

  graphData = new google.visualization.arrayToDataTable(userData);
  var chart = new google.charts.Bar($("#articleChart")[0]);
  chart.draw(graphData, google.charts.Bar.convertOptions(optionsArticleUsers));
}

function totalRevisions(rdata){
  $("#totalRevisions").append("There are " + rdata["revisions"] + " total revisions.");
  $("#topRevisions").append("The top 5 active users are: <br>");
  topUsers = []
  topUserData = {}
  for(var user in rdata["topUsers"]){
    $("#topRevisions").append(String(parseInt(user)+1) + ". " + rdata["topUsers"][user][0] + " with " + rdata["topUsers"][user][1] + " total revisions. <br>");
    // topUsers.push(rdata["topUsers"][user][0])
    console.log(rdata["topUsers"][user][0])
    topUsers.push(rdata["topUsers"][user][0])
    // var request = "/topUserYear?data=" + articleName + "%26%26" + rdata["topUsers"][user][0]
    var request = "/topUserYear/" + articleName + "/" + rdata["topUsers"][user][0]
    console.log(request)
    $.get(request, function(resdata){
      topUserData[resdata[0]] = resdata[1]
    })
  }
}

function updateRevisions(rdata){
  if(rdata["update"] === undefined){
    $("#updateRevisions").append("Pull requests made. Total number of additional revisions: " + rdata["updatedRevisions"]);
  }
  else{
    $("#updateRevisions").append("No pull requests made.");
  }
}

function loadArticle(e) {
  $("#articleTitle").empty();
  $("#totalRevisions").empty();
  $("#topRevisions").empty();
  $("#articleChart").empty();
  $("#updateRevisions").empty();
  articleName = e.params.data.text;
  $("#articleTitle").append(e.params.data.text);
  $.get('./getIndArticleData?article=' + e.params.data.text, function(rdata){
    totalRevisions(rdata);
    updateRevisions(rdata);
  })
  // $("#topRevisions").append(e.params.data.text);
  $.get('/groupByArticleUser?article=' + e.params.data.text, function(rdata){
    articleData = rdata
    drawArticleBar(articleData)
  })
}

$(document).ready(function() {

    // $.when(
      $.getJSON('/data',null, function(rdata) {
      	data = rdata
        drawBar()
      })
    // ).then(function(){
      $.get('/getarticledata?data=mostRevisions', function(rdata){
        var text = "The article with the most revisions is " + rdata["_id"] + " with "+ String(rdata["revisions"]) + " revisions.";
        $("#mostRevisions").text(text);
      });
      $.get('/getarticledata?data=leastRevisions', function(rdata){
        var text = "The article with the least revisions is " + rdata["_id"] + " with "+ String(rdata["revisions"]) + " revisions.";
        $("#leastRevisions").text(text);
      });
      $.get('/getarticledata?data=mostRegisteredUsers', function(rdata){
        var text = "The article with the most unique registered users is " + rdata["_id"] + " with "+ String(rdata["uniqueUserCount"]) + " users.";
        $("#mostRegisteredUsers").text(text);
      });
      $.get('/getarticledata?data=leastRegisteredUsers', function(rdata){
        var text = "The article with the least unique registered users is " + rdata["_id"] + " with "+ String(rdata["uniqueUserCount"]) + " users.";
        $("#leastRegisteredUsers").text(text);
      });
      $.get('/getarticledata?data=longestHistory', function(rdata){
        var text = "The article with the longest history is " + rdata["title"] + " with the earliest revision on "+ String(rdata["timestamp"]).substring(0,10) + ".";
        $("#longestHistory").text(text);
      });
      $.get('/getarticledata?data=shortestHistory', function(rdata){
        var text = "The article with the shortest history is " + rdata["title"] + " with the lastest revision on "+ String(rdata["timestamp"]).substring(0,10) + ".";
        $("#shortestHistory").text(text);
      });
    // }).then(function(){
      $.get('/articleList', function(rdata){
        $("#articleSearch").select2({
          data: rdata,
          placeholder: "Select an article"
        });
      })
    // });

    $("#page-content-wrapper-articles").hide();
    $("#articleChartToggle").hide();
    $("#graphTopUsers").hide();

    $("#pie").click(function(event){
      event.preventDefault();
      if(data.length <= 0){
        setTimeout(function(){
        	drawPie()
        }, 1000);
      } else {
        drawPie()
      }
   	})

   	$("#bar").click(function(event){
      event.preventDefault();
      if(data.length <= 0){
        setTimeout(function(){
        	drawBar()
        }, 1000);
      } else {
        drawBar()
      }
   	})

    $("#overall").click(function(e) {
        e.preventDefault();
        $("#page-content-wrapper-articles").hide();
        $("#page-content-wrapper-overall").show();
    });

    $("#article-statistics").click(function(e) {
        e.preventDefault();
        $("#page-content-wrapper-overall").hide();
        $("#page-content-wrapper-articles").show();
    });

    $("#articleBarChart").click(function(e) {
        e.preventDefault();
        $("#userSearch").parent().hide();
        drawArticleBar(articleData);
    });

    $("#articlePieChart").click(function(e) {
        e.preventDefault();
        $("#userSearch").parent().hide();
        drawArticlePie(articleData);
    });

    $("#articleTopFive").click(function(e) {
        e.preventDefault();
        console.log(topUsers);
        console.log(topUserData);
        $("#articleChart").empty();
        $("#userSearch").parent().show();
        $("#userSearch").select2({
          data: topUsers,
          placeholder: "Select users to graph",
          multiple: "multiple"
        });
        $("#graphTopUsers").show();
    });

    $("#graphTopUsers").click(function(e){
      e.preventDefault();
      drawArticleUsersBar(selectedUsers);
    });


    // $("#userSearch").on("select2:select", function(e){
    //   loadArticle(e);
    //   $("#articleChartToggle").show();
    // })


    $("#articleSearch").on("select2:select", function(e){
      loadArticle(e);
      $("#articleChartToggle").show();
      $("#userSearch").empty();
      $("#userSearch").parent().hide();
      selectedUsers = []
    })

    $("#userSearch").on("select2:select", function(e){
      selectedUsers.push(e.params.data.text)
    })

    $("#userSearch").on("select2:unselect", function(e){
      var index = selectedUsers.indexOf(e.params.data.text)
      if(index > -1){
        selectedUsers.splice(index, 1);
      }
    })
});
