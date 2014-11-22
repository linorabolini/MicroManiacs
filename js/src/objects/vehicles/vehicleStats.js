define(function (require) {

    /**
     * Object to store vehicle stats
     * @param {[number]} enginePower represents the engine power
     * @param {[number]} steering    represents the vehicle steering
     */
    function VehicleStats (enginePower, steering) {
        this.enginePower = enginePower;
        this.steering    = steering;
    }

    VehicleStats.prototype.dispose = function() {
        this.enginePower = null;
        this.steering    = null;
    };

    return VehicleStats;
});