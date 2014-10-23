define(function (require) {
    'use strict';

    var BaseObject = require('BaseObject'),
        LevelScreen = require('LevelScreen'),
        files = require('files'),
        input = require('input');

    // constants

    var APP = BaseObject.extend({

        // variables

        currentScreen: null,

        // functions

        setup: function () {
            console.log("App Init.");

            this.configureInput();
            this.loadDataFiles();
        },
        loadDataFiles: function () {
            var NUM_LEVELS = 1,
                NUM_CHASIS = 1,
                NUM_WHEELS = 1,
                DATA_PATH = "js/data/";

            files.onLoaded(this.startApp);
            files.loadFiles(DATA_PATH + "/levels/", "level", files.LEVELS, NUM_LEVELS);
            files.loadFiles(DATA_PATH + "/cars/", "chasis", files.CHASIS, NUM_CHASIS);
            files.loadFiles(DATA_PATH + "/cars/", "wheel", files.WHEELS, NUM_WHEELS);
        },
        configureInput: function () {

            this.configureKeyboardEvents();

            input.addSource("keyboard", window);
        },
        configureKeyboardEvents: function () {
            function loadKeyboardSource (source, id) {
                function keyEvent(event) {
                    if (event.repeat) return;
                    var data = { id: id,
                                value: event.type == "keydown",
                                code: event.keyCode,
                                type: "key" 
                        };
                    input.trigger("input", data);
                };
                source.addEventListener( "keydown", keyEvent);
                source.addEventListener( "keyup"  , keyEvent);
            }

            input.addSourceLoader("keyboard", loadKeyboardSource);
        },
        startApp: function () {
            var level = new LevelScreen(files.LEVELS[0]);
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