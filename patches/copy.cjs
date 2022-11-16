const data = require("./patches.json");

const { copyFileSync } = require("fs");
const { join } = require("path");

data.forEach((patch) => {
  copyFileSync(join(__dirname, patch.source), join(__dirname, patch.dest));
});
