//
// ARKANIC 2021
//

let video = document.getElementById("video");

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let width, height;

video.addEventListener("play", () => {
    timerCallback();
    setTimeout(() => {
        width = video.videoWidth / 10;
        height = video.videoHeight / 10;
    
        canvas.width = width;
        canvas.height = height;

        let div = document.createElement("div");
        for(let y = 0; y < height; y++) {
            let p = document.createElement("p");
            for(let x = 0; x < width; x++) {
                let cb = document.createElement("input");
                cb.type = "checkbox";
                cb.id = `${x}.${y}`;
                p.appendChild(cb);
            }
            div.appendChild(p);
        }

        document.getElementsByTagName("body")[0].appendChild(div);
    }, 0);
}, false);

function timerCallback() {
    if(video.paused || video.ended) return;
    computeFrame();
    setTimeout(() => {
        timerCallback();
    }, 0);
}

function computeFrame() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    for(let x = 0; x < width; x++) {
        for(let y = 0; y < height; y++) {
            let black = (ctx.getImageData(x, y, 1, 1).data[0] < 127);
            document.getElementById(`${x}.${y}`).checked = black;
        }
    }
}