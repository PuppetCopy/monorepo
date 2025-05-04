import { defineConfig } from '@wagmi/cli'
import { foundry } from '@wagmi/cli/plugins'

export default defineConfig({
  out: './src/const/abi/__generated/abi.ts',
  plugins: [
    foundry({
      project: '../contracts',
      forge: {
        clean: true,
      },
    }),
  ],
})
