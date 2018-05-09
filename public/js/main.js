var app={
	serverUrl:'http://chat2016.herokuapp.com/',

	listenSocket:function(){
	     var socket = io.connect(this.serverUrl); //creating socket connection
	     var usericon='<span class="glyphicon glyphicon-user blue"></span> ';
	     var currentUser='nobody';//current user nickname 
 		 var currentUserId=10;	//initial default value     
 		 var userImg='<img src="img/user.gif" class="img-responsive img-circle center-block" alt="user image">';


		$('#idsender').prop('disabled', false);//enabling input sender login
		$('#m').prop('disabled',true);//disabling btn send	
		$('#btnLogin').prop('disabled',false);//enabling btnLogin
		$('#btnLogout').prop('disabled',true);//disabling btnLogout
			//$('#idreceiver').prop('disabled',true);//disabling input receiver
   
    socket.on('users connected', function(data){
        $('#usersConnected').html(data); //displaying how many conncetions are.
    });    

		$('#btnLogin').on('click',function(){
				currentUserId=$('#idsender').val();//id current logged user
				$('#idsender').prop('disabled', true); //disaabling input idsender
				$('#m').prop('disabled', false); //enabling input idsender
				socket.emit('user logged',currentUserId); //enviando ID de usurio logead	
				toReceivers(currentUserId);//adding posible receiver to html select, calling a function	
				$('#btnLogin').prop('disabled',true);//disabling btnLogin
				$('#btnLogout').prop('disabled',false);//enabling btnLogout
		});

		socket.on('user logged',function(myInfo){//receives current user data, this is an array		
			currentUser=myInfo[0].nickname;
			//currentUserId=myInfo[0].iduser; //iduser logged
			$('#m').prop('disabled',false);//enabling btn send
			$('#m').focus();
			//alert(currentUser);	
		});

    // Loading stored messages from this current chat user
	    socket.on('initial msgs', function(data){
	    	//alert('Cargando datos...'+data.length);
	    	//alert(data[0][12].msg); //mensaje del registro numero 13     style="text-align: right;"
	        for (var i = 0; i < data.length; i++){

	        	if(data[i].idsender==currentUserId){ //right allingment for my messages
		 			$('#messages').append('<div class="bubble2 me"><div class="row"><div class="col-xs-3 col-sm-2">'+userImg +'</div><div class="col-xs-9 col-sm-10">'+usericon +' '+data[i].nickname+': </br>'+data[i].msg + '    ' + '<h6><small class="text-right">  '+data[i].datetime + '</small></h6></div></div></div>');
	        	}else{
		 			$('#messages').append('<div class="bubble you"><div class="row"><div class="col-xs-9 col-sm-10">'+usericon+' '+data[i].nickname+': </br>'+data[i].msg + '    ' + '<h6><small>  '+data[i].datetime + '</small></h6></div><div class="col-xs-3 col-sm-2">'+userImg+'</div></div></div>');	
		 			}
	        }
	 	    $('#txtChat').scrollTop($('#txtChat')[0].scrollHeight);//moving to the last msg  
		    $('#m').focus(); //set focus to input 	         
	    }); 


		//Form Submitt  Event	
	      $('form').submit(function(){ //sending data 
	      	var arraymsg=[$('#idsender').val(),$('#idreceiver').val(),$('#m').val(),currentUser];
	      	if($('#m').val()==''){
	      		$('#m').focus(); 
	      		return false;
	      	}else{
	      		socket.emit('chat message', arraymsg); //envindo mensaje a node
	      		//showMsg(arraymsg);
	      	}
	      	$('#m').val('');
	      	$('#m').focus();
	        //socket.emit('chat message', $('#m').val()); //emitiendo mensaje a node
	        return false;
	      });
	     //---------------------------------------------------
	    
	      socket.on('chat message', function(msg2){ //recive informacion ingresda en chat
	      	//alert('current id '+currentUserId);
	      	var timenow=getDateTime(); //getting time from personal function in jlfunctions.js
 			
 			if(msg2[0]===currentUserId){//right allingment for my messages	
		 		$('#messages').append('<div class="bubble2 me"><div class="row"><div class="col-xs-3 col-sm-2">'+userImg +'</div><div class="col-xs-9 col-sm-10">'+usericon +' '+msg2[3]+': </br>'+msg2[2] + '    ' + '<h6><small class="text-right">  '+msg2[4]+ '</small></h6></div></div></div>');
 			}else{		 		
		 		$('#messages').append('<div class="bubble you"><div class="row"><div class="col-xs-9 col-sm-10">'+usericon+' '+msg2[3]+': </br>'+msg2[2] + '    ' + '<h6><small>  '+msg2[4] + '</small></h6></div><div class="col-xs-3 col-sm-2">'+userImg+'</div></div></div>');	
			}

	        $('#txtChat').scrollTop($('#txtChat')[0].scrollHeight);//moving to the last msg
	      	$('#m').val('');
	        $('#m').focus(); //set focus to input
	      });  

	      function toReceivers(takenId){
	      	for(var v=1;v<5;v++){
	      		if(takenId!=v){
	      			$('#idreceiver').append($("<option></option>").val(v).html("user"+v));
	      		}
	      	}	
	      }

	      $('#btnLogout').on('click',function(){
	      		location.reload(true);
	      });		

	}, //close listenSocket


    initialize: function(){ //inicializando el objeto
    	var self=this;
    	self.listenSocket();
        }
};

app.initialize();