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
$repType=preg_replace('/[^a-z0-9_]+/i','',array_shift($request));

if($resrc!='sales')
{
	header('X-PHP-Response-Code: 403', true, 403);
	die('Illegal Operation');
}

if($method=='GET' && $repType=='items')
{
	$query="SELECT t.Name AS Type, d.Name AS Drug, p.Description AS Product, SUM(si.QuantitySold) AS Sales
	FROM Sales s
	NATURAL JOIN SalesItem si
	NATURAL JOIN Batch b
	NATURAL JOIN Product p
	NATURAL JOIN Drug d JOIN Type t ON p.Type_ID = t.Type_ID
	GROUP BY p.Type_ID, p.Drug_ID, p.Product_ID";
	
	$result=mysqli_query($conn,$query);
			if (!$result) {
				header('Content-Type: application/json');
			echo json_encode(array("error"=>"Query Failed","description"=>"Failed to extract report from database"));
			header('X-PHP-Response-Code: 404', true, 404);
			die(mysqli_error($conn));
		}


		//set return header 
		header('Content-Type: application/json');
		$json=array();
		//generate json object from result
		while($row=mysqli_fetch_assoc($result))
		{
			$json[$row['Type']]['type']=$row['Type'];
			$json[$row['Type']]['drugs'][]=array(
			'drug'=>$row['Drug'],
			'products'=>array(
				'name'=>$row['Product'],
				'sold'=>$row['Sales'])
			);
		}
	$temp=array_values($json);

	//regenerate json object to correct format
	
	$final=array();
	foreach($temp as $type)
	{
		$final[$type['type']]['type']=$type['type'];
		$grp=array();
		foreach($type['drugs'] as $drug)
		{
			
			$grp[$drug['drug']]['drug']=$drug['drug'];
			$grp[$drug['drug']]['products'][]= array(
				'name'=>$drug['products']['name'],
				'sold'=>$drug['products']['sold']);

			
		}
		$final[$type['type']]['drugs']=array_values($grp);
		


	}
	echo json_encode(array_values($final));
//	print_r($final);
//	print_r($grp);
	
}
?>