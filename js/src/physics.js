define(function (require) {
    'use strict';

    var config = require('config').worker,
        worker;

    return {
        onmessage: function (messageCallback) {
            worker  = new Worker(config.path);
            worker.onmessage = messageCallback;
        },
        send: function (type, data) {
            worker.postMessage({
                type: type,
                data: data
            });
        },
        dispose: function () {
            if (worker) {
                worker.terminate();
            }
        }
    };
});