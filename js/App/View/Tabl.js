var AppPokazaniya = (function (app) {

  app.View.Table = function (element) {

    var that = this;

    this.element = element;

    this.value_field = {

      element: $("td:nth-child(4)"),//4-ый столбец "показания",

      addValue: function (dom_element) {
        var id = dom_element.parentNode.firstElementChild.textContent,// текстовое содержимое первого столбца таблицы (id) - далее как значение POST-параметра передается на сервер в файл response.php
          insertValue = prompt("Ввести показания", $(dom_element).text()); // окно ввода показаний с ранее введенным значением по умолчанию
        if (insertValue == null || insertValue == "" || insertValue == 0) return; // если нажать кнопку "отмена" или ввести пустое значение - произойдет выход из функции
        var scrollTop = $(dom_element).offset().top;// анимация появления таблицы
        $('html, body').animate({scrollTop: scrollTop}, 1000, 'swing');// прокрутка таблицы в начало документа
        $(dom_element).html("<div class = loader></div>"); // иначе в ячейку будет вставлен div с фоном картинки-загрузчика

        // и аяксом отправятся следующие данные на сервер в файл response.php:
        $.ajax({
          data: {insertValue: insertValue, firstId: id}, // POST['insertValue'] со значением, введенным в prompt-окно, и POST['firstid'] с текстовым содержимым(уникальным id) первого столбца
          success: function (content) { // при успешном запросе
            if (content) { // если ответ не пустой
              $(dom_element).html(content); // в ячейку "показания" вставляется ответ сервера(показания счетчика), затирая div с анимацией загрузчика
            }
          },
          error: function (xhr, str, errorType) {// при неуспешном запросе
            $dialog.dialog('open');// выводится диалоговое окно
          }
        });
      },

      setNewStyle: function (dom_element) {
        $(dom_element).css({backgroundColor: 'red'});// красный фон
      },

      setDefaultStyle: function(dom_element){
        $(dom_element).css({background: ''});// изначальный фон
      }
    };

    this.button_remove = {
      element: $("td:nth-child(6)"),
      removeString: function(dom_element){
        that.removeString(dom_element);
      }
    };

  };

  var table = app.View.Table;

  table.prototype = {
    constructor: table,

    addString: function (array_string) {
      var tr = document.createElement('tr'),
        td = [];
      for (var i = 0; i < 6; i++) {
        td[i] = document.createElement('td');
        td[i].textContent = array_string[i];
        tr.appendChild(td[i]);
      }
      this.element.appendChild(tr);

      tr.style.display = 'none';// ������� ������ ��� ������������ ������� ��������
      var $last_tr = $(tr).last();// ������-��� ����������� ������
      $last_tr.fadeIn(1000);// �������� ��������� ������
      var scrollTop = $last_tr.offset().top;// ���������� ������-��� ����������� ������
      $('html, body').animate({scrollTop: scrollTop}, 1000, 'swing');// ��������� �� ������
    },

    removeString: function(dom_element){
      var id = dom_element.parentNode.firstElementChild.textContent;// номер из 1ой ячейки
      var parent = dom_element.parentNode; // строка-родитель(tr)
      var $parent = $(dom_element.parentNode); // строка-родитель(tr)
      var really = confirm("Действительно удалить строку с id = " + id + "?");// диалоговое окно с запросом на подтверждение
      if (really) {// если нажата кнопка "да"
        $.ajax({//аякс в response.php
          data: {id: id},// передача POST["id"] - это уникальный номер из первой ячейки
          success: function (content) { // при удачном ответе
            //parent.parentNode.removeChild(parent);// происходит удаление строки с переданным id
            $parent.effect('explode', {mode: 'hide'}, 600, function () {
              parent.parentNode.removeChild(parent);// происходит удаление строки с переданным id
            });

            /*$parent.effect('bounce', 1000, function(){
             parent.parentNode.removeChild(parent);// происходит удаление строки с переданным id
             });*/
          },
          error: function (xhr, str, errorType) {// при ошибке
            $dialog.dialog('open');//вывод модального окна
          }
        });
      }
    }
  };

  return app;
}(AppPokazaniya || {}));
