console.log("calc.js loaded.");
data.forEach(function (current, index, arr) {
    if (current !== null && current !== undefined)
    {
        var number = Number(arr[index]);
        if (number != NaN) {
            if (current == 0) {
                arr[index] = number + 10;
            }
            else if (current > 100) {
                arr[index] = number - 100;
            }
            else if (current < 100) {
                arr[index] = number + 100;
            }
        }           
    }       
});
