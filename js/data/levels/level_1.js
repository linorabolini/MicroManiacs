{
	"metadata": {
		"version": 4.3,
		"type": "Object",
		"generator": "ObjectExporter"
	},
	"geometries": [
		{
			"uuid": "059ACE9A-D8E0-43A1-A2C0-1811D69C6DD0",
			"type": "BoxGeometry",
			"width": 800,
			"height": 20,
			"depth": 800,
			"widthSegments": 1,
			"heightSegments": 1,
			"depthSegments": 1
		},
		{
			"uuid": "911AB290-3D13-4DED-9273-C1E557121111",
			"type": "BoxGeometry",
			"width": 20,
			"height": 20,
			"depth": 20,
			"widthSegments": 1,
			"heightSegments": 1,
			"depthSegments": 1
		},
		{
			"uuid": "A054CF19-61B3-4925-8E51-AEA9BE3F6710",
			"type": "BoxGeometry",
			"width": 15,
			"height": 15,
			"depth": 15,
			"widthSegments": 1,
			"heightSegments": 1,
			"depthSegments": 1
		},
		{
			"uuid": "90B7D62A-7A9C-45AD-87DE-E6E7DA6154D1",
			"type": "BoxGeometry",
			"width": 100,
			"height": 100,
			"depth": 100,
			"widthSegments": 1,
			"heightSegments": 1,
			"depthSegments": 1
		},
		{
			"uuid": "E5EABF31-3337-41DF-841E-63C1DF98C57C",
			"type": "BoxGeometry",
			"width": 5,
			"height": 5,
			"depth": 5,
			"widthSegments": 1,
			"heightSegments": 1,
			"depthSegments": 1
		},
		{
			"uuid": "39BB3B2F-5BFC-4CFC-8245-ABF44319662D",
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
			"color": 16769203,
			"ambient": 16777215,
			"emissive": 0,
			"specular": 1118481,
			"shininess": 30,
			"opacity": 1,
			"transparent": false,
			"wireframe": false
		},
		{
			"uuid": "10D86B62-6B49-46B5-B8BF-B685C90A35CB",
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
			"uuid": "614B34B6-253B-4F3E-BBB5-E25D9AFB4A80",
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
			"uuid": "23E526E6-3B8D-4960-8C65-61713DEFF042",
			"type": "MeshPhongMaterial",
			"color": 16752207,
			"ambient": 16777215,
			"emissive": 0,
			"specular": 1118481,
			"shininess": 30,
			"opacity": 1,
			"transparent": false,
			"wireframe": false
		},
		{
			"uuid": "8C9F4D5D-6A83-4908-87D1-43C9069604CA",
			"type": "MeshPhongMaterial",
			"color": 16775512,
			"ambient": 16777215,
			"emissive": 0,
			"specular": 1118481,
			"shininess": 30,
			"opacity": 1,
			"transparent": false,
			"wireframe": false
		},
		{
			"uuid": "7AB31159-50F1-4813-B824-E9791B823141",
			"type": "MeshPhongMaterial",
			"color": 3800570,
			"ambient": 16777215,
			"emissive": 0,
			"specular": 1118481,
			"shininess": 30,
			"opacity": 1,
			"transparent": false,
			"wireframe": false
		}],
	"object": {
		"uuid": "F872E3F5-5558-4C09-8923-6611E6DAEE6F",
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
						"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,427.5879211425781,313.6686096191406,-383.2039489746094,1]
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
						"uuid": "618016F8-97D8-4C6F-A1FF-3F1DBDAFF488",
						"name": "Box 3",
						"userData": {
							"mass": 0
						},
						"type": "Mesh",
						"geometry": "059ACE9A-D8E0-43A1-A2C0-1811D69C6DD0",
						"material": "BAD909DE-8535-432F-80B9-AF0985288937",
						"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,1.659999966621399,7.519999980926514,-10.699999809265137,1]
					},
					{
						"uuid": "F1A8294D-0DB3-4D47-AB7A-CCB49DCF7584",
						"name": "Box 1",
						"type": "Mesh",
						"geometry": "911AB290-3D13-4DED-9273-C1E557121111",
						"material": "10D86B62-6B49-46B5-B8BF-B685C90A35CB",
						"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,426.0184631347656,-208.73272705078125,1]
					},
					{
						"uuid": "CB7A2085-599B-46CA-9B75-2C59C8F49EFA",
						"name": "Box 2",
						"type": "Mesh",
						"geometry": "A054CF19-61B3-4925-8E51-AEA9BE3F6710",
						"material": "614B34B6-253B-4F3E-BBB5-E25D9AFB4A80",
						"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,178.75999450683594,284.8800048828125,-251.77000427246094,1]
					},
					{
						"uuid": "EA787236-FA2F-475F-856E-D12B456B6F76",
						"name": "Box 3",
						"type": "Mesh",
						"geometry": "90B7D62A-7A9C-45AD-87DE-E6E7DA6154D1",
						"material": "23E526E6-3B8D-4960-8C65-61713DEFF042",
						"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,-117.4800033569336,178.08999633789062,-163.5500030517578,1]
					},
					{
						"uuid": "6B991AFA-3D30-4DF4-8D71-768EA215E80A",
						"name": "Box 4",
						"type": "Mesh",
						"geometry": "E5EABF31-3337-41DF-841E-63C1DF98C57C",
						"material": "8C9F4D5D-6A83-4908-87D1-43C9069604CA",
						"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,262.9200134277344,252.1300048828125,-175,1]
					},
					{
						"uuid": "BC099F29-B363-485C-A4C6-37B09813E44E",
						"name": "Box 1",
						"userData": {
							"mass": 0
						},
						"type": "Mesh",
						"geometry": "39BB3B2F-5BFC-4CFC-8245-ABF44319662D",
						"material": "7AB31159-50F1-4813-B824-E9791B823141",
						"matrix": [0.9358968138694763,0.35227423906326294,0,0,-0.35227423906326294,0.9358968138694763,0,0,0,0,1,0,247.60000610351562,-14.210000038146973,187.8699951171875,1]
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
				"uuid": "ED6B8F6A-3473-41E7-A0AA-27AB65B64E1A",
				"name": "DirectionalLight 1 Target",
				"type": "Object3D",
				"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,-2.417149066925049,1]
			},
			{
				"uuid": "BE494B08-217C-41F4-A36C-8CA94131B6F8",
				"name": "SPAWNERS",
				"type": "Object3D",
				"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
				"children": [
					{
						"uuid": "EF3A0822-FCA7-49DB-98D6-4F1B7CF94B5B",
						"name": "spawner 1",
						"type": "Object3D",
						"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
					}]
			}]
	}
}