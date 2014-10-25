define(function (require) {
    'use strict';

    var serializer = {

            // MAIN FUNCTIONS
            //=========================================================

            serialize: function (obj, scale, data, offset) {
                var chained = data !== undefined,
                    offset = offset || 0,
                    data = data || [];

                offset = this[obj.type](obj, scale, data, offset);

                return chained ? offset : data;
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
            },

            // UTILITY FUNCTIOS
            //=========================================================

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
            serializeObjectType: function (obj, array, offset) {
                array[offset] = obj.type;
                return offset + 1;
            },
            serializeGeometryType: function (obj, array, offset) {
                array[offset] = obj.geometry.type;
                return offset + 1;
            },
            serializeGeometry: function (obj, array, offset, scale) {

                var type = obj.geometry.type;

                if (undefined !== type) {
                    offset = this.serializeGeometryType(obj, array, offset);
                    offset = this[type](obj, array, offset, scale);
                } else {
                    console.error("Object type is undefined");
                }

                return offset;
            },
            serializeChildren: function (obj, data, offset, scale) {
                var i, il, child;

                data[offset] = [];

                for (i = 0, il = obj.children.length; i < il; i++) {
                    child = obj.children[i];
                    data[offset].push(this.serialize(child, scale));
                }

                return offset + 1;
            },
            serializeUserData: function (obj, array, offset) {
                var data = obj.userData;
                array[offset] = data.mass !== undefined ? data.mass : 1;

                return offset + 1;
            },

            // OBJECT TYPES
            //=========================================================

            Mesh: function (mesh, scale, data, offset) {

                offset = this.serializePosition(mesh, data, offset, scale);
                offset = this.serializeRotation(mesh, data, offset);
                offset = this.serializeObjectType(mesh, data, offset);
                offset = this.serializeGeometry(mesh, data, offset, scale);
                offset = this.serializeChildren(mesh, data, offset, scale);
                offset = this.serializeUserData(mesh, data, offset);

                return offset;
            },
            Group: function (group, scale, data, offset) {

                offset = this.serializePosition(group, data, offset, scale);
                offset = this.serializeRotation(group, data, offset);
                offset = this.serializeObjectType(group, data, offset);
                offset = this.serializeChildren(group, data, offset, scale);
                offset = this.serializeUserData(group, data, offset);

                return offset;
            },
            Object3D: function (group, scale, data, offset) {
                return this.Group(group, scale, data, offset);
            },

            // GEOMETRY TYPES
            //==========================================================

            BoxGeometry: function (obj, array, offset, scale) {
                var size        = obj.geometry.parameters,
                    half = 0.5;
                array[offset]     = size.width * obj.scale.x / scale * half;
                array[offset + 1] = size.height * obj.scale.y / scale * half;
                array[offset + 2] = size.depth * obj.scale.z / scale * half;

                return offset + 3;
            },
            SphereGeometry: function (obj, array, offset, scale) {
                var radius        = obj.geometry.parameters.radius;
                array[offset] = radius / scale * obj.scale.x;

                return offset + 1;
            },
        };

    return serializer;
});