$(function() {
  // Now all the arrow object code is put together in one function.
  // Now we can make more than one arrow by repeatedly calling this function.
  function createArrow(centerX, centerY, length, color, thickness) {

    // Define the arrow object's properties.
    arrow = {};
    arrow.center = {x: centerX, y: centerY};
    arrow.length = length;
    arrow.color = color;
    arrow.thickness = thickness;
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
    // It used to return the new rotation to the calling function, which would then
    // feed it back to the arrow later, but that is pointless. Now this method updates
    // the arrow's rotation directly, and doesn't need to return anything.
    arrow.updateRotation = function(mouseX, mouseY) {
      var adjacent = mouseX - this.center.x;
      var opposite = mouseY - this.center.y;
      angle = Math.atan(1.0 * opposite / adjacent);
      if (adjacent < 0) {
        angle -= Math.PI;
      }
      this.rotation = angle;
    };

    // Returns the arrow to the callling function.
    return arrow;

  };


  // Global variables for drawing the canvas.
  // Now with mouse location properties!
  var canvas = $("#canvas")[0];
  var context = canvas.getContext("2d");
  var bgColor = "#FFFFFF";
  var frameColor = "#000000";
  var mouseX = 0;
  var mouseY = 0;

  // Create a couple of arrows with different properties.
  arrow1 = createArrow(20, 20, 40, "#FF0000", 1);
  arrow2 = createArrow(465, 465, 70, "#00FF00", 2);

  // This is the function to run every frame of the program.
  function drawFrame() {
    $("#canvas").mousemove(function(e) {
      mouseX = e.pageX - canvas.offsetLeft;
      mouseY = e.pageY - canvas.offsetTop;
      //console.log("mouseX: " + mouseX + "   mouseY: " + mouseY);
    });

    // Use global variables to draw the canvas bg and frame.
    context.fillStyle = bgColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = frameColor;
    context.strokeRect(0, 0, canvas.width, canvas.height);

    // Update both arrows rotations.
    arrow1.updateRotation(mouseX, mouseY);
    arrow2.updateRotation(mouseX, mouseY);

    // Save the context, set the transformation matrix,
    // translate to the arrow center, draw the arrow, retstore the context.
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.translate(arrow1.center.x, arrow1.center.y);
    context.rotate(arrow1.rotation);
    arrow1.draw(context);
    context.restore();

    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.translate(arrow2.center.x, arrow2.center.y);
    context.rotate(arrow2.rotation);
    arrow2.draw(context);
    context.restore();

  };

  // Run the drawFrame function, update the arrow's rotation, set timer to run again.
  function gameLoop() {
    drawFrame();
    window.setTimeout(gameLoop, 10);
  }

  // Start it all off.
  gameLoop();

});
