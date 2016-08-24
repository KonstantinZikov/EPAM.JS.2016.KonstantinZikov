function Zombie() {
    var protected = {};

    this.$ = $("<div>").addClass("zombie");
    this.$.css("bottom", random(0, 40) + "px");
    var $healthLine = $("<div>").addClass("health");
    this.$.append($healthLine);


    this.minSpeed = 1;
    this.speed = this.minSpeed;
    this.health = 50;
    protected.currentHealth = this.health;
    this.position = 0;
    this.dead = false;

    this.move = function () {
        this.position += this.speed;
        this.$.css("right", this.position);
    }

    this.getWidth = function () {
        if (this.width === undefined) {
            this.width = this.$.width();
        }
        return this.width;
    }

    function die() {
        this.dead = true;
        this.$.remove();
    }

    function updateHealth() {
        percent = protected.currentHealth / this.health * 100;
        $healthLine.css("width", percent + "%");
    }

    this.damage = function (points) {
        var pt = Number(points);
        if (pt > 0) {
            protected.currentHealth -= pt;
            updateHealth.call(this);
            if (protected.currentHealth <= 0) {
                die.call(this);
            }
        }
    }

    this.slowUp = function (ms) {
        if (this.speed !== this.minSpeed)
        {
            var lastSpeed = this.speed;
            this.speed = this.minSpeed;
            var zombie = this;
            setTimeout(function () {
                zombie.speed = lastSpeed;
            }, ms);
        }
        
    }

    return protected;
}
