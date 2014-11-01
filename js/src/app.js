define(function (require) {
    'use strict';

    var BaseObject = require('BaseObject'),
        LevelScreen = require('LevelScreen'),
        files = require('files'),
        input = require('input'),
        KeyboardController = require('keyboard'),
        MobileController = require('mobile'),
        server = require('server'),
        APP = null;
    // constants

    APP = BaseObject.extend({

        // variables

        currentScreen: null,

        // functions

        setup: function () {
            server && this.configureServer();
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
        configureServer: function () {
            server.emit('register as server');

            server.on('client connection', function (source) {
                console.log('client ' + source.id + ' connected');
                input.addSource(new MobileController(source));
            });

            server.on('message', function (msg) {
                console.log('message from ' + msg.id);
                var source = input.getSource(msg.id);
                if(source)
                    input.getSource(msg.id).emit(msg);
            });
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