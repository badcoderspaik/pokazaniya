window.addEventListener("load", function () {
  var table = document.getElementById("table"), // таблица
    $table = $('#table'), // таблица
    select = document.getElementById("select"),// список выбора "Добавить ТП"
    statistic = document.getElementById("statistic"),// список выбора "Статистика по номеру ТП"
    set_values = document.getElementById('set_values'); // список выбора "Просчитать и внести показания"
  lastTd = $("td:nth-child(6)"),// 6-ой столбец таблицы - кнопка удаления
    valuesTd = $("td:nth-child(4)"),// 4-ый столбец "показания"
    statistic_count = document.getElementById("statistic_count"),// список выбора "Статистика по номеру счетчика"
    body = document.body,// тело оно и в Африке тело
    form = document.getElementById("form"),// форма со списками
    $form = $('#form'),// форма со списками
    $dialog = $('#dialog');// диалоговое окно - выводится при неудачном ajax-запросе в функции error. Это стандартный компонент jQuery UI - dialog

  // диалоговое окно
  $dialog.dialog({
    title: 'Ошибка',
    autoOpen: false,
    modal: true,
    show: 'puff',
    hide: 'puff',
    buttons: {
      'Лады': function () {
        $(this).dialog('close');
      }
    }
  });

  /**
   * установки по умолчанию для ajax-запросов
   */
  $.ajaxSetup({
    type: "POST",
    dataType: "text",
    url: "http://kupislona.esy.es/pokazaniya/js/response.php"
  });

  /*
   * клик на 6-ой ячейке(кнопке удаления)
   */
  lastTd.live('touchstart', function () { // для сенсорного экрана при касании
    $(this).css({backgroundColor: 'violet'});// фиолетовый фон
  }).live('touchend', function () { // для сенсорного экрана при поднятии пальца
    $(this).css({background: ''}); // изначальный фон
  }).live('mouseover', function () { // для ПК - мышь над элементом
    $(this).css({cursor: 'pointer', outline: '3px solid violet'}); // рамка фиолетового цвета в 3px + cursor pointer
  }).live('mouseout', function () { // при mouseoute
    $(this).css({outline: 'none'});// изначальные стили
  });

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
  }).live("mouseover", function () { // мышь над ячейкой
    $(this).css({cursor: 'pointer', outline: '3px solid red'});// красная рамка в 3px + cursor pointer
  }).live('mouseout', function () {
    $(this).css({outline: 'none'});// none
  });

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


  /**
   * Срабатывает при выборе пункта из списков
   * "статистика по номеру ТП " и "статистика по номеру счетчика"
   * в функции-обработчике одного из объектов данного списка
   * @function showStatistic
   * @param {HTMLSelectElement} those - Объект списка.
   * При вызове передается как this - statistic или statistic_count
   * @param {string} postValue - Строка. Передается как "statistic" или "statisticCount";
   * в функции аяксом отправляется на сервер
   * как параметр post-запроса
   * и на сервере в файле response.php
   * обрабатывается как POST["statistic"] или POST["statisticCount"]
   */
  function showStatistic(those, postValue) {
    if (those.selectedIndex == 0) return;// если выбран 1ый элемент списка - возврат из функции
    var that = those,// объект списка
      statisticTp = those.value;// значение выбранного элемента списка
    $("<div class=loader2></div>").insertBefore($form);
    $.ajax({
      /**
       *значение выбранного элемента списка post-запросом
       передается на сервер в response.php.
       Если функция вызывается списком "statictic" - то передается номер ТП.
       Если функция вызывается списком "statistic_count" - то номер счетчика
       */
      data: postValue + "=" + statisticTp,
      /**
       *в ответ сервер возвращает строку вида "1, 309(здесь номер ТП(как в данном случае) или номер счетчика), 160000, 5654, 12.06.16, "
       любой длины в параметре content
       */
      success: function (content) {
        /**
         * парсинг строки,где разделителем служит запятая, в массив;
         * причем последний элемент этого массива пуст
         */
        var temp = content.split(",");
        temp.pop();// поэтому он удаляется
        /**
         * массив temp может состоять из любого количества элементов,
         * но кратного числу 5 - это число ячеек в одной строке.
         * Переменная circle - это количество строк в создаваемой ниже таблице вывода статистики,
         * причем количество создаваемых каждый раз строк разное - оно завист
         * от количества элементов в базе данных
         */
        var circle = temp.length / 5;
        var statisticTable = document.createElement('table');// таблица вывода статистики
        statisticTable.className = 'statTable';
        var statisticTr = document.createElement('tr');// строка данной таблицы
        var ths = []; // пустой массив для объектов элементов th таблицы вывода статистики
        for (var c = 0; c < 5; c++) { //т.к. строка из 5 ячеек
          ths[c] = document.createElement('th');// создание ячеек th таблицы
          statisticTr.appendChild(ths[c]);// добавление их в строку таблицы
        }
        ths[0].textContent = 'id';// наполнение ячеек текстовым содержимым
        ths[1].textContent = 'Номер ТП';
        ths[2].textContent = 'Номер счетчика';
        ths[3].textContent = 'Показания';
        ths[4].textContent = 'Дата';
        statisticTable.appendChild(statisticTr);// добавление новой строки в таблицу
        /**
         * Идея алгоритма такова:
         * берется массив temp, содержащий значения
         * из БД - id, номер ТП, номер счетчика, показания, дату,
         * и на каждой итерации цикла из него вновь и вновь
         * создается временный массив tempArray при помощи
         * метода Array.slice, вычленяющего из temp по 5
         * последующих элементов. Затем создается строка таблицы tr,
         * внутренний цикл создает ячейки таблицы,
         * текстовое содержимое которых берется
         * из этих каждых пяти вычлененных элементов массива.
         * Далее ячейки добавляются к строке
         * И наконец во внешнем цикле на каждой
         * его итерации строки вставляются в таблицу.
         * По завершении таблицa вставляется в body
         *
         */
        for (var i = 0, arrayEnd = 5, arrayStart = 0; i < circle; i++, arrayEnd += 5, arrayStart += 5) {
          var tempArray = temp.slice(arrayStart, arrayEnd);// временный динамический массив из 5ти элементов
          var tr = document.createElement('tr'); // строка таблицы вывода статистики
          for (var j = 0; j < tempArray.length; j++) {
            var td = document.createElement('td');// ячейки таблицы
            td.textContent = tempArray[j];// заполнение ячеек
            tr.appendChild(td);// вставка ячеек в строку
          }
          statisticTable.appendChild(tr);// вставка строки в таблицу
        }

        $("div.loader2").remove();// удаление картинки-загрузчика
        body.insertBefore(statisticTable, form);// вставка таблицы статистики в тело документа перед списками выбора
        var lastTable = $('.statTable').last();// последняя добавленная таблица вывода статистики
        lastTable.css({display: 'none'});// скрытие таблицы статистики для последующей анимации появления
        //lastTable.fadeIn(1000);// анимация появления таблицы
        //lastTable.effect( "bounce", { times: 3 }, 1500 );// анимация подпрыгивания таблицы
        //lastTable.effect('drop', {direction: 'left', mode: 'show'}, 'slow');// анимация выдвижения таблицы слева
        lastTable.effect('puff', {mode: 'show'}, 600);//
        var scrollTop = $('.statTable').last().offset().top;// анимация появления таблицы
        $('html, body').animate({scrollTop: scrollTop}, 1000, 'swing');// прокрутка таблицы в начало документа
        body.insertBefore(document.createElement('p'), form);// абзац для визуального отделения таблиц статистики от списков выбора
        body.insertBefore(document.createElement('p'), statisticTable);// абзац для отделения таблиц друг от друга
        that.options[0].selected = true;// программная установка 1го элемента списка в активное состояние
      },
      error: function (error) {// при неудачном ответе сервера
        $dialog.dialog('open');//alert(error);
      }
    });
  }

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

  /**
   * функция построения строки таблицы
   * и добавления ее в таблицу
   * @function addTr
   * @param {array} arrayTr - массив значений для вставки в ячейки таблицы
   */
  function addTr(arrayTr) {
    var tr = document.createElement("tr"),// строка
      td = [];// массив для ячеек
    for (var i = 0; i < 6; i++) {
      td[i] = document.createElement("td");// ячейка
      td[i].textContent = arrayTr[i];// заполнение ячеек содержимым
      tr.appendChild(td[i]);// вставка ячейки в строку
    }
    table.appendChild(tr);// добавление строки в таблицу
    tr.style.display = 'none';// скрытие строки для последующего эффекта анимации
    var $last_tr = $(tr).last();// только-что добавленная строка
    $last_tr.fadeIn(1000);// анимация появления строки
    var scrollTop = $last_tr.offset().top;// координаты только-что добавленной строки
    $('html, body').animate({scrollTop: scrollTop}, 1000, 'swing');// скроллинг до строки
  }

}, false);
