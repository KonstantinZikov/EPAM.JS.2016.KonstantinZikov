var engine = {
    finish:false,
    maxPosition:0,
    tick:100,
    zombies:[],
    $lines: null,
    $gameOver:null,

    bind: function () {
        engine.maxPosition = $("#field").width();
        engine.$lines = $(".field-line");
        engine.$gameOver = $(".game-over");
        $(".button#btnGenerate").on("click", engine.generate);
        $(".button#btnSlow").on("click", engine.slowUp);
        $(".button#btnOld").on("click", engine.growOld);
        $(".button#btnExplode").on("click", engine.explode);
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

    slowUp:function(){
        for (var i = 0; i < engine.zombies.length; i++) {
            engine.zombies[i].slowUp(10000);
        }
    },

    growOldActive:false,
    growOld: function () {
        if (!engine.growOldActive) {
            engine.growOldActive = true;
            var next = true;
            function dicreaseHealth() {
                for (var i = 0; i < engine.zombies.length; i++) {
                    engine.zombies[i].damage.call(engine.zombies[i], 1);
                }

                if (next) {
                    setTimeout(dicreaseHealth, 1000);
                }
            }
            dicreaseHealth();
            setTimeout(function () {
                next = false;
                engine.growOldActive = false;
            }, 10000);
        }       
    },

    explode: function(){
        for (var i = 0; i < engine.zombies.length; i++) {
            engine.zombies[i].damage(15);
            var $expl = $("<div>").addClass("explosion");
            engine.zombies[i].$.append($expl);
            helper($expl);
        }
    },

    gameTick: function () {
        for (var i = 0; i < engine.zombies.length; i++) {
            if (!engine.zombies[i].dead) {
                engine.zombies[i].move();
                if (engine.zombies[i].position + engine.zombies[i].getWidth() >= engine.maxPosition) {
                    engine.gameOver();
                }
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

function helper(expl) {
    setTimeout(function () { expl.remove(); }, 400);
}