const chalk = require('chalk');

/**
 * check if title is empty on page
 */
module.exports = function emptyTitles(document) {
	const title = document.querySelector('title').innerHTML;
	if(!title) {
		console.log(chalk.bgRed.black(`No title`));
	} else {
		console.log(chalk.bgCyan.black(`Page title: ${title}`));
	}

}