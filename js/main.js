'use strict';

require.config({
    baseUrl: 'js',
    paths: {
    // libs
        'jquery'        : 'libs/jquery-2.1.0.min',
        'underscore'    : 'libs/underscore-min',
        'datgui'        : 'libs/dat.gui',
        'fishbone'      : 'libs/fishbone',
        'three'         : 'libs/three.min',

    //engine
        // objects
        'BaseObject'    : 'engine/objects/BaseObject',
        'LevelModel'    : 'engine/objects/LevelModel',
        'LevelScreen'   : 'engine/objects/LevelScreen',
        'LevelViewport' : 'engine/objects/LevelViewport',
        'cameraHelper'  : 'engine/objects/cameraHelper',

            // vehicles
            'vehicle'                : 'engine/objects/vehicles/vehicle',
            'vehicleStats'           : 'engine/objects/vehicles/vehicleStats',
            'vehicleParts'           : 'engine/objects/vehicles/vehicleParts',
            'vehicleStatus'          : 'engine/objects/vehicles/vehicleStatus',
            'vehicleController'      : 'engine/objects/vehicles/vehicleController',
            'vehicleSerializer'      : 'engine/objects/vehicles/vehicleSerializer',

        // inputs
        'keyboard'      : 'engine/inputs/keyboard',
        'mobile'        : 'engine/inputs/mobile',


// upper level
        'debug'         : 'engine/debug',
        'server'        : 'engine/server',
        'serializer'    : 'engine/serializer',
        'physics'       : 'engine/physics',
        'input'         : 'engine/input',
        'utils'         : 'engine/utils',
        'app'           : 'engine/app',
        'files'         : 'engine/files'
    }
});

define('io', [], function(config) {
    try {
        return io;
    } catch(e) {
        return false
    }
});

define('config', [], function() {
    return {
        server: {
            name: 'server',
            host: 'http://localhost:3000',
            options: {
                'reconnection': false,
            }
        },
        worker: {
            path: './js/engine/workers/ammo.js'
        },
        level: {
            scale: 80,
            camera: {
                perspective: false
            }
        },
        debug: true
    }
});

require(['app', 'datgui'],
    function (app) {

        // component setup
        //==============================================
        app.setup();

        // main loop config
        //==============================================
        var last = Date.now();
        function step(now) {
            app.update(now - last);
            last = now;
            window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);

    });