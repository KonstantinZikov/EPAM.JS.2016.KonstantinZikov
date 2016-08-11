var typeCount = 3;
var elementCount = 5;
var data = [];

for (var i = 0; i < elementCount; i++) {
    var type = random(1, typeCount);
    data[i] = {
        count:random(1, 10),
    };    
    data[i]["getCount" + type] = function () {
        return this.count;
    };
    console.log(`type=${type}, count=${data[i].count}`);
}
