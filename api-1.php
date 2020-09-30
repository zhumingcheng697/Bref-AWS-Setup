<?php
$props = array();
parse_str($_SERVER['QUERY_STRING'], $props);

$response = new \stdClass;
$response->time = date(DATE_ISO8601);
$response->message = 'Hello ' . ($props['name'] ?? 'World!');
$response->query = $props;

$json_response = json_encode($response);
echo $json_response;
?>