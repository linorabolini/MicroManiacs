define(function (require) {

    var BaseObject          = require('BaseObject'),
        THREE               = require('three'),
        files               = require('files'),
        utils               = require('utils'),
        serializer          = require('serializer'),
        Vehicle             = require('vehicle'),
        VehicleParts        = require('vehicleParts'),
        VehicleStats        = require('vehicleStats'),
        VehicleStatus       = require('vehicleStatus'),
        physics             = require('physics'),
        _                   = require('underscore'),
        CameraHelper        = require('cameraHelper'),
        config              = require('config').level;

    //  WORKER SHARED MESSAGES
    var WORKER = {
        SET_VEHICLES_STATUS : 0, // message to update vehicles status
        START               : 1, // deprecated
        ADD_OBJECT          : 2, // message to create a body
        REMOVE_OBJECT       : 3, // not implemented
        CREATE_CAR          : 4, // message to create cars
        SIMULATION_DATA     : 5, // callback with physics information
        ADD_FORCE           : 6, // not implemented
        SET_ATTRIBUTES      : 7  // not implemented
    };

    var SCALE = config.scale; // + SCALE -> + SPEED

    return BaseObject.extend({

        // variables

        bodies: null,
        wheels: null,
        spawners: null,
        vehicles: null,
        scene: null,
        cameraHelper: null,
        

        // functions

        init: function () {
            this.__init();

            this.bodies   = [];
            this.spawners = [];
            this.wheels   = [];
            this.vehicles = [];
        },
        generateFromSceneData: function (data) {
            // setup the physical world
            physics.onmessage(this.onmessage);

            // create a new scene info from data
            var loader = new THREE.ObjectLoader();
            this.scene = loader.parse(data);

            // load level
            this.loadCameraFromSceneData(this.scene)
                .loadLightFromSceneData(this.scene)
                .loadStaticObjectsFromSceneData(this.scene)
                .loadSpawnersFromSceneData(this.scene);
        },
        handleInput: function (event) {
            var vehicle = this.getVehicle(event.id);
            vehicle.handleInput(event);
        },
        addPlayers: function (inputSources) {
            _.each(inputSources, function(config) {
                this.addPlayer(config);
            }, this);
        },
        addPlayer: function (config) {

            var vehicle = this.createVehicle(config),
                spawner = this.getFreeSpawner();

            vehicle.setAs(spawner);
            this.addVehicleToScene(vehicle);
            this.setVehicle(config.internalSourceId, vehicle);

            // TODO: create vehicle object to control the chasis here
            // var player = new Player();

        },
        loadCameraFromSceneData: function (sceneData) {
            this.cameraHelper = new CameraHelper(sceneData, config.camera);
            this.addChild(this.cameraHelper);

            return this;
        },
        getCamera: function () {
            return this.cameraHelper.camera;
        },
        getCameraTarget: function () {
            return this.cameraHelper.target;
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

            return this;

        },
        loadStaticObjectsFromSceneData: function (sceneData) {
            // load objects from LEVEL layer
            var levelObjects = sceneData.getObjectByName("LEVEL").children.slice(),
                object;

            for (var i in levelObjects) {
                object               = levelObjects[i];
                object.castShadow    = true;
                object.receiveShadow = true;

                this.addBodyToScene(object);
                this.createPhysicalObject(object);  // physicaly
            };

            return this;
        },
        loadSpawnersFromSceneData: function (sceneData) {
            // load objects from SPAWNERS layer
            var spawnersObject = sceneData.getObjectByName("SPAWNERS");
            this.spawners      = spawnersObject.children;

            return this;
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
        createVehicle: function (config) {
            var loader      = new THREE.ObjectLoader(),
                chasisId    = config.chasisId || 0,
                wheelIds    = config.wheelIds || [0, 0, 0, 0];

            // load the 
            var vehicleData = loader.parse(files.get("chasis", chasisId));

            // configure chasis with the spawner
            //  position and rotation
            var chasis = vehicleData.getObjectByName("CHASIS");

            // load and configure wheels
            var wheels = wheelIds.map(function(id) {
                return loader.parse(files.get("wheel", id));
            });

            // load anchors information
            var anchors = vehicleData.getObjectByName("WHEELS").children;

            // compound vehicle
            var parts   = new VehicleParts(chasis, anchors, wheels);
            var stats   = new VehicleStats(150, 0.4);
            var status  = new VehicleStatus();
            var vehicle = new Vehicle(parts, stats, status);

            return vehicle;
        },
        addVehicleToScene: function (vehicle) {
            var chasis = vehicle.getChasis(),
                wheels = vehicle.getWheels();

            this.addBodyToScene(chasis);
            wheels.forEach(this.addWheelToScene);

            // serialize and create physical vehicle
            var sVehicle = vehicle.serialize(SCALE);
            physics.send(WORKER.CREATE_CAR, sVehicle);
        },
        addBodyToScene: function (body) {
            this.scene.add(body);
            this.bodies.push(body);
        },
        addWheelToScene: function (wheel) {
            this.scene.add(wheel);
            this.wheels.push(wheel);
        },
        removeVehicleFromScene: function (vehicle) {
            console.error("NOT IMPLEMENTED!");
        },
        removeBodyFromScene: function (body) {
            console.error("NOT IMPLEMENTED!");
        },
        removeWheelFromScene: function (wheel) {
            console.error("NOT IMPLEMENTED!");
        },
        setVehicle: function (id, value) {
            this.vehicles[id] = value;
        },
        getVehicle: function (id) {
            return this.vehicles[id];
        },
        rotateCamera: function (axis, value) {
            this.cameraHelper.rotateCamera(axis, value);
        },
        update: function (dt) {
            this.__update(dt);

            // updateVehiclesStatus
            var data = this.vehicles.map(function(vehicle) {
                return vehicle.getStatus();
            });
            physics.send(WORKER.SET_VEHICLES_STATUS, data);
        },
        dispose: function () {
            physics.dispose();
            this.bodies     = null;
            this.scene      = null;
            this.spawners   = null;
            this.wheels     = null;
            this.vehicles   = null;

            this.__dispose();
        }
    });
});