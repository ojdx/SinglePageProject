var d3Application = {};
(function() {
    'use strict';
    require.config({
        paths: {
            domReady: 'libs/require/domReady',
            jquery: 'libs/jquery/jquery',
            underscore: 'libs/underscore/underscore',
            backbone: 'libs/backbone/backbone',
            hogan: 'libs/hogan/hogan-2.0.0.amd',
            sio: 'libs/socket.io/dist/socket.io'
        },
        shim: {
            underscore:{exports: '_'},
            'backbone': {
                deps: ['underscore', 'jquery'],
                exports: 'Backbone'
            },
            'sio': {
                exports: 'io'
            }
        }
    });
    var updateModuleProgress = function(context, map, depMaps){
        console.log('loading: ' + map.name + ' at ' + map.url);
    };
    require.onResourceLoad = function(context, map, depMaps){
        updateModuleProgress(context, map, depMaps);
    };

    require(['domReady'], function(domReady, map){
        domReady(function(){
            updateModuleProgress = function(domReady, map){
                console.log('loading ' + map.name + ' at ' + map.url);
            };
        });
    });

    require(['jquery'],
        function($){
            require(['clientApplication'], function(app){
                d3Application.app = app;
                app.initialize();
            });
        }
    );
}).call(this);
