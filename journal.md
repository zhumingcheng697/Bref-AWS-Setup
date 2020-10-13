# Journal

## Week 4

### Tuesday: September 22, 2020 (2 hours)

- Read Bref [documentations](https://bref.sh/docs/)

- Created an AWS account and an IAM user

- Installed [`serverless`](https://www.serverless.com/) global command and setting it up with AWS

### Wednesday: September 23, 2020 (5 hours)

- Continued reading and following Bref documentation

- Installed [Composer](https://getcomposer.org/) PHP dependency manager, and installed [Bref](https://bref.sh/) through it

- Getting started with PHP syntax

- Tested with building [lambda functions](/php-func/index.php) and HTTP APIs using PHP runtime

### Thursday: September 24, 2020 (4 hours)

- Added `iamRoleStatements` in `serverless.yml` and installed [AWS PHP SDK](https://aws.amazon.com/sdk-for-php/) to run PHP lambda functions through serverless using the IAM user

- Tested with [HTTP APIs that invoke PHP lambda functions](php-api/func-invoking-api.php)

- Tested with [HTTP APIs that invoke other HTTP APIs](php-api/api-invoking-api.php)

- Tested with [PHP lambda functions that invoke other PHP lambda functions](php-func/func-invoking-func.php)

### Friday: September 25, 2020 (1 hour)

- Tested with [PHP lambda functions that invoke HTTP APIs](php-func/api-invoking-func.php)

- Tested with using the PHP `mail()` function in [HTTP APIs](php-api/mail-api.php) (does not seem to be working for now)

## Week 5

### Monday: September 28, 2020 (3 hours)

- Installed [Swift Mailer](https://swiftmailer.symfony.com/docs/introduction.html) PHP dependency

- Tested with the `global` keyword and variable scopes in PHP

- Tested with [PHP lambda functions that send emails using Swift Mailer](php-api/mail-api.php)

- Tested with [HTTP APIs that send emails using Swift Mailer](php-func/mail-func.php)

### Tuesday: September 29, 2020 (1 hour)

- Added `README.md` for `serverless` and Bref set-up process and `serverless` commands

## Week 6

### Monday: October 5, 2020 (2 hours)

- Built a Qualtrics survey that sends email using the PHP Lambda API wrote last week

- Tested with complex data types available in Qualtrics surveys

### Tuesday: October 6, 2020 (1 hour)

- Tested with emailing complex data types from surveys

### Friday: October 9, 2020 (7 hours)

- Added ability to generate new `serverless.yml` programmatically

- Added ability to set the application name and AWS region in `serverless.yml` in the CLI if they haven’t been set yet.

- Added ability to automatically update `serverless.yml` with PHP scripts in [`php-api/`](php-api) and [`php-func/`](php-func)

- Added ability to automatically update path to `/vendor/autoload.php` in PHP scripts

- Updated `package.json`

- Updated `README.md`

## Week 7

### Monday: October 12, 2020 (2 hours)

- Researched on backreference and lookahead in regex

- Added regex check for inputting AWS regions

- Improved `/vendor/autoload.php` path update

- Updated `README.md`