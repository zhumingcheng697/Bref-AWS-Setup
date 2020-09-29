<?php

require __DIR__ . '/vendor/autoload.php';

function send_email($mailto, $subject, $body) {
    $transport = (new Swift_SmtpTransport("smtp-mail.outlook.com", 587, "tls"))
        ->setUsername("nyu-dining-test@outlook.com")
        ->setPassword("Dining*2020")
    ;

    $mailer = new Swift_Mailer($transport);

    $message = (new Swift_Message($subject))
        ->setFrom(["nyu-dining-test@outlook.com" => "PHP Email Lambda Test"])
        ->setTo([$mailto])
        ->setBody($body)
    ;

    return $mailer->send($message);
}

function send_default_email($subject, $body) {
    echo "Trying to send email to \"nyu-dining-test@outlook.com\"\n";

    try {
        $result = send_email("nyu-dining-test@outlook.com", $subject, $body);

        echo $result ? "Email sent successfully to \"nyu-dining-test@outlook.com\"\n" : "Email failed to send: " . $result . "\n";
    } catch (Exception $e) {
        echo "Email failed to send: " .  $e->getMessage() . "\n";
    }
}

(function() {
    $params = array();
    parse_str($_SERVER['QUERY_STRING'], $params);

    $mailto = $params["to"] ?? $params["mailto"] ?? "nyu-dining-test@outlook.com";
    $subject = $params["subject"] ?? "PHP Email Lambda Test (" . date(DATE_RFC2822) . ")";
    $body = $params["body"] ?? $params["msg"] ?? $params["message"] ?? "This is an automatic email sent using PHP Lambda.";

    if ($params["dev"] ?? false) {
        echo "email: " . $mailto . "\nsubject: " . $subject . "\nbody: " . $body . "\n";
    }

    try {
        $result = send_email($mailto, $subject, $body);

        if ($result) {
            echo "Email sent successfully to \"" . $mailto . "\"\n";
        } else {
            echo "Email failed to send: " . $result . "\n";

            send_default_email($subject, $body);
        }
    } catch (Exception $e) {
        echo "Email failed to send: " .  $e->getMessage() . "\n";

        send_default_email($subject, $body);
    }
})();

?>