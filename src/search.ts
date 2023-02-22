import { debug } from "@actions/core";
import * as path from "path";

/**
 * If multiple paths are specific, the least common ancestor (LCA) of the search paths is used as
 * the delimiter to control the directory structure for the artifact. This function returns the LCA
 * when given an array of search paths
 *
 * Example 1: The patterns `/foo/` and `/bar/` returns `/`
 *
 * Example 2: The patterns `~/foo/bar/*` and `~/foo/voo/two/*` and `~/foo/mo/` returns `~/foo`
 */
export function getMultiPathLCA(searchPaths: string[]): string {
  if (searchPaths.length < 2) {
    throw new Error("At least two search paths must be provided");
  }

  const commonPaths = new Array<string>();
  const splitPaths = new Array<string[]>();
  let smallestPathLength = Number.MAX_SAFE_INTEGER;

  // split each of the search paths using the platform specific separator
  for (const searchPath of searchPaths) {
    // debug(`Using search path ${searchPath}`);

    const splitSearchPath = path.normalize(searchPath).split(path.sep);

    // keep track of the smallest path length so that we don't accidentally later go out of bounds
    smallestPathLength = Math.min(smallestPathLength, splitSearchPath.length);
    splitPaths.push(splitSearchPath);
  }

  // on Unix-like file systems, the file separator exists at the beginning of the file path, make sure to preserve it
  if (searchPaths[0].startsWith(path.sep)) {
    commonPaths.push(path.sep);
  }

  let splitIndex = 0;
  // function to check if the paths are the same at a specific index
  function isPathTheSame(): boolean {
    const compare = splitPaths[0][splitIndex];
    for (let i = 1; i < splitPaths.length; i++) {
      if (compare !== splitPaths[i][splitIndex]) {
        // a non-common index has been reached
        return false;
      }
    }
    return true;
  }

  // loop over all the search paths until there is a non-common ancestor or we go out of bounds
  while (splitIndex < smallestPathLength) {
    if (!isPathTheSame()) {
      break;
    }
    // if all are the same, add to the end result & increment the index
    commonPaths.push(splitPaths[0][splitIndex]);
    splitIndex++;
  }
  return path.join(...commonPaths);
}
