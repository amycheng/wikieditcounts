(function($){
 var socket = io.connect('http://localhost');
 var $list = $('#changes');
 socket.on('message', function (data) {
  if ($list.find('li').length>0) {
    $list.find('li:first').before('<li>'+data.title+'</li>');
  }else{
   $list.append('<li>'+data.title+'</li>');

 };
});
  // $( document ).ready(function() {
  //   console.log("running main.js");

  // });
}(jQuery));