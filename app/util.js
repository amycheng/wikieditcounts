/*Methods*/

// node dependencies for methods
var cheerio = require('cheerio');
var moment = require('moment');
var wikijs = require('wikijs');
var request = require('request');
var config = require('./config');

module.exports={
  //methods
  connect: function(ip,callback){
    _this = this;
    //method for connecting to wikipedia
    request("http://en.wikipedia.org/w/index.php?limit=50&tagfilter=&title=Special%3AContributions&contribs=user&target="+ip+"+&namespace=&tagfilter=&year=2014&month=-1", function(err, resp, body) {
      if (err) {
        return;
      }
      if (body) {
        _this.parse(body,callback);
      }
    });
  },
  getIP: function(block){
    //method for creating an array out of an IP block
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
  /*
  //not using this  method
  getWiki: function(title,callback){
    //method for grabbing Wikipedia content
    //title is the title of the wikipedia entry
    wikijs.page(title, function(err, data){
      data.html(function(err, content){
        $ = cheerio.load(content);
        var imgPath= $('.infobox').find('tr:nth-child(2)').find('td').find('a').find('img').attr('src');
        if (typeof callback == "function"){
          callback.call(undefined,imgPath);
        }
        return;
    });
    });
  },
  */
  parse: function(data,callback){
    // grab link
    // method for grabbing the most recently edited, this is an asynchronous method
    // data: the DOM we're navigating, we're getting this from connect()

    //DOM selectors for the wikipedia page
    var
    selector= "#mw-content-text ul li",
    titleSelector= ".mw-contributions-title",
    dateSelector= ".mw-changeslist-date";

    $ = cheerio.load(data);

    // parsing the DOM backwards because the list of changes is in descending order and we want to append in ascending order
    for (var i = $(selector).length - 1; i >= 0; i--) {
      var $_this = $(selector).eq(i);
      var timestamp = moment($_this.find(dateSelector).text(),"HH:mm D MMMM YYYY");
      var entry = {"title":$_this.find(titleSelector).text(),"timestamp":timestamp};
      if (typeof callback == "function"){
       callback.call(undefined,entry);
     };
    };
  }
};
