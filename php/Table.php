<?
class Table
{
    private $data;
    private $header;

    function __construct($data, $header = array(), $is_button_add = false)
    {
        $this->data = $data;
        $this->header = $header;
        $this->is_button_add = $is_button_add;
    }

    private function addHeader($th){
        echo "\t<tr>\n";
        foreach($th as $head){
            echo "\t\t<th>$head</th>\n";
        }
        echo "\t<tr>\n";
    }

    private function addButton($className = "crossRemoveButton")
    {
        echo "\t\t<td>\n";
        echo "\t\t\t<div class = $className>\n";
        echo "\t\t\t</div>\n";
        echo "\t\t</td>\n";
    }

    function show()
    {
        /*$counter = 0;
        echo "<table>\n<tr>\n";
        foreach ($this->data as $value) {
            $counter++;
            echo "<td>\n$value\n</td>\n";
            if ($counter == $this->length) {
                echo "<td><div class = 'crossRemoveButton'></div></td>";
                echo "</tr>\n<tr>\n";
                $counter = 0;
            }

        }
        echo "</tr>\n</table>\n";*/
        echo "<table id = 'table'>\n";
        $this->addHeader($this->header);
        while($r = $this->data->fetch_assoc()){
            echo "\t<tr>\n";
            foreach($r as $val){
                echo "\t\t<td>$val</td>\n";
            }
            if ($this->is_button_add) $this->addButton();
            echo "\t</tr>\n";
        }
        echo "</table>\n";
    }
}

//$table = new Table($result, 5);
//$table->show();