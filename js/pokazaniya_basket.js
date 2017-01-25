
$(function () {
  $table = $('#table');
  $lastTd = $("td:nth-child(6)");// 6-ой столбец таблицы - кнопка удаления
  $page_loader = $("<div id = 'page_loader'></div>");
  ajaxSetup("cherep_loader.gif");
  execute();
});