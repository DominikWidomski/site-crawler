const url = require('url');
const chalk = require('chalk');

function leftPad(string, length, padChar = ' ') {
    return Array(length).fill(padChar).join('') + string;
}

function formatOutput(repeatingLinks) {
    for(const [pathname, labels] of Object.entries(repeatingLinks)) {
        console.log(chalk.red(`${pathname}: `));

        for(const { label } of labels) {
            console.log(leftPad(label.replace(/\s+/gi, ' ').trim(), pathname.length));
        }
    }
}

/**
 * Check for inconsistent labels for the same anchors
 */
module.exports = function inconsistentAnchorsText(document) {
	const repeatingLinks = Array.from(document.querySelectorAll('a')).reduce((obj, a) => {
        if(!a.href) {
            return obj;
        }

        console.log(chalk.orange(a.href));
        const uri = url.parse(a.href);

        if(!obj[uri.pathname]) {
            obj[uri.pathname] = [];
        }

        // Getting innerHTML because innerText returns empty if element hidden
        obj[uri.pathname].push({
            el: a,
            label: a.innerHTML
        });

        return obj;
    }, {});

    for(const [pathname, labels] of Object.entries(repeatingLinks)) {
        const reduced = labels.reduce((arr, label) => {
            label = label.label.toLowerCase().trim();

            if(!arr.includes(label)) {
                arr.push(label);
            }

            return arr;
        }, []);

        if(reduced.length === 1) {
            delete repeatingLinks[pathname];
        }
    }

    if(Object.keys(repeatingLinks).length) {
        console.log(chalk.bgRed(`Repeating links labels:`));
        formatOutput(repeatingLinks);
    }

    return repeatingLinks;
}