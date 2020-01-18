const Loco = require("loco-api-js");
const File = require("fs");

const { dirname, join } = require("path");

const loco = new Loco("...");
const root = dirname(File.realpathSync(__filename));

(async () => {
    const locales = await loco.getLocales();
    const source = JSON.parse(File.readFileSync(join(root, "source.json")));
    const keys = Object.keys(source);

    keys.sort();

    const missing = {};

    if (File.existsSync(join(root, `missing.json`))) {
        File.unlinkSync(join(root, `missing.json`));
    }

    for (let i = 0; i < locales.length; i++) {
        const local = locales[i].code.split("-")[0];

        if (local === "en") {
            if (File.existsSync(join(root, "lang", `${local}.json`))) {
                File.unlinkSync(join(root, "lang", `${local}.json`));
            }

            const output = {};

            output[local] = {};

            for (let j = 0; j < keys.length; j++) {
                output[local][keys[j]] = (source[keys[j]] || "").trim();
            }

            File.appendFileSync(join(root, "lang", `${local}.json`), JSON.stringify(output, null, 4));
        } else {
            if (File.existsSync(join(root, "lang", `${local}.json`))) {
                File.unlinkSync(join(root, "lang", `${local}.json`));
            }

            const resource = (await loco.exportLocale(locales[i].code));
            const output = {};

            output[local] = {};

            for (let j = 0; j < keys.length; j++) {
                if (resource[keys[j]] === undefined && resource.en[keys[j]] === undefined) {
                    missing[keys[j]] = (source[keys[j]] || "").trim();
                }

                output[local][keys[j]] = (resource[keys[j]] || resource.en[keys[j]] || source[keys[j]] || "").trim();
            }

            File.appendFileSync(join(root, "lang", `${local}.json`), JSON.stringify(output, null, 4));
        }

        console.log(`Complete '${local}.json'`);
    }

    File.appendFileSync(join(root, `missing.json`), JSON.stringify(missing, null, 4));
})();
