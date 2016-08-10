console.log("log.js loaded.");
window.onload = function () {
    for (var i = 0; i < data.length; i++){
        var output = "data[" + i + "]=";
        if (data[i] === undefined) {
            console.log(output + "не определено");
        }
        else if (data[i] === null) {
            console.log(output + "не указано");
        }
        else {
            console.log(output + data[i]);
        }
    }
};