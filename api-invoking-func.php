<?php declare(strict_types=1);

require __DIR__ . '/vendor/autoload.php';

return function ($event) {
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, "https://yyq5828qhf.execute-api.us-east-1.amazonaws.com/dev/2/?" . http_build_query($event));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    $output = curl_exec($curl);
    curl_close($curl);

    $response = new \stdClass;
    $response->time = date(DATE_ISO8601);
    $response->event = $event;
    $response->api_response = json_decode($output);

    $json_response = json_encode($response);
    return $json_response;
};