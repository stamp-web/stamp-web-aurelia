const fs = require('fs');
const path = require('path');

const dist = path.resolve(__dirname, '../../dist');

function rm(p) {
    if (fs.existsSync(p)) {
        fs.rmSync(p, { recursive: true, force: true });
    }
}

function cp(src, dst) {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.cpSync(src, dst, { recursive: true });
}

/* clean dist */
rm(dist);
fs.mkdirSync(dist);


"resources/**",
    "scripts/**",
    "index.html",
    "favicon.ico",
    "node_modules/pdfmake/build/pdfmake.js",
    "node_modules/pdfmake/build/vfs_fonts.js"

/* copy runtime assets */
cp('scripts', 'dist/scripts');
cp('index.html', 'dist/index.html');
cp('favicon.ico', 'dist/favicon.ico');
cp('node_modules/pdfmake/build/pdfmake.js', 'dist/node_modules/pdfmake/build/pdfmake.js');
cp('node_modules/pdfmake/build/vfs_fonts.js', 'dist/node_modules/pdfmake/build/vfs_fonts.js');

console.log('Pre-pack staging complete');
