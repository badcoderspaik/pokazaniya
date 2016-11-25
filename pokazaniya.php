<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
    "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>

    <meta
     name="viewport "content = "width=device-width, initial-scale=1.0">
    <title></title>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
    <script src="js/pokazaniya.js"></script>
    <style>
        body {
            font-size: 0.8em;
            font-weight: bold;
            background-image: url("res/skin.png");
            background-attachment: fixed;
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

					 p#date{
							font-size: 1.5em;
							padding: 15px;
							border: 1px solid #3c763d;
							border-radius: 4px;
							color: #3c763d;
							background-color: #dff0d8;
							 text-shadow: 0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2), 0 20px 20px rgba(0,0,0,.15);
					 }

    </style>
    <meta charset="utf-8"/>
</head>
<body>

<?php

require_once("connection.php");

$query = "select * from pokazaniya";
$result = $db->query($query);
$num_results = $result->num_rows;

echo "<p id = date>Сегодня " . date("d.m.y")."</p>";?>
<center><script src="http://www.epwr.ru/aphorism/data21utf8.js"></script><font size=1><!--<a href="http://www.epwr.ru">Афоризмы</a>--></font></center>
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
</form>
<p></p>
<a><img src="http://www.meteonova.ru/informer/PNG102_36403_1C1C1C_1C1C1C_E8E8E8_B5B5B5_FFFFFF_1C1C1C_4F4F4F.PNG" border="0" title="Погода от Метеоновы по г. Усть-Каменогорск" alt="Погода от Метеоновы по г. Усть-Каменогорск"></a>
<link rel="stylesheet" type="text/css" href="https://bst1.gismeteo.ru/assets/flat-ui/legacy/css/informer.min.css"> <div id="gsInformerID-yoCHRFM6D135gY" class="gsInformer" style="width:134px;height:150px"> <div class="gsIContent"> <div id="cityLink"> <a>Погода в Усть-Каменогорске</a> </div> <div class="gsLinks"> <table> <tr> <td> <div class="leftCol"> <a> <img alt="Gismeteo" title="Gismeteo" src="https://bst1.gismeteo.ru/assets/flat-ui/img/logo-mini2.png" align="middle" border="0" /> <span>Gismeteo</span> </a> </div> <div class="rightCol"></div> </td> </tr> </table> </div> </div> </div> <script async src="https://www.gismeteo.ru/api/informer/getinformer/?hash=yoCHRFM6D135gY" type="text/javascript"></script> <!-- Gismeteo informer END -->
</body>
</html>
