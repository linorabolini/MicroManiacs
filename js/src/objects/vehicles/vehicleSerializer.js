define(function(require) {

	var serializer = require('serializer');

	function serialize(parts, scale) {
        var wheelAnchors = parts.wheelAnchors,
            chasisModel  = parts.chasisModel,
            wheelModels  = parts.wheelModels,
            ratio        = scale  / 10,
            wheelsData   = [];

        for (var i = 0, il = wheelAnchors.length; i < il; i++) {

            // reset values
            var anchor       = wheelAnchors[i];
            var wheel        = wheelModels[i];
            
            var isFrontWheel = anchor.userData.isFrontWheel;
            var mirrored     = anchor.userData.mirrored;
            
            var radius       = wheel.userData.radius || 0.5;
            var suspension   = wheel.userData.suspensionRestLength || 0.15;
            
            var dx           = anchor.position.x / 10 / ratio;
            var dy           = anchor.position.y / 10 / ratio;
            var dz           = anchor.position.z / 10 / ratio;
            //

            var wheelData = {
                "isFrontWheel"  : isFrontWheel,
                "mirrored"      : mirrored,

                "wheelRadius"           : radius / ratio,
                "suspensionRestLength"  : suspension / ratio,

                "connectionPoint"   : [ dx, dy, dz ],
                "wheelDirection"    : [ 0, -1, 0 ],
                "wheelAxle"         : [ -1, 0, 0 ],
            };

            wheelsData.push(wheelData);
        }

        return {

            "chasisData"            : serializer.serialize(chasisModel, scale),
            "wheels"                : wheelsData,

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