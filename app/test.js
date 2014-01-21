var bot = require('nodemw');
var wikiClient = new bot({
      server: 'en.wikipedia.org',  // host name of MediaWiki-powered site
      path: '/w',                  // path to api.php script
      debug: false                // is more verbose when set to true
    });



// wikiClient.getImagesFromArticle('Lynching of Laura and L.D. Nelson', function(data) {
//   console.log(data[1].title);
//   wikiClient.getImageInfo(data[0].title,function(res){
//     console.log(res.url);
//   });
// });

  // console.log(  wikiClient.getTemplateParamFromXml(tmplXml, paramName));

  // var wikipedia = require("wikipedia-js");
  // var cheerio = require("cheerio");
  // var query = "Lynching of Laura and L.D. Nelson";
  //   // if you want to retrieve a full article set summaryOnly to false.
  //   // Full article retrieval and parsing is still beta
  //   var options = {query: query, format: "html", summaryOnly: true};
  //   wikipedia.searchArticle(options, function(err, res){
  //     if(err){
  //       console.log(err);
  //       return;
  //     }else{
  //     // $ = cheerio.load(res);

  //       console.log(res);
  //     }

  //   });

var Wiki = require("wikijs");
Wiki.page("Lynching of Laura and L.D. Nelson", function(err, data){
    // page = WikiPage object for 'Batman' article
    data.images(function(err, content){
      console.log(content);
  });
     data.summary(function(err, content){
      console.log(content);
  });
});
