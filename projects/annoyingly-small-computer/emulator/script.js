let commands = {
    // HLT
    "0":(asc) => {
        console.log("Halted");
        asc.running = false;
    },
    // ADD
    "1":(asc) => {
        let acclumator = asc.hexToDeci(asc.acclumator);
        let addressValue = asc.hexToDeci(asc.ram[asc.register.address]);
        let total = asc.deciToHex((acclumator + addressValue) % 16);

        asc.acclumator = total;
    },
    // SUB
    "2":(asc) => {
        let acclumator = asc.hexToDeci(asc.acclumator);
        let addressValue = asc.hexToDeci(asc.ram[asc.register.address]);
        let total = asc.deciToHex(Math.abs(acclumator - addressValue) % 16);
    },
    // STO
    "3":(asc) => {
        let addressRegRaw = asc.hexToDeci(asc.register.address);
        if(addressRegRaw > 7 || addressRegRaw < 0) {
            console.log("STO access overflow");
            this.running = false;
        }

        asc.ram[addressRegRaw] = asc.acclumator;
    },
    // ?
    "4":(asc) => {
        console.log("Unknown command '4'");
        asc.running = false;
    },
    // LDA
    "5":(asc) => {
        let acclumatorRaw = asc.hexToDeci(asc.acclumator);
        if(acclumatorRaw > 7 || acclumatorRaw < 0) {
            console.log("LDA access overflow");
            this.running = false;
        }

        asc.acclumator = asc.ram[acclumatorRaw];
    },
    // BR
    "6":(asc) => {
        asc.counter = asc.deciToHex(asc.hexToDeci(asc.register.address));
        asc.cm = true;
    },
    // BRZ
    "7":(asc) => {
        if(asc.acclumator === "0") {
            asc.counter = asc.deciToHex(asc.hexToDeci(asc.register.address));
            asc.cm = true;
        } else {
            asc.cm = false;
        }
    },
    // BRA
    "8":(asc) => {
        asc.counter = asc.counter = asc.deciToHex(asc.hexToDeci(asc.acclumator));
        asc.cm = true;
    },
    // INP
    "9":(asc) => {
        getInput(asc);
    },
    // OUT
    "A":(asc) => {
        showOutput(asc);
    },
    // ZER
    "B":(asc) => {
        let acclumatorRaw = asc.hexToDeci(asc.acclumator);
        if(acclumatorRaw > 7 || acclumatorRaw < 0) {
            console.log("ZER access overflow");
            this.running = false;
        }
        asc.ram[acclumatorRaw] = "0";
    },
    // ONE
    "C":(asc) => {
        let acclumatorRaw = asc.hexToDeci(asc.acclumator);
        if(acclumatorRaw > 7 || acclumatorRaw < 0) {
            console.log("ONE access overflow");
            this.running = false;
        }
        
        asc.ram[acclumatorRaw] = "1";
    },
    // ?
    "D":(asc) => {
        console.log("Unknown command 'D'");
        this.running = false;
    },
    // ?
    "E":(asc) => {
        console.log("Unknown command 'E'");
        this.running = false;
    },
    // ?
    "F":(asc) => {
        console.log("Unknown command 'F'");
        this.running = false;
    }
}

function getInput(asc) {
    asc.acclumator = prompt("Please enter a hex-nibble input.", "0");
}
function showOutput(asc) {
    alert(asc.acclumator);
}

class AnnoyinglySmallComputer {
    constructor(program) {
        if(program.length > 16) return console.error("Program is too long!!");
        
        this.rom = [];
        for(let x = 0; x < 16; x++) {
            this.rom[x] = "00"
        }
        for(let i in program) {
            if(!(/[0-9A-Fa-f]{2}/g).test(program[i]) || !(program[i] === "00")) return console.error(`${program[i]} is not an 8-bit hex!`);
            if(program[i].length != 2) return console.error(`${program[i]} is too short/long!`);

            this.rom[i] = program[i];
        }

        this.ram = [];
        for(let x = 0; x < 8; x++) {
            this.ram[x] = "0";
        }

        this.counter = "0";
        this.acclumator = "0";
        this.register = {
            instruction: "0",
            address: "0"
        }

        this.running = false;
    }

    hexToDeci(h) {
        if(h.length != 1) return console.error(`${h} is not a 4-bit hex!`);

        return parseInt(h, 16);
    }

    deciToHex(d) {
        if(d < 0 || d > 15) return console.error(`${d} is either too large or too small!`);

        return d.toString(16).toUpperCase();
    }

    cycle() {
        if(!this.running) return false;

        this.cm = false;
        
        let nibble = this.rom[this.hexToDeci(this.counter)];

        this.register.instruction = nibble[0];
        this.register.address = nibble[1];

        this.cm = false;

        // run command
        commands[this.register.instruction](this);

        let counterRaw = this.hexToDeci(this.counter);
        if(!this.cm) counterRaw++;
        this.counter = this.deciToHex(counterRaw);
        if(counterRaw > 15) {
            console.log("Reached end of ROM, stopping...");
            this.running = false;
        }

        return true;
    }
}


let counter = document.getElementById("counter");
let instructionRegister = document.getElementById("instruction-register");
let addressRegister = document.getElementById("address-register");
let rom = document.getElementById("rom");
let ram = document.getElementById("ram");
let programInput = document.getElementById("program-input");
let programSubmit = document.getElementById("program-submit");

function updateHTML(asc) {
    counter.innerHTML = `${asc.counter}`;
    instructionRegister.innerHTML = `${asc.register.instruction}`;
    addressRegister.innerHTML = `${asc.register.address}`;
    rom.innerHTML = `${asc.rom}`;
    ram.innerHTML = `${asc.ram}`;
}

let cycleOnce = document.getElementById("cycle-once");

programSubmit.addEventListener("click", (e) => {
    let asc = new AnnoyinglySmallComputer((programInput.value || "90\nA0\n70").toUpperCase().split("\n"));
    asc.running = true;

    updateHTML(asc);

    let running = true;
    cycleOnce.addEventListener("click", (e) => {
        if(!running) return console.log("Program is finished.");
        console.log(asc.counter);
        running = asc.cycle();

        updateHTML(asc);
    });
});