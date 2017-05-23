google.charts.load('current', {packages: ['bar']});

var options = {'title':"Revisions by Year  ",
        'width':800,
        'height':600};

var data = []

function drawPie(){
  graphData = new google.visualization.DataTable();
  graphData.addColumn('string', 'Year');
  graphData.addColumn('number', 'Viewers');
  $.each(data, function(key, val) {
    graphData.addRow([key, val]);
  })
  var chart = new google.visualization.PieChart($("#myChart")[0]);
  chart.draw(graphData, options);
}

function drawBar(){
  graphData = new google.visualization.arrayToDataTable(data);
  var chart = new google.charts.Bar($("#myChart")[0]);
  chart.draw(graphData, google.charts.Bar.convertOptions(options));
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
