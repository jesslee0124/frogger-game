var WIDTH = 505;
var HEIGHT = 404;
var score = 0;
var life = 3;
var gameOver;
var star1;
var star1Removed = false;

// Enemies our player must avoid
var Enemy = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/enemy-bug.png';
    this.speed = Math.floor(Math.random() * 300) + 1;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // Multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x < WIDTH) {
        this.x += this.speed * dt;
    } else {
        this.x = 0;
    }
    this.checkCollisions(player);
    document.getElementById("score").innerHTML = score;

    // Update Star Images to reflect the number of life
    var star3 = document.getElementById("star-3");
    var star2 = document.getElementById("star-2");
    star1 = document.getElementById("star-1");
    if (life === 2 && star3 !== null) {
        star3.parentNode.removeChild(star3);
    } else if (life === 1 && star2 !== null) {
        star2.parentNode.removeChild(star2);
    } 
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Check collisions and update life and call reset
Enemy.prototype.checkCollisions = function(player) {
    var collision;
    if (Math.abs(this.x - player.x) < 101 && Math.abs(this.y - player.y) < 76)  {
        collision = true;
        if (collision === true && life >= 1) {
            life = life - 1;
            player.reset(score, life);
            if (life === 0) {
                // Remove the remaining star image if life is 0
                star1.parentNode.removeChild(star1);
                star1Removed = true;
                if (star1Removed === true) {
                    setTimeout(function alertGameOver() {
                        alert("Game Over... You scored " + score + ".");
                        alert("Press enter to restart the game!");
                        life = 3;
                        score = 0;
                        player.reset(score, life);  
                      }, 500);
                }
            }
        }  
    } 
};

// Create Player class
var Player = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = 200;
    this.y = 400;
    this.sprite = 'images/char-boy.png';
};

// Update the player
Player.prototype.update = function() {
    if (gameOver === true) {
        this.reset();
    }
}

// Renders the player image on canvas
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


// Moves the players after detecting the keyboard input(up,down,right,left)
Player.prototype.handleInput = function(key) {
    var playerObject = this;
    if (key === 'up') {
        if (this.y > 0 && this.y <= HEIGHT) {
            // Moved Up
            this.y = this.y - 83;
            if (this.y === -15) {
                score = score + 1;
                setTimeout(function gameReset() {
                    playerObject.reset(score, life);
                }, 100);
            }
        } else {
            gameOver = true;
        }
    } else if (key === 'down') {
        if (this.y > 0 && this.y <= HEIGHT - 83) {
            // Moved Down
            this.y = this.y + 83;
        } 
    } else if (key === 'right') {
        if (this.x >= -2 && this.x < 402 && this.y > -15) {
            // Moved Right
            this.x = this.x + 101;
        } 
    } else if (key === 'left') {
        if (this.x > 0 && this.x <= WIDTH && this.y > -15) {
            // Moved Left
            this.x = this.x - 101;
        } 
    }
}

// Resets the position of player after collision and gameOver
Player.prototype.reset = function(score, life) {
    this.x = 200;
    this.y = 400;
    score = score;
    life = life;
    // Reset the star images
    if (star1Removed === true) {
        var img = [];
        var stars = document.querySelectorAll(".star");
        for (i = 0; i < 3; i++) {
            img[i] = document.createElement("img");
            img[i].src= "images/Star.png";
            img[i].id = "star-" + (i+1);
            stars[i].appendChild(img[i]);
        }
        star1Removed = false;
    }
}

// Instantiate objects
var allEnemies = [new Enemy(200, 227), new Enemy(100, 144), new Enemy(100, 61)];
var player = new Player();
alert("You have 3 chances to get to water! Press enter to start the game...");

// This listens for key presses and sends the keys to handleInput()
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Change the character by adding click event listener to #characters
// and updating player.sprite
var characters = document.querySelector("#characters");
characters.addEventListener("click", updateCharacter, false);

function updateCharacter(e) {
    if (e.target !== e.currentTarget) {
        var clickedCharacter = e.target.src;
        clickedCharacter = clickedCharacter.substring(clickedCharacter.indexOf("images"));
        player.sprite = clickedCharacter;
    }
    e.stopPropagation();
}