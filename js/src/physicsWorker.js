
var Module = { TOTAL_MEMORY: 256*1024*1024 };

importScripts('../../js/libs/ammo.js');

// Bullet-interfacing code

var collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
var dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
var overlappingPairCache = new Ammo.btDbvtBroadphase();
var solver = new Ammo.btSequentialImpulseConstraintSolver();
var dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
dynamicsWorld.setGravity(new Ammo.btVector3(0, -10, 0));

var bodies = [];

// var groundShape = new Ammo.btBoxShape(new Ammo.btVector3(500, 50, 500));
// var groundTransform = new Ammo.btTransform();
// groundTransform.setIdentity();
// groundTransform.setOrigin(new Ammo.btVector3(0, -56, 0));

// (function() {
//   var mass = 0;
//   var localInertia = new Ammo.btVector3(0, 0, 0);
//   var myMotionState = new Ammo.btDefaultMotionState(groundTransform);
//   var rbInfo = new Ammo.btRigidBodyConstructionInfo(0, myMotionState, groundShape, localInertia);
//   var body = new Ammo.btRigidBody(rbInfo);

//   dynamicsWorld.addRigidBody(body);
//   //bodies.push(body);
// })();


function startUp(data) {

  // create the initial static level
  if(data.staticBodies) {
    for (var i = 0; i < data.staticBodies.length; i++) {
      addObject(data.staticBodies[i]);
    };
  }

  var last = Date.now();
  function mainLoop() {
    var now = Date.now();
    simulate(now - last);
    last = now;
  }
  setInterval(mainLoop, 1000/60);
}

function addObject(data) {
  var object = data.object;

  // default transform
  var startTransform = new Ammo.btTransform();
  startTransform.setIdentity();
  startTransform.setOrigin(new Ammo.btVector3(object[0], object[1], object[2]));
  startTransform.setRotation(new Ammo.btQuaternion(object[3], object[4], object[5], object[6]));

  // set mass
  var mass = object[10]; // default

  // shape
  var shape = new Ammo.btBoxShape(new Ammo.btVector3(object[7] * 0.5, object[8] * 0.5, object[9] * 0.5));

  // calculate local inertia
  var localInertia = new Ammo.btVector3(0, 0, 0);
  shape.calculateLocalInertia(mass, localInertia);

  // motion state
  var myMotionState = new Ammo.btDefaultMotionState(startTransform);
  var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState, shape, localInertia);
  var body = new Ammo.btRigidBody(rbInfo);

  dynamicsWorld.addRigidBody(body);
  bodies.push(body);
}

var transform = new Ammo.btTransform(); // taking this out of readBulletObject reduces the leaking

function readBulletObject(i, object) {
  var body = bodies[i];
  body.getMotionState().getWorldTransform(transform);
  var origin = transform.getOrigin();
  object[0] = origin.x();
  object[1] = origin.y();
  object[2] = origin.z();
  var rotation = transform.getRotation();
  object[3] = rotation.x();
  object[4] = rotation.y();
  object[5] = rotation.z();
  object[6] = rotation.w();
}

function simulate(dt) {
  dt = dt || 1;

  dynamicsWorld.stepSimulation(dt, 4);

  var data = {objects: []};

  // Read bullet data into JS objects
  var num = bodies.length;
  for (var i = 0; i < num; i++) {
    var object = [];
    readBulletObject(i, object);
    data.objects[i] = object;
  }

  postMessage(data);
}

// messages 
var INPUT = 0,
    START = 1,
    ADD_OBJECT = 2,
    REMOVE_OBJECT = 3;

onmessage = function(event) {
  var data = event.data;

  if(undefined === data.type) {
    console.error("message without type arrived");
    return
  } 

  switch(data.type) {
    case INPUT:
      break;
    case START:
      startUp(data);
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

console.log(Ammo);

