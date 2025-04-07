import { defineConfig } from '@wagmi/cli'
import { foundry } from '@wagmi/cli/plugins'

export default defineConfig({
  out: "middleware/const/src/abi/__generatedContracts.ts",
  plugins: [
    foundry({
      clean: true,
      project: 'contracts',
    }),
  ],
})