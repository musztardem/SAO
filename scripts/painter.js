const NET_DIVISOR = 50;

class Painter {
  constructor() {
    this._canvas = document.getElementById('board');
    this._ctx = this._canvas.getContext('2d');
  }

  _drawBackground() {
    /* background color */
    this._ctx.fillStyle = Colors.grey;
    this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);

    /* net */
    this._ctx.strokeStyle = Colors.blue;
    for (let i = 0; i < this._canvas.width / NET_DIVISOR; i++) {
      this._ctx.beginPath();
      this._ctx.moveTo(i * NET_DIVISOR, 0);
      this._ctx.lineTo(i * NET_DIVISOR, this._canvas.height);
      this._ctx.stroke();
    }

    for (let i = 0; i < this._canvas.height / NET_DIVISOR; i++) {
      this._ctx.beginPath();
      this._ctx.moveTo(0, i * NET_DIVISOR);
      this._ctx.lineTo(this._canvas.width, i * NET_DIVISOR);
      this._ctx.stroke();
    }
  }

  _drawCities() {
    this._ctx.strokeStyle = Colors.yellow;
    this._ctx.fillStyle = Colors.yellow;

    this._cities.forEach(city => {
      let radius = 10;
      this._ctx.beginPath();
      this._ctx.arc(city.x, city.y, radius, 0, 2 * Math.PI, false);
      this._ctx.fill();
      this._ctx.stroke();
    });
  }

  _drawConnections() {
    this._ctx.strokeStyle = Colors.orange;
    for (let i = 0; i < this._cities.length; i++ ) {
      let currCityIndex = i;
      let nextCityIndex = (i+1) % this._cities.length;

      this._ctx.beginPath();
      this._ctx.moveTo(this._cities[currCityIndex].x, this._cities[currCityIndex].y);
      this._ctx.lineTo(this._cities[nextCityIndex].x, this._cities[nextCityIndex].y);
      this._ctx.stroke();
    }
  }

  paint(cities) {
    this._cities = cities;
    this._drawBackground();
    this._drawConnections();
    this._drawCities();
  }
}

const painter = new Painter();
painter.paint(cities);
