<?php
$params = array();
parse_str($_SERVER['QUERY_STRING'], $params);

$mailto = $params[0] ?? $params["email"] ?? $params["to"] ?? $params["mailto"] ?? "nyu-dining-test@outlook.com";
$subject = $params["subject"] ?? "PHP Email Lambda Test (" . date(DATE_RFC2822) . ")";
$body = $params["body"] ?? $params["msg"] ?? $params["message"] ?? "This is an automatic email sent using PHP Lambda.";

echo "email: " . $mailto . "\nsubject: " . $subject . "\nbody: " . $body . "\n";

try {
    $result = mail($mailto, $subject, $body);

    echo $result . "\n";

    if ($result) {
        echo "Email sent successfully to \"" . $mailto . "\"";
    } else {
        echo "Email failed to send";
    }
} catch (Exception $e) {
    echo 'Caught exception: ',  $e->getMessage(), "\n";
}
?>