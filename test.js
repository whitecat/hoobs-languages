const Loco = require("loco-api-js");
const File = require("fs");

const { dirname, join } = require("path");

const loco = new Loco("5pxDtjXTzMLg3tFZ3EdDTEslro-AjMyBC");
const root = dirname(File.realpathSync(__filename));

(async () => {
    const locales = await loco.getLocales();
    const source = JSON.parse(File.readFileSync(join(root, "source.json")));
    const keys = Object.keys(source);

    keys.sort();

    if (File.existsSync(join(root, `missing.json`))) {
        File.unlinkSync(join(root, `missing.json`));
    }

    for (let i = 0; i < locales.length; i++) {
        console.log(`\n${locales[i].code}`);
        console.log("---------------------------------------------------------------");

        const resource = (await loco.exportLocale(locales[i].code));

        for (let j = 0; j < keys.length; j++) {
            console.log(`${keys[j]}: ${(resource[keys[j]] || resource.en[keys[j]] || source[keys[j]]).trim()}`)
        }

        console.log("---------------------------------------------------------------");
    }
})();
