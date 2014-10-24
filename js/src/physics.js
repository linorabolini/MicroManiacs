define(function (require) {
    'use strict';

    var worker;

    return {
        loadWorker: function (path, messageCallback) {
            this.dispose();
            worker  = new Worker(path);
            worker.onmessage = messageCallback;
            return this;
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