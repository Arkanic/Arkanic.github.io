let spinnerCanvas = document.getElementById("spinner-canvas");
let imageUpload = document.getElementById("image-upload");
let generateSpinner = document.getElementById("generate-spinner");
let progress = document.getElementById("progress");
let messages = document.getElementById("messages");

let spinX = document.getElementById("spin-x");
let spinY = document.getElementById("spin-y");
let spinZ = document.getElementById("spin-z");

let image = new Image();
image.src = "../img/cube.png";
let texture = new THREE.Texture(image);
image.addEventListener("load", () => {
    texture.needsUpdate = true;
});

console.lhandlers.push(() => {
    let m = "";
    for(let i = console.logs.length - 1; i > console.logs.length - 11; i--) {
        m += `<p>${console.logs[i] || ""}</p>`;
    }
    messages.innerHTML = m;
});

let imageLoadedPromise = new Promise(resolve => {
    imageUpload.addEventListener("change", (e) => {
        let file = imageUpload.files[0];
        let reader = new FileReader();

        reader.addEventListener("load", () => {
            image.src = reader.result;
            resolve();
        });

        if(file) reader.readAsDataURL(file);
    });
});

function mapr(value, a, b, c, d) {
    value = (value - a) / (b - a);
    return c + value * (d - c);
}

function generateGif(elem, renderFunction, duration=1, fps=30) {
    let frames = duration * fps;

    let capturer = new CCapture({
        format: "gif",
        workersPath: "/js/",
        framerate: fps,
        verbose: true
    });

    capturer.start();

    let now = 0;

    return new Promise(async function addFrame(resolve)  {
        renderFunction(now / frames);

        await capturer.capture(elem);

        progress.value = now / frames;
        now++;

        if(now < frames) await setTimeout(() => {
            addFrame(resolve);
        }, 0);
        else {
            capturer.save((blob) => {
                resolve(blob);
            });
        }
    });
}

generateSpinner.addEventListener("click", async (e) => {
    generateSpinner.style.display = "none";
    progress.style.display = "";

    let buffer = await generateGif(spinnerCanvas, render, 4, 30);
    let blob = new Blob([buffer], {type: "image/gif"});

    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "spinny.gif";
    link.dispatchEvent(new MouseEvent("click"));

    window.location.reload();
});

// setup
let camera = new THREE.PerspectiveCamera(50, 1, 0.1, 10);
camera.position.z = 2;

let scene = new THREE.Scene();
let geometry = new THREE.BoxGeometry(1, 1, 1);
let material = new THREE.MeshBasicMaterial({map:texture});
let mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

let renderer = new THREE.WebGLRenderer({canvas:spinnerCanvas});
renderer.setClearColor(0xffffff, 1);
renderer.setSize(400, 400);

function render(progress) {
    // DOM read is faster than write, so this is ok
    if(spinX.checked) mesh.rotation.x = progress * Math.PI * 2;
    if(spinY.checked) mesh.rotation.y = progress * Math.PI * 2;
    if(spinZ.checked) mesh.rotation.z = progress * Math.PI * 2;

    renderer.render(scene, camera);
}

function animation(time) {
    if(progress.style.display === "none") {
        render((time / 2000) % 1);
    }

    requestAnimationFrame(animation);
}

requestAnimationFrame(animation);