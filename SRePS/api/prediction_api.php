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
	if(preg_match('/^\d{4}$/',$query['year']) && preg_match('/^\d{2}$/',$query['month']))
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
	
	
	$query="SELECT month(SaleDate) as month,year(SaleDate) as year , sum(Amount) as Total
	FROM `sales`
	WHERE month(SaleDate) =$month and year(SaleDate)<$year
	GROUP BY month(SaleDate),year(SaleDate)";
	
	$result=mysqli_query($conn,$query);
			if (!$result) {
				header('Content-Type: application/json');
			echo json_encode(array("error"=>"Query Failed","description"=>"Failed to get sales monthly forecast from database"));
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
				'month'=>$row['year']."-".$row['month'],
				'total'=>$row['Total']
			);
		}
	
	echo json_encode($json);

	
	
}
?>