$(function () {
    window.onresize = function(event) {
        width = $bord.width();
        shift = width / 2;
        bordPosition = cut($bord.css("left"));
        bordHeight = $bord.height();
        bordWidth = $bord.width();
        bordSpeed = 0;
        bottomBorder = $(window).height() - bordHeight;
        rightBorder = $(window).width();
    };

    var blocks = [];
    var finish = false;
    var $bord = $(".bord");
    var width = $bord.width();
    var shift = width / 2;
    var bordPosition = cut($bord.css("left"));
    var bordHeight = $bord.height();
    var bordWidth = $bord.width();
    var bordSpeed = 0;
    var started = false;
    var blocksLeft = 0;


    $("*").mousemove(function (e) {
        if (!finish)
        {
            var x = e.clientX;
            bordSpeed = (x - shift) - bordPosition;
            bordPosition = x - shift;
            if (bordPosition < 0) {
                bordPosition = 0;
            }
            if (bordPosition > rightBorder - bordWidth) {
                bordPosition = rightBorder - bordWidth;
            }
            $bord.css({ "left": bordPosition + "px" });
        }
        
    });

    var hSpeed = 0;
    var vSpeed = 0;

    var bottomBorder = $(window).height() - bordHeight;
    var topBorder = 60;
    var leftBorder = 0;
    var rightBorder = $(window).width();
    generateBlocks()
    $(".bord").on("click", function () {
        if (started) {
            if (!finish) {
                $(".bord").text("Resume");
                finish = true;
            }
            else {
                $(".bord").text("Pause");
                finish = false;
                setTimeout(ballMove, gameSpeed)
            }
        }
        else {
            started = true;
            $(".bord").text("Pause");
            hSpeed = 10;
            vSpeed = 10;
            setTimeout(ballMove, gameSpeed);
            setTimeout(function () {
                $ball.show();
            }, 100);
        }
        
    });



    var $ball = $(".ball");
    var ballX = cut($ball.css("left"));
    var ballY = cut($ball.css("top"));
    var ballDm = $ball.height();

    var gameSpeed = 10;

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

        if (!finish)       {
            setTimeout(ballMove, gameSpeed);
        }
        
    }

    function generateBlocks() {
        blocksLeft = 10 * 6;
        var part = ($(window).height()) / 100;
        for (var i = 0; i < 10; i++) {
            blocks[i] = [];
            for (var j = 0; j < 6; j++) {
                var $block = $("<div>");
                $block.addClass("block");
                $block.css("left", i * 10 + "%");
                $block.css("top", j * 2 * part + topBorder + "px");
                $("body").append($block);
                blocks[i][j] = { is: true, block: $block };               
            }
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
        if (yCell < 6 && yCell >=0)
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

    }
});

function cut(str) {
    var cutEnd = str.length - 2;
    return Number(str.substring(0, cutEnd));
}

