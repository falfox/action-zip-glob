import * as core from "@actions/core";
import { debug } from "@actions/core";
import * as glob from "@actions/glob";
import AdmZip from "adm-zip";
import fs from "fs";
import path from "path";
import { getMultiPathLCA } from "./search";

async function run() {
  const zip = new AdmZip();

  const dest = core.getInput("dest");
  const input = core.getInput("files");
  console.log({
    env: process.env,
    dest,
    input,
  });
  const patterns = input.split(" ");
  const globber = await glob.create(patterns.join("\n"));
  const files = await globber.glob();

  if (files.length === 0) {
    console.log("No files found");
    return;
  }

  const lca = getMultiPathLCA(files);
  debug(`[lca] ${lca}`);
  files.forEach((file) => {
    const fileStat = fs.lstatSync(file);
    const relative = path.relative(lca, file);
    debug(`[rel] ${relative}`);

    if (!fileStat.isDirectory()) {
      const dirname = path.normalize(path.dirname(relative));
      if (dirname === ".") {
        zip.addLocalFile(file);
      } else {
        zip.addLocalFile(file, dirname);
      }
      console.log(`[+] ${file} with dirname ${dirname} to zip`);
    }
  });

  const destPath = path.join(process.env.GITHUB_WORKSPACE!, dest);

  zip.writeZip(destPath);

  console.log(`\nZipped file ${dest} successfully`);
}

run();
