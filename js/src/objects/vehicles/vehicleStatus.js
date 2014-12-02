define(function (require) {

    var _ = require('underscore');

    // we create a temp array to setup the properties
    // that will be exposed to the car physics engine
    var props = [
        "Acceleration",
        "Steering",
        "LocalForceX",
        "LocalForceY",
        "LocalForceZ"
    ];

    // we setup the raw data of the vehicle with
    // and fill it with zeros for each variable
    function VehicleStatus () {

        // it is important to initialize the raw data
        // so it can be accessible from the setters 
        // and getters
        this.raw = props.map(function() {
            return 0.0; 
        });
    }

    // generate setters and getters dinamically
    _.each(props, function (el, indx) {

        // we create the setter
        VehicleStatus.prototype["set" + el] = function (value) {
            this.raw[indx] = value;
        }

        // we create the getter
        VehicleStatus.prototype["get" + el] = function () {
            return this.raw[indx];
        }
    });

    VehicleStatus.prototype.dispose = function () {
        this.raw = null;
    }

    return VehicleStatus;
});