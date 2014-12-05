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
			"uuid": "D636D129-4D26-4683-8FD1-4B47F3F014F3",
			"type": "SphereGeometry",
			"radius": 75,
			"widthSegments": 32,
			"heightSegments": 16,
			"phiStart": 0,
			"phiLength": 6.28,
			"thetaStart": 0,
			"thetaLength": 3.14
		},
		{
			"uuid": "5550BF71-A5FC-4E18-8B37-BD20CCF2FFC7",
			"type": "BoxGeometry",
			"width": 100,
			"height": 100,
			"depth": 100,
			"widthSegments": 1,
			"heightSegments": 1,
			"depthSegments": 1
		},
		{
			"uuid": "349BF0B8-F96F-4FD1-930E-9884558B9869",
			"type": "BoxGeometry",
			"width": 100,
			"height": 100,
			"depth": 100,
			"widthSegments": 1,
			"heightSegments": 1,
			"depthSegments": 1
		},
		{
			"uuid": "793875B3-629B-4180-A0DA-9D1B8A226934",
			"type": "SphereGeometry",
			"radius": 75,
			"widthSegments": 32,
			"heightSegments": 16,
			"phiStart": 0,
			"phiLength": 6.283185307179586,
			"thetaStart": 0,
			"thetaLength": 3.141592653589793
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
		},
		{
			"uuid": "DEF2F4D6-7F62-469B-A0EC-88ADBAAD74E3",
			"type": "MeshPhongMaterial",
			"color": 16777215,
			"ambient": 16777215,
			"emissive": 0,
			"specular": 1118481,
			"shininess": 30
		},
		{
			"uuid": "1FA47D7B-26D7-4C3D-B722-43F3E41B8CF7",
			"type": "MeshPhongMaterial",
			"color": 16777215,
			"ambient": 16777215,
			"emissive": 0,
			"specular": 1118481,
			"shininess": 30
		},
		{
			"uuid": "87289445-1EEA-4431-9817-8FEF1B7D6284",
			"type": "MeshPhongMaterial",
			"color": 16777215,
			"ambient": 16777215,
			"emissive": 0,
			"specular": 1118481,
			"shininess": 30
		}],
	"object": {
		"uuid": "01AFAB3D-3B5D-4B51-AADC-562EABECBF86",
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
						"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,1.659999966621399,7.519999980926514,0,1]
					},
					{
						"uuid": "E86AF58A-93E8-457E-A58C-C166618848EF",
						"type": "Mesh",
						"name": "Sphere 2",
						"geometry": "D636D129-4D26-4683-8FD1-4B47F3F014F3",
						"material": "F837D1DA-5DA0-4BCA-9E05-E51AE4E4F782",
						"matrix": [0.3993266820907593,0,0,0,0,0.3993266820907593,0,0,0,0,0.3993266820907593,0,0,226.44000244140625,0,1]
					},
					{
						"uuid": "474FF42C-6D80-4D59-9BA2-5B3C6DF4DC08",
						"type": "Mesh",
						"name": "Box 1",
						"geometry": "5550BF71-A5FC-4E18-8B37-BD20CCF2FFC7",
						"material": "DEF2F4D6-7F62-469B-A0EC-88ADBAAD74E3",
						"matrix": [0.25999999046325684,0,0,0,0,0.25999999046325684,0,0,0,0,0.25999999046325684,0,0,236.99000549316406,-211.14999389648438,1]
					},
					{
						"uuid": "F6B8884C-18FC-442E-AEEA-AD2760D581F3",
						"type": "Group",
						"name": "Group 3",
						"matrix": [-0.13042360544204712,-0.6824951767921448,-0.7191592454910278,0,-0.0002077362732961774,0.7253737449645996,-0.6883552074432373,0,0.9914583563804626,-0.08962836116552353,-0.0947476401925087,0,4.337031841278076,196.5777130126953,236.36459350585938,1],
						"children": [
							{
								"uuid": "62883EC0-2E3A-464B-AEF4-BC90C34268C6",
								"type": "Mesh",
								"name": "Box 3",
								"geometry": "349BF0B8-F96F-4FD1-930E-9884558B9869",
								"material": "1FA47D7B-26D7-4C3D-B722-43F3E41B8CF7",
								"matrix": [0.23000000417232513,0,0,0,0,0.23000000417232513,0,0,0,0,0.23000000417232513,0,0,0,0,1]
							},
							{
								"uuid": "6BD34A6B-F435-456E-A8E4-F1CE7CEB9C12",
								"type": "Mesh",
								"name": "Sphere 5",
								"geometry": "793875B3-629B-4180-A0DA-9D1B8A226934",
								"material": "87289445-1EEA-4431-9817-8FEF1B7D6284",
								"matrix": [0.33000001311302185,0,0,0,0,0.33000001311302185,0,0,0,0,0.33000001311302185,0,0,30.17786407470703,0,1]
							},
							{
								"uuid": "38D12BB0-4120-41F7-B403-E306B3606241",
								"type": "Object3D",
								"name": "Group666",
								"matrix": [-0.13042357563972473,-0.0031716979574412107,-0.9914532899856567,0,-0.0002077197568723932,0.9999949336051941,-0.0031716979574412107,0,0.9914583563804626,-0.0002077197568723932,-0.13042357563972473,0,1.6886379718780518,-62.44912338256836,-4.854404926300049,1],
								"children": [
									{
										"uuid": "8EBFC367-A97E-45B9-9A67-B04EC005B7F3",
										"type": "Mesh",
										"name": "Box 3",
										"geometry": "349BF0B8-F96F-4FD1-930E-9884558B9869",
										"material": "1FA47D7B-26D7-4C3D-B722-43F3E41B8CF7",
										"matrix": [0.23000000417232513,0,0,0,0,0.23000000417232513,0,0,0,0,0.23000000417232513,0,0,0,0,1]
									},
									{
										"uuid": "A533E295-608B-4AB7-A17F-F614EE42E5A8",
										"type": "Mesh",
										"name": "Sphere 5",
										"geometry": "793875B3-629B-4180-A0DA-9D1B8A226934",
										"material": "87289445-1EEA-4431-9817-8FEF1B7D6284",
										"matrix": [0.33000001311302185,0,0,0,0,0.33000001311302185,0,0,0,0,0.33000001311302185,0,0,30.17786407470703,0,1]
									}]
							},
							{
								"uuid": "B7526EA4-7BA8-4D41-BC2C-B7AA469C618C",
								"type": "Object3D",
								"name": "Group666 2",
								"matrix": [-0.1497972011566162,-0.9785365462303162,-0.14151686429977417,0,0.9860726594924927,-0.15831901133060455,0.05094805732369423,0,-0.07225935161113739,-0.13191403448581696,0.9886239171028137,0,32.19898223876953,28.93705177307129,1.1229029893875122,1],
								"children": [
									{
										"uuid": "A798CD4E-61E0-429E-9F1F-2EB7C86C01B9",
										"type": "Mesh",
										"name": "Box 3",
										"geometry": "349BF0B8-F96F-4FD1-930E-9884558B9869",
										"material": "1FA47D7B-26D7-4C3D-B722-43F3E41B8CF7",
										"matrix": [0.23000000417232513,0,0,0,0,0.23000000417232513,0,0,0,0,0.23000000417232513,0,0,0,0,1]
									},
									{
										"uuid": "7FB38596-796F-4160-986F-319BA12A2657",
										"type": "Mesh",
										"name": "Sphere 5",
										"userData": {
											"mass": 55
										},
										"geometry": "793875B3-629B-4180-A0DA-9D1B8A226934",
										"material": "87289445-1EEA-4431-9817-8FEF1B7D6284",
										"matrix": [0.33000001311302185,0,0,0,0,0.33000001311302185,0,0,0,0,0.33000001311302185,0,0,30.18000030517578,0,1]
									}]
							}]
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
						"uuid": "E7E84E1E-7BF1-4091-9506-B94BA1821725",
						"type": "Group",
						"name": "Group 2",
						"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,135.7899932861328,0,1]
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