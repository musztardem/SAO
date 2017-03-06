const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const NET_FACTOR = 50;

const cities = [
  { x: 100, y: 100 },
  { x: 100, y: 200 },
  { x: 200, y: 300 },
  { x: 400, y: 400 },
  { x: 200, y: 500 },
  { x: 300, y: 600 },
  { x: 500, y: 500 },
  { x: 600, y: 600 },
  { x: 700, y: 400 },
  { x: 500, y: 300 },
  { x: 600, y: 200 },
  { x: 400, y: 100 },
];

const drawBackground = () => {
  /* background color */
  ctx.fillStyle = Colors.grey;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  /* net */
  ctx.strokeStyle = Colors.blue;
  for (let i = 0; i < canvas.width / NET_FACTOR; i++) {
    ctx.beginPath();
    ctx.moveTo(i * NET_FACTOR, 0);
    ctx.lineTo(i * NET_FACTOR, canvas.height);
    ctx.stroke();
  }

  for (let i = 0; i < canvas.height / NET_FACTOR; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * NET_FACTOR);
    ctx.lineTo(canvas.width, i * NET_FACTOR);
    ctx.stroke();
  }
}

const drawCities = () => {
  ctx.strokeStyle = Colors.yellow;
  ctx.fillStyle = Colors.yellow;

  cities.forEach(city => {
    let radius = 10;
    ctx.beginPath();
    ctx.arc(city.x, city.y, radius, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
  });
}

drawBackground();
drawCities();
