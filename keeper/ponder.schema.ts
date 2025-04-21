import { onchainTable } from "ponder";

export const blitmapTokens = onchainTable("blitmap_tokens", (t) => ({
  id: t.integer().primaryKey(),
  owner: t.hex(),
}));