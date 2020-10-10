<?php

require __DIR__ . '../../vendor/autoload.php';

$props = array();
parse_str($_SERVER['QUERY_STRING'], $props);

$lambda = new \Aws\Lambda\LambdaClient([
    'version' => 'latest',
    'region' => 'us-east-1',
]);

$result = $lambda->invoke([
    'FunctionName' => 'app-dev-function-test',
    'InvocationType' => 'RequestResponse',
    'LogType' => 'None',
    'Payload' => json_encode($props),
]);

$response = new \stdClass;
$response->time = date(DATE_ISO8601);
$response->query = $props;
$response->func_response = json_decode(json_decode($result->get('Payload')->getContents(), true));

$json_response = json_encode($response);
echo $json_response;
?>