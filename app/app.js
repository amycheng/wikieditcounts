console.log("app running");

//dependences for the server
var http = require('http');
var fs = require('fs');
var request = require('request');
var io = require('socket.io');
var mime = require('mime');
var moment = require('moment');

//custom module with methods
var util = require('./util');

//configuration variables
var config = require('./config');

//app variables
var
ipList=util.getIP(config.ipBlocks),
mostRecent,
dateThresold=config.dateThresold;

/*
//grab ips to find contributions
for (var i = 0; i < config.ipBlocks.length; i++) {
  //build ip address
  var base=config.ipBlocks[i].ip;
  var last = config.ipBlocks[i].last;
  for (var j = 0; j < config.ipBlocks[i].blockSize; j++) {
    var lastHex=last+j;
    var ip = base+lastHex.toString();
    var data;
    ipList.push(ip);
  }
}
console.log("finished parsing ip blocks!");
*/

//our server
var server = http.createServer(function(req, response){
  var path = req.url;
  fs.readFile(__dirname+path,'utf8', function(error, data){
    if (error){
      console.log(error);
      response.writeHead(404);
      response.write("opps this doesn't exist - 404");
    }
    else{
      response.writeHead(200, {"Content-Type": mime.lookup(path)});
      response.write(data, "utf8");
      response.end();
    }
  });
});
server.listen(9001);
//sockets.io stufff
io = io.listen(server);
io.sockets.on('connection', function (socket){
  setInterval(function(){
    console.log("parsing wikipedia");
        //code for static web development
        // mostRecent={"title":"Test Page","timestamp":"10:00"};
        // io.sockets.emit('message', mostRecent);

        //production code
        for (var i = 0; i < ipList.length; i++) {
          var ip = ipList[i];
          util.connect(ip,function(wikiEntry){
            if (moment(wikiEntry.timestamp).isAfter(dateThresold)===true) {
              io.sockets.emit("message",wikiEntry);
              dateThresold=wikiEntry.timestamp;
            };
           });
        };
      }, 5000);
});

