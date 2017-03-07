<?php
require_once 'int/fmfu.config.php';
$domainName = FMFU_DOMAIN;
session_start();
if (isset($_GET["m"])){
  $sessioncode = $_GET["m"];
}else{
  $sessioncode = 	substr(session_id(), -6);
}

if (isset($_GET['rg'])){
  session_regenerate_id(true);
  $sessioncode = 	substr(session_id(), -6);
}
?>
<!DOCTYPE html>
<html>
<head>
  <meta content="width=device-width initial-scale=1.0" name="viewport"/>
  <!--Import Google Icon Font-->
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <!--Import materialize.css-->
  <link rel="stylesheet" href="css/materialize.css">
  <link rel="stylesheet" media="screen" href="css/index.css" >
  <link rel="stylesheet" media="screen" href="css/index2.css" >
  <title> Follow Me Follow You</title>
</head>
<body>

  <?php
  echo "<div id='peerid' class='hidden'>".$sessioncode."</div>"; //echo session id into a hidden div
  echo "<div id='domainUrl' class='hidden'>".$domainName."</div>"; //echo session id into a hidden div

  ?>

  <nav>
    <div class="nav-wrapper">
      <div class="container">
        <!-- <div class="row"> -->

          <!-- <div class="col s8 collection"> -->
          <span style="color:black;">
          <i style="display: inline; font-size: 35px;" class="material-icons">person_pin<span id="noOfPeer" class="badge">0</span></i>

        </span>
            <!-- <span class="black-text">Follow Me Follow You</span> -->
            <!-- <a class="collection-item"> -->
              <!-- <i style="display:inline;" class="material-icons">person_pin</i> -->
              <!-- <span class="new badge">9</span> -->
            <!-- </a> -->
          <!-- </div> -->

          <!-- <div class="col push-s4"> -->
            <ul class="right">
              <a class="waves-effect waves-light btn settingBtn" href="#panelFmfu"><i class="material-icons">settings</i></a>
            </ul>
          <!-- </div> -->

        </div>
      </div>
    </div>
  </nav>

  <div id="map"></div>

  <div id="panelFmfu" class="modal bottom-sheet" >

    <div class="modal-content">
      <div class="row">
        <div class="col s12">
          <div class="col s7">
            <span>Location High Accueacy:</span>
          </div>
          <div name="highAccuSlider" class="switch">
            <label>
              Off
              <input type="checkbox" id="highAccuracy">
              <span class="lever"></span>
              On
            </label>
          </div>
        </div>
      </div><!-- div class row -->

      <!-- <div class="row">
      <div class="col s12">
      <span>Update frequency:</span>
      <p class="range-field">
      <input type="range" id="updateFrequency-fill" value="5" min="3" max="15"/>
    </p>
  </div>
</div> -->

<div class="row">

  <div class="col s12">
    <ul class="tabs">
      <li class="tab col s6"><a href="#panelCreateGroup">Create Group</a></li>
      <li class="tab col s6"><a href="#panelJoinGroup">Join Group</a></li>
    </ul>
  </div>


  <!-- Create group pannel -->
  <div id="panelCreateGroup" class="col s12">
    <span>Enter your name to create a group.</span>

    <form class="col s12">
      <div class="row">
        <div class="input-field col s10">
          <i class="material-icons prefix">location_on</i>
          <input id="cgrpid" type="text" class="validate" disabled>
          <label for="cgrpid">Group ID</label>
        </div>
        <div class="input-field col s10">
          <i class="material-icons prefix">account_circle</i>
          <input id="cgrpname" type="text" class="validate inputName">
          <label for="cgrpname">Your Name</label>
        </div>
      </div>
    </form>

    <!-- <div class="row center horizontal">
      <button id="startPButton" type="button" class="btn center" onclick="startPos()"><i class="material-icons">done</i></button>
      <button id="stopPButton" type="button" class="btn center" onclick="stopLocation()"><i class="material-icons">cancel</i></button>
    </div> -->

  </div><!-- id="panelCreateGroup" -->


  <!-- Join group pannel -->
  <div id="panelJoinGroup" class="col s12">
    <span>Enter your name and Group ID to share your location with your peers.</span>
    <form class="col s12">
      <div class="row">
        <div class="input-field col s10">
          <i class="material-icons prefix">location_on</i>

          <?php
          if (isset($_GET["g"])){
            $u = $_GET["g"];
            echo "<input id='jgrpid' value='$u' type='text'></input>";
          }else{
            echo "<input id='jgrpid' value='' type='text'></input>";
          }
          ?>


          <!-- <input id="jgrpid" type="text" class="validate" value=""> -->
          <label for="jgrpid">Group ID</label>
        </div>
        <div class="input-field col s10">
          <i class="material-icons prefix">account_circle</i>
          <input id="jgrpname" type="text" class="validate inputName">
          <label for="jgrpname">Your Name</label>
        </div>
      </div>
    </form>



  </div><!-- id="panelJoinGroup" -->

    <div class="row center horizontal">
      <button id="startPButton" type="button" class="btn center" onclick="startPos()"><i class="material-icons">done</i></button>
      <button id="stopPButton" type="button" class="btn center" onclick="stopLocation()"><i class="material-icons">cancel</i></button>
    </div>

      <div class="col s4">
        <div class="fixed-action-btn click-to-toggle">
          <a class="btn-floating btn green">
            <i class="large material-icons">share</i>
          </a>
          <ul>
            <?php
            echo '<li class="waves-effect waves-light"><a id="shareWhap" href="whatsapp://send?text=' .$domainName. '/?g=' .substr($sessioncode, -6). '" data-action="share/whatsapp/share"><img src="imgs/WhatsApp30x30.png" width="34" height="34" alt="WhatsApp Share!" /></a></li>';
            echo '<li class="waves-effect waves-light"><a id="shareLine" href="http://line.me/R/msg/text/?' .$domainName. '/?g=' .substr($sessioncode, -6). '"><img src="imgs/line30x30.png" width="34" height="34" alt="LINE it!" /></a></li>';
            echo '<li class="waves-effect waves-light"><a id="copyBtn" href="#" ><i class="material-icons">content_copy</i></a></li>';
            ?>
          </ul>
        </div>
      </div><!-- class="col s4" -->

    </div><!-- class="row" -->
  </div><!-- class="modal-content" -->
</div><!-- id="panelFmfu" class="modal bottom-sheet" -->
<?php echo "<script> var gMapKey = '" . GOOGLE_MAP_JAVASCRIPT_API . "';</script>"?>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.0/js/materialize.js"></script>
<script src='js/marker.class.js'></script>
<script src='js/index.js'></script>

</body></html>
