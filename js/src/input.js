define(function (require) {
	var Model = require('fishbone');

	var EVENT = {
		INPUT: "input"
	};

	var TYPE = {
		KEY: "key",
		KEYBOARD: "keyboard"
	};

	var sourceCounter = 0;
	var sources = [];
	var sourceLoaders = [];

	var Input = Model({

		addSource: function (type, source, id) {

			id = id || sourceCounter;

			if (id > sourceCounter)
				console.warn("Non used id configured might be overriden");

			for (var i = 0; i < sourceLoaders.length; i++) {
				var loader = sourceLoaders[i];
				if (loader.type == type) {
					loader.loadSource(source, id);
					sources.push({id: id, source: source});
					sourceCounter++;
					break;
				}
			};

		},
		addSourceLoader: function (type, loadSourceFunction) {
			sourceLoaders.push({
				type: type,
				loadSource: loadSourceFunction
			})
		},
		getSources: function () {
			return sources;
		}

	});

	return new Input();
});