define(function (require){
    
    var BaseObject = require('BaseObject'),
        THREE = require('three'),
        files = require('files'),
        utils = require('utils'),
        input = require('input');

    //  WORKER SHARED MESSAGES

    var WORKER = {
        INPUT:0,
        START:1,
        ADD_OBJECT:2,
        REMOVE_OBJECT:3,
        CREATE_CAR: 4,
        SIMULATION_DATA: 5
    };

    // SCALE
    var SCALE = 50; // MORE SCALE -> MORE SPEED
    var PERSPECTIVE_CAMERA = false;

    return BaseObject.extend({

        // variables

        physicsWorker: null,
        bodies: null,
        scene: null,
        camera: null,
        spawners: null,
        wheels: null,

        // functions

        init: function () {
            this.__init();

            this.bodies = [];
            this.spawners = [];
            this.wheels = [];

            input.on("input", this.handleInput);
        },
        handleInput: function (event) {
            if (event.type == "key") {
                event.code = utils.getKeyCode(event.code);

                this.physicsWorker.postMessage({
                    type: WORKER.INPUT,
                    data: event
                });
            }
        },
        generateFromSceneData: function (data) {
            // setup the physical world
            this.setupWorker();

            // create a new scene info from data
            var loader = new THREE.ObjectLoader();
            this.scene = loader.parse(data);

            // load camera
            this.loadCameraFromSceneData(this.scene);

            // load light
            this.loadLightFromSceneData(this.scene);

            // load static objects
            this.loadStaticObjectsFromSceneData(this.scene);

            // load spawn areas
            this.loadSpawnersFromSceneData(this.scene);

            // TODO THIS: vehicles have to be created at the start and 
            // upon connection of new controllers
            this.addPlayers(input.getSources());

            //
        },
        addPlayers: function (inputSources) {
            for (var i = 0; i < inputSources.length; i++) {
                var inputSource = inputSources[i];

                this.addPlayer(inputSource.id);
            };
        },
        addPlayer: function (id) {

            var spawner = this.getFreeSpawner();
            var loader = new THREE.ObjectLoader();
            var chasis = loader.parse(files.CHASIS[0]);

            chasis.position.copy(spawner.position);
            chasis.rotation.copy(spawner.rotation);

            var chasisData = this.serializeMesh(chasis);

            this.scene.add(chasis);
            this.bodies.push(chasis);

            chasis.castShadow = true;
            chasis.receiveShadow = true;

            // wheels

            for (var i = 0; i < 4; i++) {
                var wheel = loader.parse(files.WHEELS[0]);
                this.scene.add(wheel);
                this.wheels.push(wheel);
            };

            var ratio = SCALE / 10;
            var dx = 0.9 / ratio;
            var dy = 0.4 / ratio;
            var dzBack = 2 / ratio;
            var dzFront = 2 / ratio;

            var radius = 0.5 / ratio;

            var data = {

                "id" : id,

                "chasisData": chasisData,

                "wheels" : [

                    {
                        "isFrontWheel"  : true,
                        "mirrored"      : false,

                        "wheelRadius"           : radius,
                        "suspensionRestLength"  : 0.25 / (ratio),

                        "connectionPoint"   : [ -dx, -dy, dzFront ],
                        "wheelDirection"    : [ 0, -1, 0 ],
                        "wheelAxle"         : [ -1, 0, 0 ],

                        "tuning" : {
                            "rollInfluence" : 0.1,
                        }
                    },

                    {
                        "isFrontWheel"  : true,
                        "mirrored"      : true,

                        "wheelRadius"           : radius,
                        "suspensionRestLength"  : 0.25 / (ratio),

                        "connectionPoint"   : [ dx, -dy, dzFront ],
                        "wheelDirection"    : [ 0, -1, 0 ],
                        "wheelAxle"         : [ -1, 0, 0 ],

                        "tuning" : {
                            "rollInfluence" : 0.1,
                        }

                    },

                    {
                        "isFrontWheel"  : false,
                        "mirrored"      : false,

                        "wheelRadius"           : radius,
                        "suspensionRestLength"  : 0.5 / (ratio),

                        "connectionPoint"   : [ -dx, -dy, -dzBack ],
                        "wheelDirection"    : [ 0, -1, 0 ],
                        "wheelAxle"         : [ -1, 0, 0 ]

                    },

                    {
                        "mirrored"      : true,
                        "isFrontWheel"  : false,

                        "wheelRadius"           : radius,
                        "suspensionRestLength"  : 0.5 / (ratio),

                        "connectionPoint"   : [ dx, -dy, -dzBack ],
                        "wheelDirection"    : [ 0, -1, 0 ],
                        "wheelAxle"         : [ -1, 0, 0 ]
                    }

                ],

                "maxSuspensionTravelCm" : 750.0,
                "maxSuspensionForce"    : 6000.0,
                "suspensionStiffness"   : 10.0 * ratio,
                "suspensionCompression" : 20.83,
                "suspensionDamping"     : 0.88,
                "rollInfluence"         : 0.1,
                "frictionSlip"          : 1000

            }

            this.physicsWorker.postMessage({
                type: WORKER.CREATE_CAR,
                data: data
            });

        },
        loadCameraFromSceneData: function (sceneData) {

            var w = window.innerWidth;
            var h = window.innerHeight;

            if (PERSPECTIVE_CAMERA) { 
                this.camera = new THREE.PerspectiveCamera( 70, w / h, 1, 1500 );
            } else {
                this.camera = new THREE.OrthographicCamera( -w/2, w/2, h/2, -h/2, 1, 1500 );
            }

            var cameraData = sceneData.getObjectByName("CAMERA");
            var pos = cameraData.getObjectByName("POSITION");
            var target = cameraData.getObjectByName("TARGET");
    
            this.camera.position.copy(pos.position);
            this.camera.lookAt(target.position);

        },
        loadLightFromSceneData: function (sceneData) {

            var w = window.innerWidth;
            var h = window.innerHeight;

            // light

            var light = sceneData.getObjectByName("LIGHT", true);
            light.castShadow = true;

            light.shadowCameraNear = 100;
            light.shadowCameraFar = 1500;
            light.shadowCameraFov = 10;

            //light.shadowCameraVisible = true;

            light.shadowBias = 0.0001;
            light.shadowDarkness = 0.2;

            light.shadowMapWidth = w;
            light.shadowMapHeight = h;
        },
        loadStaticObjectsFromSceneData: function (sceneData) {
            // load objects from LEVEL layer
            var levelObject = sceneData.getObjectByName("LEVEL");
            var len = levelObject.children.length;

            for (var i = 0; i < len; i++) {
                var object = levelObject.children[i];

                object.castShadow = true;
                object.receiveShadow = true;

                this.bodies.push(object);    // logicaly
                this.createPhysicalObject(object);  // physicaly
            };
        },
        loadSpawnersFromSceneData: function (sceneData) {
            // load objects from SPAWNERS layer
            var spawnersObject = sceneData.getObjectByName("SPAWNERS");
            this.spawners = spawnersObject.children;
        },
        createPhysicalObject: function (mesh) {
            var serializedMesh = this.serializeMesh(mesh);

            this.physicsWorker.postMessage({
                type: WORKER.ADD_OBJECT,
                data: serializedMesh
            });

            return serializedMesh;
        },
        getFreeSpawner: function() {
            return utils.getRandom(this.spawners);
        },
        serializeMesh: function (mesh) {

            // serialize the mesh params to pass them to the
            // physics worker.

            var offset = 0;
            var object = [];

            offset = this.serializePosition(mesh, object, offset);
            offset = this.serializeRotation(mesh, object, offset);
            offset = this.serializeBoxSize(mesh, object, offset);

            object[offset] = mesh.userData.mass !== undefined ? mesh.userData.mass : 1;

            return object;
        },
        serializeVehicle: function (mesh, spawner) {

            // serialize the mesh params to pass them to the
            // physics worker.

            var offset = 0;
            var object = [];

            offset = this.serializePosition(spawner, object, offset);
            offset = this.serializeRotation(spawner, object, offset);
            offset = this.serializeBoxSize(mesh, object, offset);

            object[offset] = mesh.userData.mass !== undefined ? mesh.userData.mass : 1;

            return object;
        },
        serializeObject3D: function (mesh) {

            // serialize an Object 3d

            var offset = 0;
            var object = [];

            offset = this.serializePosition(mesh, object, offset);
            offset = this.serializeRotation(mesh, object, offset);

            return object;
        },
        serializePosition: function(obj, array, offset) {
            var origin = obj.position;
            array[offset] = origin.x / SCALE;
            array[offset+1] = origin.y / SCALE;
            array[offset+2] = origin.z / SCALE;

            return offset + 3;
        },
        serializeRotation: function(obj, array, offset) {
            var rotation = obj.quaternion;
            array[offset] = rotation.x;
            array[offset+1] = rotation.y;
            array[offset+2] = rotation.z;
            array[offset+3] = rotation.w;

            return offset + 4;
        },
        serializeBoxSize: function(obj, array, offset) {
            var size = obj.geometry.parameters;
            array[offset] = size.width / SCALE;
            array[offset+1] = size.height / SCALE;
            array[offset+2] = size.depth / SCALE;

            return offset + 3;
        },
        setupWorker: function () {
            // Worker
            this.physicsWorker = new Worker('./js/src/physics/worker.js');
            this.physicsWorker.onmessage = this.onmessage;
            this.physicsWorker.postMessage({
                type: WORKER.START
            });
        },
        onmessage: function (event) {
            var message = event.data;

            switch(message.type) {
                case WORKER.SIMULATION_DATA:
                    this.updateWorldWithSimulationData(message.data);
                    break;
                default:
            }
        },
        updateWorldWithSimulationData: function (data) {
            var offset = 0;

            offset = this.updateObjectFromData(data, offset, this.bodies);
            offset = this.updateObjectFromData(data, offset, this.wheels);
        },
        updateObjectFromData: function (data, offset, array) {
            //bodies
            for (var i = 0; i < array.length; i++) {
                var body = array[i];
                body.position.x = data[offset] * SCALE;
                body.position.y = data[offset+1] * SCALE;
                body.position.z = data[offset+2] * SCALE;

                body.quaternion.x = data[offset+3];
                body.quaternion.y = data[offset+4];
                body.quaternion.z = data[offset+5];
                body.quaternion.w = data[offset+6];

                offset += 7;
            }

            return offset;
        },
        update: function (dt) {
            this.__update(dt);
        },
        dispose: function () {
            if (physicsWorker) physicsWorker.terminate();

            physicsWorker = null;
            this.bodies = null;
            this.this.scene = null;
            this.camera = null;
            this.spawners = null;
            this.wheels = null;

            this.__dispose();
        }
    });
});