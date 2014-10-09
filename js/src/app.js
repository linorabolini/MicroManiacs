define(function (require) {
    'use strict';

    var BaseObject = require('BaseObject'),
        Level = require('Level');

    return BaseObject.extend({

        // variables

        level: null,

        // functions

        init: function () {
            this.__init();
            console.log("App Init.");
            this.on("message", this.handleMessage);
        },
        setup: function () {
            console.log("App Setup.");

            // main loop config

            this.level = new Level();
            this.level.setup();
            this.addChild(this.level);
        },
        handleMessage: function (message) {
            console.log(message);
        },
        update: function (dt) {
            this.__update(dt);
        },
        dispose: function () {
            this.__dispose();
        }
    });
});