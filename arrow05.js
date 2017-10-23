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

    arrow.updateLength = function(mouseX, mouseY) {
      mouseDist = Math.sqrt((mouseX - this.center.x) ** 2 + (mouseY - this.center.y) ** 2);
      this.length = (mouseDist - 25) * 2;
    }

    // Returns the arrow to the callling function.
    return arrow;
  };

  // This is the function to run every frame of the program.
  function drawFrame(arrowList) {
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

    // Since there are now a whole bunch of arrows in an array, we loop
    // through the array, updating the rotation and then drawing each one.
    for (var i = 0; i < arrowList.length; i++) {
      arrow = arrowList[i];
      // Update the arrow's rotation.
      arrow.updateRotation(mouseX, mouseY);

      // Update the arrow's length.
      arrow.updateLength(mouseX, mouseY);

      // Save the context, set the transformation matrix,
      // translate to the arrow center, draw the arrow, retstore the context.
      context.save();
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.translate(arrow.center.x, arrow.center.y);
      context.rotate(arrow.rotation);
      arrow.draw(context);
      context.restore();
    }
  };

  // Run the drawFrame function, update the arrow's rotation, set timer to run again.
  // I slowed it down from 100 frames per second to 20 frames per second.
  // It still looks good.
  function gameLoop() {
    drawFrame(arrowList);
    window.setTimeout(gameLoop, 10);
  }

  // Global variables for drawing the canvas.
  // Now with mouse location properties!
  var canvas = $("#canvas")[0];
  var context = canvas.getContext("2d");
  var bgColor = "#000000";
  var frameColor = "#FFFFFF";
  var mouseX = 0;
  var mouseY = 0;

  // Initialize the arrowList array. Define common properties for all arrows.
  var arrowList = [];
  var arrowColor = "#FFFFFF";
  var arrowLength = 20;
  var arrowThickness = 1;
  var arrowCount = 0;
  var arrowSeparation = 20;

  // Use a loop to locate the center of each arrow separately, and add it to the arrowList.
  for (var y = 0; y <= canvas.height; y += arrowSeparation) {
    arrowList[arrowCount++] = createArrow(0, y, arrowLength, arrowColor, arrowThickness);
    arrowList[arrowCount++] = createArrow(canvas.width, y, arrowLength, arrowColor, arrowThickness);
  }
  for (var x = arrowSeparation; x < canvas.width; x += arrowSeparation) {
    arrowList[arrowCount++] = createArrow(x, 0, arrowLength, arrowColor, arrowThickness);
    arrowList[arrowCount++] = createArrow(x, canvas.height, arrowLength, arrowColor, arrowThickness);
  }

  // Start it all off.
  gameLoop();
});
