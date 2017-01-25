
function execute() {
  $lastTd.live({// операции над последней ячейкой строки - кнопкой удаления

    mouseover: function(){
      $(this).css({cursor: 'pointer'})
    },

    touchstart: function () {
      $(this).css({backgroundColor: 'red'});
    },

    touchend: function () {
      $(this).css({backgroundColor: ''});
    },

    click: function () {

      var id = this.parentNode.firstElementChild.textContent,// номер из 1ой ячейки строки-родителя
        $parent = $(this.parentNode),// строка-родитель(tr)
        really = confirm("Восстановить строку с id = " + id + "?");// диалоговое окно с запросом на подтверждение

      if (really) {

        $.ajax({
          data: {idText: id},// post в response.php с номером из 1ой ячейки
          success: function () {
            $parent.effect('explode', {mode: 'hide'}, 1000, function () {
              $parent.remove();// происходит удаление строки с переданным id
            });
          }

        });

      }

    }

  });
}

  
