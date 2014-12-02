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
            var indx = this.children.indexOf(child);
            if (indx >= 0) {
                this.children.splice(indx, 1);
                child.parent = null;
                return child;
            }
        },
        dispose: function () {
            var i;
            if (this.isDisposed) {
                console.error("Tried to dispose an already disposed object");
                return;
            }

            for (i = this.children.length - 1; i >= 0; i--) {
                this.children[i].dispose();
            }

            this.children = [];
            this.isDisposed = true;

            this.parent && this.parent.removeChild(this);
        },
        update: function (dt) {
            var i;
            for (i = this.children.length - 1; i >= 0; i--) {
                this.children[i].update(dt);
            }
        }
    });
});