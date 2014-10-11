define(function(require){
	var $ = require('jquery');

	// constants

    var NUM_LEVELS = 1,
        DATA_PATH = "js/data/";

	var numLevels = NUM_LEVELS,
		levelsPath = DATA_PATH + "levels/";
		LEVELS = [];

	for (var i = 1; i <= numLevels; i++) {
		var levelName = "LEVEL_" + i;
		$.getJSON(levelsPath + levelName + ".js", function(data) {
			LEVELS.push(data);
		});
	}

	return LEVELS;
});