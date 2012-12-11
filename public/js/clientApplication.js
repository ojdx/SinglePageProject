define([
    'jquery',
    'underscore',
    'backbone',
    'ApplicationView'
], function($, _, Backbone, ApplicationView){
    var initialize = function(){
       new ApplicationView({el:$("body")});
    };
    return {
        initialize: initialize
    };
});