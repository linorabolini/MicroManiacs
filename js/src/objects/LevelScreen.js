define(function (require){
	
	var BaseObject = require('BaseObject'),
		LevelModel = require('LevelModel'),
		LevelViewport = require('LevelViewport');


	return BaseObject.extend({

		// variables

		level: null,
		viewport: null,

		// functions

		init: function (data) {
			this.__init();
			console.log("level screen setup.");

			// create level from scene data
			this.level = new LevelModel();
			this.level.generateFromSceneData(data);

			// create a new viewport to render the level
			this.viewport = new LevelViewport();
			this.viewport.startRendering(this.level);
			this.viewport.addToScreen();

			// add elements to the update loop
			this.addChild(this.level);
			this.addChild(this.viewport);
		}
	});
});