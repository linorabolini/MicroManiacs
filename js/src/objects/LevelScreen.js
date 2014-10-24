define(function (require){
    
    var BaseObject = require('BaseObject'),
        LevelModel = require('LevelModel'),
        LevelViewport = require('LevelViewport'),
        input = require('input');

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
            this.level.addPlayers(input.getSources());

            // create a new viewport to render the level
            this.viewport = new LevelViewport();
            this.viewport.startRendering(this.level);
            this.viewport.addToScreen();

            // add elements to the update loop
            this.addChild(this.level);
            this.addChild(this.viewport);

            // setup input
            input.on("input", this.handleInput);
        },
        handleInput: function (event) {
            if (event.type == "key") {

                switch (event.code) {
                    case 87: // W
                        // this.level.rotateCamera("z", 20);
                        break;
                    default:
                        this.level.handleInput(event);
                }
            }
        }
    });
});