//const log = require('fancy-log');
//const { bold, dim, cyan, blue, red, green, magenta, grey, white, redBright, cyanBright, greenBright, blueBright, bgMagenta } = require('ansi-colors');

// DYNAMIC CONTENT EXPORT
const dco = require("./gulp-dco.js");
exports.default = dco.default;
exports.fr = dco.fr;
exports.it = dco.it;
exports.de = dco.default;
exports.build = dco.build;
