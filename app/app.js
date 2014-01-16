console.log("app running");

//Node.js Dependences
var http = require('http');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment');
var io = require('socket.io');
var mime = require('mime');

//configuration variables
var config = require('./config');

var
ipList=[],
selector = "#mw-content-text ul li",
titleSelector = ".mw-contributions-title",
dateSelector = ".mw-changeslist-date",
mostRecent,
dateThresold = "'2010-10-20'"; //test most recent date

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

//our server
var server = http.createServer(function(request, response){
  var path = request.url;
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
        /*code for static web development*/
        // mostRecent={"title":"Test Page","timestamp":"10:00"};
        // io.sockets.emit('message', mostRecent);

        /*production code*/
        for (var i = 0; i < ipList.length; i++) {
          var ip = ipList[i];
          konnect(ip,function(){
            console.log('phoo');
            console.log(mostRecent);
            io.sockets.emit('message', mostRecent);
          });
        };
    }, 5000);
});

//our methods to connect and parse stuff
var konnect = function(ip,callback){
  // console.log('konnecting');
  request("http://en.wikipedia.org/w/index.php?limit=50&tagfilter=&title=Special%3AContributions&contribs=user&target="+ip+"+&namespace=&tagfilter=&year=2014&month=-1", function(err, resp, body) {
    if (err) {
      return;
    }
    if (body) {
      parsePage(body,callback);
      // if (typeof callback == "function"){
      //   console.log("has callback");
      //   callback.apply();
      // }
    }
  });
};

var parsePage = function(data,callback){
  $ = cheerio.load(data);
  $(selector).each(function(i) {
    var $_this = $(this);
      //parse the timestamp of edit
      var timestamp = moment($_this.find(dateSelector).text(),"HH:mm D MMMM YYYY");
      if (moment(timestamp).isAfter(dateThresold)) {
        console.log($_this.find(titleSelector).text());
        console.log(moment(timestamp).format('h:mm'));
        mostRecent={"title":$_this.find(titleSelector).text(),"timestamp":moment(timestamp).format('h:mm')};
        dateThresold = timestamp;
        if (typeof callback == "function"){
          callback.apply();
        };
      };
      // console.log(timestamp);
    });
};


