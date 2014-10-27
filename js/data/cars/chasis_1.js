{
	"metadata": {
		"version": 4.3,
		"type": "Object",
		"generator": "ObjectExporter"
	},
	"geometries": [
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
			"uuid": "10D86B62-6B49-46B5-B8BF-B685C90A35CB",
			"type": "MeshPhongMaterial",
			"color": 43007,
			"ambient": 16777215,
			"emissive": 0,
			"specular": 1118481,
			"shininess": 30
		},
		{
			"uuid": "7A4B8B18-8F5E-4BE5-910F-141C4D87547D",
			"type": "MeshPhongMaterial",
			"color": 16721430,
			"ambient": 16777215,
			"emissive": 0,
			"specular": 1118481,
			"shininess": 30
		},
		{
			"uuid": "3D18B521-8425-4C63-803E-CF036E852002",
			"type": "MeshPhongMaterial",
			"color": 12647423,
			"ambient": 16777215,
			"emissive": 0,
			"specular": 1118481,
			"shininess": 30
		}],
	"object": {
		"uuid": "08102A8C-DBF4-44E4-B7B2-7C0A118CE3AE",
		"type": "Group",
		"name": "Chasis",
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
				"material": "10D86B62-6B49-46B5-B8BF-B685C90A35CB",
				"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
			},
			{
				"uuid": "A50D9087-BF2E-4F8A-8A3C-4FADE648B656",
				"type": "Mesh",
				"name": "Box 4",
				"geometry": "C23A5BE1-2784-47F7-9347-8AA966B45245",
				"material": "7A4B8B18-8F5E-4BE5-910F-141C4D87547D",
				"matrix": [0.23000000417232513,0,0,0,0,0.05000000074505806,0,0,0,0,0.07999999821186066,0,0,8.84000015258789,-28.489999771118164,1]
			},
			{
				"uuid": "A943B98A-3EFE-4F9D-AA63-E0B78EA06D24",
				"type": "Mesh",
				"name": "Box 5",
				"geometry": "6D62D701-FA07-4236-A6BF-5A5D0CC98A70",
				"material": "3D18B521-8425-4C63-803E-CF036E852002",
				"matrix": [0.15000000596046448,0,0,0,0,0.06860466301441193,0.013906853273510933,0,0,-0.029800400137901306,0.1470099836587906,0,0,1.6200000047683716,8.729999542236328,1]
			}]
	}
}