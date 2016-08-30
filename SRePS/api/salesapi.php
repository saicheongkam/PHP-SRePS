<?php

//NOTE Ensure that all dates are in yyyy/mm/dd format before entering to database

// get the HTTP method, path and body of the request
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));
$input = json_decode(file_get_contents('php://input'),true);

// connect to the mysql database
// Update he connection string accordingly

//Update from the config.php
require_once('config.php');
$conn = mysqli_connect($host, $user, $password, $database);
mysqli_set_charset($conn,'utf8');


// retrieve the resource asked
$resrc = preg_replace('/[^a-z0-9_]+/i','',array_shift($request));
if($resrc!='sales')
{
	header('X-PHP-Response-Code: 403', true, 403);
	die('Illegal Operation');
}
//extract id if exist with uri
$id=array_shift($request);
//extract data from json input
if (isset ($input))  {
	// escape the columns and values from the input object
	$saleColumns = array('SaleDate','Amount','Paid','Change','Staff_ID');
	$values=array_values($input);

	 
	// build the SET part of the SQL command
	$set = '';
	for ($i=0;$i<count($saleColumns);$i++) {
		$set.=($i>0?',':'').'`'.$saleColumns[$i].'`=';
		$set.=($values[$i]===null?'NULL':''.(is_numeric($values[$i])?$values[$i]:'"'.$values[$i].'"').'');
	}
}


if($method=='POST')
{
	var_dump($set);
	$sql="insert into `Sales` set $set";
	$result=mysqli_query($conn,$sql);
	
	if(!$result)
	{
		die(mysqli_error($conn));
	}
}
//get all sales data
if ($method == 'GET')
{
	$query1="SELECT s.Sale_ID, s.SaleDate, s.Amount
FROM Sales s
INNER JOIN Staff staff ON s.Staff_ID = staff.Staff_ID
INNER JOIN SalesItem si ON s.Sale_ID = si.Sale_ID
INNER JOIN Batch b ON si.Batch_ID = b.Batch_ID
INNER JOIN Product p ON b.Product_ID = p.Product_ID
ORDER BY s.Sale_ID";
	//run query
	$result1=mysqli_query($conn,$query1);
	if (!$result1) {
  header('X-PHP-Response-Code: 404', true, 404);
  die(mysqli_error($conn));
}
	
	
	//set return header 
	header('Content-Type: application/json');
	$json=array();
	//generate json object from result
	while($row=mysqli_fetch_assoc($result1))
	{
		$json[$row['Sale_ID']]['id']=$row['Sale_ID'];
		$json[$row['Sale_ID']]['date']=$row['SaleDate'];
		$json[$row['Sale_ID']]['amount']=$row['Amount'];
	}

	echo json_encode(array_values($json));
	
}
 
	

mysqli_close($conn);

?>