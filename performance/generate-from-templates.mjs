import {readdir, readFile, stat, writeFile} from "node:fs/promises";
import {gunzipSync} from "node:zlib";
import {fileURLToPath} from "node:url";
import {compose} from 'node:stream';
import path from "node:path";

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const CHARACTERS_LENGTH = CHARACTERS.length;

function generateString(length) {
    let result = '';
    let counter = 0;
    while (counter < length) {
        result += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS_LENGTH));
        counter += 1;
    }
    return result;
}

async function generateFromTemplates(inFilePath, outFilePath) {
    const title = path.basename(outFilePath, '.html');

    console.time(`generate from template ${title}`);

    console.time(`generate from template ${title}: setup`);
    let templateFile;
    {
        const rawFileContent = await readFile(inFilePath);
        const unzippedFileContent = gunzipSync(rawFileContent);
        templateFile = unzippedFileContent.toString();
    }
    console.timeEnd(`generate from template ${title}: setup`);

    console.time(`generate from template ${title}: generate`);

    let output = `<!DOCTYPE html><html translate="no"><head><title>${title}</title></head><body><pre>`;

    const fileLength = templateFile.length;

    let newPart = true;
    let value = '';
    let type = undefined

    for (let i = 0; i < fileLength; i++) {
        const char = templateFile[i];

        if (newPart) {
            type = char;
            newPart = false;
            continue;
        }

        if (char === '\x06') {
            if (type === 's') {
                output += value;
            } else {
                output += generateString(parseInt(value));
            }

            newPart = true;
            value = '';
            type = undefined;
            continue;
        }

        value += char;
    }

    output += `</pre></body></html>`
    await writeFile(outFilePath, output);

    console.timeEnd(`generate from template ${title}: generate`);
    console.timeEnd(`generate from template ${title}`);
}

async function getAllFilesInDirectory(dirPath) {
    const files = [];

    for (const file of await readdir(dirPath)) {
        if (!file.endsWith('.gzip')) {
            // Skip non-gzip files
            continue;
        }

        const filePath = path.join(dirPath, file);

        const {size} = await stat(filePath)
        files.push({path: filePath, size});
    }

    return files
        // Sort by size from smallest to largest
        .sort((itemA, itemB) => itemA.size - itemB.size)
        .map(item => item.path);
}

const fileInDir = await getAllFilesInDirectory(path.join(__dirname, './templates'));

for (const file of fileInDir) {
    const outFilePath = path.join(__dirname, './generated', path.basename(file, '.gzip') + '.html');

    await generateFromTemplates(file, outFilePath);
}
