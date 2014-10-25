define(function (require) {
    'use strict';


    var serializer = {
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
        serializeBoxSize: function (obj, array, offset, scale) {
            var size        = obj.geometry.parameters;
            array[offset]   = size.width * obj.scale.x / scale;
            array[offset + 1] = size.height * obj.scale.y / scale;
            array[offset + 2] = size.depth * obj.scale.z / scale;

            return offset + 3;
        },
        mesh: function (mesh, scale) {

            // serialize the mesh params to pass them to the
            // physics worker.

            var offset = 0,
                object = [];

            offset = this.serializePosition(mesh, object, offset, scale);
            offset = this.serializeRotation(mesh, object, offset);
            offset = this.serializeBoxSize(mesh, object, offset, scale);

            object[offset] = mesh.userData.mass !== undefined ? mesh.userData.mass : 1;

            return object;
        },
        object3D: function (mesh, scale) {

            // serialize an Object 3d

            var offset = 0,
                object = [];

            offset = this.serializePosition(mesh, object, offset, scale);
            offset = this.serializeRotation(mesh, object, offset);

            return object;
        },
        applySerialData: function (data, offset, array, scale) {
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