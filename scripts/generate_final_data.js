const {generateRandomPan} = require('./pan-generator');
const data = require('./data');
var fs = require('fs');


let newData = data.map(e => {
    e.pan = generateRandomPan();
    return e;
});

console.log(newData);

fs.writeFile(
    "users.json",
    JSON.stringify(newData),
    err => {
        // Checking for errors 
        if (err) throw err;

        // Success 
        console.log("Done writing");
    }); 