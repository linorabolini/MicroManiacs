define(function (require) {
	'use strict';

	var utils = {};

	utils.getRandom = function(array) {
		return array[Math.floor(Math.random() * array.length)];
	}

	return utils
});