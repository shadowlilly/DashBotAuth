<?php
if(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'node-xmlhttprequest')
{    

echo getenv("localtoken");

} else {

echo "1-800-GO-BUCK-YOURSELF";

}
?>
