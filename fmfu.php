<?php
require_once 'int/conectMysql.php';

if( isset($_POST['mCode']) )
{
	$myCode = $_POST['mCode'];
}

if( isset($_POST['mlatitude']) )
{
	$mylatitude = $_POST['mlatitude'];
}

if( isset($_POST['mlongitude']) )
{
	$mylongitude = $_POST['mlongitude'];
}

if( isset($_POST['maccuracy']) )
{
	$myaccuracy = $_POST['maccuracy'];
}

if( isset($_POST['youCode']) )
{
	$uCode = $_POST['youCode'];
}

if(isset($myCode)){
	$stmt = $conn->prepare("INSERT INTO $dbname (deviceId, latitude, longitude, accuracy) VALUES (?,?,?,?)");
	$stmt->bind_Param("ssss", $myCode, $mylatitude, $mylongitude, $myaccuracy);
	if($stmt->execute()){
		// echo "sql insert success.";
	}else{
		// echo "sql insert fail." . $conn->error;
	}
	$stmt->close();
}

if ( $uCode != ''){
	$stmt = $conn->prepare("SELECT latitude, longitude, accuracy FROM $dbname WHERE deviceId=? ORDER BY no DESC LIMIT 1");
	$stmt->bind_Param("s", $uCode);
	$stmt->execute();
	$stmt->store_result();
	if($stmt->num_rows > 0){
		$stmt->bind_result($lat, $long, $accuracy);
		while ($stmt->fetch()){
			$output = array('lat' => $lat, 'lng'=> $long, 'accuracy' => $accuracy);
		}
		// echo '$output: ' . $output;
		$latlong =  json_encode($output, JSON_FORCE_OBJECT);
		echo $latlong;
	}
}
$conn->close();
?>
