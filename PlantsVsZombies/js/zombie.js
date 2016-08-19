// all static members implemented in di.js
function Zombie() {

    //Create div
    this.$ = $("<div>").addClass("zombie");
    this.position = 0;

    this.move = function () {
        this.$.css("right", ++this.position);
    }

    this.getWidth = function () {
        if (this.width === undefined) {
            this.width = this.$.width();
        }
        return this.width;
    }
}
