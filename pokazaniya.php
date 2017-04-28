<!DOCTYPE html>
<html>
<head>
    <title>Показания</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/360px.css" media="(max-width: 360px)">
    <link rel="stylesheet" href="css/361_800.css" media="(min-width: 361px) and (max-width: 800px)">
    <link rel="stylesheet" href="css/800px.css" media="(max-width: 800px)">
    <link rel="stylesheet" href="css/960px.css" media="(min-width: 960px)">
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
    <script
        src="http://code.jquery.com/ui/1.12.1/jquery-ui.min.js"
        integrity="sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU="
        crossorigin="anonymous">
    </script>
    <script src='/pokazaniya/js/App/AppPokazaniya.js'></script>
    <script src='/pokazaniya/js/App/View/Tabl.js'></script>
    <script src="/pokazaniya/js/init.js"></script>
    <script src="js/pokazaniya.js"></script>
    <script src="/pokazaniya/js/ajaxSetup.js"></script>
    <script src="/pokazaniya/js/dialog.js"></script>
    <script src="/pokazaniya/js/statisticTable.js"></script>
    <script src="/pokazaniya/js/addingTr.js"></script>
    <link rel="stylesheet" href="css/jquery-ui.min.css">

    <style>

        /*под мобилу*/

        /* @media (max-width: 360px) {
             body {
                 font-size: 0.8em;
             }

             #menu-button {
                 position: fixed;
                 top: 0;
                 right: 0;
                 width: 50px;
                 height: 50px;
                 background-color: white;
                 opacity: 0.2;
                 cursor: pointer;
                 padding: 10px;
                 border: 1px solid black;
                 border-radius: 5px;
                 z-index: 100;
             }

             .m-button {
                 background-color: black;
                 height: 10px;
                 margin-bottom: 10px;
             }

             form {
                 left: 0;
                 background-color: inherit;
                 padding: 0;
             }
         }*/

        /* @media (min-width: 600px) and (max-width: 800px) {
             body {
                 font-size: 1.2em;
             }

             select {
                 font-size: 1em;
             }
         }
 */
    </style>
    <meta charset="utf-8"/>
</head>
<body>

<?php

require_once("connection.php");// коннект к базе
require_once("php/Table.php");

// запрос - выбрать все записи из таблицы pokazaniya и отсортировать по возрастанию
//$query = "select * from pokazaniya ORDER BY id ASC";
$res = $connector->select("select * from pokazaniya ORDER BY id ASC", false);
//запостить запрос в базу и записать его в переменную result
//$result = $db->query($query);
//количество строк-результатов
$num_results = $res->num_rows;
$table = new Table($res, array('id', 'Номер ТП', 'Номер счетчика', 'Покзания', 'Дата'), true);
//абзац с текущей датой
echo "<p id = date>Сегодня " . date("d.m.y") . "</p>"; ?>
<!--кнопка меню в правом верхнем углу страницы, скрывающая-отображающая блок списков-->
<div id="menu-button">
    <div class="m-button"></div>
    <div class="m-button"></div>
    <div class="m-button"></div>
</div>
<!--абзац-разделитель-->
<p></p>
<? //вывод html таблицы
$table->show();
/*echo "<table id = 'table'>";
echo "<tr>";
echo "<th>id</th>";
echo "<th>Номер ТП</th>";
echo "<th>Номер счетчика</th>";
echo "<th>Показания</th>";
echo "<th>Дата</th>";
echo "<tr>";
for ($i = 0; $i < $num_results; $i++) {
    $row = $result->fetch_object();
    echo "<tr>";
    echo "<td>$row->id</td>";
    echo "<td>$row->tp_number</td> ";
    echo "<td>$row->count_number</td>";
    echo "<td>$row->pok</td>";
    echo "<td>$row->date</td>";
    echo "<td><div class = 'crossRemoveButton'></div></td>";
    echo "</tr>";
}
echo "</table>";*/

?>
<br>

<form id="accordion">

    <select id="select" name="selected">
        <option>Добавить ТП</option>
        <option>309</option>
        <option>310</option>
        <option>311</option>
        <option>312</option>
        <option>313</option>
        <option>314</option>
    </select>

    <p></p>

    <select id="statistic" name="statistic">
        <option>Статистика по номеру ТП</option>
        <option>309</option>
        <option>310</option>
        <option>311</option>
        <option>312</option>
        <option>313</option>
        <option>314</option>
    </select>

    <p></p>

    <select id="statistic_count" name="statistic_count">
        <option>Статистика по счетчику</option>
        <option>100964</option>
        <option>160000</option>
        <option>215110</option>
        <option>995258</option>
        <option>019250</option>
        <option>114489</option>
        <option>215933</option>
        <option>516465</option>
        <option>820943</option>
        <option>835057</option>
        <option>20297549</option>
        <option>20309187</option>
    </select>

    <p></p>

    <select id="set_values">
        <option>Просчитать показания</option>
        <option>100964</option>
        <option>160000</option>
        <option>215110</option>
        <option>995258</option>
        <option>019250</option>
        <option>114489</option>
        <option>215933</option>
        <option>516465</option>
        <option>820943</option>
        <option>835057</option>
        <option>20297549</option>
        <option>20309187</option>
    </select>
</form>
<!--блок для диалогового окна (плагин jqueryUI dialog)-->
<div id="dialog">
    <p>
        Слабое сетевое соединение Попытка не пытка, дружок!
    </p>
</div>

</body>
</html>
