<?php
if(!empty($_SERVER['HTTP_USER_AGENT']) && strtolower($_SERVER['HTTP_USER_AGENT']) == 'node-xmlhttprequest')
{    

echo getenv("localtoken");

} else {

echo "1-800-GO-BUCK-YOURSELF";

}
?>
