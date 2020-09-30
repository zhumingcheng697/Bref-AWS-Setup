## How to Set Up

1. Install [`serverless`](https://serverless.com/) globally.
    ```
    $ npm install -g serverless
    ```
   
2. Configure `serverless` using [AWS access keys](https://bref.sh/docs/installation/aws-keys.html).
    ```
    $ serverless config credentials --provider aws --key <key> --secret <secret>
    ```

3. Install [Composer](https://getcomposer.org/) globally.

    - On a Linux / Unix / macOS machine, [install Composer locally](https://getcomposer.org/download/) and then move the downloaded `composer.phar` to `/usr/local/bin/composer`.
        ```
        $ mv composer.phar /usr/local/bin/composer
        ```
   
   - On a Windows machine, download and run [Composer-Setup.exe](https://getcomposer.org/Composer-Setup.exe) as detailed on the [Composer website](https://getcomposer.org/doc/00-intro.md#using-the-installer).

4. Install [Bref](https://bref.sh/docs/) through Composer.
    ```
    $ composer require bref/bref
    ```

5. Initiate a new Bref project, if you haven’t already.
    ```
    $ vendor/bin/bref init
    ```

## Commands

- Deploy an AWS application with all the lambdas:
    ```
    $ serverless deploy
    ```

- Invoke a lambda function:

    ```
    $ serverless invoke -f <function-name>
    
    $ serverless invoke -f <function-name> --data='{"key": "value", ...}'
    ```

- Delete the AWS application with all the lambdas:
    ```
    $ serverless remove
    ```