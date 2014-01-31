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
cache = [],
output={"entries":[]};

var scrape = function(){

  //production code
  for (var i = 0; i < ipList.length; i++) {
    var ip = ipList[i];
    util.connect(ip,function(wikiEntry){
      var data= wikiEntry;
        if ((wikiEntry.timestamp).isAfter(dateThresold)) {
          dateThresold=wikiEntry.timestamp;
          // cache.push(data);
          data.timestamp= moment(wikiEntry.timestamp).format('MMMM Do YYYY, h:mm:ss a');
          output.entries[output.entries.length]=data;
          console.log(data);
          // console.log(data);

          //send our data
          // io.sockets.emit("entry",data);
          // io.sockets.emit('pageCount',cache.length);
        };
    });
  };
};
//our server
var server = http.createServer(function(req, response){
  var path = req.url;
  var filePath = req.url;

  if(path=='/'||path=='/index.html'){
    filePath="/index.html";
  }
  if (path=='/api') {
    console.log("phoo");

    response.writeHead(200,{"Content-Type":'application/json','Access-Control-Allow-Origin' : '*'});
    if (output.length>0) {
      response.end(JSON.stringify(null));
    }else{
      response.end(JSON.stringify(output));

    };
  };
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
scrape();
setInterval(function(){
  console.log("scraping");
  scrape();
}, 5000);

//sockets.io stufff
// io = io.listen(server);
//uncomment this to tone down the debugging
// io.set('log level', 1);


// io.sockets.on('connection', function (socket){
//   console.log("sockets.io initialized");
//   // if data has been polled before, append this content
//   if (cache.length>0) {
//     console.log("downloading cache");
//     for (var i = 0; i < cache.length; i++) {
//       io.sockets.emit('entry', cache[i]);
//     };
//     io.sockets.emit('pageCount',cache.length);
//   };

//   scrape();
//   //polling Wikipedia site every 5 seconds
//   setInterval(function(){
//     console.log("ping");
//     scrape();
//   }, 5000);
// });

