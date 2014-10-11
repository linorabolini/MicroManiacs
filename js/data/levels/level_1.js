{
	"metadata": {
		"version": 4.3,
		"type": "Object",
		"generator": "ObjectExporter"
	},
	"geometries": [
		{
			"uuid": "56058118-D773-4379-9B19-BA5D9136E5F4",
			"type": "BoxGeometry",
			"width": 100,
			"height": 100,
			"depth": 100,
			"widthSegments": 1,
			"heightSegments": 1,
			"depthSegments": 1
		},
		{
			"uuid": "2A9A532F-0716-46A7-9945-3AFD0E9268CC",
			"type": "BoxGeometry",
			"width": 100,
			"height": 100,
			"depth": 100,
			"widthSegments": 1,
			"heightSegments": 1,
			"depthSegments": 1
		}],
	"materials": [
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
		},
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
		}],
	"object": {
		"uuid": "0D061DDF-A85F-414A-A98C-60E392424E4B",
		"type": "Scene",
		"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
		"children": [
			{
				"uuid": "618016F8-97D8-4C6F-A1FF-3F1DBDAFF488",
				"name": "Box 2",
				"type": "Mesh",
				"geometry": "56058118-D773-4379-9B19-BA5D9136E5F4",
				"material": "BAD909DE-8535-432F-80B9-AF0985288937",
				"matrix": [4.268885612487793,0,0,0,0,0.08721674233675003,0,0,0,0,5.573833465576172,0,1.655370831489563,7.5179667472839355,-10.69787883758545,1]
			},
			{
				"uuid": "42B7716E-3303-43DF-9E6A-AFE8E1C87AA1",
				"name": "DirectionalLight 1",
				"type": "DirectionalLight",
				"color": 16777215,
				"intensity": 1,
				"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,263.45526123046875,247.8525390625,162.43603515625,1]
			},
			{
				"uuid": "6A602C12-BDDA-46B7-B669-B6095B56280E",
				"name": "DirectionalLight 1 Target",
				"type": "Object3D",
				"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,-253.90185546875,-59.919429779052734,1]
			},
			{
				"uuid": "8F2504A4-9BE5-4A88-8546-B17A7FB01FC9",
				"name": "Box 1",
				"type": "Mesh",
				"geometry": "2A9A532F-0716-46A7-9945-3AFD0E9268CC",
				"material": "82D9DBF4-0973-4CB3-916E-C31F914577BE",
				"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,-92.0807876586914,0.4476560652256012,0,1]
			}]
	}
}