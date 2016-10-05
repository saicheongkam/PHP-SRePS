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
		//extract parameters from the query string
	parse_str($_SERVER['QUERY_STRING'], $query);
	
	if(!$query)
	{
		header('Content-Type: application/json');
			echo json_encode(array("error"=>"Bad Call","description"=>"Invalid API Call"));
			header('X-PHP-Response-Code: 404', true, 404);
			die(mysqli_error($conn));
	}
	//check if date format correct
	if(preg_match('/^\d{4}-\d{2}-\d{2}$/',$query['start']) && preg_match('/^\d{4}-\d{2}-\d{2}$/',$query['end']))
	{
		$start=$query['start'];
		$end=$query['end'];
	}
	else
	{
		header('Content-Type: application/json');
			echo json_encode(array("error"=>"Invalid Date","description"=>"Dates not in correct format"));
			header('X-PHP-Response-Code: 404', true, 404);
			die(mysqli_error($conn));
	}
	
	//Modified to include nulls when a product is never sold 
	$query="SELECT t.Name AS Type, d.Name AS Drug, p.Description AS Product, COALESCE(SUM(si.QuantitySold * p.UnitPrice),0) AS Sales
FROM Product p
NATURAL LEFT JOIN Batch b
NATURAL LEFT JOIN SalesItem si
NATURAL LEFT JOIN Sales s
NATURAL LEFT JOIN Drug d
LEFT JOIN Type t ON p.Type_ID = t.Type_ID
WHERE ( s.SaleDate >='$start' AND s.SaleDate<='$end' ) OR (s.SaleDate IS NULL)
GROUP BY  p.Type_ID, p.Drug_ID, p.Product_ID 
ORDER BY Sales DESC, Type";
	
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

if($method=='GET' && $repType=='sale')
{
		//extract parameters from the query string
	parse_str($_SERVER['QUERY_STRING'], $query);
	
	if(!$query)
	{
		header('Content-Type: application/json');
			echo json_encode(array("error"=>"Bad Call","description"=>"Invalid API Call"));
			header('X-PHP-Response-Code: 404', true, 404);
			die(mysqli_error($conn));
	}
	//check if date format correct
	if(preg_match('/^\d{4}$/',$query['year']) && preg_match('/^\d{1,2}$/',$query['month']))
	{
		$month=$query['month'];
		$year=$query['year'];
	}
	else
	{
		header('Content-Type: application/json');
			echo json_encode(array("error"=>"Invalid Date","description"=>"Dates not in correct format"));
			header('X-PHP-Response-Code: 404', true, 404);
			die(mysqli_error($conn));
	}
	
	
	$query="SELECT SaleDate as Date,sum(Amount) as Total
	FROM `sales`
	WHERE month(SaleDate) =$month and year(SaleDate)=$year
	GROUP BY SaleDate";
	
	$result=mysqli_query($conn,$query);
			if (!$result) {
				header('Content-Type: application/json');
			echo json_encode(array("error"=>"Query Failed","description"=>"Failed to get sales monthly report from database"));
			header('X-PHP-Response-Code: 404', true, 404);
			die(mysqli_error($conn));
		}


		//set return header 
		header('Content-Type: application/json');
		$json=array();
		//generate json object from result
		while($row=mysqli_fetch_assoc($result))
		{
			$json[]=array(
				'date'=>$row['Date'],
				'total'=>$row['Total']
			);
		}
	
	echo json_encode($json);

	
	
}
?>