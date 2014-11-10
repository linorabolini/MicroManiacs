define(function(require) {

	var serializer = require('serializer');

	function serialize(chasisModel, wheelAnchors, wheelModels, scale) {
		var ratio   = scale  / 10,
			wheelsData = [],
            dx,
            dy,
            dz,
            radius,
            suspensionRestLength,
            isFrontWheel,
            mirrored;

        for (var i = 0, il = wheelAnchors.length; i < il; i++) {

            var anchor = wheelAnchors[i];
            var wheel = wheelModels[i];

            // reset values
            dx = anchor.position.x / 10 / ratio;
            dy = anchor.position.y / 10 / ratio;
            dz = anchor.position.z / 10 / ratio;
            isFrontWheel = anchor.userData.isFrontWheel;
            mirrored = anchor.userData.mirrored;

            radius = wheel.userData.radius || 0.5;
            suspensionRestLength = wheel.userData.suspensionRestLength || 0.15;
            //

            var wheelData = {
                "isFrontWheel"  : isFrontWheel,
                "mirrored"      : mirrored,

                "wheelRadius"           : radius / ratio,
                "suspensionRestLength"  : suspensionRestLength / ratio,

                "connectionPoint"   : [ dx, dy, dz ],
                "wheelDirection"    : [ 0, -1, 0 ],
                "wheelAxle"         : [ -1, 0, 0 ],
            };

            wheelsData.push(wheelData);
        }

        return {

            "chasisData": serializer.serialize(chasisModel, scale),
            "wheels" : wheelsData,

            "maxSuspensionTravelCm" : 750.0,
            "maxSuspensionForce"    : 6000.0,
            "suspensionStiffness"   : 10.0 * ratio,
            "suspensionCompression" : 20.83,
            "suspensionDamping"     : 0.88,
            "rollInfluence"         : 0.1,
            "frictionSlip"          : 1000

        }
	}

	return {
		serialize: serialize
	}
});