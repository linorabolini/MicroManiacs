'use strict';

var Module = { TOTAL_MEMORY: 256*1024*1024 };

importScripts('../../libs/ammo.js');


// Bullet-interfacing code

var collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
var dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
var overlappingPairCache = new Ammo.btDbvtBroadphase();
var solver = new Ammo.btSequentialImpulseConstraintSolver();
var dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
dynamicsWorld.setGravity(new Ammo.btVector3(0, -10, 0));

var bodies = [];
var vehicles = [];
var bodiesMap = {};

var vehiclesStatus = [];

var DISABLE_DEACTIVATION = 4;
var ENGINE_FORCE = 150;
var STEERING = 0.4;
var BRAKE = 2;

var FPS = 50;

function startUp(data) {
    // loop
    var last = Date.now();
    function mainLoop() {
        var now = Date.now();
        update(now - last);
        last = now;
    }
    setInterval(mainLoop, 1000/FPS);
}

function readVec3(data, offset) {
    var o = offset[0];
    offset[0] = o + 3;
    return new Ammo.btVector3(data[o], data[o + 1], data[o + 2]);
}

function readQuaternion(data, offset) {
    var o = offset[0];
    offset[0] = o + 4;
    return new Ammo.btQuaternion(data[o], data[o + 1], data[o + 2], data[o + 3]);
}

function readSlot(data, offset) {
    var o = offset[0];
    offset[0] = o + 1;
    return data[o];
}

function readGeometry(data, offset) {
    var type = readSlot(data, offset);
    return geometryReader[type](data, offset);
}

function readShape(data, offset) {
    var type = readSlot(data, offset);
    return shapeReader[type](data, offset);
}

var geometryReader = {
    BoxGeometry: function (data, offset) {
        return new Ammo.btBoxShape(readVec3(data, offset));
    },

    SphereGeometry: function (data, offset) {
        return new Ammo.btSphereShape(readSlot(data, offset));
    }
};

var shapeReader = {
    Mesh: function (data, offset) {
        return readGeometry(data, offset);
    },
    Group: function (data, offset) {
        return new Ammo.btCompoundShape();
    },
    Object3D: function (data, offset) {
        return this.Group(data, offset);
    }
};

function addObject(data, parent) {

    var offset = [ 0 ];

    // default transform
    var t = new Ammo.btTransform();

    t.setIdentity();
    t.setOrigin(readVec3(data, offset));
    t.setRotation(readQuaternion(data, offset));

    // SHAP
    var shape = readShape(data, offset);
    var children = readSlot(data, offset);

    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        addObject(child, shape);
    };

    // MASS
    var mass = data[ offset[ 0 ] ]; // default

    // calculate local inertia
    var localInertia = new Ammo.btVector3(0, 0, 0);
    shape.calculateLocalInertia(mass, localInertia);

    if(parent) {
        parent.addChildShape(t, shape);
        return;
    }

    // motion state
    var myMotionState = new Ammo.btDefaultMotionState(t);
    var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState, shape, localInertia);
    var body = new Ammo.btRigidBody(rbInfo);

    dynamicsWorld.addRigidBody(body);

    bodies.push(body);

    return body;
}

function createVehicle( data ) {

    var vehicleTuning = new Ammo.btVehicleTuning();
    var rollInfluence = ( data.rollInfluence !== undefined ) ? data.rollInfluence : 0.1;
    
    var chassis       = addObject(data.chasisData);
    var raycaster     = new Ammo.btDefaultVehicleRaycaster( dynamicsWorld );
    var vehicle       = new Ammo.btRaycastVehicle( vehicleTuning, chassis, raycaster );

    chassis.setActivationState( DISABLE_DEACTIVATION );
    vehicle.setCoordinateSystem( 0, 1, 2 ); // right, up, forward

    var suspensionStiffness   = ( data.suspensionStiffness !== undefined ) ? data.suspensionStiffness : 5.88;
    var suspensionCompression = ( data.suspensionCompression !== undefined ) ? data.suspensionCompression: 0.83;
    var suspensionDamping     = ( data.suspensionDamping !== undefined ) ? data.suspensionDamping : 0.88;
    var maxSuspensionTravelCm = ( data.maxSuspensionTravelCm !== undefined ) ? data.maxSuspensionTravelCm : 500.0;
    var frictionSlip          = ( data.frictionSlip !== undefined ) ? data.frictionSlip : 10.5;
    var maxSuspensionForce    = ( data.maxSuspensionForce !== undefined ) ? data.maxSuspensionForce : 6000.0;

    for ( var i = 0, il = data.wheels.length; i < il; i ++ ) {

        var wheel                = data.wheels[ i ];
        
        var connection           = wheel.connectionPoint;
        var direction            = wheel.wheelDirection;
        var axle                 = wheel.wheelAxle;
        
        var suspensionRestLength = wheel.suspensionRestLength;
        var wheelRadius          = wheel.wheelRadius;
        var isFrontWheel         = wheel.isFrontWheel;
        
        var tuning               = vehicleTuning;

        var connectionPointCS0 = new Ammo.btVector3( connection[ 0 ], connection[ 1 ], connection[ 2 ] );
        var wheelDirectionCS0  = new Ammo.btVector3( direction[ 0 ], direction[ 1 ], direction[ 2 ] );
        var wheelAxleCS        = new Ammo.btVector3( axle[ 0 ], axle[ 1 ], axle[ 2 ] );

        vehicle.addWheel( connectionPointCS0, wheelDirectionCS0, wheelAxleCS,
                  suspensionRestLength, wheelRadius, tuning, isFrontWheel );

        var wheelInfo = vehicle.getWheelInfo( i );
        wheelInfo.set_m_rollInfluence( rollInfluence );
        wheelInfo.set_m_suspensionStiffness(suspensionStiffness);
        wheelInfo.set_m_wheelsDampingRelaxation(suspensionDamping);
        wheelInfo.set_m_wheelsDampingCompression(suspensionCompression);
        wheelInfo.set_m_frictionSlip(frictionSlip);
        wheelInfo.set_m_rollInfluence(rollInfluence);

    }

    dynamicsWorld.addVehicle(vehicle);
    vehicles.push(vehicle);
    vehiclesStatus.push([0, 0]);

    return vehicle;
}

function applyEngineForce( force, vehicleId, wheelId ) {
    var vehicle = vehicles[ vehicleId ];
    if ( wheelId === undefined ) {
        for ( var i = 0, il = vehicle.getNumWheels(); i < il; i ++ ) {
            vehicle.applyEngineForce( force, i );
        }
    } else {
        vehicle.applyEngineForce( force, wheelId );
    }
}

function setSteering( steering, vehicleId, wheelId ) {
    var vehicle = vehicles[ vehicleId ];
    if ( wheelId === undefined ) {
        for ( var i = 0, il = vehicle.getNumWheels(); i < il; i ++ ) {
            vehicle.setSteeringValue( steering, i );
        }
    } else {
        vehicle.setSteeringValue( steering, wheelId );
    }
}

function setBrake( brake, vehicleId, wheelId ) {
    var vehicle = vehicles[ vehicleId ];
    if ( wheelId === undefined ) {
        for ( var i = 0, il = vehicle.getNumWheels(); i < il; i ++ ) {
            vehicle.setBrake( brake, i );
        }
    } else {
        vehicle.setBrake( brake, wheelId );
    }
}

function readBulletVehicle( i, data, offset ) {

  var vehicle = vehicles[ i ];

    for ( var j = 0, jl = vehicle.getNumWheels(); j < jl; j ++ ) {

        vehicle.updateWheelTransform( j, true );
        var transform = vehicle.getWheelTransformWS( j );
        
        var origin    = transform.getOrigin();
        var rotation  = transform.getRotation();

        data[ offset ]     = origin.x();
        data[ offset + 1 ] = origin.y();
        data[ offset + 2 ] = origin.z();

        data[ offset + 3 ] = rotation.x();
        data[ offset + 4 ] = rotation.y();
        data[ offset + 5 ] = rotation.z();
        data[ offset + 6 ] = rotation.w();

        offset += 7;

    }

  return offset;

}

function readBulletVehicleSpeed( i, data, offset ) {

    var vehicle    = vehicles[ i ];
    var speed      = vehicle.getCurrentSpeedKmHour();
    data[ offset ] = speed;

    offset += 1;

    return offset;

}

var tmpTransform = new Ammo.btTransform(); // taking this out of readBulletObject reduces the leaking

function readBulletObject( i, data, offset ) {

    var body     = bodies[ i ];
    body.getMotionState().getWorldTransform( tmpTransform );
    
    var origin   = tmpTransform.getOrigin();
    var rotation = tmpTransform.getRotation();

    data[ offset ]     = origin.x();
    data[ offset + 1 ] = origin.y();
    data[ offset + 2 ] = origin.z();

    data[ offset + 3 ] = rotation.x();
    data[ offset + 4 ] = rotation.y();
    data[ offset + 5 ] = rotation.z();
    data[ offset + 6 ] = rotation.w();

    offset += 7;

    return offset;

}

function setVehiclesStatus (data) {
    for (var i = 0, il = data.length; i < il; ++i) {
        setVehicleStatus(i, data[i]);
    }
}

function setVehicleStatus (id, status) {
    vehiclesStatus[id] = status;
}

function getVehicleStatus (id) {
    return vehiclesStatus[id];
}

var tmpvec = new Ammo.btVector3(0, 0, 0);
var tmpvecZero = new Ammo.btVector3(0, 0, 0);

function updateVehicles () {

    for (var i = 0, il = vehicles.length; i < il; i++) {

        var status = getVehicleStatus(i);

        var vehicle   = vehicles[i];
        var body      = vehicle.getRigidBody();
        var transform = body.getCenterOfMassTransform();
        var rotation  = transform.getRotation();
        var axis      = rotation.getAxis();
        var angle     = rotation.getAngle();

        var acceleration = status[0];
        var steering     = status[1];
        var localForceX  = status[2];
        var localForceY  = status[3];
        var localForceZ  = status[4];

        // acceleration
        applyEngineForce(acceleration, i, 2);
        applyEngineForce(acceleration, i, 3);

        // steering
        setSteering(steering, i, 0);
        setSteering(steering, i, 1);

        // forces
        tmpvec.setValue(localForceX, localForceY, localForceZ);
        if(tmpvec.length2() !== 0) {
            tmpvec = tmpvec.rotate(axis, angle);
            body.applyForce(tmpvec, tmpvecZero);
        }

    };

}

function update(dt) {

  dt = dt || 1;
  dynamicsWorld.stepSimulation(dt, 1);
  updateVehicles();

  var message = { 
    type: SIMULATION_DATA, 
    data: []
  };

  var offset = 0;

  // bodies including vehicle chasis
  for (var i = 0; i < bodies.length; i++) {
    offset = readBulletObject(i, message.data, offset);
  }

  // vehicles wheels
  for (var i = 0; i < vehicles.length; i++) {
    offset = readBulletVehicle(i, message.data, offset);
  }

  postMessage(message);
}

// messages 
var SET_VEHICLE_STATUS     = 0,
    START                  = 1,
    ADD_OBJECT             = 2,
    REMOVE_OBJECT          = 3,
    CREATE_CAR             = 4,
    SIMULATION_DATA        = 5;

onmessage = function(event) {
    var message = event.data;
    var data    = message.data;
    var type    = message.type;

    if(undefined === type) {
        console.error("message without type arrived");
        console.error(data);
        return
    } 

    switch(type) {
    case SET_VEHICLE_STATUS:
        setVehiclesStatus(data);
        break;
    case CREATE_CAR:
        createVehicle(data);
        break;
    case ADD_OBJECT:
        addObject(data);
        break;
    case REMOVE_OBJECT:
        removeObject(data);
        break;
    default:
        postMessage("message arrived");
  }
}

startUp();