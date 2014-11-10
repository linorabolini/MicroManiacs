define(function (require) {

    var BaseObject = require('BaseObject');

    var ACCELERATION = 0,
        STEERING = 1;

    return BaseObject.extend({

        // variables

        status: null,

        // functions

        init: function (chasis, enginePower, steering) {
            this.__init();
            this.chasis = chasis;
            this.enginePower = enginePower || 150;
            this.steering = steering || 0.4;
            this.status = [0, 0];
        },
        setAcceleration: function (value) {
            value = Math.max(value, -1);
            value = Math.min(value, 1);
            this.status[ACCELERATION] = value * this.enginePower;
        },
        setSteering: function (value) {
            value = Math.max(value, -1);
            value = Math.min(value, 1);
            this.status[STEERING] = value * this.steering;
        },
        getStatus: function () {
            return this.status;
        }
    });
});