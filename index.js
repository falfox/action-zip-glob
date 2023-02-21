const fs = require("fs");
const path = require("path");
const glob = require("@actions/glob");
const AdmZip = require("adm-zip");
const core = require("@actions/core");

const dest = core.getInput("dest");

const zip = new AdmZip();

async function run() {
  const input = core.getInput("files");
  const patterns = input.split(" ");
  const globber = await glob.create(patterns.join("\n"));
  const files = await globber.glob();

  if (files.length === 0) {
    console.log("No files found");
    return;
  }

  files.forEach((file) => {
    const fileStat = fs.lstatSync(file);
    const relativePath = path.relative(process.env.GITHUB_WORKSPACE, file);

    if (!fileStat.isDirectory()) {
      zip.addLocalFile(file, path.dirname(relativePath));
      console.log(`[+] ${file} to zip`);
    }
  });

  const destPath = path.join(process.env.GITHUB_WORKSPACE, dest);

  zip.writeZip(destPath);

  console.log(`\nZipped file ${dest} successfully`);
}

run();
