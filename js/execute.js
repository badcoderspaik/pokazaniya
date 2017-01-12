// 3
function execute() {
  $lastTd.live({

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

      var id = this.parentNode.firstElementChild.textContent,// номер из 1ой ячейки
        $parent = $(this.parentNode),
        really = confirm("Восстановить строку с id = " + id + "?");// диалоговое окно с запросом на подтверждение

      if (really) {

        $.ajax({
          data: {idText: id},
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

  
