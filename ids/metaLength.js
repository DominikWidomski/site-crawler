const chalk = require('chalk');
const config = {
    min: 140,
    max: 160
}

module.exports = function missingMetaTags(document) {
    const meta = document.querySelector('meta[name="description"]');

    // @NOTE: doesn't output when no meta exists
    // might be useful to output anyway
    if(meta && (meta.length < config.min || meta.length > config.max)) {
        console.log(chalk.bgYellow.black('Page meta description is not the ideal length.'));
    }
}