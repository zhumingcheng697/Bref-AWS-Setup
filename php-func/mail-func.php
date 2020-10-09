<?php

require __DIR__ . '/vendor/autoload.php';

return function ($event) {
    global $return_msg;

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
        global $return_msg;

        $return_msg .= "Trying to send email to \"nyu-dining-test@outlook.com\"\n";

        try {
            $result = send_email("nyu-dining-test@outlook.com", $subject, $body);

            $return_msg .= $result ? "Email sent successfully to \"nyu-dining-test@outlook.com\"\n" : "Email failed to send: " . $result . "\n";
        } catch (Exception $e) {
            $return_msg .= "Email failed to send: " .  $e->getMessage() . "\n";
        }
    }

    $mailto = $event["to"] ?? $event["mailto"] ?? "nyu-dining-test@outlook.com";
    $subject = $event["subject"] ?? "PHP Email Lambda Test (" . date(DATE_RFC2822) . ")";
    $body = $event["body"] ?? $event["msg"] ?? $event["message"] ?? "This is an automatic email sent using PHP Lambda.";

    if ($event["dev"] ?? false) {
        $return_msg .= "email: " . $mailto . "\nsubject: " . $subject . "\nbody: " . $body . "\n";
    }

    try {
        $result = send_email($mailto, $subject, $body);

        if ($result) {
            $return_msg .= "Email sent successfully to \"" . $mailto . "\"\n";
        } else {
            $return_msg .= "Email failed to send: " . $result . "\n";
            send_default_email($subject, $body);
        }
    } catch (Exception $e) {
        $return_msg .= "Email failed to send: " .  $e->getMessage() . "\n";
        send_default_email($subject, $body);
    }

    return $return_msg;
};
?>