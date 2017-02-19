<?php
require_once 'int/fmfu.config.php';
$domainName = FMFU_DOMAIN;
session_start();
if (isset($_GET["m"])){
	$sessioncode = $_GET["m"];
}else{
	$sessioncode = 	substr(session_id(), -6);
}
?>
<!DOCTYPE html>
<html>
<head>
	<link rel="stylesheet" media="screen" href="css/index.css" >
	<meta content="width=device-width initial-scale=1.0" name="viewport"/>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
	<script src="js/bootstrap.min.js"></script>
	<link rel="stylesheet" href="css/bootstrap.min.css" >
	<title> Follow Me Follow You</title>
</head>
<body>
	<?php
	echo "<div id='sessionid' class='hidden'>".$sessioncode."</div>"; //echo session id into a hidden div
	?>
	<div id="appTitle">
		<span>Follow Me Follow You</span>
		<button id="settings" type="button" class="btn btn-default btn-sm pull-right" data-toggle="modal" data-target=".panelFmfu"><span class="glyphicon glyphicon-option-vertical" aria-hidden="true"></span></button>
	</div>
	<div id="map"></div>
	<div class="modal fade panelFmfu" tabindex="-1" role="dialog" aria-labelledby="Setting">
		<div class="modal-dialog modal-lg" role="document">
			<div class="modal-content">
				<div id="panelFmfu">
					<button type="button" class="btn btn-default pull-right" data-dismiss="modal" name="button"><span aria-hidden="true" class="glyphicon glyphicon-remove"></span></button>
					<div class="panelTitle">Follow Me Follow You</div>
					<div class="container">
						<br>
						<div class="input-group">
							<span class="input-group-addon" id="myCode">MyCode: </span>
							<span id="myCodeBox" type="text" class="form-control" aria-describedby="myCode">test</span>
						</div>
						<br>
						<div class="btn-group">
							<button type="button" class="btn btn-default btn-md pull-right"><span class="glyphicon glyphicon-duplicate"></span></button>
							<?php
							echo '<a class="pull-right" href="whatsapp://send?text=' .$domainName. '/?u=' .substr($sessioncode, -6). '" data-action="share/whatsapp/share"><img src="imgs/WhatsApp30x30.png" width="34" height="34" alt="WhatsApp Share!" /></a>';
							echo '<a class="pull-right" href="http://line.me/R/msg/text/?' .$domainName. '/?u=' .substr($sessioncode, -6). '"><img src="imgs/line30x30.png" width="34" height="34" alt="LINE it!" /></a>';
							?>
						</div>
						<br>
						<br>
						<div class="input-group">
							<span class="input-group-addon" id="uCode">U: </span>
							<?php
							if (isset($_GET["u"])){
								$u = $_GET["u"];
								echo "<input id='uCodeInput' value='$u' aria-describedby='uCode' placeholder='Put your fds code here.' ></input>";
							}else{
								echo "<input id='uCodeInput' aria-describedby='uCode' placeholder='Put your fds code here.'></input>";
							}
							?>
						</div>
						<br>
						<label for="highAccuSlider">High Accueacy:</label>
						<select name="highAccuSlider" id="highAccuracy" data-role="slider">
							<option value="false">Off</option>
							<option value="true" default>On</option>
						</select>
						<br>
						<label for="updateFrequency-fill">Update frequency: <span id="updateFrequency"></span></label>
						<input type="range" name="updateFrequency-fill" id="updateFrequency-fill" value="5" min="3" max="15" step="1" data-highlight="true">
						<br>
						<button id="startPButton" type="button" class="btn btn-success start pButton btn-block" onclick="startPos()">Start</button>
						<button id="stopPButton" type="button" class="btn btn-default stop pButton btn-block" onclick="stopLocation()">Stop</button>
						<br>
					</div>
				</div><!-- id="panelFmfu" -->
			</div>
		</div>
	</div>
	<?php echo "<script> var gMapKey = '" . GOOGLE_MAP_JAVASCRIPT_API . "';</script>"?>
	<script src='js/index.js'></script>
</body></html>
