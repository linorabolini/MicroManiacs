define(function(require) {
    var config = require('config'),
        debug = config.debug;

    return function () {
            if (!debug) return;
            var i;
            console.log('===== DEBUG ======');
            for (i in arguments) {
              console.log(arguments[i]);
            }
        }
});