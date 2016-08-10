console.log("log.js loaded.");
window.onload = function () {
    data.forEach(function (current, index, arr) {
        var output = "data[" + index + "]=";
        if (current === undefined) {
            console.log(output + "не определено");
        }
        else if (current === null) {
            console.log(output + "не указано");
        }
        else {
            console.log(output + current);
        }
    });
};
