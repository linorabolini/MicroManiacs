define(function (require) {
    'use strict';

    var shapes = require('shapes'),

        serializer = {
            serializePosition: function (obj, array, offset, scale) {
                var origin      = obj.position;
                array[offset]   = origin.x / scale;
                array[offset + 1] = origin.y / scale;
                array[offset + 2] = origin.z / scale;

                return offset + 3;
            },
            serializeRotation: function (obj, array, offset) {
                var rotation    = obj.quaternion;
                array[offset]   = rotation.x;
                array[offset + 1] = rotation.y;
                array[offset + 2] = rotation.z;
                array[offset + 3] = rotation.w;

                return offset + 4;
            },
            mesh: function (mesh, scale) {

                // serialize the mesh params to pass them to the
                // physics worker.

                var offset = 0,
                    object = [];

                offset = this.serializePosition(mesh, object, offset, scale);
                offset = this.serializeRotation(mesh, object, offset);
                offset = this.serializeGeometry(mesh, object, offset, scale);
                offset = this.serializeUserData(mesh, object, offset);

                object[offset] = mesh.userData.mass !== undefined ? mesh.userData.mass : 1;

                return object;
            },
            serializeGeometry: function (obj, array, offset, scale) {

                var type = obj.geometry.type;

                if (undefined !== type) {
                    offset = this.serializeGeometryType(obj, array, offset);
                    offset = this["serialize" + type](obj, array, offset, scale);
                } else {
                    console.error("Object type is undefined");
                }

                return offset;
            },
            serializeBoxGeometry: function (obj, array, offset, scale) {
                var size        = obj.geometry.parameters;
                var half = 0.5;
                array[offset]     = size.width * obj.scale.x / scale * half;
                array[offset + 1] = size.height * obj.scale.y / scale * half;
                array[offset + 2] = size.depth * obj.scale.z / scale * half;

                return offset + 3;
            },
            serializeSphereGeometry: function (obj, array, offset, scale) {
                var radius        = obj.geometry.parameters.radius;
                array[offset] = radius / scale;

                return offset + 1;
            },
            serializeGeometryType: function (obj, array, offset) {
                array[offset] = obj.geometry.type;
                return offset + 1;
            },
            serializeUserData: function (obj, array, offset) {
                var data = obj.userData;
                array[offset] = data.mass !== undefined ? data.mass : 1;

                return offset + 1;
            },
            applyData: function (data, offset, array, scale) {
                var i, body;
                for (i = 0; i < array.length; i++) {
                    body = array[i];

                    body.position.x = data[offset] * scale;
                    body.position.y = data[offset + 1] * scale;
                    body.position.z = data[offset + 2] * scale;

                    body.quaternion.x = data[offset + 3];
                    body.quaternion.y = data[offset + 4];
                    body.quaternion.z = data[offset + 5];
                    body.quaternion.w = data[offset + 6];

                    offset += 7;
                }

                return offset;
            }
        };

    return serializer;
});