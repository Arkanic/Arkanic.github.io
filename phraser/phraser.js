/**
 * perform checksum on 12 words chosen
 * 
 * @param {Array<number>} data Array of the index chosen. 1-index, therefore "abandon" is 1.
 * @returns {Promise<number, string>} Index of 12th word
 */
function checksum12(data) {
    return new Promise((resolve, reject) => {
        if(data.length != 12) reject("Need 12 words as input");

        let binstr = (s, l=8) => s.toString(2).padStart(l, "0");
        let tohex = (bytes) => bytes.map(x => x.toString(16).padStart(2, 0)).join(" ");
        let bytes = data.map(x => binstr(x, 11)).join("").match(/.{1,8}/g).map(x => parseInt(x, 2));

        if(bytes.length != 17) return reject("Something went wrong, check input");
        bytes.pop();

        console.log(`Entropy is ${tohex(bytes)}`);

    
        window.crypto.subtle.digest("SHA-256", new Uint8Array(bytes).buffer).then(x => {
            if(x.byteLength != 32) return reject("Error: Wrong final word bits");

            let hash = new Uint8Array(x);
            let cs = binstr(hash[0]).match(/.{1,4}/g)[0];
            let bits = [binstr(bytes[15]), cs].join("");

            return resolve(parseInt(bits.substr(1), 2));
        });
    });
}

/**
 * When given a string, returns numerical index in bip39 wordlist
 * When given an index, returns bip39 word for that index
 * 
 * @param {string | number} x Data to process
 * 
 * @returns {number | string} Result; if word or index does not exist -1 and "" are returned respectively
 */
function convert(x) {
    if(typeof(x) === "string") {
        return words.indexOf(x);
    } else { 
        return (x < words.length && x >= 0) ? words[x] : "";
    }
}

let wordsIn = document.getElementById("wordsin");
let submit = document.getElementById("submit");
let checksumOut = document.getElementById("checksum");
let result = document.getElementById("result");

/**
 * Display error message to the user
 * 
 * @param {string} str message
 */
function error(str) {
    result.innerHTML = `<p style="color:red;">${str}</p>`
}

submit.addEventListener("click", () => {
    let str = wordsIn.value.split(" ");
    if(str.length != 12) return error("Need 12 words!");

    let indexes = str.map(w => convert(w));
    if(indexes.includes("")) return error("Words need to be in the bip39 wordlist!");

    checksum12(indexes).then(checksum => {
        checksumOut.innerHTML = checksum;

        let final = str.map(w => convert(w));
        final[11] = checksum;

        result.innerHTML = final.map(x => convert(x)).join(" ");
    }, (reason) => {
        error(reason);
    });
});

let wordsInCount = document.getElementById("wordsin-count");
wordsIn.addEventListener("keypress", () => {
    wordsInCount.innerHTML = wordsIn.value.split(" ").length;
});

let wordlist = document.getElementById("wordlist");
for(let i in words) {
    let word = words[i];

    let p = document.createElement("p");
    p.innerHTML = `${i}: ${word}`;

    wordlist.appendChild(p);
}