// asm.js config

var Module = { TOTAL_MEMORY: 256 * 1024 * 1024 };

// globals

var meanDt = 0.0;
var meanDt2 = 0.0;
var frame = 1;

var DATA = null;
var numWheelsTotal = 0;

var interval = null;

var restartTime = 1000;
var nextTimeToRestart = 0;

//

var isFirefox = !! navigator.userAgent.match( /firefox/i );
var isChrome = !! navigator.userAgent.match( /chrome/i );
var ffVersion = getFirefoxVersion();
var chVersion = getChromeVersion();
var useASMJS = supportsASMJS();
var useTransferables = supportsTransferables();

// helpers

function getFirefoxVersion() {

	var version = 0;

	var pattern = navigator.userAgent.match( /firefox\/(\d+)\./i );

	if ( pattern && pattern.length > 1 ) {

		version = pattern[ 1 ];

	}

	return version;

}

function getChromeVersion() {

	var version = 0;

	var pattern = navigator.userAgent.match( /chrome\/(\d+)\./i );

	if ( pattern && pattern.length > 1 ) {

		version = pattern[ 1 ];

	}

	return version;

}

function supportsASMJS() {

	var isFirefox = !! navigator.userAgent.match( /firefox/i );

	var version = 0;

	if ( isFirefox ) {

		var pattern = navigator.userAgent.match( /firefox\/(\d+)\./i );

		if ( pattern && pattern.length > 1 ) {

			version = pattern[ 1 ];

		}

	}

	return isFirefox && version >= 22;

}

function supportsTransferables() {

	var supported = false;

	try {

		var ab = new ArrayBuffer( 1 );

		postMessage( ab, [ ab ] );
		supported = ( ab.byteLength === 0 );

    } catch( e ) {
    };

	return supported;

}

//

/*
if ( useASMJS ) {

	importScripts( 'ammo.asm.js' );

} else {

	importScripts( 'ammo.fast.js' );

}
*/

// switched to asm.js version everywhere as in Chrome at least since 30.0.1581.2
// "fast" build became incredibly slow

importScripts( 'ammo.asm.js' );

// Bullet-interfacing code

var ACTIVE_TAG = 1;
var ISLAND_SLEEPING = 2;
var WANTS_DEACTIVATION = 3;
var DISABLE_DEACTIVATION = 4;
var DISABLE_SIMULATION = 5;

// enum PHY_ScalarType

var PHY_FLOAT = 0;
var PHY_DOUBLE = 1;
var PHY_INTEGER = 2;
var PHY_SHORT = 3;
var PHY_FIXEDPOINT88 = 4;
var PHY_UCHAR = 5;

var gravityVector = new Ammo.btVector3( 0, -9.81, 0 );

var collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
var dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
var overlappingPairCache = new Ammo.btDbvtBroadphase();
var solver = new Ammo.btSequentialImpulseConstraintSolver();

var dynamicsWorld = new Ammo.btDiscreteDynamicsWorld( dispatcher, overlappingPairCache, solver, collisionConfiguration );
dynamicsWorld.setGravity( gravityVector );

var tmpTransform = new Ammo.btTransform();

var bodies = [];
var vehicles = [];
var bodiesMap = {};
var shapesMap = {};

function initGround( floorSize, floorHeight ) {

	var floorThickness = 5;
	var floorSizeHalf = floorSize * 0.5;

	// break floor into 4 tiles to reduce vehicle wheels jitter

	var groundSize = new Ammo.btVector3( floorSizeHalf, floorThickness, floorSizeHalf );
	var groundShape = new Ammo.btBoxShape( groundSize );

	var groundTransform = new Ammo.btTransform();
	groundTransform.setIdentity();

	var mass = 0;
	var localInertia = new Ammo.btVector3( 0, 0, 0 );

	var offsets = [ [ -floorSizeHalf, -floorSizeHalf ],
					[ -floorSizeHalf, floorSizeHalf ],
					[ floorSizeHalf, -floorSizeHalf ],
					[ floorSizeHalf, floorSizeHalf ] ];

	for ( var i = 0; i < 4; i ++ ) {

		var offset = offsets[ i ];

		var position = new Ammo.btVector3( offset[ 0 ], floorHeight - floorThickness, offset[ 1 ] );
		groundTransform.setOrigin( position );

		var myMotionState = new Ammo.btDefaultMotionState( groundTransform );
		var rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, myMotionState, groundShape, localInertia );
		var groundBody = new Ammo.btRigidBody( rbInfo );

		dynamicsWorld.addRigidBody( groundBody );

	}

}

function resetTransforms( nObjects, transforms ) {

	dynamicsWorld.clearForces();

	var offset = 0;
	var itemSize = 7;

	for ( var i = 0; i < nObjects; i ++ ) {

		var body = bodies[ i ];
		var transform = body.getWorldTransform();

		var origin = transform.getOrigin();
		var rotation = transform.getRotation();

		var angularVelocity = body.getAngularVelocity();
		var linearVelocity = body.getLinearVelocity();

		var sx = transforms[ offset ];
		var sy = transforms[ offset + 1 ];
		var sz = transforms[ offset + 2 ];

		var qx = transforms[ offset + 3 ];
		var qy = transforms[ offset + 4 ];
		var qz = transforms[ offset + 5 ];
		var qw = transforms[ offset + 6 ];

		origin.setValue( sx, sy, sz );
		rotation.setValue( qx, qy, qz, qw );

		angularVelocity.setValue( 0, 0, 0 );
		linearVelocity.setValue( 0, 0, 0 );

		// set back returned const bullet objects

		transform.setRotation( rotation );
		body.setAngularVelocity( angularVelocity );
		body.setLinearVelocity( linearVelocity );

		// reset rigid body state

		body.clearForces();
		body.activate();

		offset += itemSize;

	}

}

function createVehicleTuning( data ) {

	var tuning = new Ammo.btVehicleTuning();

	var suspensionStiffness = ( data.suspensionStiffness !== undefined ) ? data.suspensionStiffness : 5.88;
	var suspensionCompression = ( data.suspensionCompression !== undefined ) ? data.suspensionCompression: 0.83;
	var suspensionDamping = ( data.suspensionDamping !== undefined ) ? data.suspensionDamping : 0.88;
	var maxSuspensionTravelCm = ( data.maxSuspensionTravelCm !== undefined ) ? data.maxSuspensionTravelCm : 500.0;
	var frictionSlip = ( data.frictionSlip !== undefined ) ? data.frictionSlip : 10.5;
	var maxSuspensionForce = ( data.maxSuspensionForce !== undefined ) ? data.maxSuspensionForce : 6000.0;

	tuning.set_m_suspensionStiffness( suspensionStiffness );
	tuning.set_m_suspensionCompression( suspensionCompression );
	tuning.set_m_suspensionDamping( suspensionDamping );
	tuning.set_m_maxSuspensionTravelCm( maxSuspensionTravelCm );
	tuning.set_m_frictionSlip( frictionSlip );
	tuning.set_m_maxSuspensionForce( maxSuspensionForce );

	return tuning;

}

function createVehicle( data ) {

	var vehicleTuning = createVehicleTuning( data );
	var rollInfluence = ( data.rollInfluence !== undefined ) ? data.rollInfluence : 0.1;

	var chassis = bodiesMap[ data.chassisId ];
	var raycaster = new Ammo.btDefaultVehicleRaycaster( dynamicsWorld );
	var vehicle = new Ammo.btRaycastVehicle( vehicleTuning, chassis, raycaster );

	chassis.setActivationState( DISABLE_DEACTIVATION );
	vehicle.setCoordinateSystem( 0, 1, 2 ); // right, up, forward

	for ( var i = 0, il = data.wheels.length; i < il; i ++ ) {

		var wheel = data.wheels[ i ];

		var connection = wheel.connectionPoint;
		var direction = wheel.wheelDirection;
		var axle = wheel.wheelAxle;

		var suspensionRestLength = wheel.suspensionRestLength;
		var wheelRadius = wheel.wheelRadius;
		var isFrontWheel = wheel.isFrontWheel;

		var tuning = ( wheel.tuning !== undefined ) ? createVehicleTuning( wheel.tuning ) : vehicleTuning;

		var connectionPointCS0 = new Ammo.btVector3( connection[ 0 ], connection[ 1 ], connection[ 2 ] );
		var wheelDirectionCS0 = new Ammo.btVector3( direction[ 0 ], direction[ 1 ], direction[ 2 ] );
		var wheelAxleCS = new Ammo.btVector3( axle[ 0 ], axle[ 1 ], axle[ 2 ] );

		vehicle.addWheel( connectionPointCS0, wheelDirectionCS0, wheelAxleCS,
						  suspensionRestLength, wheelRadius, tuning, isFrontWheel );

		if ( wheel.tuning && wheel.tuning.rollInfluence !== undefined ) rollInfluence = wheel.tuning.rollInfluence;

		var wheelInfo = vehicle.getWheelInfo( i );
		wheelInfo.set_m_rollInfluence( rollInfluence );

		numWheelsTotal += 1;

	}

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

function createVehicles( vehiclesData ) {

	for ( var i = 0, il = vehiclesData.length; i < il; i ++ ) {

		var vehicleData = vehiclesData[ i ];

		var vehicle = createVehicle( vehicleData );
		dynamicsWorld.addVehicle( vehicle );

		vehicles.push( vehicle );

	}

}

function createShape( data ) {

	var shape;
	var sizeVector;

	var type = data.type;

	if ( type === "box" ) {

		var sx = data.sx;
		var sy = data.sy;
		var sz = data.sz;

		sizeVector = new Ammo.btVector3( sx, sy, sz );
		shape = new Ammo.btBoxShape( sizeVector );

	} else if ( type === "cylinder" ) {

		var sx = data.sx;
		var sy = data.sy;
		var sz = data.sz;

		sizeVector = new Ammo.btVector3( sx, sy, sz );
		shape = new Ammo.btCylinderShape( sizeVector );

	} else if ( type === "sphere" ) {

		var radius = data.radius;
		shape = new Ammo.btSphereShape( radius );

	} else if ( type === "capsule" ) {

		var radius = data.radius;
		var height = data.height;
		shape = new Ammo.btCapsuleShape( radius, height );

	} else if ( type === "heightfield" ) {

		var floatByteSize = 4;
		var heightBuffer = Ammo.allocate( floatByteSize * data.widthPoints * data.lengthPoints, "float", Ammo.ALLOC_NORMAL );

		for ( var i = 0, il = data.heights.length; i < il; i ++ ) {

			Ammo.setValue( heightBuffer + i * floatByteSize, data.heights[ i ], 'float' );

		}

		var heightScale = 1.0;
		var minHeight = data.minHeight;
		var maxHeight = data.maxHeight;
		var upAxis = ( data.upAxis !== undefined ) ? data.upAxis : 1; // 0 => x, 1 => y, 2 => z
		var heightDataType = PHY_FLOAT;
		var flipQuadEdges = false;

		shape = new Ammo.btHeightfieldTerrainShape(
					data.widthPoints,
					data.lengthPoints,
					heightBuffer,
					heightScale,
					minHeight,
					maxHeight,
					upAxis,
					heightDataType,
					flipQuadEdges
				);

		var sx = data.width / ( data.widthPoints - 1 );
		var sz = data.length / ( data.lengthPoints - 1 );
		var sy = 1.0;

		sizeVector = new Ammo.btVector3( sx, sy, sz );
		shape.setLocalScaling( sizeVector );

	} else if ( type === "triangleMesh" ) {

		var indexedTriangles = ( data.indexedTriangles !== undefined ) ? data.indexedTriangles : false;

		var use32bitIndices = ( data.use32bitIndices !== undefined ) ? data.use32bitIndices : true;
		var use4componentVertices = false;

		var scale = data.scale;

		if ( indexedTriangles ) {

			var vertices = data.vertices;
			var indices = data.indices;

			var numTriangles = indices.length / 3;
			var numVertices = vertices.length / 3;

			var triangleMesh = new Ammo.btTriangleIndexVertexArray();

			var indexType = PHY_INTEGER;
			var mesh = new Ammo.btIndexedMesh();

			var floatByteSize = 4;
			var vertexBuffer = Ammo.allocate( floatByteSize * vertices.length, "float", Ammo.ALLOC_NORMAL );

			for ( var i = 0, il = vertices.length; i < il; i ++ ) {

				Ammo.setValue( vertexBuffer + i * floatByteSize, scale * vertices[ i ], 'float' );

			}

			var intByteSize = use32bitIndices ? 4 : 2;
			var intType = use32bitIndices ? "i32" : "i16";

			var indexBuffer = Ammo.allocate( intByteSize * indices.length, intType, Ammo.ALLOC_NORMAL );

			for ( var i = 0, il = indices.length; i < il; i ++ ) {

				Ammo.setValue( indexBuffer + i * intByteSize, indices[ i ], intType );

			}

			var indexStride = intByteSize * 3;
			var vertexStride = floatByteSize * 3;

			mesh.set_m_numTriangles( numTriangles );
			mesh.set_m_triangleIndexBase( indexBuffer );
			mesh.set_m_triangleIndexStride( indexStride );

			mesh.set_m_numVertices( numVertices );
			mesh.set_m_vertexBase( vertexBuffer );
			mesh.set_m_vertexStride( vertexStride );

			triangleMesh.addIndexedMesh( mesh, indexType );

		} else {

			var triangleMesh = new Ammo.btTriangleMesh( use32bitIndices, use4componentVertices );

			var removeDuplicateVertices = true;

			var vertexA = new Ammo.btVector3( 0, 0, 0 );
			var vertexB = new Ammo.btVector3( 0, 0, 0 );
			var vertexC = new Ammo.btVector3( 0, 0, 0 );

			var vertices = data.vertices;

			for ( var i = 0, il = vertices.length; i < il; i += 9 ) {

				var xA = vertices[ i ];
				var yA = vertices[ i + 1 ];
				var zA = vertices[ i + 2 ];

				var xB = vertices[ i + 3 ];
				var yB = vertices[ i + 4 ];
				var zB = vertices[ i + 5 ];

				var xC = vertices[ i + 6 ];
				var yC = vertices[ i + 7 ];
				var zC = vertices[ i + 8 ];

				xA *= scale;
				yA *= scale;
				zA *= scale;

				xB *= scale;
				yB *= scale;
				zB *= scale;

				xC *= scale;
				yC *= scale;
				zC *= scale;

				vertexA.setValue( xA, yA, zA );
				vertexB.setValue( xB, yB, zB );
				vertexC.setValue( xC, yC, zC );

				triangleMesh.addTriangle( vertexA, vertexB, vertexC, removeDuplicateVertices );

			}

		}

		var useQuantizedAabbCompression = true;
		var buildBvh = true;

		shape = new Ammo.btBvhTriangleMeshShape( triangleMesh, useQuantizedAabbCompression, buildBvh );

	} else if ( type === "compound" ) {

		shape = new Ammo.btCompoundShape();

		for ( var i = 0, il = data.children.length; i < il; i ++ ) {

			var child = data.children[ i ];
			var position = ( child.position !== undefined ) ? child.position : [ 0.0, 0.0, 0.0 ];
			var rotation = ( child.rotation !== undefined ) ? child.rotation : [ 0.0, 0.0, 0.0, 1.0 ];

			var localTransform = new Ammo.btTransform();
			localTransform.setIdentity();

			var origin = localTransform.getOrigin();
			origin.setValue( position[ 0 ], position[ 1 ], position[ 2 ] );

			var quaternion = localTransform.getRotation();
			quaternion.setValue( rotation[ 0 ], rotation[ 1 ], rotation[ 2 ], rotation[ 3 ] );
			localTransform.setRotation( quaternion );

			var childShape = createShape( child );
			shape.addChildShape( localTransform, childShape );

		}

	}

	return shape;

}

function createShapes( shapesData ) {

	for ( var i = 0, il = shapesData.length; i < il; i ++ ) {

		var shapeData = shapesData[ i ];
		var shape = createShape( shapeData );

		var id = shapeData.id;
		shapesMap[ id ] = shape;

	}

}

function createRigidBodies( nObjects, transforms, objectsData ) {

	var offset = 0;
	var itemSize = 7;

	var startTransform = new Ammo.btTransform();
	startTransform.setIdentity();

	for ( var i = 0; i < nObjects; i ++ ) {

		// read data

		var sx = transforms[ offset ];
		var sy = transforms[ offset + 1 ];
		var sz = transforms[ offset + 2 ];

		var qx = transforms[ offset + 3 ];
		var qy = transforms[ offset + 4 ];
		var qz = transforms[ offset + 5 ];
		var qw = transforms[ offset + 6 ];

		offset += itemSize;

		var data = objectsData[ i ];

		var bodyId = data.bodyId;
		var shapeId = data.shapeId;
		var mass = data.mass;
		var linearThreshold = ( data.linearSleepThreshold !== undefined ) ?  data.linearSleepThreshold : 0.8;
		var angularThreshold = ( data.angularSleepThreshold !== undefined ) ? data.angularSleepThreshold : 1.0;

		var isDynamic = ( mass > 0.0 );

		// create physics object

		startTransform.setIdentity();

		var shape = shapesMap[ shapeId ];

		var localInertia = new Ammo.btVector3( 0, 0, 0 );

		if ( isDynamic ) {

			shape.calculateLocalInertia( mass, localInertia );

		} else {

			var origin = startTransform.getOrigin();
			var rotation = startTransform.getRotation();
			origin.setValue( sx, sy, sz );
			rotation.setValue( qx, qy, qz, qw );

			startTransform.setRotation( rotation );

		}

		var motionState = new Ammo.btDefaultMotionState( startTransform );
		var rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, shape, localInertia );
		var body = new Ammo.btRigidBody( rbInfo );

		//

		if ( isDynamic ) {

			body.setSleepingThresholds( linearThreshold, angularThreshold );

			if ( data.deactivationTime !== undefined ) {

				body.setDeactivationTime( data.deactivationTime );

			}

			if ( data.linearDamping !== undefined || data.angularDamping !== undefined ) {

				var linearDamping = ( data.linearDamping !== undefined ) ? data.linearDamping : 0.0;
				var angularDamping = ( data.angularDamping !== undefined ) ? data.angularDamping : 0.0;

				body.setDamping( linearDamping, angularDamping );

			}

		}

		//

		dynamicsWorld.addRigidBody( body );

		bodies.push( body );
		bodiesMap[ bodyId ] = body;

		// set physics transforms

		var transform = body.getWorldTransform();
		var origin = transform.getOrigin();
		var rotation = transform.getRotation();

		origin.setValue( sx, sy, sz );
		rotation.setValue( qx, qy, qz, qw );

		transform.setRotation( rotation );

		body.activate();

	}

}

// constraint.setLimit()
// ---------------------
// softness:
//		0->1, recommend ~0.8 -> 1
//		describes % of limits where movement is free
//		beyond this softness %, the limit is gradually enforced until the "hard" (1.0) limit is reached
//
// biasFactor:
//		0->1?, recommend 0.3 +/-0.3 or so
//		strength with which constraint resists zeroth order (angular, not angular velocity) limit violation
//
// relaxationFactor:
//		0->1, recommend to stay near 1
//		the lower the value, the less the constraint will fight velocities which violate the angular limits

function createHingeConstraint( data ) {

	// hinge constraint between two rigidbodies
	// each with a pivotpoint that descibes the axis location in local space
	// axis defines the orientation of the hinge axis

	var bodyA = bodiesMap[ data.bodyA ];
	var bodyB = bodiesMap[ data.bodyB ];

	var pivotA = data.pivotInA;
	var pivotB = data.pivotInB;

	var axisA = data.axisInA;
	var axisB = data.axisInB;

	var pivotInA = new Ammo.btVector3( pivotA[ 0 ], pivotA[ 1 ], pivotA[ 2 ] );
	var pivotInB = new Ammo.btVector3( pivotB[ 0 ], pivotB[ 1 ], pivotB[ 2 ] );

	var axisInA = new Ammo.btVector3( axisA[ 0 ], axisA[ 1 ], axisA[ 2 ] );
	var axisInB = new Ammo.btVector3( axisB[ 0 ], axisB[ 1 ], axisB[ 2 ] );

	var constraint = new Ammo.btHingeConstraint( bodyA, bodyB, pivotInA, pivotInB, axisInA, axisInB );

	if ( data.limit !== undefined ) {

		var low = data.limit.low;
		var high = data.limit.high;

		var softness = ( data.limit.softness !== undefined ) ? data.limit.softness : 0.9;
		var biasFactor = ( data.limit.biasFactor !== undefined ) ? data.limit.biasFactor : 0.3;
		var relaxationFactor = ( data.limit.relaxationFactor !== undefined ) ? data.limit.relaxationFactor : 1.0;

		constraint.setLimit( low, high, softness, biasFactor, relaxationFactor );

	}

	return constraint;

}

function createConeTwistConstraint( data ) {

	// btConeTwistConstraint can be used to simulate ragdoll joints (upper arm, leg etc).
	// It is a fixed translation, 3 degree-of-freedom (DOF) rotational "joint".
	// It divides the 3 rotational DOFs into swing (movement within a cone) and twist.
	// Swing is divided into swing1 and swing2 which can have different limits, giving an elliptical shape.
	// (Note: the cone's base isn't flat, so this ellipse is "embedded" on the surface of a sphere.)
	//
	// In the contraint's frame of reference:
	// 	twist is along the x-axis,
	// 	and swing 1 and 2 are along the z and y axes respectively.

	var transformA = new Ammo.btTransform();
	var transformB = new Ammo.btTransform();

	transformA.setIdentity();
	transformB.setIdentity();

	var positionA = data.transformA.position;
	var positionB = data.transformB.position;

	var rotationA = data.transformA.rotation;
	var rotationB = data.transformB.rotation;

	var rAType = data.transformA.rotationType;
	var rBType = data.transformB.rotationType;

	//

	if ( rotationA ) {

		var rotationMatrix = transformA.getBasis();

		if ( rAType === "quaternion" ) {

			var quaternion = transformA.getRotation();
			quaternion.setValue( rotationA[ 0 ], rotationA[ 1 ], rotationA[ 2 ], rotationA[ 3 ] );
			rotationMatrix.setRotation( quaternion );

		} else if ( rAType === "eulerZYX" ) {

			rotationMatrix.setEulerZYX( rotationA[ 0 ], rotationA[ 1 ], rotationA[ 2 ] );

		}

	}

	if ( positionA ) {

		transformA.setOrigin( new Ammo.btVector3( positionA[ 0 ], positionA[ 1 ], positionA[ 2 ] ) );

	}

	//

	if ( rotationB ) {

		var rotationMatrix = transformB.getBasis();

		if ( rBType === "quaternion" ) {

			var quaternion = transformB.getRotation();
			quaternion.setValue( rotationB[ 0 ], rotationB[ 1 ], rotationB[ 2 ], rotationB[ 3 ] );
			rotationMatrix.setRotation( quaternion );

		} else if ( rBType === "eulerZYX" ) {

			rotationMatrix.setEulerZYX( rotationB[ 0 ], rotationB[ 1 ], rotationB[ 2 ] );

		}

	}

	if ( positionB ) {

		transformB.setOrigin( new Ammo.btVector3( positionB[ 0 ], positionB[ 1 ], positionB[ 2 ] ) );

	}

	//

	var bodyA = bodiesMap[ data.bodyA ];
	var bodyB = bodiesMap[ data.bodyB ];

	var constraint = new Ammo.btConeTwistConstraint( bodyA, bodyB, transformA, transformB );

	if ( data.limit !== undefined ) {

		var swingSpan1 = data.limit.swingSpan1;
		var swingSpan2 = data.limit.swingSpan2;
		var twistSpan = data.limit.twistSpan;

		var softness = ( data.limit.softness !== undefined ) ? data.limit.softness : 1.0;
		var biasFactor = ( data.limit.biasFactor !== undefined ) ? data.limit.biasFactor : 0.3;
		var relaxationFactor = ( data.limit.relaxationFactor !== undefined ) ? data.limit.relaxationFactor : 1.0;

		constraint.setLimit( swingSpan1, swingSpan2, twistSpan, softness, biasFactor, relaxationFactor );

	}

	return constraint;

}

function createConstraint( data ) {

	var constraint;

	var type = data.type;

	if ( type === "hinge" ) {

		constraint = createHingeConstraint( data );

	} else if ( type === "coneTwist" ) {

		constraint = createConeTwistConstraint( data );

	}

	return constraint;

}

function createConstraints( constraintsData ) {

	for ( var i = 0, il = constraintsData.length; i < il; i ++ ) {

		var constraintData = constraintsData[ i ];
		var constraint = createConstraint( constraintData );

		var disableCollisionsBetweenLinkedBodies = ( constraintData.disableCollisionsBetweenLinkedBodies !== undefined ) ? constraintData.disableCollisionsBetweenLinkedBodies : true;
		dynamicsWorld.addConstraint( constraint, disableCollisionsBetweenLinkedBodies );

	}

}

function readBulletVehicle( i, data, offset ) {

	var vehicle = vehicles[ i ];

	for ( var j = 0, jl = vehicle.getNumWheels(); j < jl; j ++ ) {

		vehicle.updateWheelTransform( j, true );
		var transform = vehicle.getWheelTransformWS( j );

		var origin = transform.getOrigin();
		var rotation = transform.getRotation();

		data[ offset ] 	   = origin.x();
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

function readBulletObject( i, data, offset ) {

	var body = bodies[ i ];
	body.getMotionState().getWorldTransform( tmpTransform );

	var origin = tmpTransform.getOrigin();
	var rotation = tmpTransform.getRotation();

	data[ offset ] 	   = origin.x();
	data[ offset + 1 ] = origin.y();
	data[ offset + 2 ] = origin.z();

	data[ offset + 3 ] = rotation.x();
	data[ offset + 4 ] = rotation.y();
	data[ offset + 5 ] = rotation.z();
	data[ offset + 6 ] = rotation.w();

	offset += 7;

	return offset;

}

function timeToRestart() {

	if ( nextTimeToRestart ) {

		if ( Date.now() >= nextTimeToRestart ) {

			nextTimeToRestart = 0;
			return true;

		}

		return false;

	}

	var minInactiveCount = bodies.length * 0.5;
	var inactiveCount = 0;

	for ( var i = 0, il = bodies.length; i < il; i ++ ) {

		var body = bodies[ i ];

		if ( !body.isActive() ) {

			inactiveCount += 1;

			if ( inactiveCount > minInactiveCount ) {

				nextTimeToRestart = Date.now() + restartTime;
				break;

			}

		}

	}

	return false;

}

function simulate( dt ) {

	dt = dt || 1;

	dynamicsWorld.stepSimulation( dt, 2 );

	// compute stats

	var alpha;

	if ( meanDt > 0 ) {

		alpha = Math.min( 0.1, dt / 1000 );

	} else {

		alpha = 0.1; // first run

	}

	meanDt = alpha * dt + ( 1 - alpha ) * meanDt;

	var alpha2 = 1 / frame ++;
	meanDt2 = alpha2 * dt + ( 1 - alpha2 ) * meanDt2;

	var currFPS = Math.round( 1000 / meanDt );
	var allFPS = Math.round( 1000 / meanDt2 );

	//

	var itemSize = 7;
	var headerSize = 6;

	var numRigidBodies = bodies.length;
	var numVehicles = vehicles.length;

	var dataSize = headerSize + ( numRigidBodies + numWheelsTotal ) * itemSize + numVehicles * 1;

	// spawn new buffer on init
	// and also when the old one didn't come back yet
	// from the main thread
	// or if there are more objects than before

	if ( ! DATA || DATA.length < dataSize ) {

		DATA = new Float32Array( dataSize );

	}

	var offset = 0;

	// set data header

	DATA[ 0 ] = frame;
	DATA[ 1 ] = currFPS;
	DATA[ 2	] = allFPS;

	DATA[ 3	] = numRigidBodies;
	DATA[ 4	] = numVehicles;
	DATA[ 5	] = numWheelsTotal;

	offset += headerSize;

	// read rigid bodies bullet data into the buffer

	var i, il;

	for ( i = 0, il = bodies.length; i < il; i ++ ) {

		offset = readBulletObject( i, DATA, offset );

	}

	// read wheels bullet data into the buffer

	for ( i = 0, il = vehicles.length; i < il; i ++ ) {

		offset = readBulletVehicle( i, DATA, offset );

	}

	// read vehicles bullet data into the buffer

	for ( i = 0, il = vehicles.length; i < il; i ++ ) {

		offset = readBulletVehicleSpeed( i, DATA, offset );

	}

	// send simulation state data into the main thread

	if ( useTransferables ) {

		// Firefox 21 needs both arguments to use ArrayBuffer
		// Firefox 24 and Chrome can use Float32Array + ArrayBuffer

		if ( isFirefox && ffVersion <= 22 ) {

			postMessage( DATA.buffer, [ DATA.buffer ] );

		} else {

			postMessage( DATA, [ DATA.buffer ] );

		}

	} else {

		postMessage( DATA );

	}

	//

	if ( timeToRestart() ) {

		var message = {

			"type"	: "simulationIdle"

		};

		postMessage( message );

		nextTimeToRestart = 0;

	}

}

function initSimulation( nObjects, transforms, objectsData, shapesData, constraintsData, vehiclesData ) {

	frame = 1;

	meanDt = 0.0;
	meanDt2 = 0.0;

	createShapes( shapesData );
	createRigidBodies( nObjects, transforms, objectsData );
	createConstraints( constraintsData );
	createVehicles( vehiclesData );

	var last = Date.now();

	function mainLoop() {

		var now = Date.now();
		simulate( now - last );
		last = now;

	}

	if ( interval ) clearInterval( interval );
	interval = setInterval( mainLoop, 1000/60 );

	// few steps to initialize physics objects positions
	// and warm up V8 optimizer

	for ( var i = 0; i < 5; i ++ ) {

		dynamicsWorld.stepSimulation( 0.01, 2 );

	}

	simulate( 0.01 );

	var message = {

		"type"	: "simulationInitialized"

	};

	postMessage( message );

}

function setGravity( value ) {

	gravityVector.setValue( value[ 0 ], value[ 1 ], value[ 2 ] );
	dynamicsWorld.setGravity( gravityVector );

	for ( var i = 0, il = bodies.length; i < il; i ++ ) {

		var body = bodies[ i ];
		body.activate();

	}

}

function debugMessage( text ) {

	var message = {

		"type" 		: "debug",
		"content"	: text

	}

	postMessage( message );

}

onmessage = function( event ) {

	if ( event.data instanceof Float32Array ) {

		DATA = event.data;

		// cast buffer into typed array for Firefox 24

		var buffer = DATA.buffer;

		if ( DATA.length === 0 && buffer.byteLength > 0 ) {

			DATA = new Float32Array( buffer );

		}

	} else if ( event.data instanceof ArrayBuffer ) {

		// cast buffer into typed array for Firefox 21

		var buffer = event.data;

		if ( buffer.byteLength > 0 ) {

			DATA = new Float32Array( buffer );

		}

	} else {

		var message = event.data;

		if ( message.type === "init" ) {

			if ( message.floorEnabled ) {

				initGround( message.floorSize, message.floorHeight );

			}

			initSimulation( message.nObjects, message.transforms, message.objectsData,
							message.shapesData,
							message.constraintsData,
							message.vehiclesData );

			setGravity( message.gravity );

		} else if ( message.type === "setGravity" ) {

			setGravity( message.value );

		} else if ( message.type === "applyEngineForce" ) {

			applyEngineForce( message.force, message.vehicleId, message.wheelId );

		} else if ( message.type === "setSteering" ) {

			setSteering( message.steering, message.vehicleId, message.wheelId );

		} else if ( message.type === "setBrake" ) {

			setBrake( message.brake, message.vehicleId, message.wheelId );

		} else if ( message.type === "resetTransforms" ) {

			resetTransforms( message.nObjects, message.transforms );

		}

	}

}