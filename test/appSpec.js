//loading in our app.js file
var fs = require('fs');
var myCode = fs.readFileSync('./app/app.js','utf-8'); // depends on the file encoding
eval(myCode);

//dependcies to help testing
var request = require('request');
var cheerio = require('cheerio');

//Dummy Data
var testIp = "63.118.144.98";
var testUrl= "http://en.wikipedia.org/w/index.php?limit=50&tagfilter=&title=Special%3AContributions&contribs=user&target="+testIp+"+&namespace=&tagfilter=&year=2014&month=-1";

// server is running correctly
describe("Set-up", function() {
  it("server is setup", function(done) {
    request("http://localhost:9001", function(error, response, body){
      expect(response.statusCode).toBe(200);
      done();
    });
  });
   it("ip list is populated",function(){
     expect(ipList.length).toBeGreaterThan(0);
   });
});

// Wikipedia is being scraped correctly
describe("scraping wikipedia",function(){
  var connected=false;
  it("connecting to wikipedia",function(done){
      konnect(testIp,function(){
        connected=true;
        expect(connected).toBeTruthy();
        done();
      });
  });
  it("parsing data",function(done){
    request(testUrl,function(err,res,body){
      parsePage(body,function(){
        if (mostRecent) {
          done();
        }
      });
    });
  });
});

//socket.io is pushing data
describe("push wikipedia scrape to front-end",function(){
  it("page is available",function(done){
    request("http://localhost:9001", function(error, response, body){
      $ = cheerio.load(body);
      expect($('body').text()).toContain("Edit-a-Thon");
      done();
    });
  });
  it("data is being pushed",function(){
    request("http://localhost:9001", function(error, response, body){
      $ = cheerio.load(body);
      expect($('body').find('.changed-page').length()).toBeGreaterThan(0);
      done();
    });
  });
});
