define(function (require) {

    var BaseObject = require('BaseObject'),
        THREE 	   = require('three');

    return BaseObject.extend({

        // variables
        camera: null,
        target: null,
        isRotatingCamera: 0,

        rotate: {x: 0, y: 0, z: 0},
        rotateVec: {
            x: new THREE.Vector3(1, 0, 0),
            y: new THREE.Vector3(0, 1, 0),
            z: new THREE.Vector3(0, 0, 1)
        },
        
        init: function (sceneData, config) {
        	this.__init();
        	var w           = window.innerWidth / 2,
        	    h           = window.innerHeight / 2,
        	    cameraData  = sceneData.getObjectByName("CAMERA"),
        	    pos         = cameraData.getObjectByName("POSITION"),
        	    target      = cameraData.getObjectByName("TARGET");

        	if (config.perspective)
        	    this.camera = new THREE.PerspectiveCamera(70, w / h, 1, 1500);
        	else
        	    this.camera = new THREE.OrthographicCamera(-w, w, h, -h, 1, 1500);

        	this.camera.position.copy(pos.position);
        	this.camera.lookAt(target.position);
        	this.target = target;
        },
        rotateCamera: function(axis, value) {
			this.rotate[axis]     = value;
			this.isRotatingCamera = this.rotate["x"] + this.rotate["y"] + this.rotate["z"];
        },
        update: function (dt) {
        	this.__update(dt);

        	// rotate camera 
        	if(this.isRotatingCamera) {
        	    var amount = dt * 0.001;
        	    var position = this.camera.position;
        	    position.applyAxisAngle(this.rotateVec["z"], amount * this.rotate["z"]);
        	    position.applyAxisAngle(this.rotateVec["y"], amount * this.rotate["y"]);
        	    position.applyAxisAngle(this.rotateVec["x"], amount * this.rotate["x"]);
        	    this.camera.lookAt(this.target.position);
        	}

        },
        dispose: function() {
            this.__dispose();
			this.camera    = null;
			this.target    = null;
			this.rotateVec = null;
			this.rotate    = null;
        }
    });
});