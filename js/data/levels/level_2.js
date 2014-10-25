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
			"uuid": "5A3582E9-D7D5-4332-865D-6968E551E463",
			"type": "SphereGeometry",
			"radius": 75,
			"widthSegments": 32,
			"heightSegments": 16,
			"phiStart": 0,
			"phiLength": 6.28,
			"thetaStart": 0,
			"thetaLength": 3.14
		}],
	"materials": [
		{
			"uuid": "BAD909DE-8535-432F-80B9-AF0985288937",
			"type": "MeshPhongMaterial",
			"color": 16769203,
			"ambient": 16777215,
			"emissive": 0,
			"specular": 1118481,
			"shininess": 30
		},
		{
			"uuid": "F837D1DA-5DA0-4BCA-9E05-E51AE4E4F782",
			"type": "MeshLambertMaterial",
			"color": 9959873,
			"ambient": 16777215,
			"emissive": 0
		}],
	"object": {
		"uuid": "777616DD-AAB1-4F0D-8BE5-CDE60C10A3DA",
		"type": "Scene",
		"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
		"children": [
			{
				"uuid": "41401ADB-B644-4C36-AA14-B3C90FAFFB93",
				"type": "Object3D",
				"name": "CAMERA",
				"matrix": [0.9995500445365906,0,-0.029995501041412354,0,0,1,0,0,0.029995501041412354,0,0.9995500445365906,0,98.93085479736328,0,0,1],
				"children": [
					{
						"uuid": "637C9710-DAF1-452B-B4C6-ADAC90C8DB9D",
						"type": "Object3D",
						"name": "POSITION",
						"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,427.5879211425781,313.6686096191406,-383.2039489746094,1]
					},
					{
						"uuid": "1975EE13-CACA-4C10-A362-45CF4D5C68F3",
						"type": "Object3D",
						"name": "TARGET",
						"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
					}]
			},
			{
				"uuid": "94F31C03-F6C5-45D2-8F95-B4C6AF00E677",
				"type": "Object3D",
				"name": "LEVEL",
				"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
				"children": [
					{
						"uuid": "618016F8-97D8-4C6F-A1FF-3F1DBDAFF488",
						"type": "Mesh",
						"name": "Box 3",
						"userData": {
							"mass": 0
						},
						"geometry": "059ACE9A-D8E0-43A1-A2C0-1811D69C6DD0",
						"material": "BAD909DE-8535-432F-80B9-AF0985288937",
						"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,1.659999966621399,7.519999980926514,-10.699999809265137,1]
					},
					{
						"uuid": "E86AF58A-93E8-457E-A58C-C166618848EF",
						"type": "Mesh",
						"name": "Sphere 2",
						"geometry": "5A3582E9-D7D5-4332-865D-6968E551E463",
						"material": "F837D1DA-5DA0-4BCA-9E05-E51AE4E4F782",
						"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,226.44000244140625,0,1]
					}]
			},
			{
				"uuid": "BE494B08-217C-41F4-A36C-8CA94131B6F8",
				"type": "Object3D",
				"name": "SPAWNERS",
				"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
				"children": [
					{
						"uuid": "EF3A0822-FCA7-49DB-98D6-4F1B7CF94B5B",
						"type": "Object3D",
						"name": "spawner 1",
						"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,100.634765625,0,1]
					},
					{
						"uuid": "F6B8884C-18FC-442E-AEEA-AD2760D581F3",
						"type": "Group",
						"name": "Group 3",
						"matrix": [-0.1292577087879181,0,-0.9916110634803772,0,0,1,0,0,0.9916110634803772,0,-0.1292577087879181,0,0,162.3994598388672,234.22178649902344,1]
					}]
			},
			{
				"uuid": "4724A8A9-0B07-4751-8375-6D16A7A101E5",
				"type": "DirectionalLight",
				"name": "LIGHT",
				"color": 16775119,
				"intensity": 0.24,
				"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,372.7900085449219,452.5899963378906,-252.6199951171875,1]
			},
			{
				"uuid": "285D814F-B198-4946-88FF-17A979F4D2CE",
				"type": "Object3D",
				"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
			},
			{
				"uuid": "9B53E943-AA57-45F2-A003-85A077E9A6F5",
				"type": "Object3D",
				"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
			},
			{
				"uuid": "91FC1B7B-50E5-42C8-B4CF-A9E210D4272A",
				"type": "Object3D",
				"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
			},
			{
				"uuid": "85A7328C-88D0-43AA-9ABA-9BB0F36D1419",
				"type": "Object3D",
				"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
			},
			{
				"uuid": "799E4256-44DE-4878-B009-A287BA2DD67F",
				"type": "Object3D",
				"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
			},
			{
				"uuid": "A381178D-38E9-4993-A53B-B0D4B0533F13",
				"type": "HemisphereLight",
				"name": "HemisphereLight 1",
				"color": 9160959,
				"groundColor": 16702236,
				"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,126.80999755859375,200,-451.57000732421875,1]
			}]
	}
}