
/**
 * установки по умолчанию для ajax-запросов
 */
function ajaxSetup(loader_url){
  $.ajaxSetup({
    type: "POST",
    dataType: "text",
    complete: function(){$page_loader.remove();},// удаление анимации-загрузчика
    beforeSend: function (jqXHR) {
      jqXHR.setRequestHeader("Autor", "Alexandr Timofeev");
      $page_loader.css({ // вставка анимации-загрузчика перед отправкой "аякса" на сервак
        width: '100px',
        height: '100px',
        position: 'fixed',
        background: "url('/pokazaniya/res/"+loader_url+"') no-repeat",
        left: ($(window).width() / 2 - 50) + 'px',
        top: ($(window).height() / 2 - 50) + 'px'
      }).appendTo($('body'));
    },
    url: "/pokazaniya/php/response.php"
  });
}

	


