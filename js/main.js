'use strict';

require.config({
    baseUrl: 'js',
    paths: {
    // libs
        'jquery': 'libs/jquery-2.1.0.min',
        'underscore': 'libs/underscore-min',
        'datgui': 'libs/dat.gui',
        'fishbone' : 'libs/fishbone',
        'three' : 'libs/three.min',

    //src
        // models
        'Time': 'src/Time',
        'BaseObject' : 'src/models/BaseObject',
        'LevelModel' : 'src/models/LevelModel',
        'LevelScreen' : 'src/models/LevelScreen',


        // views
        'LevelViewport' : 'src/views/LevelViewport',

// upper level
        'utils': 'src/utils',
        'APP': 'src/app',
        'fileManager' : 'src/fileManager'
    }
});

require(['jquery', 'APP', 'datgui'],
    function ($, APP) {

        // component setup
        //==============================================
        APP.setup();

        // main loop config
        //==============================================

        var start = null;
        function step(timestamp) {

            // calculate elapsed time since last frame
            if (start === null) start = timestamp;
            var dt = timestamp - start;
            dt *= 0.001;

            // update elements
            APP.update(dt);

            window.requestAnimationFrame(step);
        }

        window.requestAnimationFrame(step);

    });