var info = {}
info.typeCount = 3;
info.elementCount = 5;
info.data = [];

for (var i = 0; i < info.elementCount; i++) {
    var type = random(1, info.typeCount);
    info.data[i] = {
        count:random(1, 10),
    };    
    info.data[i]["getCount" + type] = function () {
        return this.count;
    };
    console.log(`type=${type}, count=${info.data[i].count}`);
}
