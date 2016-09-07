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
//check if valid
if($resrc!='type')
{
	header('X-PHP-Response-Code: 403', true, 403);
	die('Illegal Operation');
}
//extract id if exist with uri
$id=array_shift($request);

if($resrc=='type')
{
	//get type names
	if($method=='GET' && !$id)
	{
		$sql="SELECT t.Type_ID,t.Name 
				FROM Type t 
				ORDER BY t.TYPE_ID";
		$result=mysqli_query($conn,$sql);

			if(!$result)
			{
				header('Content-Type: application/json');
			echo json_encode(array("error"=>"Query Failed","description"=>"Failed to Retrieve Drug types from Database"));
				die(mysqli_error($conn));
			}
		
		//set return header 
			header('Content-Type: application/json');
			$json=array();
			//generate json object from result
			while($row=mysqli_fetch_assoc($result))
			{
				$json[]=array(
				'id'=>$row['Type_ID'],
				'name'=>$row['Name']
				);
			}
		echo json_encode($json);
	}
}

?>