define(function (require) {

    /**
     * Object to store vehicle parts
     * @param {[object3D]} chasisModel  
     * @param {[array of positions]} wheelAnchors 
     * @param {[array of object3D]} wheelModels  
     */
    function VehicleParts (chasisModel, wheelAnchors, wheelModels) {
        this.chasisModel  = chasisModel;
        this.wheelAnchors = wheelAnchors;
        this.wheelModels  = wheelModels;
    }

    VehicleParts.prototype.dispose = function () {
        this.chasisModel  = null;
        this.wheelAnchors = null;
        this.wheelModels  = null;
    }

    return VehicleParts;
});