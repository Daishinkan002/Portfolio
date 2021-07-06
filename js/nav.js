document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems, {});
  })

$(document).ready(function(){
  $(window).scroll(function(){
    var scroll = $(window).scrollTop();
    if (scroll > 700) {
      $(".nav-wrapper").css("background" , "black");
    }

    else{
      $(".nav-wrapper").css("background" , "transparent", "transition", "background-color 200ms linear");  	
    }
  })
});