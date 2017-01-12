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