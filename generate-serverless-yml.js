const fs = require("fs");
const YAML = require("yaml");

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

const apiFiles = findFiles("php-api", "php");
const funcFiles = findFiles("php-func", "php");

/**
 * Finds files in a given path with a given extension
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
 * Loads and parses "serverless.yml"
 *
 * @param handler {function} Runs after load and parse
 * @return {void}
 */
function readServerlessYml(handler = () => {}) {
    try {
        const file = fs.readFileSync("serverless.yml", "utf8");

        try {
            handler(Object.assign({}, YAML.parse(file)));
        } catch (e) {
            console.warn(`${logStyle.fg.yellow}Unable to parse "serverless.yml"${logStyle.reset}`);
            handler(Object.assign({}, {}));
        }
    } catch (e) {
        console.warn(`${logStyle.fg.yellow}Unable to read "serverless.yml"${logStyle.reset}`);
        handler(Object.assign({}, {}));
    }
}

readServerlessYml(console.log);

console.table(apiFiles);
console.table(funcFiles);
