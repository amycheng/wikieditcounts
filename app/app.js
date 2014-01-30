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
dateThresold=moment(config.dateThresold,"HH:mm D MMMM YYYY"),
cache = [];

//our server
var server = http.createServer(function(req, response){
  var path = req.url;
  var filePath = req.url;

  if(path=='/'||path=='/index.html'){
    filePath="/index.html";
  }
  fs.readFile(__dirname+filePath,'utf8', function(error, data){
    if (error){
      response.writeHead(404);
      response.write("opps this doesn't exist - 404");
      return;
    }else{
      response.writeHead(200, {"Content-Type": mime.lookup(filePath)});
      response.write(data, "utf8");
      response.end();
    }
  });
});
server.listen(9001);
//sockets.io stufff
io = io.listen(server);
// io.set('log level', 1);
var scrape = function(){

        //production code
        for (var i = 0; i < ipList.length; i++) {
          var ip = ipList[i];
          util.connect(ip,function(wikiEntry){
            var data= wikiEntry;
              if ((wikiEntry.timestamp).isAfter(dateThresold)) {
                dateThresold=wikiEntry.timestamp;
                cache.push(data);
                data.timestamp= moment(wikiEntry.timestamp).format('MMMM Do YYYY, h:mm:ss a');
                console.log(data);

                io.sockets.emit("entry",data);
                io.sockets.emit('pageCount',cache.length);
              };
          });
};

};

io.sockets.on('connection', function (socket){
  console.log("sockets.io initialized");
  if (cache.length>0) {
    console.log("downloading cache");
    for (var i = 0; i < cache.length; i++) {
     io.sockets.emit('entry', cache[i]);
   };
   io.sockets.emit('pageCount',cache.length);
 };
 scrape();

 setInterval(function(){
  console.log("ping");
  scrape();
}, 5000);
});

