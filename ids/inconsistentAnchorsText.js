const url = require('url');
const chalk = require('chalk');

function leftPad(string, length, padChar = ' ') {
    return `${padChar.repeat(length)}${string}`;
}

function formatOutput(repeatingLinks) {
    for(const [pathname, labels] of Object.entries(repeatingLinks)) {
        console.log(chalk.red(`${pathname}: `));

        const out = [];
        for(const { label } of labels) {
            // @TODO: Can be done better, I'm sure
            // also an option to squash, I guess output is another thing still
            if(!out.includes(label)) {
                console.log(leftPad(label.replace(/\s+/gi, ' ').trim(), pathname.length + 2));
                out.push(label);
            }
        }
    }
}

/**
 * Check for inconsistent labels for the same anchors
 * @TODO: check for and label external urls
 */
module.exports = function inconsistentAnchorsText(document) {
	const repeatingLinks = Array.from(document.querySelectorAll('a')).reduce((obj, a) => {
        if(!a.href) {
            return obj;
        }

        const uri = url.parse(a.href);

        // @TODO: pathname is `null` when href is `#` etc.
        if(!uri.pathname) {
            return obj;
        }

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
        console.log(chalk.bgRed.black(`Repeating links labels:`));
        formatOutput(repeatingLinks);
    }

    return repeatingLinks;
}