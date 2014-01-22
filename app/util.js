/*Methods*/

// node dependencies for methods
var cheerio = require('cheerio');
var moment = require('moment');
var wikijs = require('wikijs');
var request = require('request');

module.exports={
  connect: function(ip,callback){
    // console.log('konnecting');
    request("http://en.wikipedia.org/w/index.php?limit=50&tagfilter=&title=Special%3AContributions&contribs=user&target="+ip+"+&namespace=&tagfilter=&year=2014&month=-1", function(err, resp, body) {
      if (err) {
        return;
      }
      if (body) {
        // parsePage(body,callback);
        if (typeof callback == "function"){
          // console.log("has callback");
          callback.apply();
        }
      }
    });
  },
  getIP: function(block){
    //block: a JSON object, that contains the starter IP address, the last two digits, and the size of the IP block
    var list = [];
    for (var i = 0; i < block.length; i++) {
      //build ip address
      var base=block[i].ip;
      var last = block[i].last;
      for (var j = 0; j < block[i].blockSize; j++) {
        var lastHex=last+j;
        var ip = base+lastHex.toString();
        var data;
        list.push(ip);
      }
    }
    console.log("finished parsing ip blocks!");
    return list;
  },
   getWiki: function(title,callback){
    //title is the title of the wikipedia entry
    wikijs.page(title, function(err, data){
      data.images(function(err, content){
        console.log(content);
        if (typeof callback == "function"){
          callback.apply();
        }
      });
    });
  },
  parse: function(data,callback){
    // data: the DOM we're navigating
    // selector: a specific element we're looking for

    $ = cheerio.load(data);
    $(selector).each(function(i) {
      var $_this = $(this);
        //parse the timestamp of edit and compare to our dateThresold
        var timestamp = moment($_this.find(dateSelector).text(),"HH:mm D MMMM YYYY");
        if (moment(timestamp).isAfter(dateThresold)) {
          console.log($_this.find(titleSelector).text());
          console.log(moment(timestamp).format('h:mm'));
          mostRecent={"title":$_this.find(titleSelector).text(),"timestamp":moment(timestamp).format('h:mm')};
          dateThresold = timestamp;
        };
        if (typeof callback == "function"){
          callback.apply();
        };
      });
  }
};
/*
// methods
var getWiki = function(title){
//title is the title of the wikipedia entry
  wikijs.page(title, function(err, data){
    data.images(function(err, content){
      console.log(content);
    });
  });
};

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
*/