
var Module = { TOTAL_MEMORY: 256*1024*1024 };

importScripts('../../libs/ammo.js');

var DISABLE_DEACTIVATION = 4;

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

var keys = [];

var ENGINE_FORCE = 150;
var STEERING = 0.4;
var BRAKE = 2;

var FPS = 45;

function Keys() {
  return {
    "up":false,
    "down": false,
    "left": false,
    "right":false,
    "space":false
  }
}

function startUp(data) {
  // create the initial static level
  if(data && data.staticBodies) {
    for (var i = 0; i < data.staticBodies.length; i++) {
      addObject(data.staticBodies[i]);
    };
  }

  // loop
  var last = Date.now();
  function mainLoop() {
    var now = Date.now();
    update(now - last);
    last = now;
  }
  setInterval(mainLoop, 1000/FPS);
}

function addObject(object, offset) {

  // default transform
  var startTransform = new Ammo.btTransform();
  startTransform.setIdentity();

  // POSITION
  startTransform.setOrigin(new Ammo.btVector3(object[0], object[1], object[2]));

  // ROTATION
  startTransform.setRotation(new Ammo.btQuaternion(object[3], object[4], object[5], object[6]));

  // MASS
  var mass = object[10]; // default

  // SIZE
  var half = 0.5;
  var shape = new Ammo.btBoxShape(new Ammo.btVector3(object[7] * half, object[8] * half, object[9] * half));

  if(offset !== undefined) {
      var oldshape = shape;

      shape = new Ammo.btCompoundShape();

      var tr = new Ammo.btTransform();
      tr.setIdentity();
      tr.setOrigin(new Ammo.btVector3(offset[0], offset[1], offset[2]));

      // localTrans effectively shifts the center of mass with respect to the chassis
      shape.addChildShape(tr, oldshape);
  }

  // calculate local inertia
  var localInertia = new Ammo.btVector3(0, 0, 0);
  shape.calculateLocalInertia(mass, localInertia);

  // motion state
  var myMotionState = new Ammo.btDefaultMotionState(startTransform);
  var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState, shape, localInertia);
  var body = new Ammo.btRigidBody(rbInfo);

  dynamicsWorld.addRigidBody(body);

  bodies.push(body);

  return body;
}

function createVehicle( data ) {

  var vehicleTuning = new Ammo.btVehicleTuning();
  var rollInfluence = ( data.rollInfluence !== undefined ) ? data.rollInfluence : 0.1;

  var chassis = addObject(data.chasisData);
  var raycaster = new Ammo.btDefaultVehicleRaycaster( dynamicsWorld );
  var vehicle = new Ammo.btRaycastVehicle( vehicleTuning, chassis, raycaster );

  chassis.setActivationState( DISABLE_DEACTIVATION );
  vehicle.setCoordinateSystem( 0, 1, 2 ); // right, up, forward

  var suspensionStiffness = ( data.suspensionStiffness !== undefined ) ? data.suspensionStiffness : 5.88;
  var suspensionCompression = ( data.suspensionCompression !== undefined ) ? data.suspensionCompression: 0.83;
  var suspensionDamping = ( data.suspensionDamping !== undefined ) ? data.suspensionDamping : 0.88;
  var maxSuspensionTravelCm = ( data.maxSuspensionTravelCm !== undefined ) ? data.maxSuspensionTravelCm : 500.0;
  var frictionSlip = ( data.frictionSlip !== undefined ) ? data.frictionSlip : 10.5;
  var maxSuspensionForce = ( data.maxSuspensionForce !== undefined ) ? data.maxSuspensionForce : 6000.0;

  for ( var i = 0, il = data.wheels.length; i < il; i ++ ) {

    var wheel = data.wheels[ i ];

    var connection = wheel.connectionPoint;
    var direction = wheel.wheelDirection;
    var axle = wheel.wheelAxle;

    var suspensionRestLength = wheel.suspensionRestLength;
    var wheelRadius = wheel.wheelRadius;
    var isFrontWheel = wheel.isFrontWheel;

    var tuning = vehicleTuning;

    var connectionPointCS0 = new Ammo.btVector3( connection[ 0 ], connection[ 1 ], connection[ 2 ] );
    var wheelDirectionCS0 = new Ammo.btVector3( direction[ 0 ], direction[ 1 ], direction[ 2 ] );
    var wheelAxleCS = new Ammo.btVector3( axle[ 0 ], axle[ 1 ], axle[ 2 ] );

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
  keys.push(new Keys());

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

    var origin = transform.getOrigin();
    var rotation = transform.getRotation();

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

  var vehicle = vehicles[ i ];
  var speed = vehicle.getCurrentSpeedKmHour();
  data[ offset ] = speed;

  offset += 1;

  return offset;

}

var tmpTransform = new Ammo.btTransform(); // taking this out of readBulletObject reduces the leaking

function readBulletObject( i, data, offset ) {

  var body = bodies[ i ];
  body.getMotionState().getWorldTransform( tmpTransform );

  var origin = tmpTransform.getOrigin();
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

function setVehicleKey (id, code, status) {
  if ( keys[id][code] !== undefined )
    keys[id][code] = status;
}

function getVehicleKey (id, code) {
  return keys[id][code];
}

function handleInput (input) {
  setVehicleKey(input.id, input.code, input.value);
}

function updateVehicles () {

  for (var i = 0, il = vehicles.length; i < il ; i++) {

    var up = getVehicleKey(i, "up");
    var down = getVehicleKey(i, "down");
    var value = (!!up - !!down);

    applyEngineForce(value * ENGINE_FORCE, i, 2);
    applyEngineForce(value * ENGINE_FORCE, i, 3);

    var left = getVehicleKey(i, "left");
    var right = getVehicleKey(i, "right");
    var value = (!!left - !!right);

    setSteering(value * STEERING, i, 0);
    setSteering(value * STEERING, i, 1);

    var space = getVehicleKey(i, "space");

    setBrake(BRAKE * !!space, i, 2);    
    setBrake(BRAKE * !!space, i, 3);    

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

  // bodies
  for (var i = 0; i < bodies.length; i++) {
    offset = readBulletObject(i, message.data, offset);
  }

  // vehicles
  for (var i = 0; i < vehicles.length; i++) {
    offset = readBulletVehicle(i, message.data, offset);
  }

  postMessage(message);
}

// messages 
var INPUT = 0,
    START = 1,
    ADD_OBJECT = 2,
    REMOVE_OBJECT = 3,
    CREATE_CAR = 4,
    SIMULATION_DATA = 5;

onmessage = function(event) {
  var message = event.data;
  var data = message.data;
  var type = message.type;

  if(undefined === type) {
    console.error("message without type arrived");
    console.error(data);
    return
  } 

  switch(type) {
    case INPUT:
      handleInput(data);
      break;
    case START:
      startUp(data);
      break;
    case CREATE_CAR:
      if(data.id >= vehicles.length - 1)
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