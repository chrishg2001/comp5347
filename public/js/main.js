google.charts.load('current', {packages: ['bar']});
google.charts.load('current', {packages: ['corechart']});

var optionsBar = {'title':"Revisions by Year  ",
        'width':800,
        'height':600};

var options = {'title':"Revisions by Type  ",
        'width':800,
        'height':600};

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
    var bot = admin + data[row][2];
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

    $.getJSON('/data',null, function(rdata) {
    	data = rdata
    }
    );

    $("#pie").click(function(event){
    	event.preventDefault();
    	drawPie()
   	})

   	$("#bar").click(function(event){
    	event.preventDefault();
    	drawBar()
   	})

});
