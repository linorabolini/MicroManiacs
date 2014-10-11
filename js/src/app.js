define(function (require) {
    'use strict';

    var BaseObject = require('BaseObject'),
        LevelScreen = require('LevelScreen');

    var APP = BaseObject.extend({

        // variables

        currentScreen: null,

        // functions

        setup: function () {
            console.log("App Init.");

            var level = new LevelScreen(null);
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