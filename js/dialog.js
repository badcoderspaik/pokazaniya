// диалоговое окно
function dialog() {
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
}
