define(function (require) {
    'use strict';

    function MobileController(externalSource) {
        this.id = externalSource.id;
    };

    MobileController.prototype.configure = function (input, id) {
        
        // stores the 
        this.internalSourceId = id;

        this.emit = function (msg) {

            // remaps the message id as the 
            // source id
            msg.id = this.internalSourceId;

            // triggers that an input has arrived
            input.trigger("input", msg);

        };

    };

    return MobileController;
});