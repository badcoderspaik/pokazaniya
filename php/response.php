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

$requests = array('selected' => $_POST['selected'],
    'count' => $_POST['count'],
    'id' => $_POST['id'],
    'insertValue' => $_POST['insertValue'],
    'firstId' => $_POST['firstId'],
    'statistic' => $_POST['statistic'],
    'statistic_count' => $_POST['statisticCount'],
    'set_value' => $_POST['set_value'],
    'tp_number' => $_POST['tp_number'],
    'idText' => $_POST['idText'],
    'cleanBasket' => $_POST['cleanBasket']
);

require_once("/home/u996357382/public_html/pokazaniya/connection.php");// подключение к базе

if (!empty($cleanBasket)) {
    $connector->delete("delete FROM pokazaniya_basket");
    echo 'do it';
}

if (!empty($selected) && !empty($count)) {//если передан номер ТП из списка "добавить ТП" и номер счетчика
    //запрос - вставить в таблицу номер ТП, номер счетчика, дату
    $connector->insert("INSERT INTO pokazaniya (tp_number, count_number, date) VALUES (\"$selected\",\"$count\",\"$currentDate\")");
    $connector->select("select * from pokazaniya order by id desc limit 1");
}

if (!empty($id)) {// id строки таблицы, передающийся при нажатии кнопки удаления(последней ячейки таблицы)
    // запрос - выбрать все записи из таблицы, где id = $id
    $res = $connector->select("select * from pokazaniya WHERE id = $id");
    $r = $res->fetch_object();
    $connector->insert("insert into `pokazaniya_basket` (`id`, `tp_number`, `count_number`, `pok`, `date`) VALUES (\"$r->id\", \"$r->tp_number\", \"$r->count_number\", \"$r->pok\", \"$r->date\")");
    $connector->delete("DELETE FROM `pokazaniya` WHERE `id`=$id");
}

if (!empty($idText)) { //если передан idText
    //запрос - выбрать все записи из таблицы pokazanya_basket, где id = idText
    $res = $connector->query("select * from `pokazaniya_basket` WHERE `id`=$idText");
    $row = $res->fetch_object();
    $connector->insert("insert into `pokazaniya` (`id`, `tp_number`, `count_number`, `pok`, `date`) VALUES (\"$row->id\", \"$row->tp_number\", \"$row->count_number\", \"$row->pok\", \"$row->date\")");
    $connector->delete("DELETE FROM `pokazaniya_basket` WHERE `id`=$idText");
}

if (!empty($insertValue)) {//если передан параметр
    //запрос - обновить показания в записи в поле pok, где id = $firstId
    $connector->update("UPDATE `pokazaniya` set `pok` = \"$insertValue\" WHERE `id`=$firstId");
    echo "$insertValue";
}

if (!empty($statistic)) {//если передан параметр
    //запрос - выбрать все записи, где номер ТП равен $statistic и отсортировать по возрастанию
    $connector->select("select * from pokazaniya WHERE tp_number = \"$statistic\" ORDER BY id ASC");
}

if (!empty($statistic_count)) {//если передан параметр
    //запрос - выбрать все записи, где номер счетчика равен $statistic_count и отсортировать по возрастанию
    $connector->select("select * from `pokazaniya` WHERE `count_number` = \"$statistic_count\" ORDER BY id ASC");

}
