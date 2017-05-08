const Crawler = require('Crawler');
const jsdom = require('jsdom');
const url = require('url');
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const appRoot = require('app-root-path');
const chalk = require('chalk');

function loadIdentifiers(s) {
	const ids = {};
	let files;

	try {
		files = glob.sync('ids/**/*.js');
	} catch(error) {
		throw error;
	}

	files.forEach(filePath => {
		const absPath = path.resolve(appRoot.path, filePath);

		try {
            fs.accessSync(absPath, fs.constants.F_OK | fs.constants.W_OK);
        } catch(e) {
            console.warn(`${absPath} not readable.`);
        }

        const stat = fs.statSync(absPath);

        if(stat.isFile()) {
        	ids[filePath] = require(path.resolve(filePath));
        	console.log(chalk.blue(`Loaded: ${filePath.replace('ids/', '')}`));
        } else if(stat.isDirectory()) {
        	// @TODO
        }
	});

	console.log(chalk.blue(`Loaded [${Object.keys(ids).length}] identifiers`));

	return ids;
}

const queued = false;

const identifiers = loadIdentifiers();

const c = new Crawler({
	jQuery: jsdom.jsdom,
	maxConnections: 10,
	callback: (error, res, done) => {
		if(error) {
			console.error(error);
		} else {
			var document = jsdom.jsdom(res.body);
			// const $ = res.$;

			console.log(chalk.bgCyan.black(`Path: ${res.req.path}`));

			for(let idPath of Object.keys(identifiers)) {
				identifiers[idPath](document);
			}

			Array.from(document.querySelector('a')).forEach(a => {
				if(!queued && a.href !== '' || a.href !== '#') {
					c.queue(a.href);
				}
			});
		}

		done();
	}
}
);


// @TODO: fails silently if can't access?
// Waits for timeout I imagine
let pathToCrawl = url.parse(process.argv[2] || '');

if(!pathToCrawl.hostname) {
	pathToCrawl = 'http://127.0.0.1:9090/';
}

c.queue(pathToCrawl.href);