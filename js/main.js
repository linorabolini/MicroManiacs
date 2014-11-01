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

    //src
        // objects
        'BaseObject'    : 'src/objects/BaseObject',
        'LevelModel'    : 'src/objects/LevelModel',
        'LevelScreen'   : 'src/objects/LevelScreen',
        'LevelViewport' : 'src/objects/LevelViewport',

        // inputs
        'keyboard'      : 'src/inputs/keyboard',
        'mobile'        : 'src/inputs/mobile',

// upper level
        'serializer'    : 'src/serializer',
        'physics'       : 'src/physics',
        'input'         : 'src/input',
        'utils'         : 'src/utils',
        'app'           : 'src/app',
        'files'         : 'src/files'
    }
});

define('server', [], function() {
    if (undefined === io) {
        console.log('Server not found');
        return false;
    }
    
    return io('http://localhost:3000'); 
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