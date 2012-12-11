define([
    'jquery',
    'underscore',
    'backbone',
    'sio',
    'hogan'
], function($, _, Backbone, io, hogan){
    return Backbone.View.extend({
        defaults :{
            connected : false
        },
        events : {
            'click .startSession' : "startSession",
            'click .pingServer' : "pingServer",
            'click .disconnectSession' : "disconnectSession"
        },
        itemRendererHTML : hogan.compile(
            '<div class="rowRenderer">' +
                '<div class="row">' +
                    '<div class="span2"><h3>{{ResponseType}}</h3></div>' +
                    '<div class="span4"><i class="icon-time"></i>  {{ResponseTime}}</div>' +
                '</div>' +
                '<div class="row">' +
                    '<div class="offset2 span12"><i class="icon-envelope"></i>  <em>{{Message}}</em></div>' +
                '</div>' +
            '</div>'),
        initialize: function(){
            _.bindAll(this);
            console.log('Application View initialized');
            $('.pingServer').attr("disabled", "disabled");
            $('.disconnectSession').attr("disabled", "disabled");
            $('.startSession').removeAttr("disabled");
        },
        startSession : function(){
            console.log('client session start request');
            this.socket = io.connect('//');
            this.initSocketListeners();
        },
        doConnect: function(){
            $(".clientOutput").append($(this.itemRendererHTML.render({ResponseType: "CONNECT",
                ResponseTime:new Date().getTime(),
                Message: "server connected"})));
            $('.startSession').attr("disabled", "disabled");
            $('.pingServer').removeAttr("disabled");
            $('.disconnectSession').removeAttr("disabled");
        },
        doDisconnect : function(e){
            $(".clientOutput").append($(this.itemRendererHTML.render({ResponseType: "DISCONNECT",
                ResponseTime:new Date().getTime(),
                Message: e})));
            $('.pingServer').attr("disabled", "disabled");
            $('.disconnectSession').attr("disabled", "disabled");
        },
        doResponse : function (e){
            $(".clientOutput").append($(this.itemRendererHTML.render(e)));
        },
        initSocketListeners : function (){
            this.socket.on('connect', this.doConnect);
            this.socket.on('serverResponse',this.doResponse);
            this.socket.on('disconnect', this.doDisconnect);
        },
        pingServer: function(){
            this.socket.emit('ping');
        },
        disconnectSession: function(){
            this.socket.emit('logout');
        }



    });
});