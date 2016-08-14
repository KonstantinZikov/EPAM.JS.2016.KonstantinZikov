$(function () {
    $field = $(".field");

    $("#generate").on("click", function () {
        clear();
        generate();
    })
    $("#set").on("click", function () {
        setColor();
    })
    $("#reset").on("click", function () {
        clear();
    })

    function clear() {
        $(".block").remove();
    }

    function generate() {
        for (var i = 0; i < 50; i++) {
            var $block = $("<div>");
            $block.addClass("block");
            $block.text(random(1, 100));

            $field.append($block);
        }
    }

    function setColor() {
        var $blocks = $(".block");
        $blocks.each(function (index, element) {
            $element = $(this);
            var value = $element.text();
            if (value > 75){
                $element.css("background-color", "#f44336");
            }
            else if (value > 50) {
                $element.css("background-color", "#ff9800");
            }
            else if (value > 25) {
                $element.css("background-color", "#4caf50");
            }
        });
    }
});