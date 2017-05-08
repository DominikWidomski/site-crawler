const chalk = require('chalk');

module.exports = function missingMetaTags(document) {
    if(!document.querySelector('meta[name="description"]')) {
        console.log(chalk.bgRed.black('Page is missing meta description.'));
    }
}