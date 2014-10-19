define(function (require) {
    'use strict';

    var BaseObject = require('BaseObject'),
        LevelScreen = require('LevelScreen'),
        fileManager = require('fileManager');

    // constants

    var NUM_LEVELS = 1,
        NUM_CHASIS = 1,
        NUM_WHEELS = 1,
        DATA_PATH = "js/data/";

    var APP = BaseObject.extend({

        // variables

        currentScreen: null,

        // functions

        setup: function () {
            console.log("App Init.");

            fileManager.callback = this.startApp;
            fileManager.loadFiles(DATA_PATH + "/levels/", "level", fileManager.LEVELS, 1);
            fileManager.loadFiles(DATA_PATH + "/cars/", "chasis", fileManager.CHASIS, 1);
            fileManager.loadFiles(DATA_PATH + "/cars/", "wheel", fileManager.WHEELS, 1);
        },
        startApp: function () {
            var level = new LevelScreen(fileManager.LEVELS[0]);
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