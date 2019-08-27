const File = require("fs");

const { dirname, join } = require("path");

const root = dirname(File.realpathSync(__filename));

(async () => {
    const source = JSON.parse(File.readFileSync(join(root, "romanian.json")));
    const keys = Object.keys(source);

    keys.sort();

    if (File.existsSync(join(root, "lang", "ro.json"))) {
        File.unlinkSync(join(root, "lang", "ro.json"));
    }

    const output = {
        ro: {}
    };

    for (let i = 0; i < keys.length; i++) {
        output.ro[keys[i]] = source[keys[i]];
    }

    File.appendFileSync(join(root, "lang", `ro.json`), JSON.stringify(output, null, 4));

    console.log(`Complete 'ro.json'`);
})();
