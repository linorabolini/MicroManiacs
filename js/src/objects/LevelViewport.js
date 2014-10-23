define(function (require){

    var BaseObject = require('BaseObject'),
        THREE = require('three'),
        utils = require('utils'),
        input = require('input');

    return BaseObject.extend({

        // variables

        renderer: null,
        model: null,

        // functions
        init: function () {
            this.__init();
            input.on("input", this.handleInput);
        },
        handleInput: function (event) {
            if (!this.model) return;

            if (event.type == "key") {
                var key = utils.getKeyCode(event.code);
            }
        },
        addToScreen: function () {
            document.body.appendChild( this.renderer.domElement );
        },
        removeFromScreen: function () {
            document.body.removeChild( this.renderer.domElement );
        },
        startRendering: function (levelModel) {
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

            this.model = levelModel; // set the level to render
        },
        update: function (dt) {
            this.__update(dt);
            this.model && this.renderer.render(this.model.scene, this.model.camera);
        },
        dispose: function() {
            this.__dispose();
            this.removeFromScreen();
        }
    });
});