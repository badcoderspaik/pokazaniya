<?

class DbConnector
{
    public $db;

    function __construct($host, $username, $password, $dbname)
    {
        $this->db = new mysqli($host, $username, $password, $dbname);
    }

    public function select($query, $show = true)
    {
        $result = $this->db->query($query);
        if ($show) {
            while ($row = $result->fetch_row()) {
                foreach ($row as $column) {
                    echo "$column,";
                }
            }
        }
        return $this->db->query($query);
    }

    public function insert($query)
    {
        $result = $this->db->query($query);
        return $result;
    }

    public function delete($query)
    {
        $result = $this->db->query($query);
        return $result;
    }

    public function update($query)
    {
        $result = $this->db->query($query);
        return $result;
    }
}