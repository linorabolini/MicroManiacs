define(function(require){
	var $ = require('jquery');

	var files = {
		LEVELS : [],
		CHASIS : [],
		WHEELS : [],
		FILES_LOADED : 0,
		TOTAL_FILES : 0,
		callback : null
	}

	files.hasFinished = function () {
		return files.FILES_LOADED == files.TOTAL_FILES;
	}

	files.loadFiles = function (path, name, array, number) {
		files.TOTAL_FILES += number;
		for (var i = 1; i <= number; i++) {
			var fileName = name + "_" + i;
			$.getJSON(path + fileName + ".js", function(data) {
				array.push(data);
				files.FILES_LOADED++;

				if (undefined !== files.callback) {
					files.hasFinished() && files.callback();
				}
			});
		}
	}

	files.onLoaded = function(callback) {
		this.callback = callback;
	}

	return files;
});