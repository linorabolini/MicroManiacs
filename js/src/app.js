define(function (require) {
    'use strict';

    var BaseObject = require('BaseObject'),
        LevelScreen = require('LevelScreen'),
        // TODO: create level manager
        LevelManager = require('LevelManager');

    var APP = BaseObject.extend({

        // variables

        currentScreen: null,

        // functions

        setup: function () {
            console.log("App Init.");

            var level = new LevelScreen(LevelManager[0]);
            this.setScreen(level);
        },
        setScreen: function (newScreen) {
            this.screen && this.removeChild(this.screen).dispose();

            this.screen = newScreen;
            this.addChild(this.screen);
        }
    });

    return new APP();
});