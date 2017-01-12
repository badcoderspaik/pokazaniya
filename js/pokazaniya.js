
$(function () {
  var table = document.getElementById("table"), // таблица
    select = document.getElementById("select"),// список выбора "Добавить ТП"
    statistic = document.getElementById("statistic"),// список выбора "Статистика по номеру ТП"
    set_values = document.getElementById('set_values'), // список выбора "Просчитать и внести показания"
    valuesTd = $("td:nth-child(4)"),// 4-ый столбец "показания"
    statistic_count = document.getElementById("statistic_count"),// список выбора "Статистика по номеру счетчика"
    $menu_button = $('#menu-button');// меню в правом верхнем углу, отвечающее за показ-скрытие формы со списками
  $dialog = $('#dialog');// диалоговое окно - выводится при неудачном ajax-запросе в функции error. Это стандартный компонент jQuery UI - dialog
  $page_loader = $("<div id = 'page_loader'></div>");
  $table = $('#table');// таблица;
  lastTd = $("td:nth-child(6)");// 6-ой столбец таблицы - кнопка удаления
  body = document.body;// тело оно и в Африке тело
  loader = $("<div class=loader2></div>");// полоса-загрузчик в функции showStatistic
  $form = $('#accordion');// форма со списками
  form = document.getElementById("accordion");// форма со списками

  dialog();
  ajaxSetup();

  $menu_button.bind({
    click: function () {
      $form.toggle();
    },

    touchstart: function () {
      $(this).css({opacity: 1});
    },

    touchend: function () {
      $(this).css({opacity: 0.2});
    }
  });

  /*
   * клик на 6-ой ячейке(кнопке удаления)
   */
  lastTd.live('touchstart', function () { // для сенсорного экрана при касании
    $(this).css({backgroundColor: 'violet'});// фиолетовый фон
  }).live('touchend', function () { // для сенсорного экрана при поднятии пальца
    $(this).css({background: ''}); // изначальный фон
  });//.live('mouseover', function () { // для ПК - мышь над элементом
//    $(this).css({cursor: 'pointer', outline: '3px solid violet'}); // рамка фиолетового цвета в 3px + cursor pointer
//  }).live('mouseout', function () { // при mouseoute
//    $(this).css({outline: 'none'});// изначальные стили
//  });

  /**
   * клик на столбце (ячейке) "показания"
   * открывает диалоговое окно,
   * в которое предлагается ввести показания счетчика
   * далее введенные показания вместе с текстовым значением (номером) из первой ячейки, которое необходимо как условие дла where в опера  * ции update
   * в качестве post-параметров отправляются на сервер файлу response.php,
   * где вставляются в БД
   * затем эти вставленные показания извлекаются из БД и
   * возвращаются обратно,
   * и вставляются в ячейку "показания"
   */
  valuesTd.live("click", function () {
    var id = this.parentNode.firstElementChild.textContent,// текстовое содержимое первого столбца таблицы (id) - далее как значение POST-параметра передается на сервер в файл response.php
      that = $(this), // псевдоним this
      insertValue = prompt("Ввести показания", that.text()); // окно ввода показаний с ранее введенным значением по умолчанию
    if (insertValue == null || insertValue == "") return; // если нажать кнопку "отмена" или ввести пустое значение - произойдет выход из функции
    var scrollTop = that.offset().top;// анимация появления таблицы
    $('html, body').animate({scrollTop: scrollTop}, 1000, 'swing');// прокрутка таблицы в начало документа
    that.html("<div class = loader></div>"); // иначе в ячейку будет вставлен div с фоном картинки-загрузчика

    // и аяксом отправятся следующие данные на сервер в файл response.php:
    $.ajax({
      data: {insertValue: insertValue, firstId: id}, // POST['insertValue'] со значением, введенным в prompt-окно, и POST['firstid'] с текстовым содержимым(уникальным id) первого столбца
      success: function (content) { // при успешном запросе
        if (content) { // если ответ не пустой
          that.html(content); // в ячейку "показания" вставляется ответ сервера(показания счетчика), затирая div с анимацией загрузчика
        }
      },
      error: function (xhr, str, errorType) {// при неуспешном запросе
        $dialog.dialog('open');// выводится диалоговое окно
      }
    });
  });

  /**
   * клик на ячейке "показания"(4й столбец)
   */
  valuesTd.live("touchstart", function () {// палец опущен
    $(this).css({backgroundColor: 'red'});// красный фон
  }).live("touchend", function () {// палец поднят
    $(this).css({background: ''});// изначальный фон
  });//.live("mouseover", function () { // мышь над ячейкой
//    $(this).css({cursor: 'pointer', outline: '3px solid red'});// красная рамка в 3px + cursor pointer
//  }).live('mouseout', function () {
//    $(this).css({outline: 'none'});// none
//  });

  /**
   * клик на кнопке удаления(последняя ячейка)
   * отправляет на сервер файлу response.php
   * post-запрос с номером,
   * взятым из первой ячейки строки, содержащей
   * эту кнопку удаления(последняя ячейка);
   * response.php в базе ищет запись с id
   * с этим номером и удаляет ее,
   * и, если эта операция проходит удачно,
   * происходит удаление строки из html-таблицы
   */
  lastTd.live("click", function () {
    var id = this.parentNode.firstElementChild.textContent;// номер из 1ой ячейки
    var parent = this.parentNode; // строка-родитель(tr)
    var $parent = $(this.parentNode);
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
          $dialog.dialog('open');//вывод диалогового окна
        }
      });
    }
  });

  /**
   * выбор в списке "добавить ТП"
   */
  select.addEventListener("change", function () {
    var checked = this.selectedIndex,// индекс выбранного элемента списка
      that = this; // псевдоним this'a
    switch (checked) { // в зависимости от выбранного пункта списка происходит вызов функции send с разными параметрами
      case(1):
        send([309, 100964, '', '']);
        send([309, 160000, '', '']);
        break;
      case(2):
        send([310, 215110, '', '']);
        send([310, 995258, '', '']);
        send([310, "019250", '', '']);
        send([310, 114489, '', '']);
        break;
      case(3):
        send([311, 215933, '', '']);
        send([311, 516465, '', '']);
        break;
      case(4):
        send([312, 820943, '', '']);
        send([312, 835057, '', '']);
        break;
      case(5):
        send([313, 20297549, '', '']);
        break;
      case(6):
        send([314, 20309187, '', '']);
        break;
    }
    that.options[0].selected = true; // програмная установка первого пункта списка в активное состояние
  }, false);




  //выбор пункта в списке "Статистика по номеру счетчика"
  statistic_count.addEventListener("change", function () {
    showStatistic(this, "statisticCount");
  }, false);

  //выбор пункта в списке "Статистика по номеру ТП"
  statistic.addEventListener("change", function () {
    showStatistic(this, "statistic");
  }, false);

  /**
   * вставляет в базу запись с ячейками, содержащими
   * номер ТП, номером счетчика, показания(пустая)
   * и дату(пустая). Затем эта запись извлекается из БД
   * и добавляется как строка к таблице
   * @function send
   * @param{array} arrayTr - массив чисел или строк для вставки в БД
   */
  function send(arrayTr) {
    // POST['selected'] - значение выбранного пункта списка - 309, 310, 311 и т.д. - номера ТП
    // POST['count'] - второй элемент переданного в аргументе функции массива - номер счетчика
    $.ajax({
      data: {selected: $("#select").val(), count: arrayTr[1]},
      success: function (content) {
        console.log(content);
        var temp = content.split(",");// парсинг строки, полученной из БД из ответа сервера и содержащей id, номер ТП и т.д., в массив
        addTr(temp);// построение из этого массива строки таблицы и добавление ее в таблицу
        $("td:nth-child(6)").html("<div class=crossRemoveButton></div>");// вставка в последнюю ячейку строки кнопки удаления
      },
      error: function (xhr, str, errorType) {
        $dialog.dialog('open');//alert(errorType);
      }
    });
  }

  /**
   * отправляет в response.php POST['set_value'] - номер счетчика, POST['count_value'] - номер счетчика, POST['set_v'] - номер ТП
   * и формирует строку таблицы из ответа
   * @param count_value
   */
  function setStatisticValues(count_value) {
    $.ajax({
      data: {set_value: $('#set_values').val(), count_value: count_value[1], set_v: count_value[0]},
      success: function (content) {
        var temp = content.split(",");// парсинг строки, полученной из БД из ответа сервера и содержащей id, номер ТП и т.д., в массив
        addTr(temp);// построение из этого массива строки таблицы и добавление ее в таблицу
        $("td:nth-child(6)").html("<div class=crossRemoveButton></div>");// вставка кнопки удаления в последнюю ячейку
      }
    });
  }

  /**
   * выбор в списке "Просчитать и внести показания"
   */
  set_values.addEventListener('change', function () {
    var checked = this.selectedIndex;
    switch (checked) {

      case 1:
        setStatisticValues([309, 100964]);
        break;

      case 2:
        setStatisticValues([309, 160000]);
        break;

      case 3:
        setStatisticValues([310, 215110]);
        break;

      case 4:
        setStatisticValues([310, 995258]);
        break;

      case 5:
        setStatisticValues([310, '019250']);
        break;

      case 6:
        setStatisticValues([310, 114489]);
        break;

      case 7:
        setStatisticValues([311, 215933]);
        break;

      case 8:
        setStatisticValues([311, 516465]);
        break;

      case 9:
        setStatisticValues([312, 820943]);
        break;

      case 10:
        setStatisticValues([312, 835057]);
        break;

      case 11:
        setStatisticValues([313, 20297549]);
        break;

      case 12:
        setStatisticValues([314, 20309187]);
        break;
    }
    this.options[0].selected = true;// программная уствновка 1ого пункта списка в активное состояние
  }, false);
  
  //$('body').bind('ajaxStart', function () {
  //  $page_loader.css({
  //    width: '100px',
  //    height: '100px',
  //    position: 'fixed',
  //    backgroundImage: "url('http://kupislona.esy.es/pokazaniya/res/pageLoader.gif')",
  //    left: ($(window).width() / 2 - 50) + 'px',
  //    top: ($(window).height() / 2 - 50) + 'px'
  //  }).appendTo($('body'));
  //});

  $('body').bind('ajaxStop', function () {
    $page_loader.remove();
  });

});
