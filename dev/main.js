(function($){

  var renderText = function(){
    var minWidth= 480; //mobile in portrait
    var pageTotal= 0;
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

  socket.on('pageCount', function (data) {
    $('#js-count').text(data);
  });

  socket.on('entry', function (data) {
    console.log(data);
    var entry =
    $('<li><a href="http://en.wikipedia.org/wiki/'+data.title.replace(/ /g,"_")+'" target="_blank">'+data.title+'</a></li>').hide();

    if ($list.find('li').length>0) {
      $list.find('li:first').before(entry.fadeIn(1000));
    }else{
      $list.append(entry.fadeIn(1000));
    }
    console.log($('#js-timestamp').text());
    $('#js-timestamp').text(data.timestamp);
  });

  $( document ).ready(function() {
    console.log('running scripts');
    renderText();
  });
}(jQuery));

