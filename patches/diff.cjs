const data = require("./patches.json");

const { createTwoFilesPatch } = require("diff");
const { readFileSync, writeFileSync } = require("fs");
const { join, basename } = require("path");

data.forEach((patch) => {
  const patchContent = createTwoFilesPatch(
    basename(patch.source),
    basename(patch.dest),
    readFileSync(join(__dirname, patch.source), { encoding: "utf8" }),
    readFileSync(join(__dirname, patch.dest), { encoding: "utf8" })
  );
  writeFileSync(join(__dirname, patch.patch), patchContent);
});
