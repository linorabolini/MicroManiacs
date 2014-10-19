define(function(require){
	var $ = require('jquery');

	// constants

    var NUM_LEVELS = 1,
    	NUM_CHASIS = 1,
    	NUM_WHEELS = 1,
        DATA_PATH = "js/data/";

	var files = {
		LEVELS : [],
		CHASIS : [],
		WHEELS : []
	}

	function loadFiles(path, name, array, number) {
		for (var i = 1; i <= number; i++) {
			var fileName = name + "_" + i;
			$.getJSON(path + fileName + ".js", function(data) {
				array.push(data);
			});
		}
	}

	loadFiles(DATA_PATH + "/levels/", "level", files.LEVELS, 1);
	loadFiles(DATA_PATH + "/cars/", "chasis", files.CHASIS, 1);
	loadFiles(DATA_PATH + "/cars/", "wheel", files.WHEELS, 1);

	return files;
});