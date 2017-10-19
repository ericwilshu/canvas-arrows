$(function() {
  // Global variables for drawing the canvas.
  var canvas = $("#canvas")[0];
  var context = canvas.getContext("2d");
  var bgColor = "#FFFFFF";
  var frameColor = "#000000";

  // Define the arrow object's properties.
  arrow = {};
  arrow.center = {x: canvas.width / 2, y: canvas.height / 2};
  arrow.length = 500;
  arrow.color = "#009900";
  arrow.thickness = 6;
  arrow.rotation = 0;

  // Define a method to draw the arrow.
  arrow.draw = function(context) {
    context.strokeStyle = this.color;
    context.lineWidth = this.thickness;
    context.beginPath();
    context.moveTo((-this.length / 2), 0);
    context.lineTo((this.length / 2) , 0);
    context.lineTo((this.length / 4), (this.length / 4));
    context.moveTo((this.length / 2), 0);
    context.lineTo((this.length / 4), -(this.length / 4));
    context.stroke();
    context.closePath();
  };

  // This is the function to run every frame of the program.
  function drawFrame() {
    // Use global variables to draw the canvas bg and frame.
    context.fillStyle = bgColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = frameColor;
    context.strokeRect(0, 0, canvas.width, canvas.height);

    // Save the context, set the transformation matrix,
    // translate to the arrow center, draw the arrow, retstore the context.
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.translate(arrow.center.x, arrow.center.y);
    context.rotate(arrow.rotation);
    arrow.draw(context);
    context.restore();
  };

  // Run the drawFrame function, update the arrow's rotation, set timer to run again.
  function gameLoop() {
    drawFrame();
    arrow.rotation += 0.1;
    if (arrow.rotation > Math.PI * 2) {
      arrow.rotation -= (Math.PI * 2);
    }
    window.setTimeout(gameLoop, 10);
  }

  // Start it all off.
  gameLoop();

});
