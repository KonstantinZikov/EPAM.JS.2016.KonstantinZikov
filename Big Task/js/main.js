$(function () {
    
    // Main game object. Contains references to game-object-divs and game params.
    var game = {
        started: false,
        pause: false,
        isWon: false,
        score: 0,
        $body:null,
        $window: null,
        $score:null,
        height: 0,
        width:0,
        speed: 0,
        ball:{
            $: null,
            x: 0,
            y: 0,
            initX: 0,
            initY:0,
            horizontalSpeed: 0,
            verticalSpeed: 0,
            diameter:0
        },
        
        bord: {
            $: null,
            x: 0,
            height: 0,
            width: 0,
        },

        blockRows: 0,
        blockCols: 0,
        blocksLeft: 0,

        // blocks are stored in 2d array
        blocks: [],

        borders: {
            bottom: 0,
            top: 0,
            left: 0,
            right: 0,            
        },
      
        // Place game blocks to document body
        generateBlocks: function () {
            this.blocksLeft = this.blockCols * this.blockRows;
            var percent = this.height / 100;
            for (var i = 0; i < this.blockCols; i++) {
                this.blocks[i] = [];
                for (var j = 0; j < this.blockRows; j++) {
                    var $block = $("<div>");
                    $block.addClass("block");
                    $block.css("left", i * 10 + "%");
                    $block.css("top", j * 4 * percent + this.borders.top + "px");
                    this.$body.append($block);
                    this.blocks[i][j] = { is: true, block: $block };               
                }
            }            
        },

        // Drop game params to default values
        drop:function () {        
            this.$score.text(0);
            this.score = 0;
            this.started = false;
            this.pause = false;
            this.isWon = false;
            this.horizontalSpeed = 0;
            this.verticalSpeed = 0;
            this.bord.$.text("Start");
            this.ball.$.hide();
            this.ball.$.css("left", this.ball.initX);
            this.ball.$.css("top", this.ball.initY);
            this.ball.x = this.ball.initX;
            this.ball.y = this.ball.initY;
        }      
    }

    // Initialize game
    function initState() {
        //init jquery objects
        game.$body = $("body");
        game.ball.$ = $(".ball");
        game.bord.$ = $(".bord");
        game.$score = $(".score");
        game.$window = $(window);
         
        //init game tick size
        game.speed = 10;

        //init all sizes
        initSizes();

        // init ball  
        game.ball.$.width(game.ball.diameter);
        game.ball.$.height(game.ball.diameter);
        game.ball.x = pxToNumber(game.ball.$.css("left"));
        game.ball.y = pxToNumber(game.ball.$.css("top"));
        game.ball.initX = game.ball.x;
        game.ball.initY = game.ball.y;
        game.ball.horizontalSpeed = game.height / 100;
        game.ball.verticalSpeed = game.width / 100 / (game.width/game.height);

        // init bord       
        game.bord.x = pxToNumber(game.bord.$.css("left"));
              
        // init blocks
        game.blockRows = 3;
        game.blockCols = 10;
        game.generateBlocks();              
    }

    // Save sizes of game objects. It is required when the game is initialized or window is resized. 
    function initSizes() {
        // init window
        game.height = game.$window.height();
        game.width = game.$window.width();

        //init ball
        game.ball.diameter = ((game.height + game.width) / 2) / 36; //<- ball-size coef

        //init bord
        game.bord.width = game.bord.$.width();
        game.bord.height = game.bord.$.height();

        //init borders
        game.borders.top = 60;
        game.borders.right = game.width;
        game.borders.bottom = game.height - game.bord.height;
        game.borders.left = 0;
    }

    window.onresize = function (event) {
        initSizes();
    };

    // bord control with the mouse
    function mouse(e) {
        if (!game.pause)
        {
            var x = e.clientX;
            game.bord.x = x - game.bord.width / 2;
            if (game.bord.x < 0) {
                game.bord.x = 0;
            }
            if (game.bord.x > game.borders.right - game.bord.width) {
                game.bord.x = game.borders.right - game.bord.width;
            }
            game.bord.$.css({ "left": game.bord.x + "px" });
        }
    }

    // initiated when user clicks to bord
    function bordClick(){
        if (!game.isWon) {
            if (game.started) {
                if (!game.pause) {
                    game.bord.$.text("Resume");
                    game.pause = true;
                }
                else {
                    game.bord.$.text("Pause");
                    game.pause = false;
                    setTimeout(ballMove, game.speed)
                }
            }
            else {
                game.started = true;
                game.bord.$.text("Pause");
                setTimeout(ballMove, game.speed);
                setTimeout(function () { game.ball.$.show(); }, game.speed);
            }
        }
    }

    // button restart pressed
    function restart() {
        game.blocks.forEach(function (value, index, arr) {
            value.forEach(function ($value, $index, $arr) {
                $value.block.remove();
            });
        });
        $(".won").hide();
        game.generateBlocks();
        game.drop();       
    }

    initState();
    $(".restart").on("click", restart);
    $(".restart-won").on("click", restart);
    $("*").mousemove(mouse);
    game.bord.$.on("click", bordClick);



    // actions with the ball within one game tick
    function ballMove() {
        // calculate next ball coordinates
        var newX = game.ball.x + game.ball.horizontalSpeed;
        var newY = game.ball.y + game.ball.verticalSpeed;

        checkBlock(newX, newY);

        // if ball hits any border, his direction must be changed
        if (newX < game.borders.left) {
            newX = game.borders.left;
            game.ball.horizontalSpeed *= -1;
        }

        if ((newX + game.ball.diameter) > game.borders.right) {
            newX = game.borders.right - game.ball.diameter;
            game.ball.horizontalSpeed *= -1;
        }

        if (newY < game.borders.top) {
            newY = game.borders.top;
            game.ball.verticalSpeed *= -1;
        }

        // Check a bord in bottom border
        if (newX >= (game.bord.x - game.ball.diameter) && newX <= (game.bord.x + game.bord.width)){
            if (newY >= (game.borders.bottom - game.bord.height) && game.ball.verticalSpeed > 0){
                game.ball.verticalSpeed *= -1;
            }
        }
        else 
        if (newY > game.borders.bottom) {
            if (newX < (game.borders.bottom - game.ball.diameter) ||
                newX > (game.bord.x + game.bord.width)) {
                // if ball hits the bottom border (not the bord), decrease the score 
                minusScore();
            }

            newY = game.borders.bottom - game.ball.diameter;
            game.ball.verticalSpeed *= -1;
        }

        game.ball.x = newX;
        game.ball.y = newY;

        game.ball.$.css("left", game.ball.x);
        game.ball.$.css("top", game.ball.y);

        // queue the next game tick
        if (!game.pause && game.started) {
            setTimeout(ballMove, game.speed);
        }        
    }

    // Search block in selected coordinates
    function checkBlock(x, y) {
        if (x < 0){
            x = 0;
        }

        if (y < 0) {
            y = 0;
        }
        
        var partX = game.width / 10;
        var xCell = Math.floor(x / partX);
        var partY = game.height / 25;
        var yCell = Math.floor((y-game.borders.top) / partY);
        if (yCell < game.blockRows && yCell >= 0){
            if (game.blocks[xCell][yCell].is){
                game.blocks[xCell][yCell].is = false;
                game.blocks[xCell][yCell].block.remove();
                game.ball.verticalSpeed *= -1;
                game.blocksLeft--;
                plusScore();
            }

            if (game.blocksLeft == 0){
                won();
            }
        }
    }

    // the ball hit the block
    function plusScore() {
        game.score++;
        game.$score.text(game.score);
    }

    // the ball hit the bottom
    function minusScore() {
        game.score -= 2;
        if (game.score < 0) {
            game.score = 0;
        }
        game.$score.text(game.score);
    }

    // action initiated when all blocks are destroyed
    function won() {       
        game.started = false;
        game.isWon = true;
        $(".result").text("Your score: " + game.score);
        $(".won").show();
    }

    
});

// transform "15px" to 15 (as a number)
function pxToNumber(px) {
    return Number(px.substring(0, px.length - 2));
}

