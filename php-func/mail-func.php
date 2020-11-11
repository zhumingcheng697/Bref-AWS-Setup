<?php

require __DIR__ . '/../vendor/autoload.php';

return function ($event) {
    global $return_msg;

    function send_email($mailto, $subject, $body) {
        global $return_msg;

        try {
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

            if ($mailer->send($message)) {
                $return_msg .= "Email sent successfully to \"" . $mailto . "\"\n";
            } else {
                $return_msg .= "Email failed to send\n";

                if ($mailto != "nyu-dining-test@outlook.com") {
                     $return_msg .= "Trying to send email to \"nyu-dining-test@outlook.com\"\n";
                     send_email("nyu-dining-test@outlook.com", $subject, $body);
                }
            }
        } catch (Exception $e) {
            $return_msg .= "Email failed to send:\n" .  $e->getMessage() . "\n";

            if ($mailto != "nyu-dining-test@outlook.com") {
                 $return_msg .= "Trying to send email to \"nyu-dining-test@outlook.com\"\n";
                 send_email("nyu-dining-test@outlook.com", $subject, $body);
            }
        }
    }

    $mailto = $event["to"] ?? $event["mailto"] ?? "nyu-dining-test@outlook.com";
    $subject = $event["subject"] ?? "PHP Email Lambda Test (" . date(DATE_RFC2822) . ")";
    $body = $event["body"] ?? $event["msg"] ?? $event["message"] ?? "This is an automatic email sent using PHP Lambda.";

    if ($event["dev"] ?? false) {
        $return_msg .= "email: " . $mailto . "\nsubject: " . $subject . "\nbody: " . $body . "\n";
    }

    send_email($mailto, $subject, $body);

    return $return_msg;
};
?>