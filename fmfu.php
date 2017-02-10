<?php
require_once 'int/conectMysql.php';

$myCode = $_POST['mCode'];
$mylatitude = $_POST['mlatitude'];
$mylongitude = $_POST['mlongitude'];
$uCode = $_POST['youCode'];

$stmt = $conn->prepare("INSERT INTO ext_userloc (deviceId, latitude, longitude) VALUES (?,?,?)");

$stmt->bind_Param("sss", $myCode, $mylatitude, $mylongitude);

if($stmt->execute()){
	// echo "sql insert success.";
}else{
	echo "sql insert fail.";
}

$stmt->close();

if ($uCode <> null) {

	$stmt = $conn->prepare("SELECT latitude, longitude FROM ext_userloc WHERE deviceId=? ORDER BY no DESC LIMIT 1");

	$stmt->bind_Param("s", $uCode);

	$stmt->execute();

	$stmt->bind_result($lat, $long);

	while ($stmt->fetch()){
		$output = array('lat' => $lat, 'lng'=> $long);
	}

	$latlong =  json_encode($output, JSON_FORCE_OBJECT);
	echo $latlong;

}
$conn->close();
?>
