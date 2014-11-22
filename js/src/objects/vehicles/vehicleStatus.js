define(function (require) {

    var ACCELERATION = 0,
        STEERING     = 1;

    function VehicleStatus (initialAcceleration, initialSteering) {
        this.raw = [
            initialAcceleration,
            initialSteering
        ];
    }

    VehicleStatus.prototype.getAcceleration = function () {
        return this.raw[ACCELERATION];
    }

    VehicleStatus.prototype.getSteering = function () {
        return this.raw[STEERING];
    }

    VehicleStatus.prototype.setAcceleration = function (value) {
        this.raw[ACCELERATION] = value;
    }

    VehicleStatus.prototype.setSteering = function (value) {
        this.raw[STEERING] = value;
    }

    VehicleStatus.prototype.dispose = function () {
        this.raw = null;
    }

    return VehicleStatus;
});