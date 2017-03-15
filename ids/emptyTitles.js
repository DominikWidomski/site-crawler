const chalk = require('chalk');

/**
 * check if title is empty on page
 */
module.exports = function emptyTitles(document) {
	console.log(chalk.cyan(`Page title: ${document.querySelector('title').innerHTML}`));
}