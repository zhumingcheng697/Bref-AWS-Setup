<?php

require __DIR__ . '/../vendor/autoload.php';

function send_email($mailto, $subject, $body) {
    $email_config = json_decode(file_get_contents(__DIR__ . '/../email.json'), true);

    $transport = (new Swift_SmtpTransport($email_config["host"], $email_config["port"], ($email_config["encryption"] ?? null) ? $email_config["encryption"] : null))
        ->setUsername($email_config["username"])
        ->setPassword($email_config["password"])
    ;

    $mailer = new Swift_Mailer($transport);

    $message = (new Swift_Message($subject))
        ->setFrom([$email_config["username"] => "PHP Email Lambda Test"])
        ->setTo([$mailto])
        ->setBody($body)
    ;

    return $mailer->send($message);
}

function send_default_email($subject, $body) {
    echo "Trying to send email to \"nyu-dining-test@outlook.com\"\n";

    try {
        $result = send_email("nyu-dining-test@outlook.com", $subject, $body);

        echo $result ? "Email sent successfully to \"nyu-dining-test@outlook.com\"\n" : "Email failed to send:\n" . $result . "\n";
    } catch (Exception $e) {
        echo "Email failed to send:\n" .  $e->getMessage() . "\n";
    }
}

(function() {
    $props = array();
    parse_str($_SERVER['QUERY_STRING'], $props);

    $mailto = $props["to"] ?? $props["mailto"] ?? "nyu-dining-test@outlook.com";
    $subject = $props["subject"] ?? "PHP Email Lambda Test (" . date(DATE_RFC2822) . ")";
    $body = $props["body"] ?? $props["msg"] ?? $props["message"] ?? "This is an automatic email sent using PHP Lambda.";

    if ($props["dev"] ?? false) {
        echo "email: " . $mailto . "\nsubject: " . $subject . "\nbody: " . $body . "\n";
    }

    if ($body == "devMode") {
        $body .= "\n\nComplex Data:\n\n";
        foreach ($props as $key => $value) {
            $body .= ($key . ":" . $value . "\n");
        }
    }

    try {
        $result = send_email($mailto, $subject, $body);

        if ($result) {
            echo "Email sent successfully to \"" . $mailto . "\"\n";
        } else {
            echo "Email failed to send:\n" . $result . "\n";

            send_default_email($subject, $body);
        }
    } catch (Exception $e) {
        echo "Email failed to send:\n" .  $e->getMessage() . "\n";

        send_default_email($subject, $body);
    }
})();

?>
