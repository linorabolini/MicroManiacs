define(function (require){
    
    var BaseObject = require('BaseObject'),
        THREE = require('three');


    // messages
    var INPUT = 0,
        START = 1,
        ADD_OBJECT = 2,
        REMOVE_OBJECT = 3;

    return BaseObject.extend({

        // variables

        physicsWorker: null,
        renderObjects: null,
        view: null,

        // functions

        init: function (view, levelConfig) {
            this.__init();

            this.view = view;
            this.view.model = this;

            this.setupWorker();
            this.renderObjects = [];
            // this.loadPlayers();

            var levelObject = this.view.scene.getObjectByName("LEVEL");

            var len = levelObject.children.length;
            for (var i = 0; i < len; i++) {
                var cube = levelObject.children[i];
                //this.view.scene.add( cube );
                if(i!=2)cube.mass = 1;
                this.renderObjects.push(cube);
                this.createPhysicalObject(cube);
            };


        },
        createPhysicalObject: function (mesh) {
            var object = [];
            var origin = mesh.position;
            object[0] = origin.x;
            object[1] = origin.y;
            object[2] = origin.z;
            var rotation = mesh.quaternion;
            object[3] = rotation.x;
            object[4] = rotation.y;
            object[5] = rotation.z;
            object[6] = rotation.w;
            var size = mesh.geometry.parameters;
            object[7] = size.width;
            object[8] = size.height;
            object[9] = size.depth;
            var mass = mesh.mass || 0;
            object[10] = mass;

            this.physicsWorker.postMessage({
                type: ADD_OBJECT,
                object: object
            });
        },
        setupWorker: function () {
            // Worker
            this.physicsWorker = new Worker('./js/src/physicsWorker.js');
            this.physicsWorker.onmessage = this.handlePhysicsMessage;
            this.physicsWorker.postMessage({
                type: START
            });
        },
        handlePhysicsMessage: function (event) {
            var data = event.data;

            switch(data.type) {
                default:
              }
            
            for (var i = 0; i < data.objects.length; i++) {
                  var physicsObject = data.objects[i];
                  var renderObject = this.renderObjects[i];
                  renderObject.position.x = physicsObject[0];
                  renderObject.position.y = physicsObject[1];
                  renderObject.position.z = physicsObject[2];

                  renderObject.quaternion.x = physicsObject[3];
                  renderObject.quaternion.y = physicsObject[4];
                  renderObject.quaternion.z = physicsObject[5];
                  renderObject.quaternion.w = physicsObject[6];
            }
        },
        dispose: function () {
            if (physicsWorker) physicsWorker.terminate();
            this.__dispose();
        }
    });
});