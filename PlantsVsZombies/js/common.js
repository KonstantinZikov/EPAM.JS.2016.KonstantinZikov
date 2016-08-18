$(function () {
    engine.bind();
    engine.start();
})

function pxToNumber(px) {
    return Number(px.substring(0, px.length - 2));
}
