// draw

function draw() {
  //   reset the translation back to default
  context.setTransform(1, 0, 0, 1, 0, 0);

  // clear screen before redrawing player
  context.clearRect(0, 0, canvas.width, canvas.height);
  console.log('player ', player);
  //   clamp the viewport to player
  const camX = -player.locX + canvas.width / 2;
  const camY = -player.locY + canvas.height / 2;
  //   translate allows us to move around
  context.translate(camX, camY);

  players.forEach((p) => {
    if (!p) return;
    context.beginPath();
    context.fillStyle = p.color;
    context.arc(p.locX, p.locY, p.radius, 0, 2 * Math.PI);
    // context.arc(200, 200, 10, 0, 2 * Math.PI);

    context.fill();
    context.lineWidth = 3;
    context.strokeStyle = 'rgb(0,255,0)';
    context.stroke();
  });

  orbs.forEach((orb) => {
    context.beginPath();
    context.fillStyle = orb.color;
    context.arc(orb.locX, orb.locY, orb.radius, 0, Math.PI * 2);
    context.fill();
  });
  ``;
  requestAnimationFrame(draw);
}

function drawOrb(orb) {
  context.beginPath();
  context.fillStyle = orb.color;
  context.arc(orb.locX, orb.locY, orb.radius, 0, Math.PI * 2);
  context.fill();
}

canvas.addEventListener('mousemove', (event) => {
  console.log(event);
  const mousePosition = {
    x: event.clientX,
    y: event.clientY,
  };
  //   calculates the angle between the mouse position and the center of the canvas. It uses Math.atan2() to get the angle in radians, which is then converted to degrees by multiplying by 180 / Math.PI.
  // mousePosition.x - canvas.width / 2 calculates the horizontal distance from the center of the canvas to the mouse position.
  // mousePosition.y - canvas.height / 2 calculates the vertical distance from the center of the canvas to the mouse position.
  // The result of Math.atan2() is an angle in radians that represents the angle between the positive x-axis and the line between the canvas center and the mouse position. This value is then converted to degrees.
  const angleDeg =
    (Math.atan2(
      mousePosition.y - canvas.height / 2,
      mousePosition.x - canvas.width / 2
    ) *
      180) /
    Math.PI;
  if (angleDeg >= 0 && angleDeg < 90) {
    // lower right quad
    xVector = 1 - angleDeg / 90;
    yVector = -(angleDeg / 90);
  } else if (angleDeg >= 90 && angleDeg <= 180) {
    // mouse is in lower left
    xVector = -(angleDeg - 90) / 90;
    yVector = -(1 - (angleDeg - 90) / 90);
  } else if (angleDeg >= -180 && angleDeg < -90) {
    // mouse is in upper left
    xVector = (angleDeg + 90) / 90;
    yVector = 1 + (angleDeg + 90) / 90;
  } else if (angleDeg < 0 && angleDeg >= -90) {
    // mouse is in upper right
    xVector = (angleDeg + 90) / 90;
    yVector = 1 - (angleDeg + 90) / 90;
  }

  // send vectors to server

  player.xVector = xVector ? xVector : 0.1;
  player.yVector = yVector ? yVector : 0.1;
});
