define(function (require) {

    var BaseObject = require('BaseObject'),
        serializer = require('vehicleSerializer'),
        utils      = require('utils'),
        controller = require('vehicleController'),
        _          = require('underscore');

    return BaseObject.extend({

        // variables

        status: null,
        parts:  null,
        stats:  null,

        // functions

        init: function (parts, stats, status) {
            this.__init();
            this.parts = parts;
            this.stats = stats;
            this.status = status;
        },
        setAcceleration: function (value) {
            value = Math.max(value, -1);
            value = Math.min(value, 1);
            this.status.setAcceleration(value * this.stats.enginePower);
        },
        setSteering: function (value) {
            value = Math.max(value, -1);
            value = Math.min(value, 1);
            this.status.setSteering(value * this.stats.steering);
        },
        setPosition: function (position) {
            var chasis = this.getChasis();
            chasis.position.copy(position);
        },
        setRotation: function (rotation) {
            var chasis = this.parts.chasisModel;
            chasis.rotation.copy(rotation);
        },
        getChasis: function () {
            return this.parts.chasisModel;
        },
        getWheels: function () {
            return this.parts.wheelModels;
        },
        getStatus: function () {
            return this.status.raw;
        },
        getStats: function () {
            return this.stats;
        },
        serialize: function (scale) {
            return serializer.serialize(this.parts, scale);
        },
        setAs: function (data) {
            var scope = this,
                setter,
                has;

            _.each(data, function(value, key) {
                setter  = utils.getSetter(key);
                has     = _.has(scope, setter);
                
                if(has) {
                    scope[setter](value);
                }
            });
        },
        handleInput: function (input) {
            controller.handleInput(input, this);
        },
        dispose: function () {
            this.stats.dispose();
            this.parts.dispose();
            this.status.dispose();

            this.stats  = null;
            this.parts  = null;
            this.status = null;
        }
    });
});