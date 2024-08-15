import { $, Glob, write, file } from "bun";


const generatedTemp = 'generated'
const generatedDist = 'generated-contracts'

await $`cd ../contracts && bun docgen`;
await $`cp -R ../contracts/.docgen/src/. ${generatedTemp}`;
await $`rm -rf pages/${generatedDist}`;

const files = new Glob(`${generatedTemp}/**/*.md`).scan(".");

await write(file(`pages/${generatedDist}/contracts.md`), file(`${generatedTemp}/README.md`), { createPath: true });
await write(file(`pages/${generatedDist}/license.md`), file('../contracts/LICENSE.md'), { createPath: true });

let iter = 0;

for await (const match of files) {
    ++iter;
    if (/(.*)\/([^/]+)\.sol\/[^/]+\.md$/.test(match)) {
        const matchLoc = match.replace(`${generatedTemp}/src`, "").replace(/(.*)\/([^/]+)\.sol\/[^/]+\.md$/, "$1/$2.md")
        const filename = `pages/${generatedDist}/${matchLoc}`

        // await Bun.write(Bun.stdout, `${filename}\n`);
        await write(file(filename), file(match), { createPath: true });
    }
}

await Bun.write(Bun.stdout, `Processed ${iter} files\n`);


await $`rm -rf ../contracts/.docgen`;
await $`rm -rf ${generatedTemp}`;