const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const NET_FACTOR = 50;

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

drawBackground();
