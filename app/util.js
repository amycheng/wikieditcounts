/*Methods*/

// node dependencies for methods
var cheerio = require('cheerio');
var moment = require('moment');
var wikijs = requires("wikijs");

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
