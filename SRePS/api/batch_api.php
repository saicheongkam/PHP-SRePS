<?php
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

//check if valid
if($resrc!='product' && $resrc!='batch')
{
	header('X-PHP-Response-Code: 403', true, 403);
	die('Illegal Operation');
}



if (isset ($input))  {
	
	//Update a batch given id
	if($method=='PUT' && $resrc=='batch' && $id)
	{
		$id=intval($id);
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

		$sql="UPDATE Batch 
		SET $set
		WHERE Batch_ID=$id";

		//run query
		$result=mysqli_query($conn,$sql);
		if (!$result) {
			header('Content-Type: application/json');
			echo json_encode(array("error"=>"Query Failed","description"=>"Failed to Update batch to Database"));
				die(mysqli_error($conn));
		}
	}
	
	
	//add a new batch
	if($method=='POST' && $resrc=='batch')
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
		
		$sql="INSERT INTO Batch SET $set";
		//run query
		$result=mysqli_query($conn,$sql);
		if (!$result) {
			header('Content-Type: application/json');
			echo json_encode(array("error"=>"Query Failed","description"=>"Failed to Add batch to Database"));
				die(mysqli_error($conn));
		}
	}
//	// escape the columns and values from the input object
//	$saleColumns = array('SaleDate','Amount','Paid','Change','Staff_ID');
//	$values=array_values($input);
//
//	 
//	// build the SET part of the SQL command
//	$set = '';
//	for ($i=0;$i<count($saleColumns);$i++) {
//		$set.=($i>0?',':'').'`'.$saleColumns[$i].'`=';
//		$set.=($values[$i]===null?'NULL':''.(is_numeric($values[$i])?$values[$i]:'"'.$values[$i].'"').'');
//	}
//	
//	//get all items sold
//	$items=$input['Items'];
}
//get all product data based on batch id
if ($method=='GET' && $id && $resrc=='product')
{
	$id=intval($id);
	$query="SELECT b.Batch_ID, b.Quantity, b.ExpiryDate, b.Shelf
	FROM Batch b 
	WHERE b.Product_ID=$id";
	
	//run query
	$result=mysqli_query($conn,$query);
	if (!$result) {
  header('Content-Type: application/json');
			echo json_encode(array("error"=>"Query Failed","description"=>"Failed to retrieve batches from Database"));
				die(mysqli_error($conn));
}
	
	
	//set return header 
	header('Content-Type: application/json');
	$json=array();
	//generate json object from result
	while($row=mysqli_fetch_assoc($result))
	{
		$json[]=array(
		'batch_id'=>$row['Batch_ID'],
		'quantity'=>$row['Quantity'],
		'expirydate'=>$row['ExpiryDate'],
		'shelf'=>$row['Shelf']);
	}

	echo json_encode($json);
	
}

?>