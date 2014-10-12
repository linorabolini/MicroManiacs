define(function (require){
    
    var BaseObject = require('BaseObject'),
        THREE = require('three');


    //  WORKER SHARED MESSAGES

    var WORKER = {
        INPUT:0,
        START:1,
        ADD_OBJECT:2,
        REMOVE_OBJECT:3
    };

    return BaseObject.extend({

        // variables

        physicsWorker: null,
        renderObjects: null,
        scene: null,
        camera: null,


        // functions

        init: function () {
            this.__init();

            this.renderObjects = [];
        },
        generateFromSceneData: function (data) {
            // setup the physical world
            this.setupWorker();

            // create a new scene info from data
            var loader = new THREE.ObjectLoader();
            this.scene = loader.parse(data);

            this.loadCameraFromSceneData(this.scene);

            // load static objects
            this.loadStaticObjectsFromSceneData(this.scene);

            // load spawn areas
            // TODO THIS
            //
        },
        loadCameraFromSceneData: function (sceneData) {
            this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

            var cameraData = sceneData.getObjectByName("CAMERA");
            var pos = cameraData.getObjectByName("POSITION");
            var target = cameraData.getObjectByName("TARGET");
    
            this.camera.position.copy(pos.position);
            this.camera.lookAt(target.position);
        },
        loadStaticObjectsFromSceneData: function (sceneData) {
            // load objects from LEVEL layer
            var levelObject = sceneData.getObjectByName("LEVEL");
            var len = levelObject.children.length;

            for (var i = 0; i < len; i++) {
                var object = levelObject.children[i];

                // custom object data
                i == 0 && (object.mass = 1); // TODO: SACAR ESTO

                // track object
                // this.scene.add(object);          // visualy
                this.renderObjects.push(object);    // logicaly
                this.createPhysicalObject(object);  // physicaly
            };
        },
        createPhysicalObject: function (mesh) {
            var serializedMesh = this.serializeMesh(mesh);

            this.physicsWorker.postMessage({
                type: WORKER.ADD_OBJECT,
                object: serializedMesh
            });
        },
        serializeMesh: function (mesh) {

            // serialize the mesh params to pass them to the
            // physics worker. All serialization should be done 
            // here.

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

            return object;
        },
        setupWorker: function () {
            // Worker
            this.physicsWorker = new Worker('./js/src/physicsWorker.js');
            this.physicsWorker.onmessage = this.onmessage;
            this.physicsWorker.postMessage({
                type: WORKER.START
            });
        },
        onmessage: function (event) {
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