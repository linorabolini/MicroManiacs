define(function (require){
	
	var BaseObject = require('BaseObject'),
		THREE = require('three');

	return BaseObject.extend({

		// variables

		scene: null,
		camera: null,
		renderer: null,
		model: null,

		// functions

		init: function (sceneData) {
			this.__init();
			var scope = this;

			// setup scene
			this.scene = this.loadScene(sceneData);

			// setup camera
			this.camera = this.loadCamera(this.scene);

			// setup renderer
			this.renderer = new THREE.WebGLRenderer();
			this.renderer.setClearColor(0xfefefe, 1);
			this.renderer.setSize( window.innerWidth, window.innerHeight );
			window.onresize = function() {
				scope.renderer.setSize( window.innerWidth, window.innerHeight );
			};
		},
		loadCamera: function (scene) {
			var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

			var data = scene.getObjectByName("CAMERA");
			var pos = data.getObjectByName("POSITION");
			var target = data.getObjectByName("TARGET");
	
			camera.position.copy(pos.position);
			camera.lookAt(target.position);
	
			return camera;
		},
		loadScene: function () {
			var data = {
	"metadata": {
		"version": 4.3,
		"type": "Object",
		"generator": "ObjectExporter"
	},
	"geometries": [
		{
			"uuid": "2A9A532F-0716-46A7-9945-3AFD0E9268CC",
			"type": "BoxGeometry",
			"width": 100,
			"height": 100,
			"depth": 100,
			"widthSegments": 1,
			"heightSegments": 1,
			"depthSegments": 1
		},
		{
			"uuid": "2DCB8105-61A8-406B-B37F-CBDC239C1CD6",
			"type": "BoxGeometry",
			"width": 100,
			"height": 100,
			"depth": 100,
			"widthSegments": 1,
			"heightSegments": 1,
			"depthSegments": 1
		},
		{
			"uuid": "059ACE9A-D8E0-43A1-A2C0-1811D69C6DD0",
			"type": "BoxGeometry",
			"width": 800,
			"height": 20,
			"depth": 800,
			"widthSegments": 1,
			"heightSegments": 1,
			"depthSegments": 1
		}],
	"materials": [
		{
			"uuid": "82D9DBF4-0973-4CB3-916E-C31F914577BE",
			"type": "MeshPhongMaterial",
			"color": 16777215,
			"ambient": 16777215,
			"emissive": 0,
			"specular": 1118481,
			"shininess": 30,
			"opacity": 1,
			"transparent": false,
			"wireframe": false
		},
		{
			"uuid": "5D17387C-5A22-4FA3-8A6A-9C7D345DEABC",
			"type": "MeshPhongMaterial",
			"color": 16777215,
			"ambient": 16777215,
			"emissive": 0,
			"specular": 1118481,
			"shininess": 30,
			"opacity": 1,
			"transparent": false,
			"wireframe": false
		},
		{
			"uuid": "BAD909DE-8535-432F-80B9-AF0985288937",
			"type": "MeshPhongMaterial",
			"color": 16777215,
			"ambient": 16777215,
			"emissive": 0,
			"specular": 1118481,
			"shininess": 30,
			"opacity": 1,
			"transparent": false,
			"wireframe": false
		}],
	"object": {
		"uuid": "EE3B1EF1-F276-429D-B06E-226F2C8B1D32",
		"type": "Scene",
		"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
		"children": [
			{
				"uuid": "41401ADB-B644-4C36-AA14-B3C90FAFFB93",
				"name": "CAMERA",
				"type": "Object3D",
				"matrix": [0.9995500445365906,0,-0.029995501041412354,0,0,1,0,0,0.029995501041412354,0,0.9995500445365906,0,0,0,0,1],
				"children": [
					{
						"uuid": "637C9710-DAF1-452B-B4C6-ADAC90C8DB9D",
						"name": "POSITION",
						"type": "Object3D",
						"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,321.041748046875,400,2.27242112159729,1]
					},
					{
						"uuid": "1975EE13-CACA-4C10-A362-45CF4D5C68F3",
						"name": "TARGET",
						"type": "Object3D",
						"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
					}]
			},
			{
				"uuid": "94F31C03-F6C5-45D2-8F95-B4C6AF00E677",
				"name": "LEVEL",
				"type": "Object3D",
				"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
				"children": [
					{
						"uuid": "8F2504A4-9BE5-4A88-8546-B17A7FB01FC9",
						"name": "Box 1",
						"type": "Mesh",
						"geometry": "2A9A532F-0716-46A7-9945-3AFD0E9268CC",
						"material": "82D9DBF4-0973-4CB3-916E-C31F914577BE",
						"matrix": [0.4596909284591675,0.4376714825630188,0.7727405428886414,0,-0.6895482540130615,0.724239706993103,1.1346410033752363e-8,0,-0.5596494078636169,-0.5328419208526611,0.6347220540046692,0,40.601341247558594,115.0846176147461,-44.269309997558594,1]
					},
					{
						"uuid": "FDD8EBE3-BCD4-4C0C-95E7-3D6FA18CB6E4",
						"name": "Box 2",
						"type": "Mesh",
						"geometry": "2DCB8105-61A8-406B-B37F-CBDC239C1CD6",
						"material": "5D17387C-5A22-4FA3-8A6A-9C7D345DEABC",
						"matrix": [0.5448789596557617,-0.47994542121887207,0.6875749826431274,0,0.6609786152839661,0.7504047155380249,-6.175000066832581e-9,0,-0.5159595012664795,0.4544723629951477,0.7261133790016174,0,68.9037094116211,323.5484313964844,-10.528543472290039,1]
					},
					{
						"uuid": "618016F8-97D8-4C6F-A1FF-3F1DBDAFF488",
						"name": "Box 3",
						"type": "Mesh",
						"geometry": "059ACE9A-D8E0-43A1-A2C0-1811D69C6DD0",
						"material": "BAD909DE-8535-432F-80B9-AF0985288937",
						"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,1.659999966621399,7.519999980926514,-10.699999809265137,1]
					}]
			},
			{
				"uuid": "B244968A-CDFE-4AFB-838C-877A98D3878F",
				"name": "DirectionalLight 1",
				"type": "DirectionalLight",
				"color": 16777215,
				"intensity": 1,
				"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,160.85137939453125,312.0914611816406,24.82366371154785,1]
			},
			{
				"uuid": "6C0D8909-3F44-4DB0-89D5-3AAC9D1E2A5A",
				"type": "Object3D",
				"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
			},
			{
				"uuid": "AB132320-C353-43BB-B318-76E208767777",
				"type": "Object3D",
				"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
			},
			{
				"uuid": "D19089D6-3845-429B-9E45-C0233F4CF9B1",
				"type": "Object3D",
				"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
			},
			{
				"uuid": "D3C447A8-F2E8-4716-94AA-099D8C332B87",
				"type": "Object3D",
				"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
			},
			{
				"uuid": "441C0A56-8D16-4880-815F-97C7BA9B252A",
				"type": "Object3D",
				"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
			},
			{
				"uuid": "72040488-8CE2-4483-B34F-EC30AF84B34D",
				"type": "Object3D",
				"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
			},
			{
				"uuid": "11B7135D-1A14-4EF4-80BB-DCD183962228",
				"type": "Object3D",
				"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
			},
			{
				"uuid": "ED6B8F6A-3473-41E7-A0AA-27AB65B64E1A",
				"name": "DirectionalLight 1 Target",
				"type": "Object3D",
				"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,-2.417149066925049,1]
			}]
	}
}



			var loader = new THREE.ObjectLoader();
			var result = loader.parse(data);

			return result;
		},
		addToScreen: function () {
			document.body.appendChild( this.renderer.domElement );
		},
		removeFromScreen: function () {
			document.body.removeChild( this.renderer.domElement );
		},
		update: function (dt) {
			this.__update(dt);
			this.renderer.render(this.scene, this.camera);
		},
		dispose: function() {
			this.__dispose();
			this.removeFromScreen();
		}
	});
});