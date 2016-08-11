count = [];
for (var i = 1; i <= typeCount; i++) {
    count[i] = 0;
}
for (var i = 0; i < elementCount; i++) {  
    for (var j = 1; j <= typeCount; j++){
        if (data[i][`getCount${j}`] != undefined) {
            count[j] += data[i][`getCount${j}`]();
            break;
        }
    }
}
for (var i = 1; i <= typeCount; i++) {
    console.log(`count${i}=${count[i]}`);
}