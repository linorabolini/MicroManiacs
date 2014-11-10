define(function (require) {
    'use strict';

    var utils = {};

    utils.getRandom = function (array) {
        return array[Math.floor(Math.random() * array.length)];
    };

    utils.getKeyCode = function (key) {
        var code;

        // override some keys
        switch (key) {
        case 38: // key up
            code = "up";
            break;
        case 40: // key down
            code = "down";
            break;
        case 37: // key left
            code = "left";
            break;
        case 39: // key right
            code = "right";
            break;
        case 32: // key right
            code = "space";
            break;
        default:
            code = String.fromCharCode(key);
        }

        return code;
    };

    utils.inputToVehicleStatus = function (vehicle, input) {

        if (input.type === "key") {
            var code = input.code;
            code === 38 && vehicle.setAcceleration(input.value);
            code === 40 && vehicle.setAcceleration(-input.value);
            code === 39 && vehicle.setSteering(-input.value);
            code === 37 && vehicle.setSteering(input.value);
        } else if (input.type === "accelerometer") {
            vehicle.setAcceleration(input.x);
            vehicle.setSteering(input.y);
        }

    };

    return utils;
});