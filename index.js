const fs = require("fs");
const path = require("path");
const glob = require("glob");
const isGlob = require("is-glob");
const AdmZip = require("adm-zip");
const core = require("@actions/core");

const files = core.getInput("files");
const dest = core.getInput("dest");
const recursive = core.getInput("recursive") === "true";

console.log(`Ready to zip "${files}" into ${dest}`);

const zip = new AdmZip();

files.split(" ").forEach((fileName) => {
  if (isGlob(fileName)) {
    const files = glob.sync(fileName, {
      cwd: process.env.GITHUB_WORKSPACE,
      absolute: true,
      nodir: !recursive,
    });

    files.forEach((filePath) => {
      const dir = path.dirname(filePath);
      const zipDir = dir === process.env.GITHUB_WORKSPACE ? "" : dir;

      zip.addLocalFile(filePath, !recursive && zipDir);
      console.log(`  - ${filePath}`);
    });
  } else {
    const filePath = path.join(process.env.GITHUB_WORKSPACE, fileName);

    if (!fs.existsSync(filePath)) {
      console.log(`  - ${fileName} (Not Found)`);
      return;
    }

    const dir = path.dirname(fileName);
    const stats = fs.lstatSync(filePath);

    if (stats.isDirectory()) {
      const zipDir = dir === "." ? fileName : dir;
      zip.addLocalFolder(filePath, !recursive && zipDir);
    } else {
      const zipDir = dir === "." ? "" : dir;
      zip.addLocalFile(filePath, !recursive && zipDir);
    }

    console.log(`  - ${fileName}`);
  }
});

const destPath = path.join(process.env.GITHUB_WORKSPACE, dest);

zip.writeZip(destPath);

console.log(`\nZipped file ${dest} successfully`);
