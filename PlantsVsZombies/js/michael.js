function Michael() {
    var protected = Zombie.call(this);
    this.$.addClass("michael");
    this.speed = 3;
    this.health = 70;
    protected.currentHealth = this.health;
}