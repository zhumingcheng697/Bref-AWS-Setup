<?php declare(strict_types=1);

require __DIR__ . '/vendor/autoload.php';

return function ($event) {
    $lambda = new \Aws\Lambda\LambdaClient([
        'version' => 'latest',
        'region' => 'us-east-1',
    ]);

    $result = $lambda->invoke([
        'FunctionName' => 'app-dev-function-test',
        'InvocationType' => 'RequestResponse',
        'LogType' => 'None',
        'Payload' => json_encode($event),
    ]);

    $response = new \stdClass;
    $response->time = date(DATE_ISO8601);
    $response->query = $event;
    $response->api_response = json_decode(json_decode($result->get('Payload')->getContents(), true));

    $json_response = json_encode($response);
    return $json_response;
};