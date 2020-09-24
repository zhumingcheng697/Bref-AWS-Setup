<?php
$params = array();
parse_str($_SERVER['QUERY_STRING'], $params);

$response = new \stdClass;
$response->time = date(DATE_ISO8601);
$response->random_number = rand(0,1024);
$response->query = $params;

$json_response = json_encode($response);
echo $json_response;
?>