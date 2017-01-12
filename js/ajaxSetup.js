// 2
/**
 * установки по умолчанию для ajax-запросов
 */
function ajaxSetup(){
  $.ajaxSetup({
    type: "POST",
    dataType: "text",
    complete: function(){$page_loader.remove();},
    beforeSend: function (jqXHR) {
      jqXHR.setRequestHeader("Autor", "Alexandr Timofeev");
      $page_loader.css({
        width: '100px',
        height: '100px',
        position: 'fixed',
        backgroundImage: "url('/pokazaniya/res/pageLoader.gif')",
        left: ($(window).width() / 2 - 50) + 'px',
        top: ($(window).height() / 2 - 50) + 'px'
      }).appendTo($('body'));
    },
    url: "http://kupislona.esy.es/pokazaniya/js/response.php"
  });
}

	


