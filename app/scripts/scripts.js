"use strict";

function heightDetect() {
    $(".main-head").css("height", $(window).height()); //Для того, чтобы header занимал всю высоту экрана
};

function setEqualHeight(columns){
  var tallestcolumn = 0;

  columns.each(function(){
  var currentHeight = $(this).height();
    if(currentHeight > tallestcolumn){
      tallestcolumn = currentHeight;
    }
  });
  columns.height(tallestcolumn);
}

heightDetect();

$(document).ready(function() {
  setTimeout(function() {
      $('body').addClass('loaded');
  }, 3500);
  setEqualHeight($(".grid > .well"));
});

window.onload = function () {
    var progressLine = document.getElementById("progress-line"),
        body = document.body,
        html = document.documentElement,
        viewportHeight = window.innerHeight;

    var documentHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    var scrollTopValue = function () {
        return (window.pageYOffset !== undefined) ? window.pageYOffset : (documentHeight || document.body.parentNode || document.body).scrollTop;
    }

    window.addEventListener("scroll", function (){
        var scroll = scrollTopValue();
        var progress = (scroll / (documentHeight - viewportHeight)) * 100;
        progressLine.style.width = progress + "%";
    });

    window.addEventListener("resize", function () {
        documentHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    });
}
