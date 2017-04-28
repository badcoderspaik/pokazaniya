<?php
//коннект к базе
require_once("php/classes/DbConnector.php");
//$db = new mysqli("localhost", "u996357382_learn", "spaik87055091802", "u996357382_learn");
//if (mysqli_connect_errno()) {
//    echo "connection error";
//}
$connector = new DbConnector("localhost", "u996357382_learn", "spaik87055091802", "u996357382_learn");
?>