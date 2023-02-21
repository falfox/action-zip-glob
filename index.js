const path = require("path");
const glob = require('@actions/glob');
const AdmZip = require("adm-zip");
const core = require("@actions/core");

const files = core.getInput("files");
const dest = core.getInput("dest");

console.log(`Ready to zip "${files}" into ${dest}`);

const zip = new AdmZip();

async function run() {
  const patterns = files.split(" ");
  const globber = await glob.create(patterns.join("\n"));
  const files = await globber.glob();

  if (files.length === 0) {
    console.log("No files found");
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(process.env.GITHUB_WORKSPACE, file);

    zip.addLocalFile(filePath);
  });

  const destPath = path.join(process.env.GITHUB_WORKSPACE, dest);

  zip.writeZip(destPath);

  console.log(`\nZipped file ${dest} successfully`);
}

run();
