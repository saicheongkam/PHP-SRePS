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
//extract id if exist with uri
$id=preg_replace('/[^a-z0-9_]+/i','',array_shift($request));

if($resrc!='product' && $resrc!='batch' )
{
	header('X-PHP-Response-Code: 403', true, 403);
	die('Illegal Operation');
}

if(isset($input))
{
	if($method=='POST' && $resrc=='product')
	{
		$set='';
		$i=0;
		$columnNames=array_keys($input);
		//create query to add product
		foreach($columnNames as $columnName)
		{
			$set.=($i>0?',':'').$columnName.'=';
			$set.=(is_numeric($input[$columnName])?$input[$columnName]:'"'.$input[$columnName].'"');
			$i++;
		}
		
		$sql="INSERT INTO Product SET $set";
		//run query
		$result=mysqli_query($conn,$sql);
		if (!$result) {
			header('X-PHP-Response-Code: 404', true, 404);
			die(mysqli_error($conn));
		}
	}
}

//get all product data based on batch id
if ($method=='GET' && isset($id) && $resrc=='batch')
{
	$id=intval($id);
	$query="SELECT p.Description, p.UnitPrice
	FROM Batch b 
	INNER JOIN Product p
	ON b.Product_ID=p.Product_ID
	WHERE b.Batch_ID=$id";
	
	//run query
	$result=mysqli_query($conn,$query);
	if (!$result) {
  header('X-PHP-Response-Code: 404', true, 404);
  die(mysqli_error($conn));
}
	
	
	//set return header 
	header('Content-Type: application/json');
	$json=array();
	//generate json object from result
	while($row=mysqli_fetch_assoc($result))
	{
		$json['name']=$row['Description'];
		$json['price']=$row['UnitPrice'];
		
	}

	echo json_encode($json);
	
}

//get a a single product based on id supplied
if ($method=='GET' && isset($id) && $resrc=='product')
{
	$id=intval($id);
	$query="SELECT p.Description, p.UnitPrice, p.Reorderlevel, c.Description as Category
	FROM Product p 
	INNER JOIN Category c
	ON p.Category_ID=c.Category_ID
	WHERE p.Product_ID=$id";
	
	//run query
	$result=mysqli_query($conn,$query);
	if (!$result) {
  header('X-PHP-Response-Code: 404', true, 404);
  die(mysqli_error($conn));
}
	
	
	//set return header 
	header('Content-Type: application/json');
	$json=array();
	//generate json object from result
	while($row=mysqli_fetch_assoc($result))
	{
		$json['name']=$row['Description'];
		$json['price']=$row['UnitPrice'];
		$json['reOrderLevel']=$row['Reorderlevel'];
		$json['category']=$row['Category'];
	}

	echo json_encode($json);
	
}
	

mysqli_close($conn);

?>