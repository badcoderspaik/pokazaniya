<?php
$selected = $_POST["selected"]; // значение выбранного пункта списка - 309, 310, 311 и т.д. - номера ТП
$count = $_POST["count"];// номер счетчика
$id = $_POST["id"]; // уникальный номер из первой ячейки
$insertValue = $_POST["insertValue"];// значение, введенное в prompt-окно - показания для записи в БД в поле 'pok'
$firstId = $_POST["firstId"];// уникальный id записи; служит для идентификации записи, в которую будет вставлено значение из $_POST["insertValue"]
$currentDate = date("d.m.y");// динамическая дата в формате дд.мм.гг
$statistic = $_POST["statistic"];// номер ТП из списка "Статистика по номеру ТП"
$statistic_count = $_POST["statisticCount"];// номер ТП из списка "Статистика по номеру счетчика"
$set_value = $_POST["set_value"];// номер счетчика из списка "Просчитать и ввести показания"
$tp_number = $_POST['tp_number'];// номер ТП из списка "Просчитать и ввести показания"
$idText = $_POST['idText'];// уникальный номер из первой ячейки из файла execute.js

require_once("/home/u996357382/public_html/pokazaniya/connection.php");// подключение к базе

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

    $value = average($temp_array);

    $query = "INSERT INTO `pokazaniya` (`tp_number`, `count_number`, `pok`, `date`) VALUES (\"$tp_number\",\"$set_value\",\"$value\",\"$currentDate\")";
    $db->query($query);

    $query = "select * from pokazaniya order by id desc limit 1";
    $result = $db->query($query);
    $num_results = $result->num_rows;
    for ($i = 0; $i < $num_results; $i++) {
        $row = $result->fetch_object();
        echo "$row->id,$row->tp_number,$row->count_number,$row->pok,$row->date,";

    }
}

if (!empty($selected) && !empty($count)) {
    $query = "INSERT INTO `pokazaniya` (`tp_number`, `count_number`, `date`) VALUES (\"$selected\",\"$count\",\"$currentDate\")";
    $db->query($query);

    $query = "select * from pokazaniya order by id desc limit 1";
    $result = $db->query($query);
    $num_results = $result->num_rows;
    for ($i = 0; $i < $num_results; $i++) {
        $row = $result->fetch_object();
        echo "$row->id,$row->tp_number,$row->count_number,,$row->date,";

    }
}

if (!empty($id)) {
    $select_all_query = "select * from `pokazaniya` WHERE `id`=$id";
    $result = $db->query($select_all_query);
    $num_results = $result->num_rows;

    for ($i = 0; $i < $num_results; $i++) {
        $row = $result->fetch_object();
        echo "$row->id,$row->tp_number,$row->count_number,$row->pok, $row->date";
        $insert_value = "insert into `pokazaniya_basket` (`id`, `tp_number`, `count_number`, `pok`, `date`) VALUES (\"$row->id\", \"$row->tp_number\", \"$row->count_number\", \"$row->pok\", \"$row->date\")";
        $db->query($insert_value);
    }

    $query = "DELETE FROM `pokazaniya` WHERE `id`=$id";
    $db->query($query);
}

if (!empty($idText)) {
    $idText_query = "select * from `pokazaniya_basket` WHERE `id`=$idText";
    $result = $db->query($idText_query);
    $num_results = $result->num_rows;

    for ($i = 0; $i < $num_results; $i++) {
        $row = $result->fetch_object();
        echo "$row->id,$row->tp_number,$row->count_number,$row->pok, $row->date";
        $insert_value = "insert into `pokazaniya` (`id`, `tp_number`, `count_number`, `pok`, `date`) VALUES (\"$row->id\", \"$row->tp_number\", \"$row->count_number\", \"$row->pok\", \"$row->date\")";
        $db->query($insert_value);
    }

    $query = "DELETE FROM `pokazaniya_basket` WHERE `id`=$idText";
    $db->query($query);
}

if (!empty($insertValue)) {
    $query = "UPDATE `pokazaniya` set `pok` = \"$insertValue\" WHERE `id`=$firstId";
    $db->query($query);
    echo "$insertValue";
}

if (!empty($statistic)) {
    $query = "select * from `pokazaniya` WHERE `tp_number` = \"$statistic\" ORDER BY id ASC";
    $result = $db->query($query);
    $num_results = $result->num_rows;
    for ($i = 0; $i < $num_results; $i++) {
        $row = $result->fetch_object();
        echo "$row->id,$row->tp_number,$row->count_number,$row->pok,$row->date,";

    }
}

if (!empty($statistic_count)) {
    $query = "select * from `pokazaniya` WHERE `count_number` = \"$statistic_count\" ORDER BY id ASC";
    $result = $db->query($query);
    $num_results = $result->num_rows;
    for ($i = 0; $i < $num_results; $i++) {
        $row = $result->fetch_object();
        echo "$row->id,$row->tp_number,$row->count_number,$row->pok,$row->date,";

    }
}

function autoFillTable()
{

}

?>
