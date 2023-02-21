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
    const filePath = path.join(process.env.GITHUB_WORKSPACE, file);

    const fileStat = fs.lstatSync(filePath);

    if (!fileStat.isDirectory()) {
      zip.addLocalFile(filePath);
      console.log(`[+] ${file} to zip`);
    }
  });

  const destPath = path.join(process.env.GITHUB_WORKSPACE, file);

  zip.writeZip(destPath);

  console.log(`\nZipped file ${dest} successfully`);
}

run();
