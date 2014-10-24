define(function (require) {
    'use strict';
    return {
        type: "keyboard",
        load: function (input, source, id) {
            function keyEvent(event) {
                if (event.repeat) {
                    return;
                }
                var data = { id: id,
                            value: event.type === "keydown",
                            code: event.keyCode,
                            type: "key"
                        };
                input.trigger("input", data);
            }
            source.addEventListener("keydown", keyEvent);
            source.addEventListener("keyup", keyEvent);
        }
    };
});