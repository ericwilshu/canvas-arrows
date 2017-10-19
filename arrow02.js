$(function() {
  // Global variables for drawing the canvas.
  // Now with mouse location properties!
  var canvas = $("#canvas")[0];
  var context = canvas.getContext("2d");
  var bgColor = "#FFFFFF";
  var frameColor = "#000000";
  var mouseX = 0;
  var mouseY = 0;

  // Define the arrow object's properties.
  arrow = {};
  arrow.center = {x: canvas.width / 2, y: canvas.height / 2};
  arrow.length = 100;
  arrow.color = "#000000";
  arrow.thickness = 2;
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

  // Define a method to update the arrow's rotation based on the mouse position.
  arrow.getRotation = function() {
    var adjacent = mouseX - this.center.x;
    var opposite = mouseY - this.center.y;
    // Oooooh... Trigonometry...
    angle = Math.atan(1.0 * opposite / adjacent);
    if (adjacent < 0) {
      angle -= Math.PI;
    }
    return angle;
  };

  // This is the function to run every frame of the program.
  function drawFrame() {
    // This code gets the mouse position relative to the upper left corner of the canvas.
    $("#canvas").mousemove(function(e) {
      mouseX = e.pageX - canvas.offsetLeft;
      mouseY = e.pageY - canvas.offsetTop;
      //console.log("mouseX: " + mouseX + "   mouseY: " + mouseY);
    });

    // Update the arrow's rotation.
    arrow.rotation = arrow.getRotation();

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
    // Don't need to update the arrow's rotation here anymore. It happens in drawFrame.
    /*
    arrow.rotation += 0.1;
    if (arrow.rotation > Math.PI * 2) {
      arrow.rotation -= (Math.PI * 2);
    }
    */
    window.setTimeout(gameLoop, 10);
  }

  // Start it all off.
  gameLoop();

});
