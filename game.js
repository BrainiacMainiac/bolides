/*jshint globals: false, unused: false, strict: false, debug: true, globalstrict: true, moz: true, browser: true, devel: true, jquery: true*/
var bolides = {
    canvas: {
        ctx: '',
    },
    // Attributes of the player's ship declared
    spaceship: {
        // Starting x and y
        x: 100,
        y: 100,
        // Starting speed
        speed: 0,
        // Starting angle
        angle: 0,
        // Starting direction
        direction: {
            x: 0,
            y: 0
        },
        // Starting health
        hearts: 3
    },
    // Attributes of the asteroids declared
    asteriod: {
        // Same attributes as the ship, aside from pos
        x: Math.floor(Math.random() * 50 + 800),
        y: Math.floor(Math.random() * 600 + 20),
        angle: 0,
        direction: {
            x: 0,
            y: 0
        },
        speed: 5
    },
    // Oh snap, Spaceship's got a gun!
    bullet : {
        // Coordinates
        x: 0,
        y: 0,
        // Speed is constant, btw.
        speed: 15,
        // Angle is spaceship's angle until fired
        angle: 0,
        // Direction stuff again! How advanced!
        direction: {
            x: 0,
            y: 0
        },
        // Is what it says on the tin
        isBeingFired: false,
        // Shooty gun
        fire: function() {
            bolides.bullet.isBeingFired = true;
            bolides.bullet.x = bolides.spaceship.x;
            bolides.bullet.y = bolides.spaceship.y;
            bolides.bullet.angle = bolides.spaceship.angle;
        }
    },
    // Images used by the project are created here
    images: {
        ship: document.createElement('img'),
        asteroid: document.createElement('img'),
        heart: document.createElement('img'),
        bullet: document.createElement("img")
    },
    initiate: function(){
        // Declare the canvas's context as 2D
        var canva = document.getElementById('canvas');
        bolides.canvas.ctx = canva.getContext('2d');
        // EventListener for keypresses to change speed and stuff
        addEventListener('keydown', function(e){bolides.control(e);});
        // Interval for slowdown
        setInterval(function(){ if(bolides.spaceship.speed > 0) {bolides.spaceship.speed -= 0.5;}}, 500);
        // Set the image sources
        bolides.images.ship.setAttribute('src', "../bolides/images/spaceship.png");
        bolides.images.asteroid.setAttribute('src', "../bolides/images/asteroid.png");
        bolides.images.heart.setAttribute('src', "../bolides/images/heart.png");
        bolides.images.bullet.setAttribute('src', "../bolides/images/bullet.png");
        // Start looping
        bolides.loop();
    },
    loop: function() {
        // Is the player out of health?
        if(bolides.spaceship.hearts === 0) {
            // Then display "Game over"
            bolides.canvas.ctx.clearRect(0, 0, 800, 600);
            bolides.canvas.ctx.font = "48px Ubuntu";
            bolides.canvas.ctx.fillStyle = "white";
            bolides.canvas.ctx.fillText("Game Over", 200, 200);
        } else {
            // No? Then move and draw everything, then loop again.
            bolides.move();
            bolides.draw();
            requestAnimationFrame(function() { bolides.loop(); });
        }
    },
    control: function(key) {
        // Up key or W key?
        if (key.keyCode === 38 || key.keyCode === 87) {
            // Then increase speed if not past terminal velocity
            if (bolides.spaceship.speed < 25) {
            bolides.spaceship.speed += 1;
            }
        // Down key or S key?
        } else if (key.keyCode === 40 || key.keyCode === 83) {
            // Then decrease speed.
            if (bolides.spaceship.speed > 0){
            bolides.spaceship.speed -= 1;
            }
        // R key?
        } else if (key.keyCode === 82) {
            // Then remove a heart.
            bolides.spaceship.hearts -= 1;
        // Left key or A key?
        } else if (key.keyCode === 37 || key.keyCode === 65) {
            // Then change its angle by 7.5 degrees
            bolides.spaceship.angle -= 0.1308996938995747;
        // Right key or D key?
        } else if (key.keyCode === 39 || key.keyCode === 68) {
            // Then change its angle by -7.5 degrees
            bolides.spaceship.angle += 0.1308996938995747;
        // Space bar or Q key?
        } else if (key.keyCode === 32 || key.keyCode === 81) {
            bolides.bullet.fire();
        }
    },
    move: function() {
        // Ship Math
        bolides.spaceship.direction.x = Math.sin(bolides.spaceship.angle);
        bolides.spaceship.direction.y = -Math.cos(bolides.spaceship.angle);
        bolides.spaceship.x += bolides.spaceship.direction.x * bolides.spaceship.speed;
        bolides.spaceship.y += bolides.spaceship.direction.y * bolides.spaceship.speed;
        // Side warps
        if (bolides.spaceship.x <= -25){
            bolides.spaceship.x = 800;
        } else if (bolides.spaceship.x >=800) {
            bolides.spaceship.x = 0;
        }
        if (bolides.spaceship.y >= 630) {
            bolides.spaceship.y = 0;
        } else if (bolides.spaceship.y <= 0) {
            bolides.spaceship.y = 600;
        }
        // If it's moving,
        if (bolides.spaceship.speed !== 0) {
            // Use the moving ship pic.
            bolides.images.ship.setAttribute('src', "../bolides/images/spaceship-move.png");
        // Elsewise, don't.
        } else {
            bolides.images.ship.setAttribute('src', "../bolides/images/spaceship.png");
        }
        // Stop bullet
        if (!bolides.bullet.isBeingFired) {
            bolides.bullet.x = bolides.spaceship.x;
            bolides.bullet.y = bolides.spaceship.y;
            bolides.bullet.angle = bolides.spaceship.angle;
        } else {
        // Bullet math
        bolides.bullet.direction.x = Math.sin(bolides.bullet.angle);
        bolides.bullet.direction.y = -Math.cos(bolides.bullet.angle);
        bolides.bullet.x += bolides.bullet.direction.x * bolides.bullet.speed;
        bolides.bullet.y += bolides.bullet.direction.y * bolides.bullet.speed;
        }
        // Because decimals
        if ((bolides.spaceship.speed > 0) && (bolides.spaceship.speed < 0.5)) {
            bolides.spaceship.speed = 0;
        } else if (bolides.spaceship.speed < 0) {
            bolides.spaceship.speed = 0;
        }
        // Bullet dissipation
        if (bolides.bullet.x <= -25){
            bolides.bullet.isBeingFired = false;
        } else if (bolides.bullet.x >=800) {
            bolides.bullet.isBeingFired = false;
        }
        if (bolides.bullet.y >= 630) {
            bolides.bullet.isBeingFired = false;
        } else if (bolides.bullet.y <= 0) {
            bolides.bullet.isBeingFired = false;
        }
    },
    draw: function() {
        // Clear the canvas
        bolides.canvas.ctx.clearRect(0, 0, 800, 600);
        // Save it so I can f*** about as much as I want
        bolides.canvas.ctx.save();
        // Set the origin to the ship's center
        bolides.canvas.ctx.translate(bolides.spaceship.x + 18, bolides.spaceship.y - 31);
        // Rotate the ship around the center by the angle of the ship
        bolides.canvas.ctx.rotate(bolides.spaceship.angle);
        // Draw the ship
        bolides.canvas.ctx.drawImage(bolides.images.ship, -18, -31, 36, 62);
        // Restore all f***ing about
        bolides.canvas.ctx.restore();
        // Oh boy more saving
        bolides.canvas.ctx.save();
        // Set the origin to the bullet's origin
        bolides.canvas.ctx.translate(bolides.bullet.x + 3, bolides.bullet.y - 12.5);
        // Rotate the canvas
        bolides.canvas.ctx.rotate(bolides.bullet.angle);
        // Fastest draw in the west
        if (bolides.bullet.isBeingFired === true) {
        bolides.canvas.ctx.drawImage(bolides.images.bullet, -3, -12.5);
        }
        // Full Restore
        bolides.canvas.ctx.restore();
        bolides.canvas.ctx.fillStyle = "red";
        bolides.canvas.ctx.fillRect(100, 100, 1, 1);
        // Draw the asteroid (doesn't turn up because it's off the screen)
        bolides.canvas.ctx.drawImage(bolides.images.asteroid, bolides.asteriod.x, bolides.asteriod.y);
        // Test asteriod x & y
        bolides.canvas.ctx.font = "48px Ubuntu";
        bolides.canvas.ctx.fillText(bolides.bullet.isBeingFired, 500, 500);
        // Check for the number of hearts and draw that many
        if (bolides.spaceship.hearts >= 3) {
            bolides.canvas.ctx.drawImage(bolides.images.heart, 10, 10);
            bolides.canvas.ctx.drawImage(bolides.images.heart, 35, 10);
            bolides.canvas.ctx.drawImage(bolides.images.heart, 60, 10);
        } else if (bolides.spaceship.hearts === 2) {
            bolides.canvas.ctx.drawImage(bolides.images.heart, 10, 10);
            bolides.canvas.ctx.drawImage(bolides.images.heart, 35, 10);
        } else {
            bolides.canvas.ctx.drawImage(bolides.images.heart, 10, 10);
        }
    }
};
// Actually start the program
addEventListener('load', function() { bolides.initiate(); });