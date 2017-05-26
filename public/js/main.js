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

var data = [];

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

function drawArticleBar(articleData){
  graphData = new google.visualization.arrayToDataTable(articleData);
  var chart = new google.charts.Bar($("#articleChart")[0]);
  chart.draw(graphData, google.charts.Bar.convertOptions(optionsArticleBar));
}

function loadArticle(e) {
  $("#articleTitle").empty();
  $("#totalRevisions").empty();
  $("#topRevisions").empty();
  $("#articleChart").empty();
  $("#articleTitle").append(e.params.data.text);
  $.get('./getIndArticleData?article=' + e.params.data.text, function(rdata){
    $("#totalRevisions").append("There are " + rdata["revisions"] + " total revisions.");
    $("#topRevisions").append("The top 5 active users are: <br>");
    for(var user in rdata["topUsers"]){
      $("#topRevisions").append(String(parseInt(user)+1) + ". " + rdata["topUsers"][user][0] + " with " + rdata["topUsers"][user][1] + " total revisions. <br>");
    }
  })
  // $("#topRevisions").append(e.params.data.text);
  $.get('/groupByArticleUser?article=' + e.params.data.text, function(rdata){
    var articleUserYear = [["Year", "Admin", "Bot", "Anon", "User"]];
    for(var year in rdata["total"]){
      var array = []
      array.push(year)
      if(rdata["admin"][year]) array.push(rdata["admin"][year]);
      else array.push(0);
      if(rdata["bot"][year]) array.push(rdata["bot"][year]);
      else array.push(0);
      if(rdata["anon"][year]) array.push(rdata["anon"][year]);
      else array.push(0);
      array.push(parseInt(rdata["total"][year]) - array[1] - array[2] - array[3])
      articleUserYear.push(array)
    }
    drawArticleBar(articleUserYear)
  })
}

$(document).ready(function() {

    $.when(
      $.getJSON('/data',null, function(rdata) {
      	data = rdata
        drawBar()
      })
    ).then(function(){
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
    }).then(function(){
      $.get('/articleList', function(rdata){
        $("#articleSearch").select2({
          data: rdata,
          placeholder: "Select an article"
        });
      })
    });

    $("#page-content-wrapper-articles").hide();

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

    $("#articleSearch").on("select2:select", function(e){
      loadArticle(e);
    })


});
