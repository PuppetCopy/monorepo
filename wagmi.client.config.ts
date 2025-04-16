import { defineConfig } from '@wagmi/cli'
import { foundry } from '@wagmi/cli/plugins'

export default defineConfig({
  out: "subgraph/abi/__generatedAbi.ts",
  plugins: [
    foundry({
      forge: {
        clean: true
      },
      project: 'contracts',
    }),
  ],
})