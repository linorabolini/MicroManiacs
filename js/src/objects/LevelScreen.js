define(function (require) {

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

            input.on('input', this.handleInput);
            input.on('new source', this.level.addPlayer);
        },
        handleInput: function (event) {
            if (event.type === "key") {

                switch (event.code) {
                case 87: // W
                    this.level.rotateCamera("z", event.value);
                    break;
                case 83: // S
                    this.level.rotateCamera("y", event.value);
                    break;
                case 65: // A
                    this.level.rotateCamera("x", event.value);
                    break;
                }
            }

            // delegate to level model
            this.level.handleInput(event);
        },
        update: function (dt) {
            this.__update(dt);
            this.viewport.render(this.level);
        }
    });
});