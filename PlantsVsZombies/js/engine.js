var engine = {
    finish:false,
    maxPosition:0,
    tick:10,
    zombies:[],
    $lines: null,
    $gameOver:null,

    bind: function () {
        engine.maxPosition = $("#field").width();
        engine.$lines = $(".field-line");
        engine.$gameOver = $(".game-over");
        $(".button#btnGenerate").on("click", engine.generate);
    },

    start: function () {
        setTimeout(engine.gameTick, engine.tick);
    },

    generate: function () {
        if (!engine.finish) {
            var type = random(1, 2);
            var zombie;
            switch (type) {
                case 1:
                    zombie = new Michael();
                    break;
                case 2:
                    zombie = new Strong();
                    break;
            }
            var lineNum = random(0, engine.$lines.length);
            $(engine.$lines[lineNum]).append(zombie.$);
            engine.zombies.push(zombie);
        }       
    },

    gameTick: function () {
        for (var i = 0; i < engine.zombies.length; i++) {
            engine.zombies[i].move();
            if (engine.zombies[i].position + engine.zombies[i].getWidth() >= engine.maxPosition) {
                engine.gameOver();
            }
        }
        if (!engine.finish) {
            setTimeout(engine.gameTick, engine.tick);
        }      
    },

    gameOver: function () {
        engine.finish = true;
        engine.$gameOver.show();
    },
}