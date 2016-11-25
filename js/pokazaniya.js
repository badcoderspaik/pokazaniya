window.addEventListener("load", function () {

  var table = document.getElementById("table"),
    select = document.getElementById("select"),
    statistic = document.getElementById("statistic"),
    lastTd = $("td:nth-child(6)"),
    valuesTd = $("td:nth-child(4)"),
    statistic_count = document.getElementById("statistic_count"),
    body = document.body,
    form = document.getElementById("form"),
  crossRemoveButton = document.createElement("p");
  crossRemoveButton.className = "crossRemoveButton";

  lastTd.live('touchstart', function () {
    $(this).css({backgroundColor: 'violet'});
  }).live('touchend', function () {
    $(this).css({background: ''});
  });

  valuesTd.live("click", function () {
    var id = this.parentNode.firstElementChild.textContent,
      that = $(this),
      insertValue = prompt("Ввести показания", that.text());
    if (insertValue == null || insertValue == "") return;
    that.html("<div class = loader></div>");

    $.ajax({
      type: "POST",
      dataType: "text",
      url: "http://kupislona.esy.es/pokazaniya/js/response.php",
      data: {insertValue: insertValue, firstId: id},
      success: function (content) {
        if (content) {
          that.html(content);
        }
      },
      error: function (xhr, str, errorType) {
        alert(errorType);
      }
    });
  });

  valuesTd.live("touchstart", function () {
    $(this).css({backgroundColor: 'red'});
  }).live("touchend", function () {
    $(this).css({background: ''});
  });

  lastTd.live("click", function () {
    var id = this.parentNode.firstElementChild.textContent;
    var parent = this.parentNode;
    var really = confirm("Действительно удалить строку с id = " + id + "?");
    if (really) {
      $.ajax({
        type: "POST",
        dataType: "text",
        url: "http://kupislona.esy.es/pokazaniya/js/response.php",
        data: {id: id},
        success: function (content) {
          parent.parentNode.removeChild(parent);
        },
        error: function (xhr, str, errorType) {
          alert(errorType);
        }
      });
    }
  });

  select.addEventListener("change", function () {
    var checked = this.selectedIndex,
      that = this;
    switch (checked) {
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
    that.options[0].selected = true;
  }, false);

  function showStatistic(those, postValue) {
    if (those.selectedIndex == 0) return;
    var that = those,
        statisticTp = those.value;
    $.ajax({
      type: "POST",
      url: "http://kupislona.esy.es/pokazaniya/js/response.php",
      data: postValue+"="+statisticTp,
      success: function (content) {
        var temp = content.split(",");
        temp.pop();
        var circle = temp.length / 5;
        var statisticTable = document.createElement('table');
        var statisticTr = document.createElement('tr');
        var ths = [];
        for (var c = 0; c < 5; c++) {
          ths[c] = document.createElement('th');
          statisticTr.appendChild(ths[c]);
        }
        ths[0].textContent = 'id';
        ths[1].textContent = 'Номер ТП';
        ths[2].textContent = 'Номер счетчика';
        ths[3].textContent = 'Показания';
        ths[4].textContent = 'Дата';
        statisticTable.appendChild(statisticTr);
        for (var i = 0, arrayEnd = 5, arrayStart = 0; i < circle; i++, arrayEnd += 5, arrayStart += 5) {
          var tempArray = temp.slice(arrayStart, arrayEnd);
          console.log(tempArray);
          var tr = document.createElement('tr');
          for (var j = 0; j < tempArray.length; j++) {
            var td = document.createElement('td');
            td.textContent = tempArray[j];
            tr.appendChild(td);
          }


          statisticTable.appendChild(tr);
        }

        body.insertBefore(statisticTable, form);
        body.insertBefore(document.createElement('p'), form);
        body.insertBefore(document.createElement('p'), statisticTable);
        that.options[0].selected = true;
      },
      error: function (error) {
        alert(error);
      }
    });
  }

  statistic_count.addEventListener("change", function () {
    showStatistic(this, "statisticCount");
  }, false);

  statistic.addEventListener("change", function () {
    showStatistic(this, "statistic");
  }, false);

  function send(arrayTr) {
    $.ajax({
      type: "POST",
      dataType: "text",
      url: "http://kupislona.esy.es/pokazaniya/js/response.php",
      data: {selected: $("#select").val(), count: arrayTr[1]},
      success: function (content) {
        var temp = content.split(",");
        addTr(temp);
        $("td:nth-child(6)").html("<div class=crossRemoveButton></div>");
      },
      error: function (xhr, str, errorType) {
        alert(errorType);
      }
    });
  }

  function addTr(arrayTr) {
    var tr = document.createElement("tr"),
      td = [];
    for (var i = 0; i < 6; i++) {
      td[i] = document.createElement("td");
      td[i].textContent = arrayTr[i];
      //if(i == 5) td[i].appendChild(crossRemoveButton);
      //td2.addEventListener("click", changeTp, false);
      tr.appendChild(td[i]);
    }
    table.appendChild(tr);

  }

}, false);
