define(function (require) {
    'use strict';

    return function MobileController(source) {
        this.id = source.id;
        this.configure = function (input, id) {
            this.sourceId = id;
            this.emit = function (msg) {
                msg.id = this.sourceId;
                input.trigger("input", msg);
            };
        };
    };
});