const fs = require("fs");

let exportFiles = [];
fs.readdir(__dirname + "site/projects/webtoys/js/p5/", (err, files) => {
    if(err) throw err;
    files.forEach(file => {
        exportFiles.push(file);
    });
    let exportAssetNamesString = "module.exports=";
    exportAssetNamesString += JSON.stringify(exportFiles);
    exportAssetNamesString = new Uint8Array(Buffer.from(exportAssetNamesString));
    fs.writeFile(__dirname + "../site/projects/webtoys/js/generated/p5List.js", exportAssetNamesString, err => {
        if(err) throw err;
        console.log("Generated p5.js webtoy list.");
    });
});
