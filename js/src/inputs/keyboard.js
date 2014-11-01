define(function (require) {
    'use strict';

    var keyboards = 0;

    return function KeyboardController () {
        this.configure = function (input, id) {
            this.id = "keyboard" + id + ':' + keyboards;
            this.sourceId = id;

            keyboards++;

            function keyEvent(event) {
                if (event.repeat) {
                    return;
                }

                var data = { 
                    id: id,
                    value: event.type === "keydown" ? 1 : 0,
                    code: event.keyCode,
                    type: "key"
                };

                input.trigger("input", data);
            }

            window.addEventListener("keydown", keyEvent);
            window.addEventListener("keyup", keyEvent);
        }
    };
});