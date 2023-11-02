import * as url from 'url';
import {rm, copyFile} from "node:fs/promises";
import fs from "node:fs";
import path from "node:path";
import webpackPkg from "webpack";
import archiver from "archiver";

const {webpack: webpackCallbacks} = webpackPkg;

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const rootDir = path.join(__dirname, '..');
const srcFolder = path.join(rootDir, 'src');
const distFolder = path.join(rootDir, 'dist');
const zipPath = path.join(rootDir, 'extension.zip');

/**
 *
 * @param {import('webpack').Configuration} options
 * @return {Promise<unknown>}
 */
function webpack(options) {
    return new Promise((resolve, reject) => webpackCallbacks(options, (err, stats) => {
        if(err) {
            return reject(err);
        }

        if(stats.hasErrors()) {
            const errors = stats.compilation.errors;
            return reject(errors.length > 1 ? errors : errors[0]);
        }

        resolve();
    }));
}

// 1. Delete previously generated zip file and dist folder
await Promise.all([
    rm(distFolder, {
        force: true,
        recursive: true
    }),
    rm(zipPath, {
        force: true,
    })
]);

// 2. Run webpack build for the script that going to be injected to the page
await webpack({
    mode: 'production',
    entry: path.join(srcFolder, 'colorize.js'),

    // Easier to debug
    optimization: {
        minimize: false
    },

    output: {
        path: distFolder,
        filename: "colorize.js",
    }
});

// 3. Copy the background script
await copyFile(
    path.join(srcFolder, 'background.js'),
    path.join(distFolder, 'background.js')
);


// 4. Zip the extension
// create a file to stream archive data to.
const output = fs.createWriteStream(zipPath);
const archive = archiver('zip');

// good practice to catch warnings (ie stat failures and other non-blocking errors)
archive.on('warning', function(err) {
    if (err.code !== 'ENOENT') {
        throw err;
    }

    console.warn('Got warning when trying to zip', err)
});

// good practice to catch this error explicitly
archive.on('error', function(err) {
    throw err;
});

// pipe archive data to the file
archive.pipe(output);

// Append files
archive.file(path.join(rootDir, 'manifest.json'), { name: 'manifest.json' });
archive.file(path.join(rootDir, 'LICENSE'), { name: 'LICENSE' });

// Copy the icons inside images/icons to the zip in the same path (images/icons)
archive.directory(path.join(rootDir, 'images/icons/'), 'images/icons/');

// Add the dist folder
archive.directory(distFolder, 'dist');

await archive.finalize();


