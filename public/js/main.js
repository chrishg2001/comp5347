google.charts.load('current', {packages: ['bar']});
google.charts.load('current', {packages: ['corechart']});

var optionsBar = {'title':"Revisions by Year  ",
        'width':600,
        'height':450};

var options = {'title':"Revisions by Type  ",
        'width':600,
        'height':450};

var data = []

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

  // $.each(data, function(key, val) {
  //   graphData.addRow([key, val]);
  // })
  var chart = new google.visualization.PieChart($("#myChart")[0]);
  chart.draw(graphData, options);
}

function drawBar(){
  graphData = new google.visualization.arrayToDataTable(data);
  var chart = new google.charts.Bar($("#myChart")[0]);
  chart.draw(graphData, google.charts.Bar.convertOptions(optionsBar));
}

$(document).ready(function() {

    // if(data.length <= 0){
    //   setTimeout(function(){
    //     drawBar()
    //   }, 3000);
    // }

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
    });

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

    // $("#menu-toggle").click(function(e) {
    //     e.preventDefault();
    //     $("#wrapper").toggleClass("toggled");
    // });

});
