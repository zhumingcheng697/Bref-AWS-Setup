const fs = require("fs");
const YAML = require("yaml");
const readline = require("readline");

/**
 * Keeps track of the current state of the program.
 *
 * "": start;
 * "sn": setting name;
 * "cn": confirming name;
 * "sr": setting region;
 * "cr": confirming region;
 * "si": saving "serverless.yml";
 * "ss": "serverless.yml" save succeeded;
 * "sf": "serverless.yml" save failed;
 *
 * @type {string}
 */
let runMode = "";

/**
 * Makes the console logs colorful.
 *
 * @link https://stackoverflow.com/a/40560590
 * @type {Object}
 */
const logStyle = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",
    fg: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        crimson: "\x1b[38m"
    },
    bg: {
        black: "\x1b[40m",
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m",
        crimson: "\x1b[48m"
    }
};

const defaultServerlessYml = {
    service: "",
    provider: {
        name: "aws",
        // region: "us-east-1",
        region: "",
        runtime: "provided",
        iamRoleStatements: [
            {
                Effect: "Allow",
                Action: ["lambda:InvokeFunction"],
                Resource: ["arn:aws:lambda:us-east-1:*:*"]
            }
        ]
    },
    plugins: ["./vendor/bref/bref"],
    functions: {},
    package: {
        exclude: [
            ".idea/**",
            "node_modules/**",
            "tests/**",
            "*.md",
            "*.js",
            "**/.DS_Store"
        ]
    }
};

/**
 * Reads the keyboard input from the console.
 *
 * @link http://logan.tw/posts/2015/12/12/read-lines-from-stdin-in-nodejs/
 */
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

function setNamePrompt() {
    console.log(`${logStyle.fg.white}How would you like to name this application? Press enter to name it ${logStyle.reset}"app"${logStyle.fg.white} by default.${logStyle.reset}`);
}

function setRegionPrompt() {
    console.log(`${logStyle.fg.white}Which AWS region would you like to use? Press enter to set it to ${logStyle.reset}"us-east-1"${logStyle.fg.white} by default.${logStyle.reset}`);
}

/**
 * Finds files in a given path with a given extension.
 *
 * @param path {string} Path of the files to find
 * @param extension {string} Extension of the files to find
 * @return {[[string]]} Pairs of the names and extensions of found files
 */
function findFiles(path, extension = "") {
    try {
        return fs.readdirSync(path).map((fileName) => {
            const regex = new RegExp(`^(.+)\\.(${extension || "[^\\.]+"})$`, "i");
            const match = fileName.match(regex);
            return match ? [match[1], match[2]] : [];
        }).filter((pair) => !!pair.length);
    } catch (e) {
        fs.mkdir(path, (err) => {
            if (err) {
                console.error(`${logStyle.fg.red}Unable to read from or write to directory "${path}":\n${e}\n${err}${logStyle.reset}`);
            } else {
                console.log(`${logStyle.fg.green}Directory "${path}" created${logStyle.reset}`);
            }
        });

        return [];
    }
}

/**
 * Loads and parses "serverless.yml".
 *
 * @param handler {function} Runs after load and parse
 * @return {void}
 */
function getServerlessYml(handler = () => {}) {
    fs.readFile("serverless.yml", "utf8", (err, file) => {
        if (err) {
            console.warn(`${logStyle.fg.yellow}"serverless.yml" load failed. Using default values instead.${logStyle.reset}`);
            handler(Object.assign({}, defaultServerlessYml));
        } else {
            try {
                const parsed = YAML.parse(file);
                parsed["functions"] = {};
                console.log(`${logStyle.fg.green}"serverless.yml" load succeeded.${logStyle.reset}`);
                handler(Object.assign({}, defaultServerlessYml, parsed));
            } catch (e) {
                console.warn(`${logStyle.fg.yellow}"serverless.yml" parse failed. Using default values instead.${logStyle.reset}`);
                handler(Object.assign({}, defaultServerlessYml));
            }
        }
    });
}

/**
 * Sets "serverless.yml" with the correct function data.
 *
 * @param yml {Object} Parsed "serverless.yml" object
 * @return {void}
 */
function setFunctions(yml) {
    const apiFiles = findFiles("php-api", "php");
    const funcFiles = findFiles("php-func", "php");

    let converted = 0;
    const allFileAmt = apiFiles.length + funcFiles.length;

    /**
     * Updates the path to autoloader in file at filePath.
     *
     * @param filePath {string} Path to the file to update
     * @return {void}
     */
    function updatePathToAutoload(filePath) {
        fs.readFile(filePath, "utf8", (err, file) => {
            if (err) {
                console.error(`${logStyle.fg.red}"${filePath}" load failed:\n${err}${logStyle.reset}`);
                converted += 1;
            } else {
                file = file.replace(/('[^']*vendor\/autoload.php')|("[^"]*vendor\/autoload.php")/g, `'../../vendor/autoload.php'`);
                fs.writeFile(filePath, file, (e) => {
                    if (e) {
                        console.error(`${logStyle.fg.red}"${filePath}" save failed:\n${e}${logStyle.reset}`);
                    }

                    converted += 1;

                    if (converted === allFileAmt) {
                        setTimeout(() => {
                            console.log(`${logStyle.fg.green}Path to "vendor/autoload.php" updated.${logStyle.reset}`);

                            if (!yml["service"]) {
                                runMode = "sn";
                                setNamePrompt();
                            } else if (!yml["provider"]["region"]) {
                                runMode = "sr";
                                setRegionPrompt();
                            } else {
                                runMode = "si";
                                saveServerlessYml(yml);
                            }
                        }, 50);
                    }
                });
            }
        });
    }

    for (const api of apiFiles) {
        const encodedName = api[0].replace(/\s/g, "-");
        const path = `php-api/${api[0]}.php`;

        yml["functions"][encodedName] = {
            handler: path,
            description: "",
            timeout: 28,
            layers: ["${bref:layer.php-74-fpm}"],
            events: [
                {http: `ANY /${encodedName}/`},
                {http: `ANY /${encodedName}/{proxy+}`}
            ]
        };

        updatePathToAutoload(path);
    }

    for (const func of funcFiles) {
        const encodedName = func[0].replace(/\s/g, "-");
        const path = `php-func/${func[0]}.php`;

        yml["functions"][encodedName] = {
            handler: path,
            description: "",
            layers: ["${bref:layer.php-74}"]
        };

        updatePathToAutoload(path);
    }

    console.log(`${logStyle.fg.green}Field "functions" updated.${logStyle.reset}`);
}

/**
 * Writes data to "serverless.yml".
 *
 * @param yml {Object} Parsed "serverless.yml" object
 * @param handler {function} Runs after load and parse
 * @return {void}
 */
function saveServerlessYml(yml, handler = () => {
    process.exit(0);
}) {
    try {
        const stringified = YAML.stringify(yml, {indent: 4, simpleKeys: true});

        fs.writeFile("serverless.yml", stringified, (err) => {
            if (err) {
                console.error(`${logStyle.fg.red}"serverless.yml" write failed:\n${err}${logStyle.reset}`);
                runMode = "sf";
                process.exit(1);
            } else {
                console.log(`${logStyle.fg.green}"serverless.yml" save succeeded.${logStyle.reset}`);
                runMode = "ss";
                handler();
            }
        });
    } catch (e) {
        console.error(`${logStyle.fg.red}"serverless.yml" stringify failed:\n${e}${logStyle.reset}`);
        runMode = "sf";
        process.exit(1);
    }
}

/**
 * Self-invoking main function.
 *
 * @return {void}
 */
(function main() {
    let yml;
    let tempName;
    let tempRegion;

    getServerlessYml((getYml) => {
        setFunctions(getYml);
        yml = getYml;
    });

    rl.on("line", (line) => {
        if (!runMode || !yml) {
            return;
        }

        if (runMode === "sn") {
            if (line) {
                tempName = line.replace(/\s/g, "-");
            } else {
                tempName = "app";
            }

            runMode = "cn";
            console.log(`${logStyle.fg.white}Application will be named to ${logStyle.reset}"${tempName}"${logStyle.fg.white}. Continue? ${logStyle.reset}(y/n)`);
        } else if (runMode === "cn") {
            if (line.toUpperCase() === "Y") {
                yml["service"] = tempName;

                if (!yml["provider"]["region"]) {
                    runMode = "sr";
                    setRegionPrompt();
                } else {
                    runMode = "si";
                    saveServerlessYml(yml);
                }
            } else if (line.toUpperCase() === "N") {
                runMode = "sn";
                setNamePrompt();
            } else {
                console.error(`${logStyle.fg.red}Please type in a valid keyword. (y/n)${logStyle.reset}`);
            }
        } else if (runMode === "sr") {
            if (line) {
                tempRegion = line.replace(/\s/g, "-");
            } else {
                tempRegion = "us-east-1";
            }

            runMode = "cr";
            console.log(`${logStyle.fg.white}Application region will be set to ${logStyle.reset}"${tempRegion}"${logStyle.fg.white}. Continue? ${logStyle.reset}(y/n)`);
        } else if (runMode === "cr") {
            if (line.toUpperCase() === "Y") {
                yml["provider"]["region"] = tempRegion;
                runMode = "si";
                saveServerlessYml(yml);
            } else if (line.toUpperCase() === "N") {
                runMode = "sr";
                setRegionPrompt();
            } else {
                console.error(`${logStyle.fg.red}Please type in a valid keyword. (y/n)${logStyle.reset}`);
            }
        }
    });
})();