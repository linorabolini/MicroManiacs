
{
	"metadata": {
		"version": 4.3,
		"type": "Object",
		"generator": "ObjectExporter"
	},
	"geometries": [
		{
			"uuid": "F6ED7903-0F27-48EF-8744-F05A14ACB95B",
			"type": "CylinderGeometry",
			"radiusTop": 5,
			"radiusBottom": 5,
			"height": 5,
			"radialSegments": 16,
			"heightSegments": 1,
			"openEnded": false
		},
		{
			"uuid": "911AB290-3D13-4DED-9273-C1E557121111",
			"type": "BoxGeometry",
			"width": 20,
			"height": 10,
			"depth": 60,
			"widthSegments": 1,
			"heightSegments": 1,
			"depthSegments": 1
		},
		{
			"uuid": "C23A5BE1-2784-47F7-9347-8AA966B45245",
			"type": "BoxGeometry",
			"width": 100,
			"height": 100,
			"depth": 100,
			"widthSegments": 1,
			"heightSegments": 1,
			"depthSegments": 1
		},
		{
			"uuid": "6D62D701-FA07-4236-A6BF-5A5D0CC98A70",
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
			"uuid": "3080FDBF-AACE-4109-901B-B6FAFB66D558",
			"type": "MeshLambertMaterial",
			"color": 13666560,
			"ambient": 16777215,
			"emissive": 0
		},
		{
			"uuid": "095DC27F-3C21-4401-ADBD-C3FFB0686CBA",
			"type": "MeshLambertMaterial",
			"color": 8028671,
			"ambient": 16777215,
			"emissive": 0
		},
		{
			"uuid": "0D7663BF-A084-4D03-A87C-F5AC2AC70512",
			"type": "MeshLambertMaterial",
			"color": 16749312,
			"ambient": 16777215,
			"emissive": 0
		},
		{
			"uuid": "DD1B1955-55B9-40E2-A69F-286670E9FAF3",
			"type": "MeshLambertMaterial",
			"color": 65023,
			"ambient": 16777215,
			"emissive": 0
		},
		{
			"uuid": "D7276EB6-5568-41B9-9574-481552BFA76E",
			"type": "MeshLambertMaterial",
			"color": 16747224,
			"ambient": 16777215,
			"emissive": 0
		}],
	"object": {
		"uuid": "E726DAF8-646C-4D72-811A-B337E1A446EF",
		"type": "Group",
		"name": "VEHICLE",
		"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
		"children": [
			{
				"uuid": "EB41FE3A-B29C-4B93-8ED3-FDFD84280C68",
				"type": "Group",
				"name": "WHEELS",
				"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
				"children": [
					{
						"uuid": "A4AE5B85-1074-4385-9664-89DECA9DA44D",
						"type": "Object3D",
						"name": "front 1",
						"userData": {
							"isFrontWheel": true,
							"mirrored": false
						},
						"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,9.449999809265137,-1.4875869750976562,9.25,1],
						"children": [
							{
								"uuid": "87DC6765-7374-40EA-862E-4E460690587B",
								"type": "Mesh",
								"name": "Cylinder 1",
								"geometry": "F6ED7903-0F27-48EF-8744-F05A14ACB95B",
								"material": "3080FDBF-AACE-4109-901B-B6FAFB66D558",
								"matrix": [-0.009203491732478142,0.9999576210975647,0,0,-0.9999576210975647,-0.009203491732478142,0,0,0,0,1,0,0,0,0,1]
							}]
					},
					{
						"uuid": "3A5D1F53-B8B4-4296-93C0-CEA58977383B",
						"type": "Object3D",
						"name": "front 2",
						"userData": {
							"isFrontWheel": true,
							"mirrored": true
						},
						"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,-9.390000343322754,-1.4900000095367432,9.25,1],
						"children": [
							{
								"uuid": "EDD14817-A0C4-4E10-AABB-23DB2B4CF351",
								"type": "Mesh",
								"name": "Cylinder 1",
								"geometry": "F6ED7903-0F27-48EF-8744-F05A14ACB95B",
								"material": "3080FDBF-AACE-4109-901B-B6FAFB66D558",
								"matrix": [-0.009203491732478142,0.9999576210975647,0,0,-0.9999576210975647,-0.009203491732478142,0,0,0,0,1,0,0,0,0,1]
							}]
					},
					{
						"uuid": "C4B2C3EE-99CE-4F72-9697-EF4687DA4DC7",
						"type": "Object3D",
						"name": "back 2",
						"userData": {
							"isFrontWheel": false,
							"mirrored": false
						},
						"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,-9.390000343322754,-2.3399999141693115,-9.25,1],
						"children": [
							{
								"uuid": "5BCA4C1E-ED69-486A-8E7D-8703045AF28E",
								"type": "Mesh",
								"name": "Cylinder 1",
								"geometry": "F6ED7903-0F27-48EF-8744-F05A14ACB95B",
								"material": "3080FDBF-AACE-4109-901B-B6FAFB66D558",
								"matrix": [-0.009203491732478142,0.9999576210975647,0,0,-0.9999576210975647,-0.009203491732478142,0,0,0,0,1,0,0,0,0,1]
							}]
					},
					{
						"uuid": "AF0625BE-9CA5-40A7-8437-B58F6729A6B4",
						"type": "Group",
						"name": "back 1",
						"userData": {
							"isFrontWheel": false,
							"mirrored": false
						},
						"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,9.390000343322754,-2.3399999141693115,-9.25,1],
						"children": [
							{
								"uuid": "AB2A365F-193A-477F-94BC-48B1A71CE14A",
								"type": "Mesh",
								"name": "Cylinder 1",
								"geometry": "F6ED7903-0F27-48EF-8744-F05A14ACB95B",
								"material": "3080FDBF-AACE-4109-901B-B6FAFB66D558",
								"matrix": [-0.009203542955219746,0.9999576210975647,0,0,-0.9999576210975647,-0.009203542955219746,0,0,0,0,1,0,0,0,0,1]
							}]
					}]
			},
			{
				"uuid": "08102A8C-DBF4-44E4-B7B2-7C0A118CE3AE",
				"type": "Group",
				"name": "CHASIS",
				"userData": {
					"mass": 50
				},
				"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
				"children": [
					{
						"uuid": "F1A8294D-0DB3-4D47-AB7A-CCB49DCF7584",
						"type": "Mesh",
						"name": "Box 1",
						"geometry": "911AB290-3D13-4DED-9273-C1E557121111",
						"material": "095DC27F-3C21-4401-ADBD-C3FFB0686CBA",
						"matrix": [1,0,0,0,0,1,0,0,0,0,0.5380376577377319,0,0,0,0,1]
					},
					{
						"uuid": "A50D9087-BF2E-4F8A-8A3C-4FADE648B656",
						"type": "Mesh",
						"name": "Box 4",
						"geometry": "C23A5BE1-2784-47F7-9347-8AA966B45245",
						"material": "0D7663BF-A084-4D03-A87C-F5AC2AC70512",
						"matrix": [0.23000000417232513,0,0,0,0,0.025900904089212418,0.0064257485792040825,0,0,-0.019263219088315964,0.0776461735367775,0,0,7.137133598327637,-14.990464210510254,1]
					},
					{
						"uuid": "A943B98A-3EFE-4F9D-AA63-E0B78EA06D24",
						"type": "Mesh",
						"name": "Box 5",
						"geometry": "6D62D701-FA07-4236-A6BF-5A5D0CC98A70",
						"material": "DD1B1955-55B9-40E2-A69F-286670E9FAF3",
						"matrix": [0.15000000596046448,0,0,0,0,0.06860466301441193,0.013906854204833508,0,0,-0.029800400137901306,0.1470099836587906,0,0,4.165573596954346,3.876051902770996,1]
					},
					{
						"uuid": "E761CCA8-DC28-4B64-93A9-0C8B2D78A187",
						"type": "Mesh",
						"name": "Box 1",
						"geometry": "911AB290-3D13-4DED-9273-C1E557121111",
						"material": "D7276EB6-5568-41B9-9574-481552BFA76E",
						"matrix": [0.7131410241127014,0,0,0,0,0.6223307251930237,0,0,0,0,0.18042674660682678,0,0,-0.42482659220695496,13.497125625610352,1]
					}]
			}]
	}
}