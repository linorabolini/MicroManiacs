define(function (require) {

    var BaseObject = require('BaseObject'),
        THREE = require('three'),
        utils = require('utils'),
        input = require('input');

    return BaseObject.extend({

        // variables

        renderer: null,

        // functions
        addToScreen: function () {
            document.body.appendChild( this.renderer.domElement );
        },
        removeFromScreen: function () {
            document.body.removeChild( this.renderer.domElement );
        },
        startRendering: function () {
            var scope = this;

            // setup renderer
            if (window.WebGLRenderingContext)
                this.renderer = new THREE.WebGLRenderer();
            else
                this.renderer = new THREE.CanvasRenderer();

            this.renderer.shadowMapEnabled = true;
            this.renderer.shadowMapType = THREE.PCFShadowMap;

            this.renderer.setClearColor(0x00688B, 1);
            this.renderer.setSize( window.innerWidth, window.innerHeight );
            window.onresize = function() {
                scope.renderer.setSize( window.innerWidth, window.innerHeight );
            };

        },
        render: function (model) {
            this.renderer.render(model.scene, model.getCamera());
        },
        dispose: function() {
            this.__dispose();
            this.removeFromScreen();
            window.onresize = null;
        }
    });
});