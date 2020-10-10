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

const apiNames = findFiles("php-api", "php");
const funcNames = findFiles("php-func", "php");

/**
 * Finds files in a given path with a given extension
 *
 * @param path {string} Path of the files to find
 * @param extension {string} Extension of the files to find
 * @return {[string]} Names of the found files
 */
function findFiles(path, extension = "") {
    try {
        return fs.readdirSync(path).map((fileName) => {
            const regex = new RegExp(`^(.+)\\.${extension || "[^\\.]+"}$`, "i");
            const match = fileName.match(regex);
            return match ? match[1] ?? "" : "";
        }).filter((name) => !!name);
    } catch (e) {
        console.error(`${logStyle.fg.red}Unable to read from "${path}": ${e}${logStyle.reset}`);
        return [];
    }
}

console.log(`${logStyle.fg.green}${apiNames}${logStyle.reset}`);
console.log(`${logStyle.fg.green}${funcNames}${logStyle.reset}`);
