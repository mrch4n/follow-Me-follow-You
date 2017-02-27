<?php
session_start();
require_once 'int/conectMysql.php';
foreach ($_POST as $key => $value){
  ${$key} = $value;
};
$peerid = substr(session_id(), -6);

function groupExist($groupId){
  global $conn, $dbname;
  $stmt = $conn->prepare("SELECT groupId FROM $dbname WHERE groupId = ?");
  $stmt->bind_Param("s", $groupId);
  if(!$stmt->execute()){
    throw new Exception("SQL error.");
  };
  $stmt->store_result();
  // echo 'stmt-num ' . $stmt->num_rows;
  if($stmt->num_rows){
    // echo 'stmt-num true';
    return true;
  }else{
    // echo 'stmt-num false';
    return false;
  }
}

function peerExist($peerid){
  global $conn, $dbname;
  $stmt = $conn->prepare("SELECT deviceId FROM $dbname WHERE deviceId = ?");
  $stmt->bind_Param("s", $peerid);
  if(!$stmt->execute()){
    throw new Exception("SQL error.");
  };
  $stmt->store_result();
  if($stmt->num_rows){
    return true;
  }else{
    return false;
  }
}

// function peeridIsGroupid($peeris, $groupid){
//   global $conn, $dbname;
//   $stmt = $conn->prepare("SELECT groupId FROM $dbname WHERE deviceId = ? AND groupId = ?");
//   $stmt->bind_Param("ss", $peerid, $groupid);
//   if(!$stmt->execute()){
//     throw new Exception("SQL error.");
//   };
//   $stmt->store_result();
//   if($stmt->num_rows){
//     return true;
//   }else{
//     return false;
//   }
// }

function createGroup($peerid, $name){
  global $conn, $dbname;

  $groupid = $peerid;

  if( !groupExist($groupid) ){
    // echo '!groupExist($groupid)';
    $stmt = $conn->prepare("INSERT INTO $dbname (deviceId, groupId, name) VALUES (?,?,?)");
    $stmt->bind_Param("sss", $peerid, $groupid, $name);
    if(!$stmt->execute()){
      throw new Exception("INSERT SQL error.");
    }else{
      return true;
    };
  }else{
    // echo 'peeridIsGroupid($peerid, $groupid)';
    $stmt = $conn->prepare("UPDATE $dbname SET name = ?, groupId = ? WHERE deviceId = ?");
    $stmt->bind_Param("sss", $name, $groupid, $peerid);
    if(!$stmt->execute()){
      throw new Exception("UPDATE SQL error.");
    }else{
      return true;
    };
    return false;
  }
}

function joinGroup($peerid, $groupid, $name){
  global $conn, $dbname;
  if( groupExist($groupid) ){
    // echo 'groupexist';
    if( peerExist($peerid) ){
      // echo 'b';
      $stmt = $conn->prepare("UPDATE $dbname SET groupId = ?, name = ? WHERE deviceId = ?");
      $stmt->bind_Param("sss", $groupid, $name, $peerid );
    }else{
      // echo 'a';
      $stmt = $conn->prepare("INSERT INTO $dbname (deviceId, groupId, name) VALUES (?,?,?)");
      $stmt->bind_Param("sss", $peerid, $groupid, $name);
    }
    if( !$stmt->execute() ){
      echo $stmt->error;
      throw new Exception("SQL error.");
    }else{
      return true;
    };
  }else{
    return false;
  }
}

function updateLocation($peerid, $lat, $lng, $accuracy, $timestamp){
  global $conn, $dbname;
  if( peerExist($peerid) ){
    $stmt = $conn->prepare("UPDATE $dbname SET latitude = ?, longitude = ?, accuracy = ?, last_seen = ? WHERE deviceId = ?");
    $stmt->bind_Param("dddis", $lat, $lng, $accuracy, $timestamp, $peerid);
    if( !$stmt->execute() ){
      throw new Exception("SQL error." . $stmt->error);
    }else{
      return true;
    };
  }else{
    return false;
  }
}

function isPeerInGroup($peerid, $groupid){
  global $conn, $dbname;
  $stmt = $conn->prepare("SELECT deviceId FROM $dbname WHERE deviceId = ? AND groupId = ?");
  $stmt->bind_Param("ss", $peerid, $groupid);
  if(!$stmt->execute()){
    throw new Exception("SQL error.");
  };
  $stmt->store_result();
  if($stmt->num_rows){
    return true;
  }else{
    return false;
  }
}

function queryPeers($peerid, $groupid){
  global $conn, $dbname;
  // echo 'queryPeers: ' . $peerid;
  $peers = '{';
  if( isPeerInGroup($peerid, $groupid) ){
    // echo 'isPeerInGroup.';
    $stmt = $conn->prepare("SELECT deviceId, name, latitude, longitude, accuracy, last_seen FROM $dbname WHERE groupId = ? ");
    $stmt->bind_Param("s", $groupid);
    if( !$stmt->execute() ){
      throw new Exception("SQL error." . $stmt->error);
    }else{
      $stmt->bind_result($deviceId, $name, $lat, $lng, $accuracy, $lastSeen);
      while ($stmt->fetch()){
        $peer = "\"$deviceId\":{\"userId\":\"$deviceId\",\"latlng\":{\"lat\":$lat,\"lng\":$lng},\"accuracy\":$accuracy,\"name\":\"$name\",\"last_seen\":$lastSeen},";

        // ${$deviceId} = array ('name' => $name, 'lat' => $lat, 'lng' => $lng, 'accuracy' => $accuracy, 'lastSeem' => $lastSeen);
        // $peers = array_merge_recursive($peers, ${$deviceId});
        $peers .= $peer;
        // echo 'peers: ' . $peers;

        // print_r( ${$deviceId});
        // print_r($peers);
      }
      // echo 'peers: ' . $peers;
      $peers = rtrim($peers, ',');
      $peers .= '}';
      // $peers = json_encode($peers, JSON_FORCE_OBJECT);
      // echo 'prase: ' . $peers;
      return $peers;
      // return json_encode($peers, JSON_FORCE_OBJECT);
      // return true;
    };
  }else{
    return false;
  }
}



// $jsobject = '{"aaa":{"userId":"aaa","latlng":{"lat":1, "lng": 1},"accuracy":23,"name":"test","last_seen":"001"},"bbb":{"more":"this is more","userId":"bbb","latlng":{"lat":2, "lng": 0},"accuracy":230,"name":"test","last_seen":"001"},"ccc":{"userId":"ccc","latlng":{"lat":3, "lng": 0},"accuracy":23,"name":"test","last_seen":"001"},"ddd":{"userId":"ddd","latlng":{"lat":4, "lng": 0},"accuracy":44,"name":"test","last_seen":"001"}}';
// echo $jsobject;

// echo 'value: ' . $mlatitude;
// $arr = get_defined_vars();
// print_r($arr);
// echo $key;


switch ($action){

  case 'createGroup':
    try{
        if( !isset($peerid) || !isset($name) ) throw new Exception("API error.");
        if( createGroup($peerid, $name) ){
          echo 'success';
          // http_response_code(200); //http code 200 OK.
          break;
        };
    }
    catch(Exception $e){
      echo 'Error: '. $e->getMessage();
    }
    // http_response_code(400); //400 bad request.
    // echo " case createGroup";
  break;

  case "joinGroup":
    try{
        if( !isset($peerid) || !isset($name) || !isset($groupid) ) throw new Exception("API error.");
        if( joinGroup($peerid, $groupid, $name) ){
          echo 'success';
          // http_response_code(200); //http code 200 OK.
          break;
        }
    }
    catch(Exception $e){
      echo 'Error: '. $e->getMessage();
    }
    // http_response_code(400); //400 bad request.
    // echo "case joinGroup";
  break;

  case "updateLocation":
    try{
        if( !isset($peerid) || !isset($lat) || !isset($lng) || !isset($accuracy) || !isset($timestamp) ) throw new Exception("API error.");
        if( updateLocation($peerid, $lat, $lng, $accuracy, $timestamp) ){
          echo 'success';
          // http_response_code(200); //http code 200 OK.
          break;
        }else{
          echo 'fail';
        }
    }
    catch(Exception $e){
      echo 'Error: '. $e->getMessage();
    }
    // echo "case updateLocation";
  break;

  case "queryPeers":
  try{
      if(  !isset($groupid) ) throw new Exception("API error.");
      if( $peers = queryPeers($peerid, $groupid) ){
        // echo 'success';
        echo $peers;
        // http_response_code(200); //http code 200 OK.
        break;
      }
  }
  catch(Exception $e){
    echo 'Error: '. $e->getMessage();
  }
  break;

  default:
    http_response_code(406); //http code 406 Not Acceptable.
  break;
}


?>
