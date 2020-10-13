## How to Set Up

1. Clone this repo.
   ```
   $ git clone https://github.com/zhumingcheng697/Bref-AWS-Setup.git
    ```
   
2. Install [`serverless`](https://serverless.com/) globally.
    ```
    $ npm install -g serverless
    ```
3. Install other necessary node modules.
    ```
    $ npm install
    ```

4. Configure `serverless` using [AWS access keys](https://bref.sh/docs/installation/aws-keys.html).
    ```
    $ serverless config credentials --provider aws --key <key> --secret <secret>
    ```

5. Install [Composer](https://getcomposer.org/) globally.

    - On a Linux / Unix / macOS machine, [install Composer locally](https://getcomposer.org/download/) and then move the downloaded `composer.phar` to `/usr/local/bin/composer`.
        ```
        $ mv composer.phar /usr/local/bin/composer
        ```
   
   - On a Windows machine, download and run [Composer-Setup.exe](https://getcomposer.org/Composer-Setup.exe) as detailed on the [Composer website](https://getcomposer.org/doc/00-intro.md#using-the-installer).

6. Install necessary PHP modules through Composer.
    ```
    $ composer install
    ```

7. You are all set!
    - To start fresh, initiate a new Bref project.
        ```
        $ vendor/bin/bref init
        ```
   
    - To quickly deploy the PHP scripts you already have, move them to [`php-api/`](php-api) and [`php-func/`](php-func), run the script `update-serverless-yml.js`, and run `serverless deploy`.
        ```
        $ node update-serverless-yml.js
        $ serverless deploy
        ```
        or
        ```
        $ npm run predeploy
        $ serverless deploy
        ```
        or
        ```
        $ npm run deploy
        ```

## NPM Scripts

- Generate or update `serverless.yml` to prepare for deployment:
    ```
    $ npm run predeploy
    ```

- Generate or update `serverless.yml` and deploy an AWS application with all the lambdas:
    ```
    $ npm run deploy
    ```
 
 > _**Warning:** Only run these two scripts if all your PHP API scripts are in [`php-api/`](php-api) and all your PHP function scripts are in [`php-func/`](php-func), or the configuration for all your other PHP scripts will be discarded._

## Serverless Commands

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