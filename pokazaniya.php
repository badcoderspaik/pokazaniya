<!DOCTYPE html>
<html>
<head>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
    <script
        src="http://code.jquery.com/ui/1.12.1/jquery-ui.min.js"
        integrity="sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU="
        crossorigin="anonymous">
    </script>
    <script src="js/pokazaniya.js"></script>
    <link rel="stylesheet" href="css/jquery-ui.min.css">
    
    <style>
        body {
            font-size: 0.8em;
            font-weight: bold;
            background-image: url("res/skin.png");
            background-attachment: fixed;
            position: relative;
        }

        table {
            border-collapse: collapse;
            empty-cells: hide;
            color: #8b4513;
        }

        td, th {
            border: 2px groove #8b4513;
            padding: 5px;
        }

        th {
            color: blue;
        }

        td:nth-child(6) {
            position: relative;
        }

        .crossRemoveButton {
            width: 20px;
            height: 20px;
            background: url("res/cross.png") no-repeat;
        }

        .loader {
            width: 20px;
            height: 20px;
            background: url("res/loader.gif") no-repeat;
        }

        .loader2 {
            background: url("res/77.gif") no-repeat;
            width: 256px;
            height: 38px;
        }

        p#date {
            font-size: 1.5em;
            padding: 15px;
            border: 1px solid #3c763d;
            border-radius: 4px;
            color: #3c763d;
            background-color: #dff0d8;
        }

        select {
            font-size: 1.5em;
        }

    </style>
    <meta charset="utf-8"/>
</head>
<body>

<?php

require_once("connection.php");

$query = "select * from pokazaniya ORDER BY id ASC";
$result = $db->query($query);
$num_results = $result->num_rows;

echo "<p id = date>Сегодня " . date("d.m.y") . "</p>"; ?>
<p></p>
<?
echo "<table id = 'table'>";
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
echo "</table>";

?>
<br>

<form id="form">
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
        <option>Статистика по номеру счетчика</option>
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
        <option>Просчитать и внести показания</option>
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

<div id="dialog">
    <p>
        Слабое сетевое соединение Попытка не пытка, дружок!
    </p>
</div>

</body>
</html>
