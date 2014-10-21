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

// upper level
        'input'         : 'src/input',
        'utils'         : 'src/utils',
        'app'           : 'src/app',
        'files'         : 'src/files'
    }
});

require(['jquery', 'app', 'datgui'],
    function ($, app) {

        // component setup
        //==============================================
        app.setup();

        // main loop config
        //==============================================

        var start = null;
        function step(timestamp) {

            // calculate elapsed time since last frame
            if (start === null) start = timestamp;
            var dt = timestamp - start;
            dt *= 0.001;

            // update elements
            app.update(dt);

            window.requestAnimationFrame(step);
        }

        window.requestAnimationFrame(step);

    });