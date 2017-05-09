google.charts.load('current', {'packages':['line']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  const cd = new ChartDrawer();
  let s = setInterval(() => {
    cd.setData(ga.getGatheredData());
    cd.drawChart();
  }, 1000);

}

class ChartDrawer {
  constructor() {
    this._data = new google.visualization.DataTable();
    this._chart = new google.charts.Line(document.getElementById('chart_div'));
    this._setColumns();
    this._setOptions();
  }

  _setColumns() {
    this._data.addColumn('number', 'Generation');
    this._data.addColumn('number', 'Max fitness');
    this._data.addColumn('number', 'Average fitness');
    this._data.addColumn('number', 'Min fitness');
  }

  _setOptions() {
    this._options = {
      chart: {
        title: 'Fitness chart of GA population',
      },
      width: 900,
      height: 500,
      hAxis: {
        title: 'Generation'
      },
      vAxis: {
        title: 'Fitness'
      }
    };
  }

  setData(data) {
    this._data.addRows(data);
  }

  drawChart() {
    this._chart.draw(this._data, google.charts.Line.convertOptions(this._options));
  }
}
