$(function () {

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
        blocks: [],

        borders: {
            bottom: 0,
            top: 0,
            left: 0,
            right: 0,            
        },
      
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
        game.blockRows = 1;
        game.blockCols = 10;
        game.generateBlocks();              
    }

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

    initState();

    window.onresize = function(event) {
        initSizes();
    };

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

    $(".restart").on("click", restart);
    $(".restart-won").on("click", restart);
    $("*").mousemove(mouse);
    game.bord.$.on("click", bordClick);

    function ballMove() {       
        var newX = game.ball.x + game.ball.horizontalSpeed;
        var newY = game.ball.y + game.ball.verticalSpeed;
        checkBlock(newX, newY);
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

        if (newX >= (game.bord.x - game.ball.diameter) && newX <= (game.bord.x + game.bord.width)){
            if (newY >= (game.borders.bottom - game.bord.height) && game.ball.verticalSpeed > 0){
                game.ball.verticalSpeed *= -1;
            }
        }
        else 
        if (newY > game.borders.bottom) {
            if (newX < (game.borders.bottom - game.ball.diameter) ||
                newX > (game.bord.x + game.bord.width)) {
                minusCount();
            }

            newY = game.borders.bottom - game.ball.diameter;
            game.ball.verticalSpeed *= -1;
        }

        game.ball.x = newX;
        game.ball.y = newY;

        game.ball.$.css("left", game.ball.x);
        game.ball.$.css("top", game.ball.y);

        if (!game.pause && game.started) {
            setTimeout(ballMove, game.speed);
        }        
    }

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
                plusCount();
            }

            if (game.blocksLeft == 0){
                won();
            }
        }
    }

    function plusCount() {
        game.score++;
        game.$score.text(game.score);
    }

    function minusCount() {
        game.score -= 2;
        if (game.score < 0) {
            game.score = 0;
        }
        game.$score.text(game.score);
    }

    function won() {       
        game.started = false;
        game.isWon = true;
        $(".result").text("Your score: " + game.score);
        $(".won").show();
    }

    
});

function pxToNumber(px) {
    return Number(px.substring(0, px.length - 2));
}

