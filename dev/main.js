(function($){

var minWidth= 480; //mobile in portrait
var pageTotal= 0;
var renderText = function(){
  console.log("making type responsive because why not?");
  $('.title-wrapper').flowtype({
    minimum : minWidth,
    fontRatio: 20,
    lineRatio: 2
  });
  $('.copy-wrapper').flowtype({
    minimum : minWidth,
    fontRatio: 28
  });
  $('.timestamp,.page-count,.stream').flowtype({
    minimum: 650,
    maximum:  730
  });
};

  //socket.io stuff
  var socket = io.connect('http://localhost');
  var $list = $('#js-changes');


  socket.on('entry', function (data) {
    console.log(data);
    if ($list.find('li').length>0) {
      $list.find('li:first').before('<li><a href="http://en.wikipedia.org/wiki/'+data.title.replace(/ /g,"_")+'" target="_blank">'+data.title+'</a></li>');
    }else{
      $list.append('<li><a href="http://en.wikipedia.org/wiki/'+data.title.replace(/ /g,"_")+'" target="_blank">'+data.title+'</a></li>');
    }
    console.log($('#js-timestamp').text());
    $('#js-timestamp').text(data.timestamp);
    pageTotal++;
    $('#js-count').text(pageTotal);
  });

$( document ).ready(function() {
  console.log('running scripts');
  renderText();

});
// if there are 12 list items, removes the last one before appending the first one
// append most recent timestamp
// append page count
}(jQuery));

