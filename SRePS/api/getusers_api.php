<?php
$method = $_SERVER['REQUEST_METHOD'];

//Database Configuration
require_once('config.php');
$conn = mysqli_connect($host, $user, $password, $database);
mysqli_set_charset($conn,'utf8');

if($method!='GET'){
	header('X-PHP-Response-Code: 400', true, 400);
	die('Bad Request');	
}

$query = "SELECT Staff_ID,Name,Role,Username FROM Staff Order by Staff_ID";
$result=mysqli_query($conn,$query);	
if (!$result) {
	header('X-PHP-Response-Code: 404', true, 404);
	die(mysqli_error($conn));
}	
$response=array();
while($row = mysqli_fetch_assoc($result)) {
	$response[] = $row;
}
echo json_encode($response);
$result->close();
$conn->close();
?>