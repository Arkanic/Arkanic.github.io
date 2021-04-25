let cicOutput = document.getElementById("cic-output");
let cicAmount = document.getElementById("cic-amount");
let cicPercent = document.getElementById("cic-percent");
let cicRepeat = document.getElementById("cic-repeat");
let cicSubmit = document.getElementById("cic-submit");

cicSubmit.addEventListener("click", (e) => {
    let amount = parseInt(cicAmount.value);
    let percent = parseInt(cicPercent.value);
    let repeats = parseInt(cicRepeat.value);
    let multBy = 1.00 + (percent/100);

    for(let i = 0; i < repeats; i++) {
        amount *= multBy;
    }

    cicOutput.innerHTML = `Compound Interest: ${amount}`;
});