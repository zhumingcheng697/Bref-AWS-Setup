<?php
$props = array();
parse_str($_SERVER['QUERY_STRING'], $props);

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, "https://yyq5828qhf.execute-api.us-east-1.amazonaws.com/dev/1/?" . $_SERVER['QUERY_STRING']);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
$output = curl_exec($curl);
curl_close($curl);

$response = new \stdClass;
$response->time = date(DATE_ISO8601);
$response->query = $props;
$response->api_response = json_decode($output);

$json_response = json_encode($response);
echo $json_response;
?>