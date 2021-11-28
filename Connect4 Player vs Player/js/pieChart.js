      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart);

      function drawChart(red, yellow, draw) {

        var data = google.visualization.arrayToDataTable([
          ['Player', 'Wins'],
          ['Draw',     draw],
          ['Red',      red],
          ['Yellow',  yellow]
        ]);

        var options = {
          title: 'Game distribution pie:'
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart'));

        chart.draw(data, options);
      }
