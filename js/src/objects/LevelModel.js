define(function (require) {

    var BaseObject          = require('BaseObject'),
        THREE               = require('three'),
        files               = require('files'),
        utils               = require('utils'),
        serializer          = require('serializer'),
        physics             = require('physics');

    //  WORKER SHARED MESSAGES
    var WORKER = {
        INPUT               : 0,
        START               : 1,
        ADD_OBJECT          : 2,
        REMOVE_OBJECT       : 3,
        CREATE_CAR          : 4,
        SIMULATION_DATA     : 5
    };

    var WORKER_PATH         = './js/src/workers/ammo.js',
        SCALE               = 80, // + SCALE -> + SPEED
        PERSPECTIVE_CAMERA  = false;

    var rotate              = {x: 0, y: 0, z: 0};
    var rotateVec           = {x: new THREE.Vector3(1, 0, 0),
                               y: new THREE.Vector3(0, 1, 0),
                               z: new THREE.Vector3(0, 0, 1)};

    return BaseObject.extend({

        // variables

        bodies: null,
        scene: null,
        camera: null,
        cameraTarget: null,
        spawners: null,
        wheels: null,
        isRotatingCamera: 0,

        // functions

        init: function () {
            this.__init();

            this.bodies = [];
            this.spawners = [];
            this.wheels = [];
        },
        generateFromSceneData: function (data) {
            // setup the physical world
            physics.loadWorker(WORKER_PATH, this.onmessage);

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
        },
        handleInput: function (event) {
            if (event.type === "key") {
                event.code = utils.getKeyCode(event.code);
                physics.send(WORKER.INPUT, event);
            } else {
                physics.send(WORKER.INPUT, event);
            }
        },
        addPlayers: function (inputSources) {
            var i, config;
            for (i in inputSources) {
                config = inputSources[i];
                this.addPlayer(config);
            }
        },
        addPlayer: function (config) {

            var spawner     = this.getFreeSpawner(),
                loader      = new THREE.ObjectLoader(),
                playerId    = config.sourceId,
                chasisId    = config.chasisId || 0,
                wheelId     = config.wheelId || 0,
                chasis,
                chasisData;

            chasis = loader.parse(files.CHASIS[chasisId]);
            chasis.position.copy(spawner.position);
            chasis.rotation.copy(spawner.rotation);
            chasis.castShadow = true;
            chasis.receiveShadow = true;
            this.scene.add(chasis);
            this.bodies.push(chasis);

            chasisData = serializer.serialize(chasis, SCALE);

            // wheels

            for (var i = 0; i < 4; i++) {

                var wheel = loader.parse(files.WHEELS[wheelId]);

                this.scene.add(wheel);
                this.wheels.push(wheel);

            }

            var ratio   = SCALE  / 10,
                dx      = 0.9 / ratio,
                dy      = 0.4 / ratio,
                dzBack  = 2   / ratio,
                dzFront = 2   / ratio,
                radius  = 0.5 / ratio;

            var data = {

                "id" : playerId,

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

            physics.send(WORKER.CREATE_CAR, data);

        },
        loadCameraFromSceneData: function (sceneData) {

            var w           = window.innerWidth,
                h           = window.innerHeight,
                cameraData  = sceneData.getObjectByName("CAMERA"),
                pos         = cameraData.getObjectByName("POSITION"),
                target      = cameraData.getObjectByName("TARGET");

            if (PERSPECTIVE_CAMERA)
                this.camera = new THREE.PerspectiveCamera(70, w / h, 1, 1500);
            else
                this.camera = new THREE.OrthographicCamera(-w/2, w/2, h/2, -h/2, 1, 1500);

            this.camera.position.copy(pos.position);
            this.camera.lookAt(target.position);
            this.cameraTarget = target;

        },
        loadLightFromSceneData: function (sceneData) {

            var light = sceneData.getObjectByName("LIGHT",
                                                    true);

            light.castShadow        = true;
            light.shadowCameraNear  = 100;
            light.shadowCameraFar   = 1500;
            light.shadowCameraFov   = 10;
            light.shadowBias        = 0.0001;
            light.shadowDarkness    = 0.2;
            light.shadowMapWidth    = window.innerWidth;
            light.shadowMapHeight   = window.innerHeight;

        },
        loadStaticObjectsFromSceneData: function (sceneData) {
            // load objects from LEVEL layer
            var levelObject = sceneData.getObjectByName("LEVEL"),
                len         = levelObject.children.length,
                object;

            for (var i = 0; i < len; i++) {

                object = levelObject.children[i];

                object.castShadow    = true;
                object.receiveShadow = true;

                this.bodies.push(object);    // logicaly
                this.createPhysicalObject(object);  // physicaly

            };
        },
        loadSpawnersFromSceneData: function (sceneData) {
            // load objects from SPAWNERS layer
            var spawnersObject = sceneData.getObjectByName("SPAWNERS");
            this.spawners      = spawnersObject.children;
        },
        createPhysicalObject: function (mesh) {
            var data = serializer.serialize(mesh, SCALE);
            physics.send(WORKER.ADD_OBJECT, data);
        },
        getFreeSpawner: function() {
            return utils.getRandom(this.spawners);
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

            offset = serializer.applyData(data, offset, this.bodies, SCALE);
            offset = serializer.applyData(data, offset, this.wheels, SCALE);

        },
        rotateCamera: function (axis, value) {
            rotate[axis] = value;
            this.isRotatingCamera = rotate["x"] + rotate["y"] + rotate["z"];
        },
        update: function (dt) {
            this.__update(dt);

            // rotate camera 
            if(this.isRotatingCamera) {
                var amount = dt * 0.001;
                this.camera.position.applyAxisAngle(rotateVec["z"], amount * rotate["z"]);
                this.camera.position.applyAxisAngle(rotateVec["y"], amount * rotate["y"]);
                this.camera.position.applyAxisAngle(rotateVec["x"], amount * rotate["x"]);
                this.camera.lookAt(this.cameraTarget.position);
            }
        },
        dispose: function () {
            physics.dispose();
            this.bodies     = null;
            this.scene      = null;
            this.camera     = null;
            this.spawners   = null;
            this.wheels     = null;

            this.__dispose();
        }
    });
});