<?php
$selected = $_POST["selected"];
$count = $_POST["count"];
$id = $_POST["id"];
$insertValue = $_POST["insertValue"];
$firstId = $_POST["firstId"];
$currentDate = date("d.m.y");
$statistic = $_POST["statistic"];
$statistic_count = $_POST["statisticCount"];
$set_value = $_POST["set_value"];
$count_value = $_POST["count_value"];
$set_v = $_POST['set_v'];

require_once("/home/u996357382/public_html/pokazaniya/connection.php");
/*$db = new mysqli("localhost", "u996357382_learn", "spaik87055091802", "u996357382_learn");
if (mysqli_connect_errno()) {
    echo "connection error";
} else {

}*/

if (!empty($set_value) && !empty($count_value)) {

    $query = "select `pok` from `pokazaniya` WHERE `count_number` = \"$set_value\" ORDER BY id ASC";
    $result = $db->query($query);
    $num_results = $result->num_rows;
    $temp_str = '';

    for ($i = 0; $i < $num_results; $i++) {
        $row = $result->fetch_object();
        $temp_str.="$row->pok,";
    }

    $temp_str = rtrim($temp_str, ',');
    $temp_array = explode(',', $temp_str);

    function average($inArray)
    {
        $temp_array = array();
        $length = count($inArray);

        for ($i = $length, $last = $length - 1; $i > 1; $i--) {
            $j = $inArray[$last] - $inArray[$last - 1];
            $temp_array[] = $j;
            $last--;
        }
        $average = array_sum($temp_array) / count($temp_array);
        return round(end($inArray) + $average);
    }

    //echo average($temp_array);
    //echo "\n";
    //echo "$set_v : $count_value";
    $value = average($temp_array);
    
	   $query = "INSERT INTO `pokazaniya` (`tp_number`, `count_number`, `pok`, `date`) VALUES (\"$set_v\",\"$count_value\",\"$value\",\"$currentDate\")";
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
    $query = "DELETE FROM `pokazaniya` WHERE `id`=$id";
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
