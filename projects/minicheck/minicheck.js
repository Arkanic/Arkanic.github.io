/**
 * Checks an object of tests. Main function.
 * 
 * @param {Object} tests
 */
function minicheck(tests) {
    for(let i in tests) {
        let test = tests[i];

        try {
            test();
            console.log(`Minicheck did "${i}"`);
        } catch(err) {
            console.log(`Minicheck failed "${i}":\n${err.stack}`);
        }

    }
}

/**
 * Fails intentionally. Used inside test functions.
 * 
 * @param {string} message Message to throw with error
 */
function fail(message) {
    throw new Error(`Minicheck fail: ${message}`);
}

/**
 * Fails if parameter doesn't exist.
 * 
 * @param {any} value The value to be inspected
 * @param {string} message Message to throw if an error occurs
 */
function exists(value, message) {
    if(!value) throw new Error(`Minicheck exists: ${message}`);
}

/**
 * Checks if the expected equals the real value
 * 
 * @param {any} real The real returned value
 * @param {any} expected The expected return value
 * @param {string} message Message to throw if an error occurs
 */
function equals(real, expected, message) {
    if(expected !== real) throw new Error(`Minicheck equals: "${expected}" != "${real}", ${message}`);
}

/**
 * Checks if a return matches `.match(x)`.
 * 
 * @param {string} value The value to be tested
 * @param {string|RegExp} match The string or RegExp to be matched to
 * @param {string} message Message to throw if an error occurs
 */
function match(value, match, message) {
    if(!value.match(match)) throw new Error(`Minicheck match: "${value}" not match "${(match instanceof RegExp) ? match.toString() : match}", ${message}`);
}