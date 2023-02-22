(function ($) {
    $(document).ready(function () {
      $.getJSON("json_file.json", function (data) {
        data.forEach((element) => {
          $("#rawTable").append(
            "<tr name='ptr-" +
              element.id +
              "'><td>" +
              element.id +
              "</td><td>" +
              element.name +
              "</td><td><button onclick='window.addToPreparedList(" +
              element.id +
              ', "' +
              element.name +
              "\", this)'>Добавить</button></td></tr>"
          );
        });
      });
    });
  
    $(document).ready(function () {
      $("#searhInput").on("keyup", function () {
        let value = $(this).val().toLowerCase();
        $("#rawTable tr").filter(function () {
          $(this).toggle(
            $(this).find("td:nth-child(2)").text().toLowerCase().indexOf(value) >
              -1
          );
        });
      });
  
      window.addToPreparedList = function (id, name, button) {
        if ($(button).data("mode") === "delete") {
          $('#preparedTable tr[name="ptr-' + id + '"]').remove();
          $('#rawTable tr[name="ptr-' + id + '"] button').text("Добавить");
          $('#rawTable tr[name="ptr-' + id + '"] button').data("mode", "add");
        } else {
          let rows1 = $("#preparedTable tr[data-index='1']");
          let rows2 = $("#preparedTable tr[data-index='2']");
          let appendPosition = -1;
          let appendObj = null;
          rows1.each(function (index){
            let obj = $(rows1[index]).find("td:nth-child(2)");
            if (obj.text() === '') {
              return;
            }
            
            // Сравниваем элементы для сортировки
            if (obj.text() > name && (appendPosition > index || appendPosition === -1)) {
              appendPosition = index;
              appendObj = $(rows1[index]);
            }
          });
  
  
          let forInsert = "<tr data-index='1' name='ptr-" +
              id +
              "'><td>" +
              id +
              "</td><td>" +
              name +
              "</td><td><button onclick='window.addToPreparedList(" +
              id +
              ', "' +
              name +
              "\", this)'>Удалить</button></td></tr>" +
              "<tr data-index='2' name='ptr-" +
              id +
              "'><td>ЗП</td><td><input name='zpField' data-forid='" +
              id +
              "' type='number' min='0' placeholder='Введите зп'><span id='validate_message_" +
              id +
              "'></span></td></tr>";
          
          if (!!!appendObj) {
              $("#preparedTable").append(forInsert);
          } else {
              appendObj.before(forInsert);
          }
  
          $('tr[name="ptr-' + id + '"] button').data("mode", "delete");
  
          $(button).text("Удалить");
          $(button).data("mode", "delete");
        }
      };
  
      $('button[name="saveButton"]').click(function (e) {
        let tableValid = $("#preparedTable tr").attr("name");
        let inputs = $("input[name='zpField']");
  
        if (!!!tableValid) {
          alert("Должность не настроена");
          return;
        }
  
        let errorExists = false;
        let preparedAnswer = [];
        inputs.each(function (index) {
          let elem = inputs[index];
          let id = $(elem).data("forid");
          if ($(elem).val() == "") {
            errorExists = true;
            $("#validate_message_" + id).html("Укажите заработную плату");
          } else {
            $("#validate_message_" + id).html("");
            preparedAnswer.push({
              rate_area_id: id,
              base_charge_value: $(elem).val()
            });
          }
        });
  
        if (errorExists) {
          return;
        }
  
        console.log(JSON.stringify(preparedAnswer));
  
        alert("Сохранено");
      });
    });
  })(jQuery);