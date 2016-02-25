var express= require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public')); //serving statics files like css, js, images

var port=process.env.PORT || 3000; //this is for heroku


var serverTime = require('./public/js/jlfunctions.js'); //importing my functions for time
//console.log('Time= ' + serverTime.myTime());

//---------------------------------
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '76.163.252.213',
  user     : 'AAAlidv_user',
  password : 'Chat2016',
  insecureAuth: true, 
  database : 'AAAlidv_chat'
});

connection.connect();

connection.query('SELECT * FROM user', function(err, rows, fields) {
  if (!err)
     console.log('Connected to external database'); //console.log('The solution is: ', rows);
  else
    console.log('Error while performing Query.',err);
});

// Define/initialize our global vars
var notes = [];
var isInitMsgs = false;
var socketCount = 0;



//-------------------------------


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	console.log('a user connected');
    socketCount++;// Socket has connected, increase socket count

    io.sockets.emit('users connected', socketCount);    // Let all sockets know how many are connected

	socket.on('chat message', function(msg){ //broadcasting msgs
		//notes.push(msg);

		msg[3]=serverTime.myTime(); //adding server time to msg	
		msg[4]=0; //message for all= 0 (private message)

	    io.emit('chat message', msg); //sending msg to index.html

	    console.log('idSender= '+ msg[0] + ' idReceiver=' + msg[1] + ' Msg='+ msg[2] + ' Time=' +msg[3]);
	    
	    var insertMsg='INSERT INTO message (idsender,idreceiver,msg,datetime,forall) VALUE(?)';

	    connection.query(insertMsg,msg,function(error){
		     if (error) {
	            console.log(error); //.message
	        } else {
	            console.log('Message inserted successfully');    
	        }

	    });

	});

/*
    // Check to see if initial query/notes are set
    if (! isInitMsgs) {
        // Initial app start, run db query
        connection.query('SELECT * FROM messages')
            .on('result', function(data){
                // Push results onto the notes array
                notes.push(data);
            }) //checar si lleva punto y coma
            .on('end', function(){
                // Only emit notes after query has been completed
                socket.emit('initial msgs', notes);
            }); //checar si lleva punto y coma
 
        isInitMsgs = true;
    } else {
        // Initial notes already exist, send out
        socket.emit('initial msgs', notes);
    }
*/




    socket.on('disconnect', function () {

        socketCount--; // Decrease the socket count on a disconnect	
        io.sockets.emit('users connected', socketCount);    // Let all sockets know how many are connected
        console.log('user disconnected');
    });

});



http.listen(port, function(){
  console.log('listening on *:3000');
});

connection.end(); //closing database connection