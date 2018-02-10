var express = require('express');
var session = require('express-session');
var path = require('path');
var bodyparser = require('body-parser');
session.count = 0

var app= express();

app.use(session({secret: 'coding'}));
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'./static')));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(req,res){
    console.log('index route - server.js');
    res.render('index');
})
var server = app.listen(8000,function(){
    console.log('EPIC BUTTON listening on port 8000');
});
var io = require('socket.io').listen(server);
io.sockets.on('connection', function(socket){
    console.log('Client/socket is connected');
    console.log('Client/socket id is: ', socket.id);
    socket.on('click', function(data){
        console.log('click server side', data);
        session.count = session.count + 1
        console.log('session.count', session.count);
        result = {
            count:session.count
        }
        io.emit('server_response', result);
    });
    socket.on('reset', function(data){
        session.count = 0;
        result= {
            count:session.count
        }
        io.emit('server_response', result);
    });
});