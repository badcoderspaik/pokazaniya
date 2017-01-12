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
  loader.insertBefore($form);//полоса-загрузчик
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

    complete: function () {
      loader.remove();
    },

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

      //$("div.loader2").remove();// удаление картинки-загрузчика
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
