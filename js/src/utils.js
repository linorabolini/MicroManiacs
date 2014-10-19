define(function (require) {
	'use strict';

	var utils = {};

	utils.getRandom = function (array) {
		return array[Math.floor(Math.random() * array.length)];
	}

    utils.getKeyCode = function (key) {
        var code = "";

        switch (event.keyCode) {
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
        }

        return code;
    }

	return utils
});