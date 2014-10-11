define(function (require){
	
	var BaseObject = require('BaseObject'),
		LevelModel = require('LevelModel'),
		LevelViewport = require('LevelViewport');

	return BaseObject.extend({

		// variables

		level: null,
		viewport: null,

		// functions

		init: function (levelConfig) {
			this.__init();
			console.log("level screen setup.");

			this.viewport = new LevelViewport();
			this.level = new LevelModel(this.viewport, levelConfig);

			this.viewport.addToScreen();

			this.addChild(this.level);
			this.addChild(this.viewport);
		}
	});
});