define(function (require) {

    /**
     * maps the input to the vehicle
     */
    function VehicleController(){};

    VehicleController.prototype.handleInput = function (input, vehicle) {
          if (input.type === "key") {
              var code = input.code;
              code === 38 && vehicle.setAcceleration(input.value);
              code === 40 && vehicle.setAcceleration(-input.value);
              code === 39 && vehicle.setSteering(-input.value);
              code === 37 && vehicle.setSteering(input.value);
          } else if (input.type === "accelerometer") {
              vehicle.setAcceleration(input.x);
              vehicle.setSteering(input.y);
          }
    }

    return new VehicleController;
});