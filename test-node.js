const quickNoise = require("./quick-noise.js");

const out = [];
const w = 200,h=50;
for (let y = 0; y <= h; y+=1) {
    out[y] = [];
    for (let x = 0; x <= w; x+=1) {
        let num = quickNoise.noise((x/w)*50,(y/h)*50,1);
        if (num > 0) {
            num = '\x1b[30m\x1b[40m' + '#';
        } else {
            num = '\x1b[37m\x1b[47m' + '#';
        }
        out[y][x] = num+'\x1b[0m';
    }
}
console.log(out.map(a => a.join('')).join("\n"));