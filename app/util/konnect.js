module.exports = konnect;

var request = require('request');
var parsePage = require('./util/parsePage');

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