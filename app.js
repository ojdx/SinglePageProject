
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , io =   require('socket.io')
  , connect = require('connect')
  , cookie = require('express/node_modules/cookie');
var Session = require('connect').middleware.session.Session;
var app = express();
var MemoryStore = express.session.MemoryStore;
var sessionStore = new MemoryStore();

app.configure(setup);
function setup() {
    app.set('port', 3000 || process.env.PORT);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('Moonage Daydream'));
    app.use(express.session({cookie: {httpOnly: "true"},
                             store: sessionStore,
                             secret: 'Moonage Daydream'
                            }));
    app.use(app.router);
    app.use(require('less-middleware')({ src: __dirname + '/public' }));
    app.use(express.static(path.join(__dirname, 'public')));
}

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res){
    if(!req.session.myval)
        req.session.myval = Math.floor(Math.random()*5000);
    console.log('myval = ' + req.session.myval);
    res.render('index', {title:'Socket Session Demo'});
});

var httpServer = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var sio = io.listen(httpServer);

sio.set('authorization', function (data, accept) {
    console.log('socket authorization function ');
    if (data.headers.cookie) {
        data.cookie = connect.utils.parseSignedCookies(cookie.parse(decodeURIComponent(data.headers.cookie)), 'Moonage Daydream');
        data.sessionID = data.cookie['connect.sid'];
        data.sessionStore = sessionStore;
        sessionStore.get(data.sessionID, function (err, session){
            if(session){
                req = {sessionStore: sessionStore, sessionID: data.sessionID};
                session = new express.session.Session(req, session);
            }
            if(err || !session){
               return accept(err, false);
            }else{
                data.session = new Session(data, session);
                return accept(null, true);
            }
        })
    } else {
        accept('No cookie transmitted.', false);
    }
});
sio.sockets.on('connection', function (socket) {
    var hs = socket.handshake;
    if(!hs.session.sessval){
        hs.session.sessval =  Math.floor(Math.random()*5000);
        hs.session.touch().save();
    }
    socket.on('ping', function(){
        hs.session.reload( function () {
            hs.session.touch().save();
            socket.emit('serverResponse', {ResponseType: "PING",
                                           ResponseTime:new Date().getTime(),
                                           Message: "Ping Response from server MemoryStore value is currently : " + hs.session['myval'] + "\n" +
                                                    "the value set on the socket connect is : " + hs.session['sessval']});
        });
    });
    socket.on('logout', function(){
        console.log('received logout ');
        hs.session.destroy();
        socket.disconnect();
    });
});