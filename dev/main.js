(function($){

  var socket = io.connect('http://localhost');
  var $list = $('#changes');
  var $contentSidebar = $('#wikicontent');

  socket.on('entry', function (data) {
    if ($list.find('li').length>0) {
      $list.find('li:first').before('<li>'+data.title+'</li>');
    }else{
      $list.append('<li>'+data.title+'</li>');
    }
  });
  socket.on('wiki_content', function (data){
    $contentSidebar.find('h2').text(data.title);
    $contentSidebar.find('img').attr('src',data.image);
  });
  // $( document ).ready(function() {
  //   console.log("running main.js");

  // });
}(jQuery));

