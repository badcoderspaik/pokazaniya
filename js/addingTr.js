/**
 * ������� ���������� ������ �������
 * � ���������� �� � �������
 * @function addTr
 * @param {array} arrayTr - ������ �������� ��� ������� � ������ �������
 */
function addTr(arrayTr) {
  var tr = document.createElement("tr"),// ������
    td = [];// ������ ��� �����
  for (var i = 0; i < 6; i++) {
    td[i] = document.createElement("td");// ������
    td[i].textContent = arrayTr[i];// ���������� ����� ����������
    tr.appendChild(td[i]);// ������� ������ � ������
  }
  table.appendChild(tr);// ���������� ������ � �������
  tr.style.display = 'none';// ������� ������ ��� ������������ ������� ��������
  var $last_tr = $(tr).last();// ������-��� ����������� ������
  $last_tr.fadeIn(1000);// �������� ��������� ������
  var scrollTop = $last_tr.offset().top;// ���������� ������-��� ����������� ������
  $('html, body').animate({scrollTop: scrollTop}, 1000, 'swing');// ��������� �� ������
}