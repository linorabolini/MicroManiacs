define(function(require) {
    var io = require('io');
    var input = require('input');
    var config = require('config');
    var debug = require('debug');
    var MobileController = require('mobile');

    function Server() {
        this.socket = null;
    };

    Server.prototype.setup = function() {
        if(!io) return;
        var socket = io(config.server.host);
        socket.on('connection', function() {
            socket.emit('register as server', config.server.name);
            socket.on('registered as server', function() {
                socket.on('client connection', function (source) {
                    debug('client ' + source.id + ' connected');
                    input.addSource(new MobileController(source));
                });
                socket.on('message', function (msg) {
                    var source = input.getSource(msg.id);
                    debug('message from ' + msg.id);
                    input.getSource(msg.id).emit(msg);
                });
            });
        });
        this.socket = socket;
    }
    
    return new Server();
});