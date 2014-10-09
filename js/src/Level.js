define(function (require){
	
	var BaseObject = require('BaseObject'),
		THREE = require('three');

	return BaseObject.extend({

		// variables

		scene: null,
		camera: null,
		renderer: null,

		// functions

		init: function () {
			this.__init();
			console.log("level init");
		},
		setup: function () {

			// setup THREE JS SCENE

			this.scene = new THREE.Scene();
			this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

			this.renderer = new THREE.WebGLRenderer();
			this.renderer.setSize( window.innerWidth, window.innerHeight );
			document.body.appendChild( this.renderer.domElement );

			// TODO: move this elsewhere
			var self = this;
			window.onresize = function() {
				self.renderer.setSize( window.innerWidth, window.innerHeight );
			};
			
			// load the level config
			this.loadLevel(null);
		},
		loadLevel: function (levelConfig) {
			var geometry = new THREE.BoxGeometry(1,1,1);
			var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
			var cube = new THREE.Mesh( geometry, material );
			this.scene.add( cube );

			this.camera.position.z = 5;
		},
		update: function (dt) {
			this.__update(dt);
			this.camera.position.y = Math.sin(dt) * 10;
			this.render();
		},
		render: function () {
			this.renderer.render(this.scene, this.camera);
		}
	});
});