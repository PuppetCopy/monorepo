import { defineConfig } from '@wagmi/cli'
import { foundry } from '@wagmi/cli/plugins'

export default defineConfig({
  out: "../middleware/src/const/abi/__generatedAbi.ts",
  plugins: [
    foundry({
      project: "../contracts",
      forge: {
        clean: true
      }
    }),
  ],
})