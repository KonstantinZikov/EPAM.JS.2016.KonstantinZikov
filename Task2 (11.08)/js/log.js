{
    count = [];
    for (var i = 1; i <= info.typeCount; i++) {
        count[i] = 0;
    }
    // if element contains any functions with name like getCount1, getCount2, etc..
    // will be called only first of it.
    for (var i = 0; i < info.data.length; i++) {
        for (var j = 1; j <= info.typeCount; j++) {
            if (info.data[i][`getCount${j}`] != undefined) {
                count[j] += info.data[i][`getCount${j}`]();
                break;
            }
        }
    }
    for (var i = 1; i <= info.typeCount; i++) {
        console.log(`count${i}=${count[i]}`);
    }
}
