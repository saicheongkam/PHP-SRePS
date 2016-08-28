<?php
// Note this code is updated to correctly support the get function

// get the HTTP method, path and body of the request
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));
$input = json_decode(file_get_contents('php://input'),true);

// connect to the mysql database
// Update he connection string accordingly
$conn = mysqli_connect('mysql.ict.swin.edu.au', 's100669579', '100196', 's100669579_db');
mysqli_set_charset($conn,'utf8');


// retrieve the resource asked
$resrc = preg_replace('/[^a-z0-9_]+/i','',array_shift($request));

//extract id if exist with uri
$id=array_shift($request);

//get all sales data
if ($method == 'GET')
{
	$query1="SELECT s.Sale_ID, s.SaleDate, s.Amount, si.Batch_ID, p.Description
FROM Sales s
INNER JOIN SalesItem si ON s.Sale_ID = si.Sale_ID
INNER JOIN Batch b ON si.Batch_ID = b.Batch_ID
INNER JOIN Product p ON b.Product_ID = p.Product_ID";
	//run query
	$result1=mysqli_query($conn,$query1);
	if (!$result1) {
  header('X-PHP-Response-Code: 404', true, 404);
  die(mysqli_error($conn));
}
	
	
	//set return header 
	header('Content-Type: application/json');
	echo '[';
	for ($i=0;$i<mysqli_num_rows($result1);$i++) {
    echo ($i>0?',':'').json_encode(mysqli_fetch_object($result1));
  }
	echo ']';
}
echo $id;
mysqli_close($conn);

?>