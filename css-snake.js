      var widthOfPixel = 10; // Height of pixel will be the same, since we are using square pixels
      var widthStage = 60; // NUmber of blocks
      var heightStage = 60; // Number of blocks or virtual pixels (vixels. I know, seriously need to rename this)
      var numberOfBlocks = widthStage*widthOfPixel * heightStage*widthOfPixel / (10*10);
      var counter = 0;
      var board = $('#board');
      var speed = 100;
      var eventQueue = []; // All keystrokes will go to this event queue and will play in sequence, so that every keystroke gets at least one frame of response
      while(counter < numberOfBlocks) {
      	board.append('<div class="pixel number-'+counter+'"> </div>');
      	counter++;
      }
      
      function lightPixel(x,y) {
      	$('.number-'+(widthStage*y + x*1)).addClass('pixel-lighted');
      }
      function unlightPixel(x,y) {
      	$('.number-'+(widthStage*y + x*1)).removeClass('pixel-lighted');
      }
      
      
      /* defining snake object. Will have properties: length, direction */
      // directions up = 1, right = 2, left = 3, down = 4
      var up = 1, right = 2, left = 3, down = 4;
      function Snake() {
      	this.length = 8;
      	this.direction = right;
      	this.tailDirection = right;
      	this.untracedBends=[];//Stores coordinates of the bends untraced by the snake's tail 
      	this.moveUp=function() {
      		this.headPosition.y --;
      	}
      	this.moveRight=function() {
      		this.headPosition.x ++;
      	}
      	this.moveLeft = function() {
      		this.headPosition.x --;
      	}
      	this.moveDown = function() {
      		this.headPosition.y ++;
      	}
      	this.headPosition = {'x':30,'y':30};
      	this.create=function() {
      		// Un-light all pixels, and light up fresh set of pixels for a new snake
      		$('.pixel-lighted').removeClass('pixel-lighted');
      		// Place tim's head
      		lightPixel(this.headPosition.x, this.headPosition.y);
      		// Draw the rest of the body
      		for(pixelsDrawn=1; pixelsDrawn<this.length; pixelsDrawn++) {
      			lightPixel(this.headPosition.x - pixelsDrawn, this.headPosition.y);
      			this.tailPosition={'x':this.headPosition.x - pixelsDrawn, 'y':this.headPosition.y};
      		}
      	}
            this.continueMoving = function() {
                  //console.log("Continuing");
                  switch(this.direction) {
                        case up:
                              this.moveUp();
                              break;
                        case down:
                              this.moveDown();
                              break;
                        case right:
                              this.moveRight();
                              break;
                        case left:
                              this.moveLeft();
                              break;
                  }
            }
      }
      
      var tim = new Snake();
      tim.create();
      
      /* Engine will decide what will be drawn in the next frame */
      function roarEngine() {
            // This is the event loop which keeps entire game logic running

            // Un-draw the tail as the snake always moves forward
            unlightPixel(tim.tailPosition.x, tim.tailPosition.y);// Since tail moves forward, hide older tail pixel
            // Move tail forward as well 
            // Decide the new direction for the tail (as there might be a bend on current position)
            if(tim.untracedBends.length > 0) {
                  // Check for the last
                  console.log('X:'+tim.untracedBends[tim.untracedBends.length - 1].x+', '+tim.tailPosition.x);
                  console.log('Y:'+tim.untracedBends[tim.untracedBends.length - 1].y+', '+tim.tailPosition.y);
                  if(tim.untracedBends[tim.untracedBends.length - 1].x == tim.tailPosition.x &&
                        tim.untracedBends[tim.untracedBends.length - 1].y == tim.tailPosition.y) {
                        // This means that the tail of snake is on the oldest inflection point and should change direction now.
                        console.log("MATCH!!!");
                        tim.tailDirection = tim.untracedBends[tim.untracedBends.length - 1].direction;
                        tim.untracedBends.pop(); // Also remove that element from the array now, as direction of tail has now changed
                  }
            }
            //Decide the new position for the tail
            switch(tim.tailDirection) {
                  case right:
                  //console.log("Moving tail to right");
                        tim.tailPosition.x ++;
                        break;
                  case left:
                        tim.tailPosition.x --;
                        break;
                  case up:
                        tim.tailPosition.y --;
                        break;
                  case down:
                        tim.tailPosition.y ++;
                        break;
            }

            // Check for keystrokes to process, so that we can move the head accordingly, and inser those bends into the snake's body
            if(eventQueue.length > 0) {
                  // There are some pending keystrokes. Process those
                  var newDirection = eventQueue.shift();
                  switch(newDirection) {
                        case up:
                              tim.direction = up;
                              tim.untracedBends.unshift({'x':tim.headPosition.x, 'y':tim.headPosition.y, 'direction':up});
                              tim.moveUp();
                              break;
                        case right:
                              tim.direction = right;
                              tim.untracedBends.unshift({'x':tim.headPosition.x, 'y':tim.headPosition.y, 'direction':right});
                              tim.moveRight();
                              break;
                        case left:
                              tim.direction = left;
                              tim.untracedBends.unshift({'x':tim.headPosition.x, 'y':tim.headPosition.y, 'direction':left});
                              tim.moveLeft();
                              break;
                        case down:
                              tim.direction = down;
                              tim.untracedBends.unshift({'x':tim.headPosition.x, 'y':tim.headPosition.y, 'direction':down});
                              tim.moveDown();
                              break;
                        default:
                              // Game paused
                  }
            }
            else {
                  // Continue in existing direction
                  tim.continueMoving();
            }
                        // Draw the head
            lightPixel(tim.headPosition.x, tim.headPosition.y);
            // If the pixel to which snake has moved already had snake body
            if($('.number-'+(tim.headPosition.y + tim.headPosition.x*1)).hasClass('pixel-lighted')) {
                  //console.log($('.number-'+(tim.headPosition.y + tim.headPosition.x*1)));
                  alert("Out!");
            } else {
                  //console.log($('.number-'+(tim.headPosition.y + tim.headPosition.x*1)));
                  //console.log("Not out");
            }
      	
      }
      
      function startEngine() {
      	$(document).keydown(function(e) {
      		switch(e.keyCode) {
      			case 38:
                              eventQueue.push(up);
      				break;
      			case 39:
                              eventQueue.push(right);
      				break;
      			case 37:
                              eventQueue.push(left);
      				break;
      			case 40:
                              eventQueue.push(down);
      				break;
                        default:
                              break;
      		}
      });
      	window.setInterval(function() {
      		roarEngine();
      	}, speed);
      	
      }
      startEngine();
