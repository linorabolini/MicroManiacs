define(function (require){
    
    var BaseObject = require('BaseObject'),
        THREE = require('three'),
        fileManager = require('fileManager'),
        Utils = require('utils');

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
    var SCALE = 10;
    var PERSPECTIVE_CAMERA = false;

    return BaseObject.extend({

        // variables

        physicsWorker: null,
        bodies: null,
        scene: null,
        camera: null,
        spawners: null,
        vehicles: null,
        wheels: null,

        // functions

        init: function () {
            this.__init();

            this.bodies = [];
            this.spawners = [];
            this.vehicles = [];
            this.wheels = [];


            function getKeyCode(key) {
                var code;
                switch (event.keyCode) {
                    case 38:
                        code = "up";
                        break;
                    case 40:
                        code = "down";
                        break;
                    case 37:
                        code = "left";
                        break;
                    case 39:
                        code = "right";
                        break;
                    default:
                        code = ""
                }
                return code;
            }

            var scope = this;

            window.onkeydown = function (event) {

                var code = getKeyCode(event.keyCode);

                scope.physicsWorker.postMessage({
                    type: WORKER.INPUT,
                    data: {
                        id: 0,
                        status: true,
                        code: code
                    }
                });
            };
            window.onkeyup = function (event) {

                var code = getKeyCode(event.keyCode);

                scope.physicsWorker.postMessage({
                    type: WORKER.INPUT,
                    data: {
                        id: 0,
                        status: false,
                        code: code
                    }
                });
            };
        },
        generateFromSceneData: function (data) {
            // setup the physical world
            this.setupWorker();

            // create a new scene info from data
            var loader = new THREE.ObjectLoader();
            this.scene = loader.parse(data);

            // load camera
            this.loadCameraFromSceneData(this.scene);

            // load static objects
            this.loadStaticObjectsFromSceneData(this.scene);

            // load spawn areas
            this.loadSpawnersFromSceneData(this.scene);

            // TODO THIS: vehicles have to be created at the start and 
            // upon connection of new controllers

                // create a sample vehicle
                var playerData = {
                    id: 3,
                    vehicleID: 1
                };
                this.addPlayer(playerData);
            //
        },
        addPlayer: function (playerData) {

            var spawner = this.getFreeSpawner();
            var spawnerData = this.serializeObject3D(spawner);

            var loader = new THREE.ObjectLoader();
            var chasis = loader.parse(fileManager.CHASIS[0]);


            var chasisData = this.serializeMesh(chasis);
            chasisData[10] = 50;

            var dx = 0.9;
            var dy = 0.4;
            var dzBack = 2;
            var dzFront = 2;

            var radius = 0.5;

            var data = {

                "vehicleID" : playerData.vehicleID,

                "spawnData" : spawnerData,

                "chasisData": chasisData,

                "wheels" : [

                    {
                        "isFrontWheel"  : true,
                        "mirrored"      : false,

                        "wheelRadius"           : radius,
                        "suspensionRestLength"  : 0.25,

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
                        "suspensionRestLength"  : 0.25,

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
                        "suspensionRestLength"  : 0.25,

                        "connectionPoint"   : [ -dx, -dy, -dzBack ],
                        "wheelDirection"    : [ 0, -1, 0 ],
                        "wheelAxle"         : [ -1, 0, 0 ]

                    },

                    {
                        "mirrored"      : true,
                        "isFrontWheel"  : false,

                        "wheelRadius"           : radius,
                        "suspensionRestLength"  : 0.25,

                        "connectionPoint"   : [ dx, -dy, -dzBack ],
                        "wheelDirection"    : [ 0, -1, 0 ],
                        "wheelAxle"         : [ -1, 0, 0 ]
                    }

                ],

                "maxSuspensionTravelCm" : 750.0,
                "maxSuspensionForce"    : 6000.0,
                "suspensionStiffness"   : 10.0,
                "suspensionCompression" : 20.83,
                "suspensionDamping"     : 0.88,
                "rollInfluence"         : 0.1,
                "frictionSlip"          : 1

            }

            this.physicsWorker.postMessage({
                type: WORKER.CREATE_CAR,
                data: data
            });

            this.scene.add(chasis);
            this.bodies.push(chasis);

            // wheels

            for (var i = 0; i < 4; i++) {
                var wheel = loader.parse(fileManager.WHEELS[0]);
                this.scene.add(wheel);
                this.wheels.push(wheel);
            };

            this.vehicles.push(playerData);
        },
        loadCameraFromSceneData: function (sceneData) {

            var w = window.innerWidth;
            var h = window.innerHeight;

            if (PERSPECTIVE_CAMERA) { 
                this.camera = new THREE.PerspectiveCamera( 70, w / h, 1, 1000 );
            } else {
                this.camera = new THREE.OrthographicCamera( -w/2, w/2, h/2, -h/2, 1, 1000 );
            }

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

                // track object
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
            return Utils.getRandom(this.spawners);
        },
        serializeMesh: function (mesh) {

            // serialize the mesh params to pass them to the
            // physics worker.

            var offset = 0;
            var object = [];

            offset = this.serializePosition(mesh, object, offset);
            offset = this.serializeRotation(mesh, object, offset);
            offset = this.serializeBoxSize(mesh, object, offset);

            console.log(mesh)
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
        dispose: function () {
            if (physicsWorker) physicsWorker.terminate();

            physicsWorker = null;
            this.vehicles = null;
            bodies = null;
            scene = null;
            camera = null;
            spawners = null;
            vehicles = null;
            wheels = null;

            this.__dispose();
        }
    });
});