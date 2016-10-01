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
if(!isset($_POST["username"]) || !isset($_POST["password"])){
	header('X-PHP-Response-Code: 404', true, 404);
	die('missing parameters');		
}
$username = $_POST["username"];
$password = $_POST["password"];
if($username && $password){
	$query = "SELECT Staff_ID,Name,Role,Username,Pass FROM Staff WHERE Username = '$username'";
	$result=mysqli_query($conn,$query);	
	if (!$result) {
		header('X-PHP-Response-Code: 404', true, 404);
		die(mysqli_error($conn));
	}	
	if ($result->num_rows > 0) {
		//set return header 
		header('Content-Type: application/json');
		$response=array();
		$row = $result->fetch_row();
		$userid = $row[0];
		$name = $row[1];
		$role = $row[2];
		$username = $row[3];
		$pass = $row[4];		
		if(MD5($password) === $pass){		
			$response['error'] = false;
			$response['message'] = 'Success';	
			$response['name'] = $name;
			$response['userid'] = $userid;
			$response['role'] = $role;
			$response['username'] = $username;
			//User session storage
            $_SESSION['loggedin'] = true;
            $_SESSION['username'] = $username;	
			$_SESSION['userid'] = $userid;
			$_SESSION['role'] = $role;
		}else{
			$response['error'] = true;
			$response['message'] = 'Invalid Password';				
		}
	}else{
		$response['error'] = true;
		$response['message'] = 'Invalid Username';			
	}	
	echo json_encode($response);	
}else{
	header('X-PHP-Response-Code: 404', true, 404);
	die('missing parameters');		
}
mysqli_close($conn);
?>