define(function (require) {
    'use strict';

    var Model = require('fishbone');

    return Model({

        // variables

        parent: null,
        children: null,
        isDisposed: false,

        // functions
        init: function () {
            this.children = [];
        },
        addChild: function (child) {
            this.children.push(child);
            child.parent = this;
        },
        removeChild: function (child) {
            var indx = indexOf(child);
            if(indx >= 0) {
                var child = this.children.splice(indx, 1)[0];
                child.parent = null;
                return child;
            }
        },
        dispose: function () {
            if(isDisposed)  {
                console.error("Tried to dispose an already disposed object");
                return;
            }

            for (var i = this.children.length - 1; i >= 0; i--) {
                this.children[i].dispose();
            };

            this.children = [];
            isDisposed = true;
        },
        update: function (dt) {
            for (var i = this.children.length - 1; i >= 0; i--) {
                this.children[i].update(dt);
            };
        }
    });
});