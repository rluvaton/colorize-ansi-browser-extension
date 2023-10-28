import {readFile, writeFile, readdir} from "node:fs/promises";
import {unzipSync} from "node:zlib";
import {faker} from "@faker-js/faker";
import {fileURLToPath} from "node:url";
import path from "node:path";

const __dirname = fileURLToPath(new URL('.', import.meta.url));

function wrapWithHtml(title, text) {
    return `<html><head><title>${title}</title></head><body><pre>${text}</pre></body></html>`;
}

async function generateFromTemplates(inFilePath, outFilePath) {
    const title = path.basename(outFilePath, '.html');
    let templateFile;

    {
        const rawFileContent = await readFile(inFilePath);
        const unzippedFileContent = unzipSync(rawFileContent);
        templateFile = JSON.parse(unzippedFileContent.toString());
    }

    let generatedFileContent = '';

    for (let item of templateFile) {
        generatedFileContent += typeof item === 'string'
            // predefined string
            ? item
            // Then a number that is the length of the string
            : faker.lorem.word(item);
    }

    await writeFile(outFilePath, wrapWithHtml(title, generatedFileContent));
}

async function getAllFilesInDirectory(dirPath) {
    const files = [];

    for (const file of await readdir(dirPath)) {
        if (!file.endsWith('.gzip')) {
            // Skip non-gzip files
            continue;
        }

        const filePath = path.join(dirPath, file);
        files.push(filePath);
    }

    return files;
}

const fileInDir = await getAllFilesInDirectory(path.join(__dirname, './templates'));

for (const file of fileInDir) {
    const outFilePath = path.join(__dirname, './generated', path.basename(file, '.gzip') + '.html');

    await generateFromTemplates(file, outFilePath);
}
