console.log("log.js loaded.");
window.onload = function () {
    data.forEach(function (current, index, arr) {
        var output = "data[" + index + "]=";
        if (current === undefined) {
            console.log(output + "�� ����������");
        }
        else if (current === null) {
            console.log(output + "�� �������");
        }
        else {
            console.log(output + current);
        }
    });
};