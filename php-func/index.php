<?php

require __DIR__ . '../../vendor/autoload.php';

return function ($event) {
    $response = new \stdClass;
    $response->time = date(DATE_ISO8601);
    $response->random_number = rand(0,1024);
    $response->message = 'Hello ' . ($event['name'] ?? 'World!');

    $json_response = json_encode($response);
    return $json_response;
};
