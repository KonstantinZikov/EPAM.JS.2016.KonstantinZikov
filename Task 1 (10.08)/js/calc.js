console.log("calc.js loaded.");
for (var i = 0; i < data.length; i++){
    if (data[i] !== null && data[i] !== undefined)
    {
        var number = Number(data[i]);
        if (number != NaN) {
            if (data[i] == 0) {
                data[i] = number + 10;
            }
            else if (data[i] > 100) {
                data[i] = number - 100;
            }
            else if (data[i] < 100) {
                data[i] = number + 100;
            }
        }           
    }       
}
