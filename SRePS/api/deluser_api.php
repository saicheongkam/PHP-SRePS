<?php
session_start();
$method = $_SERVER['REQUEST_METHOD'];

//Database Configuration
require_once('config.php');
$conn = mysqli_connect($host, $user, $password, $database);
mysqli_set_charset($conn,'utf8');

if($method!='POST'){
	header('X-PHP-Response-Code: 400', true, 400);
	die('Bad Request');	
}

if(!isset($_SESSION['loggedin'])){
	header('X-PHP-Response-Code: 401', true, 401);
	die('Unauthorized access');		
}

if(!isset($_POST["id"])){
	header('X-PHP-Response-Code: 404', true, 404);
	die('missing parameters');		
}
$id = $_POST["id"];
$response=array();
$query = "DELETE FROM Staff WHERE Staff_ID= '$id'";
$result=mysqli_query($conn,$query);	
if(!$result)
{
	$response['error'] = true;
	$response['message'] = 'Failed';	
	echo json_encode($response);
	die(mysqli_error($conn));
}else{
	$response['error'] = false;
	$response['message'] = 'Deleted';				
}
echo json_encode($response);	
mysqli_close($conn);
?>