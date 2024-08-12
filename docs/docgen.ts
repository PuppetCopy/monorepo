import { $, Glob, write, file } from "bun";


await $`cd ../contracts && bun docgen`;
await $`cp -R ../contracts/.docgen/src/src/. generated`;

const files = new Glob("generated/**/*.md").scan(".");

// await write(file(`docs/pages/contracts/README.md`), file('docs/generated/src/README.md'), { createPath: true });
// await write(file(`docs/pages/contracts/README/LICENSE.md`), file('LICENSE'), { createPath: true });

let iter = 0;

for await (const match of files) {
    ++iter;
    if (/(.*)\/([^/]+)\.sol\/[^/]+\.md$/.test(match)) {
        const matchLoc = match.replace("generated", "").replace(/(.*)\/([^/]+)\.sol\/[^/]+\.md$/, "$1/$2.md")
        const filename = `pages/contracts/${matchLoc}`

        // await Bun.write(Bun.stdout, `${filename}\n`);
        await write(file(filename), file(match), { createPath: true });
    }
}

await Bun.write(Bun.stdout, `Processed ${iter} files\n`);


await $`rm -rf ../contracts/.docgen`;
await $`rm -rf generated`;