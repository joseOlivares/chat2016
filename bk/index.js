var express= require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public')); //serving statics files like css, js, images

var port=process.env.PORT || 3000; //this is for heroku


var serverTime = require('./public/js/jlfunctions.js'); //importing my functions for time


//---------------------------------
var mysql = require('mysql');


var pool= mysql.createPool({
  host     : '76.163.252.213',
  user     : 'AAAlidv_user',
  password : 'Chat2016',
  insecureAuth: true, 
  database : 'AAAlidv_chat'
});


// Define/initialize our global vars
var dataRows= [];
var isInitMsgs = false;
var socketCount = 0;
var userInfo=[];
//-------------------------------


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

	console.log('an user connected');
    socketCount++;// Socket has connected, increase socket count

    io.sockets.emit('users connected', socketCount);    // Let all sockets know how many are connected

	socket.on('chat message', function(msg){ //broadcasting msgs
		//notes.push(msg);
		msg[3]=serverTime.myTime(); //adding server time to msg	
		msg[4]=0; //message for all= 0 (private message)

	    io.emit('chat message', msg); //sending msg to index.html  

	    console.log('idSender= '+ msg[0] + ' idReceiver=' + msg[1] + ' Msg='+ msg[2] + ' Time=' +msg[3]);
	    
	    var insertMsg='INSERT INTO message (idsender,idreceiver,msg,datetime,forall) VALUES(?)';


		pool.getConnection(function(err, connection) { 
		  // Use the connection
		  connection.query( insertMsg,[msg],function(err, rows) {
		  		if(err){
		  			console.log(err);
		  			return;
		  		}else{
		  			console.log('Msg inserted on database!');
		  		}
		    // release connection
		    connection.release();
		    // Don't use the connection here, it has been returned to the pool.
		  });
		});

	});//end socket.on 'chat message'
 

	socket.on('user logged',function(idCurrUser){ //loading info from logged user
		//userInfo=userx;
		var selectUser='SELECT * FROM user WHERE iduser=?';
 
		pool.getConnection(function(err, connection) { 

		  // Use the connection
		  connection.query(selectUser,[idCurrUser],function(err,rows) {
		  		if(err){
		  			console.log(err);
		  			return;
		  		}else{
		  			userInfo.push(rows); //user information
		  			loadData(idCurrUser);
		  			socket.emit('user logged',rows);
		  			//console.log(rows);
		  		}
		    // release connection
		    connection.release();
		    // Don't use the connection here, it has been returned to the pool.
		  });
		});
	});


	function loadData(myUser){
	if(!isInitMsgs){ //searching stored messages
		//var selectMsgs='SELECT * FROM message WHERE idSender=? or idreceiver=? ORDER BY datetime';
		var selectMsgs='SELECT message.idmsg, message.idsender, user.nickname, message.idreceiver,user.email, message.msg,'+
		' message.datetime FROM message INNER JOIN user ON (message.idsender = user.iduser)'+
		' WHERE message.idSender=? or message.idreceiver=? ORDER BY datetime';	

		//HACER UN EMIT CON EL NICK DEU USUARIO LOGUEADO PARA PROCESAR LA INFO
		//userInfo[0].iduser; //this param will be send from index.html when user starts session on chat
		//console.log('idUsuario Actual Logeado: '+myUser)
		pool.getConnection(function(err, connection) { 
		  // Use the connection
		  connection.query(selectMsgs,[myUser,myUser],function(err, rows) {
		  		if(err){
		  			console.log(err);
		  			return;
		  		}else{
		  			dataRows.push(rows); //copying data from rows to array dataRows
		  			socket.emit('initial msgs',rows); //sending msgs to index.html for first load
		  			isInitMsgs=true;
		  			console.log('Msg loaded from database!');
		  			//console.log(rows);
		  		}
		    // release connection
		    connection.release();
		    // Don't use the connection here, it has been returned to the pool.
		  });
		});
	}else{
		socket.emit('initial msgs',dataRows); //sending msgs to index.html 
		isInitMsgs=false;
	}
	//-----------------------------------END of bloque IF
}//end function loadData;






    socket.on('disconnect', function () {

        socketCount--; // Decrease the socket count on a disconnect	
        io.sockets.emit('users connected', socketCount);    // Let all sockets know how many are connected
        console.log('user disconnected');
    });

});




http.listen(port, function(){
  console.log('listening on *:'+port);
});



