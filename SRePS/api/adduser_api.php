<?php

$method = $_SERVER['REQUEST_METHOD'];

//Database Configuration
require_once('config.php');
$conn = mysqli_connect($host, $user, $password, $database);
mysqli_set_charset($conn,'utf8');
if($method!='POST'){
	header('X-PHP-Response-Code: 400', true, 400);
	die('Bad Request');	
}
if(!isset($_POST["staffname"]) || !isset($_POST["username"]) || !isset($_POST["password"])){
	header('X-PHP-Response-Code: 404', true, 404);
	die('missing parameters');		
}
$staffname = $_POST["staffname"];
$role = $_POST["role"];
$username = $_POST["username"];
$password = $_POST["password"];
$response=array();

$query = "SELECT Username FROM Staff WHERE Username = '$username'";
$result=mysqli_query($conn,$query);	
if (!$result) {
	header('X-PHP-Response-Code: 404', true, 404);
	die(mysqli_error($conn));
}	
if ($result->num_rows > 0) {
	$response['error'] = true;
	$response['message'] = 'Username not available';	
}else{
	$hashedPW = MD5($password);
	$query1 = "insert into Staff (Name,Role,Username,Pass) values ('$staffname', '$role', '$username', '$hashedPW')";	
	$result1=mysqli_query($conn,$query1);
	if(!$result1)
	{
		$response['error'] = true;
		$response['message'] = 'User creation failed.';	
		echo json_encode($response);
		die(mysqli_error($conn));
	}else{
		$response['error'] = false;
		$response['message'] = 'User created successfully.';				
	}		
}	
echo json_encode($response);	

mysqli_close($conn);
?>