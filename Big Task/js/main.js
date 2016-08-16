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
                    $block.css("top", j * 2 * percent + this.borders.top + "px");
                    this.$body.append($block);
                    this.blocks[i][j] = { is: true, block: $block };               
                }
            }            
        },

        drop:function () {        
            this.$score.text(0);
            this.started = false;
            this.pause = false;
            this.isWon = false;
            this.horizontalSpeed = 0;
            this.verticalSpeed = 0;
            this.bord.$.text("Start");
            this.ball.$.ball.hide();
            this.ball.$.ball.css("left", ballStartX);
            this.ball.$.ball.css("top", ballStartY);
            this.ball.x = this.ball.initX;
            this.ball.y = this.ball.initY;
        },

        mouse:function (e) {
            if (!this.pause)
            {
                var x = e.clientX;
                this.bord.x = x - this.width / 2;
                if (this.bord.x < 0) {
                    this.bord.x = 0;
                }
                if (this.bord.x > this.borders.right - this.bord.width) {
                    this.bord.x = this.borders.right - this.bord.width;
                }
                this.bord.$.css({ "left": this.bord.x + "px" });
            }
        },

        bordClick:function(){
            if (!this.isWon) {
                if (this.started) {
                    if (!this.pause) {
                        game.bord.$.text("Resume");
                        this.pause = true;
                    }
                    else {
                        game.bord.$.text("Pause");
                        this.pause = false;
                        setTimeout(ballMove, this.speed)
                    }
                }
                else {
                    this.started = true;
                    game.bord.$.text("Pause");
                    setTimeout(ballMove, this.speed);
                    setTimeout(function () {$ball.show();}, this.speed);
                }
            }
        },
    }

    function initState() {
        //init jquery objects
        game.$body = $("body");
        game.ball.$ = $(".ball");
        game.bord.$ = $(".bord");
        game.$score = $(".count");
        game.$window = $(window);
         
        //init game speed
        game.speed = 10;

        //init all sizes
        initSizes();

        // init ball        
        game.ball.x = pxToNumber(gameState.ball.$.css("left"));
        game.ball.y = pxToNumber(gameState.ball.$.css("top"));
        game.ball.initX = gameState.ball.x;
        game.ball.initY = gameState.ball.y;
        game.ball.horizontalSpeed = 20;
        game.ball.verticalSpeed = 20;       

        // init bord       
        game.bord.x = pxToNumber(gameState.bord.$.css("left"));
              
        // init blocks
        game.blockRows = 6;
        game.blockCols = 10;
        game.generateBlocks();              
    }

    function initSizes() {
        // init window
        game.height = gameState.$window.height();
        game.width = gameState.$window.width();

        //init ball
        game.ball.diameter = gameState.ball.$.height();

        //init bord
        game.bord.width = gameState.bord.$.width();
        game.bord.height = gameState.bord.$.height();

        //init borders
        game.borders.top = 60;
        game.borders.right = game.width;
        game.borders.bottom = game.height - game.bord.height;
        game.borders.left = 0;
    }

    window.onresize = function(event) {
        initSizes();
    };

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
    $("*").mousemove(game.mouse);
    game.bord.$.on("click", game.bordClick);

    function ballMove() {       
        var maybeX = ballX + hSpeed;
        var maybeY = ballY + vSpeed;

        checkBlock(maybeX, maybeY);

        if (maybeX < leftBorder) {
            maybeX = leftBorder;
            hSpeed *= -1;
        }

        if ((maybeX + ballDm) > rightBorder) {
            maybeX = rightBorder - ballDm;
            hSpeed *= -1;
        }

        if (maybeY < topBorder) {
            maybeY = topBorder;
            vSpeed *= -1;
        }

        if ((maybeY) > bottomBorder) {
            if (maybeX < (bordPosition - ballDm) || maybeX > (bordPosition + bordWidth)) {
                minusCount();
            }

            maybeY = bottomBorder - ballDm;
            vSpeed *= -1;
        }

        ballX = maybeX;
        ballY = maybeY;

        $ball.css("left", ballX);
        $ball.css("top", ballY);

        if (!pause && started) {
            setTimeout(ballMove, gameSpeed);
        }        
    }

    function checkBlock(X, Y) {
        if (X < 0){
            X = 0;
        }
        if (Y < 0) {
            Y = 0;
        }
        
        var partX = $(window).width() / 10;
        var xCell = Math.floor(X / partX);
        var partY = $(window).height() / 50;
        var yCell = Math.floor((Y-topBorder) / partY);
        if (yCell < 1 && yCell >=0)
        {
            if (blocks[xCell][yCell].is)
            {
                blocks[xCell][yCell].is = false;
                blocks[xCell][yCell].block.remove();
                vSpeed *= -1;
                blocksLeft--;
                plusCount();
            }
            if (blocksLeft == 0)
            {
                won();
            }
        }
    }

    function plusCount() {
        $(".count").text(Number($(".count").text()) + 1);
    }

    function minusCount() {
        var count = Number($(".count").text());
        count = count - 2;
        if (count < 0) {
            count = 0;
        }
        $(".count").text(count);
    }

    function won() {
        var count = Number($(".count").text());
        started = false;
        isWon = true;
        $(".result").text("Your score: " + count);
        $(".won").show();
    }
});

function pxToNumber(px) {
    return Number(px.substring(0, px.length - 2));
}

