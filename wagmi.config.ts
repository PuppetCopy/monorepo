import { defineConfig } from '@wagmi/cli'
import { foundry } from '@wagmi/cli/plugins'

export default defineConfig({
  out: "contracts/deployments/abi.ts",
  plugins: [
    foundry({
      project: '.',
      forge: {
        clean: true,
      }
    }),
  ],
})