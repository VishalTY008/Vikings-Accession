var fs = require('fs'), p = require('path');
var base = 'C:/Users/Admin/Desktop/ChiragDubey/client/src';
function w(r,c){var f=p.join(base,r);fs.mkdirSync(p.dirname(f),{recursive:true});fs.writeFileSync(f,c);console.log('OK:',r);}
module.exports = {w, base};
