<DOCTYPE html>
    <html>
    <head>
        <?php require_once("jq_include.php"); ?>

        <script src="/pokazaniya/js/init.js"></script>
        <script src="/pokazaniya/js/pokazaniya_basket.js"></script>
        <script src="/pokazaniya/js/addingTr.js"></script>
        <script src="/pokazaniya/js/ajaxSetup.js"></script>
        <script src="/pokazaniya/js/execute.js"></script>

        <meta charset="utf-8">
        <style>
            body {
                background-image: url('/pokazaniya/res/skin.png');
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

            .recover {
                width: 20px;
                height: 20px;
                background-image: url("http://kupislona.esy.es/pokazaniya/res/recover.png");
            }
        </style>

    </head>
    <body>

    <?php

    require_once('db_connect.php');
    $query = "select * from pokazaniya_basket ORDER BY id ASC";
    $result = $db->query($query);
    $num_results = $result->num_rows;

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
        echo "<td><div class = 'recover'></div></td>";
        echo "</tr>";
    }
    echo "</table>";
    ?>
    <br>
    <button id="btnCleanBasket">Очистить корзину</button>
    </body>
    </html>