import { boot } from "https://656703bb61f20c00084a3479--edge.netlify.com/bootstrap/index-combined.ts";

const functions = {}; const metadata = { functions: {} };


      try {
        const { default: func } = await import("file:///Users/nisko/GIT/puppet/netlify/edge-functions/og-middleware.ts");

        if (typeof func === "function") {
          functions["og-middleware"] = func;
          metadata.functions["og-middleware"] = {"url":"file:///Users/nisko/GIT/puppet/netlify/edge-functions/og-middleware.ts"}
        } else {
          console.log("\u001b[91m◈\u001b[39m \u001b[31mFailed\u001b[39m to load Edge Function \u001b[33mog-middleware\u001b[39m. The file does not seem to have a function as the default export.");
        }
      } catch (error) {
        console.log("\u001b[91m◈\u001b[39m \u001b[31mFailed\u001b[39m to run Edge Function \u001b[33mog-middleware\u001b[39m:");
        console.error(error);
      }
      

boot(functions, metadata);