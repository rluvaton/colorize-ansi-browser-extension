import puppeteer from 'puppeteer';
import {fileURLToPath} from "node:url";
import path from "node:path";
import fs, {readdir, stat, writeFile} from "node:fs/promises";

import lighthouse from "lighthouse";
import {join} from "path";

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const tmpDir = join(process.cwd(), 'exthouse')

const formats = {
    json: 'json',
    html: 'html'
}
const cacheType = {
    cold: 'cold',
    warm: 'warm',
    hot: 'hot'
}

// defaults

const defaultName = 'Default'
const defaultTotalRuns = 1
const defaultFormat = formats.html
const defaultCacheType = cacheType.cold

async function getAllGeneratedFiles() {
    const dirPath = path.join(__dirname, './generated');
    const files = [];

    for (const file of await readdir(dirPath)) {
        if (!file.endsWith('.html')) {
            // Skip non-html files
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

const [localFilePath] = await getAllGeneratedFiles();


const lhrConfig = {
    extends: 'lighthouse:default',
    settings: {
        throttlingMethod: 'devtools', // Lantern does not support warm/hot caching
        emulatedFormFactor: 'desktop', // It's not possible to install extension on mobile
        throttling: {
            cpuSlowdownMultiplier: 2 // reduce slowdown to emulate desktop
        },
        output: 'json',
        onlyAudits: [
            'screenshot-thumbnails',
            'max-potential-fid',
            'interactive',
            'mainthread-work-breakdown',
            'bootup-time',
            'network-requests',
            'main-thread-tasks'
        ]
    }
}
const cache = cacheType.hot;

function getUrlForLocalHtmlFile(filePath) {
    // TODO - need to run:
    // npx serve ./performance/generated
    return `http://localhost:3000/${path.basename(filePath)}`;
}

async function openLocalHtmlFile(page, filePath) {
    await page.goto(getUrlForLocalHtmlFile(filePath));
    // await page.goto(`file://${filePath}`);
    // const contentHtml = await fs.readFile(filePath);
    //
    // await page.setContent(contentHtml.toString());
}

async function measureChromium() {
    const pathToExtension = path.join(__dirname, '../', 'releases/v0.4.1/src');
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            `--disable-extensions-except=${pathToExtension}`,
            `--load-extension=${pathToExtension}`,
        ],
    });
    const [page] = await browser.pages();

    await page.emulateMediaFeatures([
        {name: 'prefers-color-scheme', value: 'dark'},
    ]);

    // const backgroundPageTarget = await browser.waitForTarget(
    //     target => target.type() === 'service_worker'
    // );
    // const backgroundPage = await backgroundPageTarget.page();

    const lhOpts = {
        port: new URL(browser.wsEndpoint()).port,
        disableStorageReset: cache !== defaultCacheType
    }
    // The smallest page
    const url = getUrlForLocalHtmlFile(localFilePath);
    await openLocalHtmlFile(page, localFilePath)

    // if (cache === cacheType.warm) {
    //     await lighthouse(url, lhOpts, lhrConfig)
    // } else if (cache === cacheType.hot) {
    //     await lighthouse(url, lhOpts, lhrConfig)
    //     await lighthouse(url, lhOpts, lhrConfig)
    // }

    // const {lhr} = await lighthouse(url, lhOpts, lhrConfig)

    // await browser.close()

    return {lhr}
}

const totalRuns = 1 || defaultTotalRuns;

for (let i = 1; i <= totalRuns; i++) {
    const startTime = Date.now()
    try {
        const {lhr} = await measureChromium()
        await saveDebugResult(i, lhr)
        console.info('  %s: complete in %sms/%sms', i, Date.now() - startTime, Math.round(lhr.timing.total))
    } catch (e) {
        console.error(e)
    }
}


/**
 * Save debug report.
 *
 * @param {number} i
 * @param {LhResult} lhr
 */

function saveDebugResult(i, lhr) {
    const reportPath = join(tmpDir, `result-colorize-${i}.json`)
    const compactLhr = {...lhr, i18n: undefined, timing: {total: lhr.timing.total}}
    return writeFile(reportPath, JSON.stringify(compactLhr, null, '  '))
}

