define(function (require) {
    'use strict';

    var BaseObject = require('BaseObject'),
        LevelScreen = require('LevelScreen'),
        files = require('files'),
        input = require('input'),
        KeyboardController = require('keyboard'),
        server = require('server'),
        config = require('config'),
        APP = null;

    APP = BaseObject.extend({

        // variables

        currentScreen: null,

        // functions

        setup: function () {
            server.setup();
            this.loadDataFiles();

            // add keyboard source
            input.addSource(new KeyboardController());
        },
        loadDataFiles: function () {
            var NUM_LEVELS = 2,
                NUM_CHASIS = 1,
                NUM_WHEELS = 1,
                DATA_PATH = "js/data/";

            files.onLoaded(this.startApp);
            files.loadFiles(DATA_PATH + "/levels/", "level", files.LEVELS, NUM_LEVELS);
            files.loadFiles(DATA_PATH + "/cars/", "chasis", files.CHASIS, NUM_CHASIS);
            files.loadFiles(DATA_PATH + "/cars/", "wheel", files.WHEELS, NUM_WHEELS);
        },
        startApp: function () {
            var screen = new LevelScreen(files.LEVELS[0]);
            this.setScreen(screen);
        },
        setScreen: function (newScreen) {
            if (this.screen) {
                this.removeChild(this.screen).dispose();
            }

            this.screen = newScreen;
            this.addChild(this.screen);
        }
    });

    return new APP();
});