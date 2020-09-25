<?php

require __DIR__ . '/vendor/autoload.php';

$params = array();
parse_str($_SERVER['QUERY_STRING'], $params);

$lambda = new \Aws\Lambda\LambdaClient([
    'version' => 'latest',
    'region' => 'us-east-1',
]);

$result = $lambda->invoke([
    'FunctionName' => 'app-dev-function-test',
    'InvocationType' => 'RequestResponse',
    'LogType' => 'None',
    'Payload' => json_encode($params),
]);

$response = new \stdClass;
$response->time = date(DATE_ISO8601);
$response->query = $params;
$response->api_response = json_decode(json_decode($result->get('Payload')->getContents(), true));

$json_response = json_encode($response);
echo $json_response;
?>