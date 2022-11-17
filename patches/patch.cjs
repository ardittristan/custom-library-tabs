const data = require("./patches.json");

const { applyPatch } = require("diff");
const { readFileSync, writeFileSync } = require("fs");
const { join } = require("path");

data.forEach((patch) => {
  const patched = applyPatch(readFileSync(join(__dirname, patch.source), { encoding: "utf8" }), readFileSync(join(__dirname, patch.patch), { encoding: "utf8" }));
  writeFileSync(join(__dirname, patch.dest), patched);
});
