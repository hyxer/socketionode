var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var util = require('util');
var SerialPort = require('serialport').SerialPort;
var xbee_api = require('xbee-api');

var C = xbee_api.constants;

var xbeeAPI = new xbee_api.XBeeAPI({
    api_mode: 1
});

var serialport = new SerialPort("/dev/ttyUSB0", {
    baudrate: 9600,
    parser: xbeeAPI.rawParser()
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('mode', function(msg){
    if(msg=='open')
    	{xbeeSend();
    	console.log('open door');}
	else
		{console.log('else');}
  });
  
});

function xbeeSend(){
 serialport.on("open", function () {
    var frame_obj = { 
        type: 0x00, 
        id: 0x01, 
        destination64: "0000000000000001",
        options: 0x00, 
        data: "1" 
    };  
    
    serialport.write(xbeeAPI.buildFrame(frame_obj));
    console.log('Sent to serial port.');
    serialport.close();
 });
}










http.listen(3000, function(){
  console.log('listening on *:3000');
});
