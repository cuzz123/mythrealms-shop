import {
  getPinterestPublishBlock,
  type PinterestPublishEntrypoint,
} from "../src/lib/pinterest-publisher";

const allowedEntrypoints = new Set<PinterestPublishEntrypoint>(["n8n_adapter"]);
const entrypoint = process.argv[2] as PinterestPublishEntrypoint | undefined;

if (!entrypoint || !allowedEntrypoints.has(entrypoint)) {
  console.error("Usage: pinterest-publish-gate.ts n8n_adapter");
  process.exitCode = 2;
} else {
  console.log(JSON.stringify(getPinterestPublishBlock(entrypoint)));
  process.exitCode = 1;
}
