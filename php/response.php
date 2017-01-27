<?php
$selected = $_POST["selected"]; // значение выбранного пункта списка - 309, 310, 311 и т.д. - номера ТП
$count = $_POST["count"];// номер счетчика
$id = $_POST["id"]; // уникальный номер из первой ячейки
$insertValue = $_POST["insertValue"];// значение, введенное в prompt-окно - показания для записи в БД в поле 'pok'
$firstId = $_POST["firstId"];// уникальный id записи; служит для идентификации записи, в которую будет вставлено значение из $_POST["insertValue"]
$currentDate = date("d.m.y");// динамическая дата в формате дд.мм.гг
$statistic = $_POST["statistic"];// номер ТП из списка "Статистика по номеру ТП"
$statistic_count = $_POST["statisticCount"];// номер счетчика из списка "Статистика по номеру счетчика"
$set_value = $_POST["set_value"];// номер счетчика из списка "Просчитать и ввести показания"
$tp_number = $_POST['tp_number'];// номер ТП из списка "Просчитать и ввести показания"
$idText = $_POST['idText'];// уникальный номер из первой ячейки из файла execute.js
$cleanBasket = $_POST['cleanBasket'];

require_once("/home/u996357382/public_html/pokazaniya/connection.php");// подключение к базе

if(!empty($cleanBasket)){
	$query = "delete FROM `pokazaniya_basket`";
	$db->query($query);
	echo 'do it';
}

if (!empty($set_value)) {// если передан номер счетчика из списка "Просчитать и ввести показания

    // выбрать все поля из столбца "показания" , где номер счетчика равен $set_value и отсортировать по возрастанию
    $query = "select `pok` from `pokazaniya` WHERE `count_number` = \"$set_value\" ORDER BY id ASC";
    //запрос в базу
    $result = $db->query($query);
    //количество строк-результатов
    $num_results = $result->num_rows;
    //временная пустая строка
    $temp_str = '';

    for ($i = 0; $i < $num_results; $i++) {// цикл по количеству результатов
        $row = $result->fetch_object();// запись результата в объект
        $temp_str .= "$row->pok,";// запись результата в строку
    }

    $temp_str = rtrim($temp_str, ',');// обрезать последний символ строки - запятую
    $temp_array = explode(',', $temp_str);// распарсить строку в массив

    //*
    //Вычисляет среднее арифметическое по имеющимся показаниям определенного счетчика
    //Так как среднее арифметическое есть сумма чисел, деленная на их количество,
    //то в функции все числа из столбца "показания" одного счетчика считываются в массив,
    //затем в цикле из последнего элемента массива вычитается предпоследний,
    //из предпоследнего "пред-предпоследний" и т.д. до начала массива.
    //результаты вычитания заносятся в новый временный массив $temp_array;
    //таким образом $temp_array и есть ряд чисел, по которым нужно посчитаь ср. арифм.
    //$inArray - исходный массив
    //*/
    function average($inArray)
    {
        $temp_array = array();// временный массив
        $length = count($inArray);// длинна входного массива

        for ($i = $length, $last = $length - 1; $i > 1; $i--) {
            $j = $inArray[$last] - $inArray[$last - 1];// вычитание одного элемента массива из др., начиная с конца
            $temp_array[] = $j;// занесение результата вычитания в массив
            $last--;
        }
        $average = array_sum($temp_array) / count($temp_array);// среднее арифметическое по показаниям
        return round(end($inArray) + $average);// добавить к последним показаниям полученный результат и возвратить его
    }

    $value = average($temp_array);// просичитанный результат

    //запрос - вставить в таблицу 'pokazaniya' номер ТП, номер счетчика, показания, дату
    $query = "INSERT INTO `pokazaniya` (`tp_number`, `count_number`, `pok`, `date`) VALUES (\"$tp_number\",\"$set_value\",\"$value\",\"$currentDate\")";
    //отправить запрос в базу
    $db->query($query);

    //запрос - выбрать из базы добавленную выше запись
    $query = "select * from pokazaniya order by id desc limit 1";
    // отправить запрос в базу и записать в переменную
    $result = $db->query($query);
    // количество строк-результатов
    $num_results = $result->num_rows;
    //считать результат в объект
    for ($i = 0; $i < $num_results; $i++) {
        $row = $result->fetch_object();
        // и вывести строку типа "id, номер ТП, номер счетчика, показания, дата"
        // которая будет получена функцией ajax.success в её параметре content
        // в функции setStatisticValues в pokazaniya.js
        echo "$row->id,$row->tp_number,$row->count_number,$row->pok,$row->date,";
    }
}

if (!empty($selected) && !empty($count)) {//если передан номер ТП из списка "добавить ТП" и номер счетчика
    //запрос - вставить в таблицу номер ТП, номер счетчика, дату
    $query = "INSERT INTO `pokazaniya` (`tp_number`, `count_number`, `date`) VALUES (\"$selected\",\"$count\",\"$currentDate\")";
    // отправить запрос в базу
    $db->query($query);

    //запрос - выбрать вставленную выше строку
    $query = "select * from pokazaniya order by id desc limit 1";
    //отправить запрос в базу
    $result = $db->query($query);
    // количество строк-результатов
    $num_results = $result->num_rows;

    for ($i = 0; $i < $num_results; $i++) {
        $row = $result->fetch_object();//считать результаты в объект
        //и вывести строку вида "id, номер ТП, номер счетчика, , , дата",
        //которая будет получена функцией ajax.success в её параметре content
        // в функции send в pokazaniya.js
        echo "$row->id,$row->tp_number,$row->count_number,,$row->date,";
    }
}

if (!empty($id)) {// id строки таблицы, передающийся при нажатии кнопки удаления(последней ячейки таблицы)
    // запрос - выбрать все записи из таблицы, где id = $id
    $select_all_query = "select * from `pokazaniya` WHERE `id`=$id";
    // отправить запрос в базу и записать результат в переменную result
    $result = $db->query($select_all_query);
    // количество строк-результатов
    $num_results = $result->num_rows;

    for ($i = 0; $i < $num_results; $i++) {// цикл по результатам
    	// считать результаты в объект
        $row = $result->fetch_object();
        // вывести строку вида "id, номер ТП, номер счетчика, показания, дата"
        echo "$row->id,$row->tp_number,$row->count_number,$row->pok, $row->date";
        // запрос - вставить в таблицу 'pokazaniya_basket' значения в поля id, tp_number, count_number, pok и date
        // При нажатии на кнопку удаления в таблице из файла pokazaniya.php запись удаляется
        // из таблицы pokazaniya и записывается в таблицу pokazaniya_basket, выполняющей роль корзины
        $insert_value = "insert into `pokazaniya_basket` (`id`, `tp_number`, `count_number`, `pok`, `date`) VALUES (\"$row->id\", \"$row->tp_number\", \"$row->count_number\", \"$row->pok\", \"$row->date\")";
        // выполнить запрос
        $db->query($insert_value);
    }
	// после вставки записи в pokazaniya_basket удалить ее из pokazaniya
    $query = "DELETE FROM `pokazaniya` WHERE `id`=$id";
    //выполнить запрос
    $db->query($query);
}

if (!empty($idText)) { //если передан idText
	//запрос - выбрать все записи из таблицы pokazanya_basket, где id = idText
    $idText_query = "select * from `pokazaniya_basket` WHERE `id`=$idText";
    //запостить результат в базу и записать в переменную result
    $result = $db->query($idText_query);
    // количество строк-результаов
    $num_results = $result->num_rows;

    for ($i = 0; $i < $num_results; $i++) {// цикл по результатам
    	//записать результат в объект
        $row = $result->fetch_object();
        //вывести строку вида "id, номер ТП, номер счетчика, показания, дата"
        echo "$row->id,$row->tp_number,$row->count_number,$row->pok, $row->date";
        //запрос вставляет запись в таблицу pokazaniya и удаляет ее из таблицы pokazaniya_basket
        //это процесс восстановления записи из корзины
        $insert_value = "insert into `pokazaniya` (`id`, `tp_number`, `count_number`, `pok`, `date`) VALUES (\"$row->id\", \"$row->tp_number\", \"$row->count_number\", \"$row->pok\", \"$row->date\")";
        //выполнить запрос
        $db->query($insert_value);
    }
	//запрос - удалить запись с переданным id
    $query = "DELETE FROM `pokazaniya_basket` WHERE `id`=$idText";
    //выполнить
    $db->query($query);
}

if (!empty($insertValue)) {//если передан параметр
	//запрос - обновить показания в записи в поле pok, где id = $firstId
    $query = "UPDATE `pokazaniya` set `pok` = \"$insertValue\" WHERE `id`=$firstId";
    //выполнить
    $db->query($query);
    //вывести строку из insertValue
    echo "$insertValue";
}

if (!empty($statistic)) {//если передан параметр
	//запрос - выбрать все записи, где номер ТП равен $statistic и отсортировать по возрастанию
    $query = "select * from `pokazaniya` WHERE `tp_number` = \"$statistic\" ORDER BY id ASC";
    //записать результат в объект и выполнить запрос
    $result = $db->query($query);
    //количество строк-результатов
    $num_results = $result->num_rows;
    //цикл по резльтатам
    for ($i = 0; $i < $num_results; $i++) {
    	//записать результат в объект
        $row = $result->fetch_object();
        //вывести строку вида "id, номер ТП, номер счетчика, показания, дата"
        echo "$row->id,$row->tp_number,$row->count_number,$row->pok,$row->date,";

    }
}

if (!empty($statistic_count)) {//если передан параметр
	//запрос - выбрать все записи, где номер счетчика равен $statistic_count и отсортировать по возрастанию
    $query = "select * from `pokazaniya` WHERE `count_number` = \"$statistic_count\" ORDER BY id ASC";
	//записать запрос в объект и отправить в базу
    $result = $db->query($query);
    //количество строк-результатов
    $num_results = $result->num_rows;
    //цикл по результатам
    for ($i = 0; $i < $num_results; $i++) {
    	//записать результаты в объект
        $row = $result->fetch_object();
        //вывести строку вида "id, номер ТП, номер счетчика, показания, дата"
        echo "$row->id,$row->tp_number,$row->count_number,$row->pok,$row->date,";

    }
}

function autoFillTable()
{

}

?>
