function marcatiempo(){
var now = new Date();
//var strDateTime = [[AddZero(now.getDate()), AddZero(now.getMonth() + 1), now.getFullYear()].join("/"), [AddZero(now.getHours()), AddZero(now.getMinutes())].join(":"), now.getHours() >= 12 ? "PM" : "AM"].join(" ");

return now.format("dd/MM/yyyy hh:mm TT");;
}

//Pad given value to the left with "0"
function AddZero(num) {
    return (num >= 0 && num < 10) ? "0" + num : num + "";
}

 function getDateTime() {
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length == 1) {
        var month = '0'+month;
    }
    if(day.toString().length == 1) {
        var day = '0'+day;
    }   
    if(hour.toString().length == 1) {
        var hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
        var minute = '0'+minute;
    }
    if(second.toString().length == 1) {
        var second = '0'+second;
    }   
    var dateTime = year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;   
     return dateTime;
}

module.exports={ //this module will be used in index.js
		myTime:function(){
		    var now     = new Date(); 
		    var year    = now.getFullYear();
		    var month   = now.getMonth()+1; 
		    var day     = now.getDate();
		    var hour    = now.getHours();
		    var minute  = now.getMinutes();
		    var second  = now.getSeconds(); 
		    if(month.toString().length == 1) {
		        var month = '0'+month;
		    }
		    if(day.toString().length == 1) {
		        var day = '0'+day;
		    }   
		    if(hour.toString().length == 1) {
		        var hour = '0'+hour;
		    }
		    if(minute.toString().length == 1) {
		        var minute = '0'+minute;
		    }
		    if(second.toString().length == 1) {
		        var second = '0'+second;
		    }   
		    var dateTime = year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;   
		     return dateTime;
		}
}