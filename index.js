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

			for(let idPath of Object.keys(identifiers)) {
				identifiers[idPath](document);
			}
		}

		done();
	}
}
);


// @TODO: fails silently if can't access?
// Waits for timeout I imagine
c.queue('http://127.0.0.1:9090/about-us');