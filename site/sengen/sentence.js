/**
 * @author Noah Pendleton
 * @version sg-13
*/

/* globals */

const CONSTANTS = { // constants are stored here to be easily changeable
    wordlist: {
        defaultUrl: "./words/locations.json" // the location of the fallback/default words list
    },
    game: {
        timePerQuestion: 1000 * 30, // half a minute per question
        questionsPerGame: 30 // the number of questions in a game
    }
}

let sentenceLayout; // global sentence layout is stored here
let question; // the current question the game is using
let username; // the players' chosen username
let score = 0; // the players' score
let rightWrong = [0, 0]; // the ratio of right questions to wrong ones
let questionsDone = 0;


let loadingBox = document.getElementById("loading-box"); // the loading container
let usernameBox = document.getElementById("username-box"); // the username input container
let usernameInput = document.getElementById("username-input"); // username input textbox
let usernameSubmit = document.getElementById("username-submit"); // username submit button
let gameBox = document.getElementById("game-box"); // game container
let sentenceOutput = document.getElementById("sentence-output"); // sentence output
let timerDisplay = document.getElementById("timer-display"); // timer display bar
let scoreDisplay = document.getElementById("score-display"); // score display label
let percentCorrect = document.getElementById("percent-correct"); // percentage correct label
let scoreMessage = document.getElementById("score-message"); // score message
let answerSubmit = document.getElementById("answer-submit"); // answer submit button
let resultsBox = document.getElementById("results-box"); // the game result box
let leaderboardDisplay = document.getElementById("leaderboard-display"); // the saved leaderboard display
let playerDisplay = document.getElementById("player-display"); // the display for the players' score
let playAgain = document.getElementById("play-again"); // play again button
let quit = document.getElementById("quit"); // quit button
let sampleSentenceDisplay = document.getElementById("sample-sentence-display"); // the sample sentence display box
let wordlistTitleDisplay = document.getElementById("wordlist-title-display"); // the word list title display
let helpBox = document.getElementById("help-box"); // the help box
let helpButton = document.getElementById("help-button"); // the open help box button
let closeHelpBox = document.getElementById("close-help-box"); // the close help box button
let title = document.getElementById("wl-title"); // word list title input
let author = document.getElementById("wl-author"); // word list author input
let desuIfNoWa = document.getElementById("wl-desu-if-no-wa"); // word list desu if no wa checkbox
let useAllParticles = document.getElementById("wl-use-all-particles"); // word list use all particles checkbox
let showParticleMeanings = document.getElementById("wl-show-particle-meanings"); // show particle meanings checkbox
let addParticle = document.getElementById("wl-add-particle"); // word list add particle button
let particlesEditor = document.getElementById("wl-particles-editor"); // word list particle editor container
let submit = document.getElementById("wl-submit"); // word list submit button
let output = document.getElementById("wl-output"); // word list output element
let verbBox = document.getElementById("wl-verb-box"); // word list verb input
let wlButton = document.getElementById("wl-button"); // wl icon on top right of main menu
let wlClose = document.getElementById("wl-close"); // close wl button (from wl menu)
let wlBox = document.getElementById("wl-box"); // wl container

/* end globals */

/* help/instructions */
helpButton.addEventListener("click", (e) => {
    usernameBox.classList.add("hidden");
    helpBox.classList.remove("hidden"); // show on open button click
});

closeHelpBox.addEventListener("click", (e) => {
    usernameBox.classList.remove("hidden");
    helpBox.classList.add("hidden"); // hide on close button click
});
/* end help/instructions */

/* createwordslist module */

wlButton.addEventListener("click", (e) => {
    usernameBox.classList.add("hidden");
    wlBox.classList.remove("hidden"); // show on open button click
});

wlClose.addEventListener("click", (e) => {
    usernameBox.classList.remove("hidden");
    wlBox.classList.add("hidden"); // hide on close button click
});

/**
 * Generates a random string
 * 
 * @returns {string}
 */
function generateId() {
    return Math.random().toString(36).substring(2); // converts a random number into its' string equivalent, then removes the "0." from the start 
}

/**
 * Generates a HTML element that contains the markup for a particle section
 * 
 * @param {string} parentId
 * 
 * @returns {HTMLDivElement}
 */
function generateHTMLParticleSection(parentId) {
    let container = document.createElement("div"); // container for the elements, this will be returned
    container.id = parentId;

    let particleInput = document.createElement("input"); // particle input text box
    particleInput.id = `${parentId}-particle-input`;
    particleInput.type = "text";
    particleInput.size = 4;
    particleInput.placeholder = "Wa";
    container.appendChild(particleInput); // append

    let meaningInput = document.createElement("input"); // meaning input text box
    meaningInput.id = `${parentId}-meaning-input`;
    meaningInput.type = "text";
    meaningInput.size = 30;
    meaningInput.placeholder = "Meaning";
    container.appendChild(meaningInput); // append

    let positionInput = document.createElement("input"); // index input number box
    positionInput.id = `${parentId}-position-input`;
    positionInput.type = "number";
    positionInput.size = 10;
    positionInput.placeholder = "Position in sentence";
    container.appendChild(positionInput); // append

    let deleteButton = document.createElement("button"); // delete particle button
    deleteButton.id = `${parentId}-delete-button`;
    deleteButton.innerHTML = "❌";
    container.appendChild(deleteButton); // append

    let br = document.createElement("br"); // line break
    container.appendChild(br); // append

    let wordBox = document.createElement("textarea");
    wordBox.id = `${parentId}-word-box`;
    wordBox.placeholder = "1 word per line";
    wordBox.rows = "5";
    wordBox.cols = "58";
    container.appendChild(wordBox); // append

    return container; // finished
}

/**
 * Generates a url for a custom game based on given parameters.
 * 
 * @param {string} protocol
 * @param {string} host
 * @param {string} escapedString
 * 
 * @returns {string}
 */
function generateUrl(protocol, host, escapedString) {
    return `${protocol}//sentencegenerator.tal0s.repl.co/#${escapedString}`;
}

// the list of ids
let HTMLParticleEditors = [];

addParticle.addEventListener("click", (e) => {
    let id = generateId(); // id of the element
    HTMLParticleEditors.push(id); // append to list of ids

    let particleEditor = generateHTMLParticleSection(id);
    particlesEditor.appendChild(particleEditor);

    document.getElementById(`${id}-delete-button`).addEventListener("click", (e) => { // on delete button click
        HTMLParticleEditors.splice(HTMLParticleEditors.indexOf(id), 1); // remove id from particle editors list

        particleEditor.remove(); // delete self
    });
});

submit.addEventListener("click", (e) => { // when submit button is clicked
    // we will now check for any blank text or number boxes
    let valueInputs = document.querySelectorAll("div.wl > input[type='text'], div.wl > input[type='number'], textarea"); // get all text and number inputs, as well as textareas

    let failed = [];
    valueInputs.forEach(valueInput => { // loop through all
        if (valueInput.value == "") {
            failed.push(valueInput); // push to failed loop
        }
    });

    if (failed.length > 0) { // there are blank textboxes somewhere
        for (let i in failed) { // loop through fails
            let faliure = failed[i];

            faliure.classList.add("wl-empty-box"); // give the text box a red border
            setTimeout(() => {
                faliure.classList.remove("wl-empty-box");
            }, 1000 * 5); // remove red border after 5 seconds
        }

        setTimeout(() => {
            alert("The textboxes highlighted in red are blank! This is not allowed!");
        }, 50); // give html updates a chance to happen

        return; // break
    }

    // all textboxes can now be safely accessed, as they will have contents.
    let parts = [];
    for (let i in HTMLParticleEditors) {
        let id = HTMLParticleEditors[i]; // get id

        let particleInput = document.getElementById(`${id}-particle-input`); // the particle name
        let meaningInput = document.getElementById(`${id}-meaning-input`); // the meaning input
        let positionInput = document.getElementById(`${id}-position-input`); // the position input
        let wordBox = document.getElementById(`${id}-word-box`); // the box of words

        let words = wordBox.value; // wordbox value
        words = words.split("\n"); // split by newlines

        let particle = particleInput.value; // the particle
        let meaning = meaningInput.value; // the meaning of the particle
        let position = parseInt(positionInput.value); // the index of the particle

        parts.push({ // push parts to array
            particle,
            meaning,
            position,
            words
        });
    }

    parts.sort((a, b) => a - b); // sort

    let finalObj = {};
    finalObj.title = title.value; // title
    finalObj.author = author.value; // author
    finalObj.desuIfNoWa = desuIfNoWa.checked; // desu for verb if there is no wa in sentence
    finalObj.useAllParticles = useAllParticles.checked; // use all particles provided
    finalObj.showParticleMeanings = showParticleMeanings.checked; // show meanings in brackets?

    finalObj.particleSections = {};
    finalObj.meanings = {};
    finalObj.verbs = verbBox.value; // verbs
    finalObj.verbs = finalObj.verbs.split("\n"); // split by newline

    for (let i in parts) { // loop through parsed parts
        let part = parts[i];

        finalObj.particleSections[part.particle] = part.words;
        finalObj.meanings[part.particle] = part.meaning;
    }

    let stringifiedResult = JSON.stringify(finalObj); // the serialized json
    let escapedResult = encodeURIComponent(stringifiedResult); // the escaped string
    let finalResult = generateUrl(window.location.protocol, window.location.host, escapedResult); // final url result

    let link = document.createElement("a"); // link for the link
    link.href = finalResult; // link will open to final result
    link.target = "_blank"; // open in new tab
    link.innerHTML = finalResult; // link content is final result for copy+pasting

    output.appendChild(link); // display
});
/* end createwordslist module */

/* getwordslist module */

/**
 * Get JSON object over HTTP
 * 
 * @param {string} location
 * 
 * @returns {Object}
 */
function getJSONFile(location) {
    return new Promise((resolve, reject) => { // create an asynchronous "waiting" method
        let xhr = new XMLHttpRequest(); // new http request
        xhr.open("GET", location); // GET the wordlist.json sample
        xhr.send(); // send the request

        xhr.onreadystatechange = () => { // when the state changes
            if (xhr.readyState != 4) return; // not ready;
            if (xhr.status != 200) return reject(`HTTP not ok! got ${xhr.status}.`); // 200 is HTTP code for "ok". If it is non-200 an error has occured.

            let obj = JSON.parse(xhr.responseText); // parse the response to an object
            resolve(obj); // resolve the promise
        }
    });
}

async function getWordList() {
    let result = "";
    let json;

    if (window.location.hash) { // if a words list is present in the url
        let content = window.location.hash.substring(1); // remove the "#" at the start of the url
        let stringifiedJSON = decodeURIComponent(content); // convert the URI-converted string into parseable json

        try {
            json = JSON.parse(stringifiedJSON); // parse JSON
        } catch (err) { // if there is an error
            if (err instanceof SyntaxError) {
                alert("The word list in the link is broken!\nswitching to the default word list."); // warn user
            }
        }

        result = json;
    }
    if (!json) { // else default to default wordslist
        result = await getJSONFile(CONSTANTS.wordlist.defaultUrl); // get the json file, await keyword makes it wait for the json loading to finish
    }

    return result;
}

getWordList().then(result => {
    sentenceLayout = result; // set the result to the global sentenceLayout

    loadingBox.classList.add("hidden"); // hide the loading box

    for (let i = 0; i < 5; i++) { // show 5 sample sentences
        let p = document.createElement("p"); // create p element
        let sentence = generateSentenceFromLayout(sentenceLayout).sentence; // generate sentence
        p.innerHTML = sentence;

        sampleSentenceDisplay.appendChild(p); // append result
    }

    wordlistTitleDisplay.innerHTML = `<b>Wordlist:</b> <i>"${sentenceLayout.title}"</i>`;

    usernameBox.classList.remove("hidden"); // show the loading box


    console.log(sentenceLayout); // log success
});

/* end getwordslist */

/* username input */
usernameSubmit.addEventListener("click", (e) => { // when the username input is clicked
    let usernameValue = usernameInput.value || "Player"; // default to "Player" if blank
    username = usernameValue; // set global username to the value

    usernameBox.classList.add("hidden"); // hide the username box
    gameBox.classList.remove("hidden"); // show the game box

    initQuestionAndTimer(); // start score system
});
/* end username input */
/* leaderboard */
/**
 * Returns a leaderboard object
 * 
 * @param {string} username
 * @param {number} score
 * 
 * @returns {Object}
 */
function genLeaderboardObject(username, score) {
    return {
        name: username, // name of person
        score, // the score they got
        time: Date.now() // the time it was stored at
    }
}

/**
 * Append score to localStorage, returns the result
 * 
 * @param {Object} scoreObject
 * 
 * @returns {Object}
 */
function appendToLeaderboard(scoreObject) {
    let leaderboard = JSON.parse(window.localStorage.getItem("leaderboard") || "[]") // get the leaderboard from local storage, if it doesn't exist return an empty array
    leaderboard.push(scoreObject); // append the score object

    window.localStorage.setItem("leaderboard", JSON.stringify(leaderboard)); // adds new result to saved leaderboard

    return leaderboard; // returns the result
}

/**
 * Returns the html table ready for appending when given the leaderboard array
 * 
 * @param {Array} leaderboard
 * 
 * @returns {HTMLTableElement}
 */
function displayTable(leaderboard) {
    let leaderboardCopy = leaderboard.slice(); // copy array
    leaderboardCopy.sort((a, b) => { // sort the array based on highest score to lowest score
        return b.score - a.score;
    });

    let table = document.createElement("table");
    for (let i = 0; i < Math.min(leaderboardCopy.length, 3); i++) { // loops through 10 elements, or all the elements, based on what is smaller (prevents a ridiculously large table)
        let player = leaderboardCopy[i];

        let tr = document.createElement("tr"); // the table element

        let usernameContainer = document.createElement("td"); // container for username in table
        let username = document.createElement("b"); // username in here
        username.innerHTML = player.name;
        usernameContainer.appendChild(username); // append username to username container
        tr.appendChild(usernameContainer); // append username container to table element

        let scoreContainer = document.createElement("td"); // container for score in table
        let score = document.createElement("p"); // score in here
        score.innerHTML = `${player.score}pts`;
        scoreContainer.appendChild(score); // append score to score container
        tr.appendChild(scoreContainer); // append score container to table element

        table.appendChild(tr); // append tr to table
    }

    return table; // finished
}

/**
 * Starts leaderboard display. Assumes game has just been played, and gameBox is open
 */
function startLeaderboardTasks() {
    gameBox.classList.add("hidden"); // hide game box

    let playerObj = genLeaderboardObject(username, score); // get players' results as object
    let leaderboard = appendToLeaderboard(playerObj); // append to leaderboard and get leaderboard object at the same time

    let renderedLeaderboard = displayTable(leaderboard);

    leaderboardDisplay.appendChild(renderedLeaderboard); // show rendered leaderboard

    playerDisplay.innerHTML = `You, <b>${username}</b>, got <b>${score}</b> points!`; // display users' result

    playAgain.addEventListener("click", (e) => { // on playagain click
        window.location.reload(); // reload page
    });

    resultsBox.classList.remove("hidden"); // show results box. This is done after so the user only gets displayed the finished result.
}

/* end leaderboard */
/* generate sentence */
/**
 * Remove an element from an array
 * 
 * @param {any[]} arr
 * @param {any} value
 * 
 * @returns {any[]}
 */
function removeElement(arr, value) {
    let index = arr.indexOf(value); // find the index of the value
    if (index > -1) {
        arr.splice(index, 1); // splice out value
    }
    return arr;
}

/**
 * Gives an array with x amount of keys from the sentenceLayout.particleSections object
 * 
 * @param {number} x
 * @param {Object} sentenceLayout
 * 
 * @returns {string[]}
 */
function chooseParticles(x, sentenceLayout) {
    let keys = JSON.parse(JSON.stringify(sentenceLayout.particleSections)); // json parse and stringify to prevent objects from being linked
    let baseKeys = JSON.parse(JSON.stringify(keys)); // base keys with default layout
    keys = Object.keys(keys);// get keys of object
    baseKeys = Object.keys(baseKeys);

    let chosenWords = [];

    for (let i = 0; i < x; i++) { // repeat x times
        let particle = keys[Math.floor(Math.random() * keys.length)];

        chosenWords.push(particle);
        keys = removeElement(keys, particle); // remove particle to prevent particle being chosen twice
    }

    for (let i = 0; i < baseKeys.length; i++) {
        let isInCW = false; // is in chosen words?
        for (let j = 0; j < chosenWords.length; j++) {
            if (baseKeys[i] == chosenWords[j]) isInCW = true;
        }

        if (!isInCW) {
            baseKeys = removeElement(baseKeys, baseKeys[i]);
        }
    }

    return baseKeys; // chosenWords isn't filtered into the right order, but baseKeys with the wrong words removed, so baseKeys is returned.
}

/**
 * Generate a sentence based on the given layout
 * 
 * @param {Object} sentenceLayout
 * @returns {string}
 */
function generateSentenceFromLayout(sentenceLayout) {
    let amountOfParticles
    if (sentenceLayout.useAllParticles) amountOfParticles = Object.keys(sentenceLayout.particleSections).length; // if a certain amount of sections is enforced, do that
    else amountOfParticles = Math.floor(Math.random() * (Object.keys(sentenceLayout.particleSections).length - 1)) + 1; // amount of particle sections to be put in the sentence. Object.keys gives the object a length attribute which is used.
    let particles = chooseParticles(amountOfParticles, sentenceLayout);

    let sentence = "";
    let obj = {
        parts: {}
    };

    for (let i in particles) { // loop through all the particles
        let particleSection = sentenceLayout.particleSections[particles[i]];

        let part = particleSection[Math.floor(Math.random() * particleSection.length)]; // choose random amount of particles to be used in the sentence

        sentence += `${part} ${particles[i]} `; // "sushi wo ", "neko wa ", etc.
        obj.parts[particles[i]] = part;
    }

    let verb = "";
    if (particles.includes("wa") || !sentenceLayout.desuIfNoWa) { // if there is a subject in the sentence
        verb = sentenceLayout.verbs[Math.floor(Math.random() * sentenceLayout.verbs.length)]; // choose random verb
    } else { // there is no subject in the sentence, and the settings allow for a desu if there is no wa
        verb = "desu";
    }

    sentence += verb;
    obj.verb = verb;

    return { sentence, obj }; // display final result;
}

/* end generate sentence */

/* generate question */
/**
 * de-links an object from it's parent
 * 
 * @param {Object} input
 * 
 * @returns {Object}
 */
function deLink(input) {
    return Object.assign({}, input);
}

/**
 * de-links an array from parent
 * 
 * @param {Array} input
 * 
 * @returns {Array}
 */
function deLinkArray(input) {
    return input.map(x => x);
}

/**
 * Remove an element from an array
 * 
 * @param {any[]} array
 * @param {any} value
 * 
 * @returns {any[]}
 */
function removeElement(array, value) {
    let arr = array.map(n => n); // copy array to de-link with parent (to prevent parent from being affected by changes)
    let index = arr.indexOf(value); // find the index of the value
    if (index > -1) {
        arr.splice(index, 1); // splice out value
    }
    return arr;
}

/**
 * Formats the .parts of obj to describe what they are
 * 
 * @param {Object} obj
 * @param {Object} sentenceLayout
 * 
 * @returns {Object}
 */
function describeParts(obj, sentenceLayout) {
    obj.meanings = {};

    for (let i = 0; i < Object.keys(obj.parts).length; i++) { // loop through all parts
        let partKeys = Object.keys(obj.parts); // the keys for the obj.parts
        obj.meanings[partKeys[i]] = sentenceLayout.meanings[partKeys[i]];
    }

    return obj;
}

/**
 * Generate the object for a particle question when given an input object
 * 
 * @param {Object} obj
 * @param {Object} sentenceLayout
 * 
 * @returns {Object}
 */
function genParticleQuestion(obj, sentenceLayout) {
    let particles = Object.keys(deLink(obj).parts); // the names of the particles
    let particle = particles[Math.floor(Math.random() * particles.length)]; // the chosen particle

    let allParticles = deLinkArray(Object.keys(sentenceLayout.particleSections));
    allParticles = removeElement(allParticles, particle); // remove correct answer to prevent it appearing as a "wrong answer".

    let wrongParticles = []; // the faux particles to be put in the dropdown
    for (let i = Math.min(4, allParticles.length - 1); i > 0; i--) {
        let wrongParticleIndex = Math.floor(Math.random() * allParticles.length);
        let wrongParticle = allParticles[wrongParticleIndex];

        wrongParticles.push({
            particle: wrongParticle // the particle
        });

        allParticles = removeElement(allParticles, allParticles[wrongParticleIndex]); // remove particle to prevent repeat
    }

    obj.question = {
        type: "particle", // type of question
        particle: particle, // the id (particle)
        fakes: wrongParticles // the alternative wrong answers
    }

    obj = describeParts(obj, sentenceLayout); // give particles meaning

    return obj;
}

/**
 * Generate the object for a word question when given an input object
 * 
 * @param {Object} obj
 * @param {Object} sentenceLayout
 * 
 * @returns {Object}
 */
function genWordQuestion(obj, sentenceLayout) {
    let particles = Object.keys(deLink(obj).parts);
    let particle = particles[Math.floor(Math.random() * particles.length)];

    let allWords = deLink(sentenceLayout.particleSections);
    delete allWords[particle];

    let wrongWords = []; // faux words
    for (let i = Math.min(4, Object.keys(allWords).length); i > 0; i--) { // chooses the minimum between 3 and the amount of word types, incase there isn't enough particles.
        let wordKeys = Object.keys(allWords); // the keys for the allWords variable

        let wrongWordIndex = Math.floor(Math.random() * wordKeys.length); // choose random word
        let wrongWord = allWords[wordKeys[wrongWordIndex]][Math.floor(Math.random() * allWords[wordKeys[wrongWordIndex]].length)]; // choose random word from the chosen word type


        wrongWords.push({
            word: wrongWord, // the word
            meaning: sentenceLayout.meanings[wordKeys[wrongWordIndex]] // the meaning of the word (e.g. subject, time, whatever)
        });

        delete allWords[wordKeys[wrongWordIndex]]; // delete the key so it isn't used again
    }

    obj.question = {
        type: "word",
        particle: particle,
        fakes: wrongWords
    }

    obj = describeParts(obj, sentenceLayout); // give particles meaning

    return obj;
}

/* end generate question */
/* display question */

/**
 * Lowercases the entire sentence, then uppercases the first letter of every word.
 * 
 * @param {string} sentence
 * 
 * @returns {string}
 */
function fixCapitalization(sentence) {
    let lowered = sentence.toLowerCase(); // lowercase sentence
    let parts = lowered.split(" "); // split at space
    let s = ""; // final sentence
    for (let i in parts) {
        if (s != "") s += " "; // if this is not the first word add a space
        s += parts[i].charAt(0).toUpperCase(); // add the first, uppercase letter
        s += parts[i].slice(1); // add the rest of the sentence
    }

    return s;
}

/**
 * Generate question from object. Multiple select has the id "question". Returns div element.
 * 
 * @param {Object} qobj
 * 
 * @returns {HTMLDivElement}
 */
function renderQuestion(qobj) {
    let container = document.createElement("div");
    container.classList.add("inline");

    let partsKeys = Object.keys(qobj.parts); // the keys for the object
    for (let i = 0; i < partsKeys.length; i++) { // loop through all particle sections in question
        let span = document.createElement("span"); // the section is in the span element
        if (partsKeys[i] == qobj.question.particle) { // if the question is this section of the sentence
            let sentenceSection = document.createElement("select");

            let defaultOption = document.createElement("option"); // what the box will be set to by default
            defaultOption.setAttribute("disabled", ""); // make the option not be able to be chosen again
            defaultOption.setAttribute("selected", ""); // make the option selected by default
            defaultOption.setAttribute("value", ""); // value is none
            defaultOption.innerHTML = "&lt;Pick One&gt;"; // value of the default option, "&lt;" means <, and "&gt;" means >

            sentenceSection.appendChild(defaultOption);

            let fakes = new Array(...(qobj.question.fakes));
            for (let i in fakes) { // loop through fakes
                let fake = fakes[i];
                let option = document.createElement("option");

                if (qobj.question.type == "particle") { // particle question type
                    option.value = fake.particle;
                    option.innerHTML = fixCapitalization(fake.particle); // capitalize first letter
                } else if (qobj.question.type == "word") { // word question type
                    option.value = fake.word;
                    option.innerHTML = `${fixCapitalization(fake.word)}`;
                    if(qobj.showParticleMeanings) option.innerHTML += ` (${fake.meaning})`;
                }

                sentenceSection.appendChild(option); // append the option to sentenceSection
            }
            let option = document.createElement("option"); // the answer element
            if (qobj.question.type == "particle") {
                option.value = qobj.question.particle;
                option.innerHTML = fixCapitalization(qobj.question.particle);
            } else if (qobj.question.type == "word") {
                option.value = qobj.parts[qobj.question.particle];
                option.innerHTML = `${fixCapitalization(qobj.parts[qobj.question.particle])}`;
                if(qobj.showParticleMeanings) option.innerHTML += ` (${qobj.meanings[qobj.question.particle]})`; // set the select box to the correct value (e.g. "neko (subject)" or "Ute (object subject)")
            }

            setTimeout(() => {
                let position = Math.floor(Math.random() * sentenceSection.children.length) + 1; // position of the correct answer
                sentenceSection.insertBefore(option, sentenceSection.children[position]); // insert correct answer into random position within the select element
            }, 5); // let operations finish

            if (qobj.question.type == "particle") {
                let wordP = document.createElement("p");
                wordP.innerHTML = `${qobj.parts[qobj.question.particle]}&nbsp`; // word + space

                let wordSpan = document.createElement("span"); // span for word
                wordSpan.appendChild(wordP); // append word to it's span element
                container.appendChild(wordSpan); // append span directly to container

                span.appendChild(sentenceSection); // select box
            } else if (qobj.question.type == "word") {
                let particleP = document.createElement("p");
                particleP.innerHTML = `${qobj.question.particle}&nbsp`; // particle + space

                let selectSpan = document.createElement("span"); // span for select box
                selectSpan.appendChild(sentenceSection); // append select box to it's span
                container.appendChild(selectSpan); // append span directly to container

                span.appendChild(particleP); // append particle
            }
        } else {
            let elem = document.createElement("p");
            elem.innerHTML = `${qobj.parts[partsKeys[i]]} ${partsKeys[i]}&nbsp`; // "neko wa", "Uta wo", etc.
            span.appendChild(elem); // append the element to span
        }
        container.appendChild(span);
    }

    let span = document.createElement("span");
    let elem = document.createElement("p");
    elem.innerHTML = qobj.verb; // add the end verb
    span.appendChild(elem);

    container.appendChild(span);

    return container;
}
/* end display question */
/* is correct */
/**
 * Validate an answer when given the question object and the users' answer.
 * 
 * @param {Object} questionObject
 * @param {string} userAnswer
 * 
 * @returns {Object}
 */
function validateAttempt(questionObject, userAnswer) {
    if (questionObject.question.type == "particle") {
        return {
            correct: (userAnswer == questionObject.question.particle), // returns true if correct particle, false if incorrect
            answer: questionObject.question.particle // the correct answer
        }
    } else if (questionObject.question.type == "word") {
        return {
            correct: (userAnswer == questionObject.parts[questionObject.question.particle]), // returns true if correct word, false if incorrect
            answer: questionObject.parts[questionObject.question.particle]
        }
    }
}
/* end is correct */
/* score system */
let questionTimer; // where the timer object is stored
let sliderAnimation; // where the slider animation is stored

class Timer { // the timer system
    constructor() {
        this.then = 0; // the time that the timer was started at
        this.now = 0; // the time that the timer was stopped at
    }

    /**
     * Starts the timer.
     */
    start() {
        this.then = Date.now(); // set then to current time
    }

    /**
     * Stops the timer. Returns the difference between now and the.
     * 
     * @see Timer.start
     * 
     * @returns {number}
     */
    stop() {
        this.now = Date.now(); // set now to current time
        return this.now - this.then; // return difference
    }

    /**
     * Gets the time measured from the timer. If the timer hasn't been stopped, it returns the difference between Date.now() and then.
     * 
     * @see Timer.start
     * 
     * @returns {number}
     */
    get() {
        if (this.now > 0) return this.now - this.then; // if the timer has been stopped, return now - then
        else return Date.now() - this.then; // else return current time - then
    }
}

/**
 * Map a number to a set range
 * 
 * @param {number} in_num
 * @param {number} in_min
 * @param {number} in_max
 * @param {number} out_min
 * @param {number} out_max
 * 
 * @returns {number}
 */
function map(in_num, in_min, in_max, out_min, out_max) {
    return (in_num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

/**
 * Inits/Renews the timer object
 */
function initQuestionAndTimer() {
    questionTimer = new Timer();
    questionTimer.start(); // start the timer

    let sentence = generateSentenceFromLayout(sentenceLayout).obj; // generate sentence
    let sentenceType = Math.floor(Math.random() * 2) === 1 ? "word" : "particle"; // randomly decide between a word or particle question

    if (sentenceType == "word") { // if word question
        question = genWordQuestion(sentence, sentenceLayout);
    } else if (sentenceType == "particle") {
        question = genParticleQuestion(sentence, sentenceLayout);
    }

    let renderedQuestion = renderQuestion(question); // render the question, store result into variable
    sentenceOutput.innerHTML = ""; // blank out sentence output
    sentenceOutput.appendChild(renderedQuestion); // append question to output box

    sliderAnimation = setInterval(() => {
        let width = questionTimer.get(); // get the time
        width = map(CONSTANTS.game.timePerQuestion - width, 0, CONSTANTS.game.timePerQuestion, 0, 100);
        timerDisplay.style.width = `${width}%`; // set timer display width to width

        if (width <= 0) clearInterval(sliderAnimation); // if it is bigger than the width clear.
    }, 50);
}

let scoreMessageTimeout;

/**
 * Show message in the "score message" box. Color of the message can also be changed.
 * 
 * @param {string} message
 * @param {string} color
 */
function showScoreMessage(message, color) {
    scoreMessage.style.color = color; // set the colour style
    scoreMessage.innerHTML = `${message}`; // set score box to message
    clearInterval(scoreMessageTimeout); // clear previous score message so the "disappear" effect doesn't happen before the user can read the message
    scoreMessageTimeout = setTimeout(() => {
        scoreMessage.innerHTML = "&nbsp;"; // blank out score box
        scoreMessage.style.color = "black"; // reset colour
    }, 1000 * 3); // wait three seconds
}

/**
 * Handle the score system. Parameter is an Object from `validateAttempt()`. as to whether or not the user got the question right.
 * 
 * @param {Object} wasCorrect
 */
function handleScore(wasCorrect) {
    let tookTooLong = false; // boolean to say if the user took too long or not

    questionTimer.stop();
    clearInterval(sliderAnimation); // stop the slider animation
    if (questionTimer.get() > CONSTANTS.game.timePerQuestion) {
        wasCorrect.correct = false; // if the user took longer than the max time per question they should be incorrect
        tookTooLong = true;
    }

    if (wasCorrect.correct) {
        rightWrong[0]++; // increase "rights" by one

        let deltaScore = CONSTANTS.game.timePerQuestion - questionTimer.get(); // the new score, maximum time - time taken (e.g. max time 10 seconds, took 6 secons, score is 4.)
        deltaScore = Math.floor(deltaScore / 100); // to make numbers a bit easier to read for people
        score += deltaScore;

        showScoreMessage(`Correct! +${deltaScore}pts`, "green");
    } else {
        rightWrong[1]++; // increase "wrongs" by one
        if (tookTooLong) {
            showScoreMessage("Incorrect. (You took too long!)", "red");
        } else {
            showScoreMessage(`Incorrect. (Correct answer was ${wasCorrect.answer}!)`, "red");
        }
    }

    scoreDisplay.innerHTML = `${score}`; // display score

    let percentage = Math.round((rightWrong[0] / (rightWrong[0] + rightWrong[1])) * 100); // Percentage correct, rounded [(rights / questions answered * 100)]
    percentCorrect.innerHTML = `${percentage}% correct (${rightWrong[0]}/${rightWrong[0] + rightWrong[1]})`; // display the amount to the user

    initQuestionAndTimer(); // reset for next question
}

answerSubmit.addEventListener("click", (e) => {
    questionsDone++;
    if (questionsDone > CONSTANTS.game.questionsPerGame) {
        startLeaderboardTasks(); // trigger the leaderboard system
    } else {
        let selectBox = sentenceOutput.getElementsByTagName("select")[0]; // get the only select box within the sentence output box
        let userChoice = selectBox.value; // what the user selected

        let correct = validateAttempt(question, userChoice);

        handleScore(correct); // handle the score based on what the user chose
    }
});
/* end score system */