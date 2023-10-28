import fs from "node:fs";
import {readdir, readFile, stat, writeFile} from "node:fs/promises";
import {createGunzip, unzipSync} from "node:zlib";
import {fileURLToPath} from "node:url";
import {compose} from 'node:stream';
import {pipeline} from 'node:stream/promises';
import path from "node:path";

import {faker} from "@faker-js/faker";

const __dirname = fileURLToPath(new URL('.', import.meta.url));


function createAddHtml(title) {
    return async function* addHtmlWrapping(stream) {
        yield `<!DOCTYPE html><html translate="no"><head><title>${title}</title></head><body><pre>`;

        for await (const chunk of stream) {
            yield chunk;
        }

        yield '</pre></body></html>';
    }
}

function* parsePart(part) {
    const type = part[0];
    const value = part.substring(1);

    if (type === 's') {
        yield value;
    } else {
        yield faker.lorem.word(parseInt(value))
    }
}

async function* splitByDeliminator(stream) {
    let last = '';

    for await (const chunk of stream) {
        last += chunk.toString();
        const parts = last.split('\x06');

        if (parts.length === 1) {
            continue;
        }

        last = parts.pop();

        for (const part of parts) {
            yield* parsePart(part);
        }
    }

    if (last) {
        yield* parsePart(last);
    }
}

function createParser(title) {
    return compose(
        createGunzip(),
        splitByDeliminator,
        // parseLine,
        // generateItem,
        createAddHtml(title),
    )
}


async function generateFromTemplates(inFilePath, outFilePath) {
    const title = path.basename(outFilePath, '.html');

    console.time(`generate from template ${title}`);

    console.time(`generate from template ${title}: setup`);
    let templateFile;
    {
        const rawFileContent = await readFile(inFilePath);
        const unzippedFileContent = unzipSync(rawFileContent);
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

        if(newPart) {
            type = char;
            newPart = false;
            continue;
        }

        if(char === '\x06') {
            if (type === 's') {
                output += value;
            } else {
                output += faker.lorem.word(parseInt(value));
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
