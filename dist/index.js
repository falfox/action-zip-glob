/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(7147));
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(5278);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 8090:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hashFiles = exports.create = void 0;
const internal_globber_1 = __nccwpck_require__(8298);
const internal_hash_files_1 = __nccwpck_require__(2448);
/**
 * Constructs a globber
 *
 * @param patterns  Patterns separated by newlines
 * @param options   Glob options
 */
function create(patterns, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield internal_globber_1.DefaultGlobber.create(patterns, options);
    });
}
exports.create = create;
/**
 * Computes the sha256 hash of a glob
 *
 * @param patterns  Patterns separated by newlines
 * @param currentWorkspace  Workspace used when matching files
 * @param options   Glob options
 * @param verbose   Enables verbose logging
 */
function hashFiles(patterns, currentWorkspace = '', options, verbose = false) {
    return __awaiter(this, void 0, void 0, function* () {
        let followSymbolicLinks = true;
        if (options && typeof options.followSymbolicLinks === 'boolean') {
            followSymbolicLinks = options.followSymbolicLinks;
        }
        const globber = yield create(patterns, { followSymbolicLinks });
        return internal_hash_files_1.hashFiles(globber, currentWorkspace, verbose);
    });
}
exports.hashFiles = hashFiles;
//# sourceMappingURL=glob.js.map

/***/ }),

/***/ 1026:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getOptions = void 0;
const core = __importStar(__nccwpck_require__(1967));
/**
 * Returns a copy with defaults filled in.
 */
function getOptions(copy) {
    const result = {
        followSymbolicLinks: true,
        implicitDescendants: true,
        matchDirectories: true,
        omitBrokenSymbolicLinks: true
    };
    if (copy) {
        if (typeof copy.followSymbolicLinks === 'boolean') {
            result.followSymbolicLinks = copy.followSymbolicLinks;
            core.debug(`followSymbolicLinks '${result.followSymbolicLinks}'`);
        }
        if (typeof copy.implicitDescendants === 'boolean') {
            result.implicitDescendants = copy.implicitDescendants;
            core.debug(`implicitDescendants '${result.implicitDescendants}'`);
        }
        if (typeof copy.matchDirectories === 'boolean') {
            result.matchDirectories = copy.matchDirectories;
            core.debug(`matchDirectories '${result.matchDirectories}'`);
        }
        if (typeof copy.omitBrokenSymbolicLinks === 'boolean') {
            result.omitBrokenSymbolicLinks = copy.omitBrokenSymbolicLinks;
            core.debug(`omitBrokenSymbolicLinks '${result.omitBrokenSymbolicLinks}'`);
        }
    }
    return result;
}
exports.getOptions = getOptions;
//# sourceMappingURL=internal-glob-options-helper.js.map

/***/ }),

/***/ 8298:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DefaultGlobber = void 0;
const core = __importStar(__nccwpck_require__(1967));
const fs = __importStar(__nccwpck_require__(7147));
const globOptionsHelper = __importStar(__nccwpck_require__(1026));
const path = __importStar(__nccwpck_require__(1017));
const patternHelper = __importStar(__nccwpck_require__(9005));
const internal_match_kind_1 = __nccwpck_require__(1063);
const internal_pattern_1 = __nccwpck_require__(4536);
const internal_search_state_1 = __nccwpck_require__(9117);
const IS_WINDOWS = process.platform === 'win32';
class DefaultGlobber {
    constructor(options) {
        this.patterns = [];
        this.searchPaths = [];
        this.options = globOptionsHelper.getOptions(options);
    }
    getSearchPaths() {
        // Return a copy
        return this.searchPaths.slice();
    }
    glob() {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            const result = [];
            try {
                for (var _b = __asyncValues(this.globGenerator()), _c; _c = yield _b.next(), !_c.done;) {
                    const itemPath = _c.value;
                    result.push(itemPath);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return result;
        });
    }
    globGenerator() {
        return __asyncGenerator(this, arguments, function* globGenerator_1() {
            // Fill in defaults options
            const options = globOptionsHelper.getOptions(this.options);
            // Implicit descendants?
            const patterns = [];
            for (const pattern of this.patterns) {
                patterns.push(pattern);
                if (options.implicitDescendants &&
                    (pattern.trailingSeparator ||
                        pattern.segments[pattern.segments.length - 1] !== '**')) {
                    patterns.push(new internal_pattern_1.Pattern(pattern.negate, true, pattern.segments.concat('**')));
                }
            }
            // Push the search paths
            const stack = [];
            for (const searchPath of patternHelper.getSearchPaths(patterns)) {
                core.debug(`Search path '${searchPath}'`);
                // Exists?
                try {
                    // Intentionally using lstat. Detection for broken symlink
                    // will be performed later (if following symlinks).
                    yield __await(fs.promises.lstat(searchPath));
                }
                catch (err) {
                    if (err.code === 'ENOENT') {
                        continue;
                    }
                    throw err;
                }
                stack.unshift(new internal_search_state_1.SearchState(searchPath, 1));
            }
            // Search
            const traversalChain = []; // used to detect cycles
            while (stack.length) {
                // Pop
                const item = stack.pop();
                // Match?
                const match = patternHelper.match(patterns, item.path);
                const partialMatch = !!match || patternHelper.partialMatch(patterns, item.path);
                if (!match && !partialMatch) {
                    continue;
                }
                // Stat
                const stats = yield __await(DefaultGlobber.stat(item, options, traversalChain)
                // Broken symlink, or symlink cycle detected, or no longer exists
                );
                // Broken symlink, or symlink cycle detected, or no longer exists
                if (!stats) {
                    continue;
                }
                // Directory
                if (stats.isDirectory()) {
                    // Matched
                    if (match & internal_match_kind_1.MatchKind.Directory && options.matchDirectories) {
                        yield yield __await(item.path);
                    }
                    // Descend?
                    else if (!partialMatch) {
                        continue;
                    }
                    // Push the child items in reverse
                    const childLevel = item.level + 1;
                    const childItems = (yield __await(fs.promises.readdir(item.path))).map(x => new internal_search_state_1.SearchState(path.join(item.path, x), childLevel));
                    stack.push(...childItems.reverse());
                }
                // File
                else if (match & internal_match_kind_1.MatchKind.File) {
                    yield yield __await(item.path);
                }
            }
        });
    }
    /**
     * Constructs a DefaultGlobber
     */
    static create(patterns, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = new DefaultGlobber(options);
            if (IS_WINDOWS) {
                patterns = patterns.replace(/\r\n/g, '\n');
                patterns = patterns.replace(/\r/g, '\n');
            }
            const lines = patterns.split('\n').map(x => x.trim());
            for (const line of lines) {
                // Empty or comment
                if (!line || line.startsWith('#')) {
                    continue;
                }
                // Pattern
                else {
                    result.patterns.push(new internal_pattern_1.Pattern(line));
                }
            }
            result.searchPaths.push(...patternHelper.getSearchPaths(result.patterns));
            return result;
        });
    }
    static stat(item, options, traversalChain) {
        return __awaiter(this, void 0, void 0, function* () {
            // Note:
            // `stat` returns info about the target of a symlink (or symlink chain)
            // `lstat` returns info about a symlink itself
            let stats;
            if (options.followSymbolicLinks) {
                try {
                    // Use `stat` (following symlinks)
                    stats = yield fs.promises.stat(item.path);
                }
                catch (err) {
                    if (err.code === 'ENOENT') {
                        if (options.omitBrokenSymbolicLinks) {
                            core.debug(`Broken symlink '${item.path}'`);
                            return undefined;
                        }
                        throw new Error(`No information found for the path '${item.path}'. This may indicate a broken symbolic link.`);
                    }
                    throw err;
                }
            }
            else {
                // Use `lstat` (not following symlinks)
                stats = yield fs.promises.lstat(item.path);
            }
            // Note, isDirectory() returns false for the lstat of a symlink
            if (stats.isDirectory() && options.followSymbolicLinks) {
                // Get the realpath
                const realPath = yield fs.promises.realpath(item.path);
                // Fixup the traversal chain to match the item level
                while (traversalChain.length >= item.level) {
                    traversalChain.pop();
                }
                // Test for a cycle
                if (traversalChain.some((x) => x === realPath)) {
                    core.debug(`Symlink cycle detected for path '${item.path}' and realpath '${realPath}'`);
                    return undefined;
                }
                // Update the traversal chain
                traversalChain.push(realPath);
            }
            return stats;
        });
    }
}
exports.DefaultGlobber = DefaultGlobber;
//# sourceMappingURL=internal-globber.js.map

/***/ }),

/***/ 2448:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hashFiles = void 0;
const crypto = __importStar(__nccwpck_require__(6113));
const core = __importStar(__nccwpck_require__(1967));
const fs = __importStar(__nccwpck_require__(7147));
const stream = __importStar(__nccwpck_require__(2781));
const util = __importStar(__nccwpck_require__(3837));
const path = __importStar(__nccwpck_require__(1017));
function hashFiles(globber, currentWorkspace, verbose = false) {
    var e_1, _a;
    var _b;
    return __awaiter(this, void 0, void 0, function* () {
        const writeDelegate = verbose ? core.info : core.debug;
        let hasMatch = false;
        const githubWorkspace = currentWorkspace
            ? currentWorkspace
            : (_b = process.env['GITHUB_WORKSPACE']) !== null && _b !== void 0 ? _b : process.cwd();
        const result = crypto.createHash('sha256');
        let count = 0;
        try {
            for (var _c = __asyncValues(globber.globGenerator()), _d; _d = yield _c.next(), !_d.done;) {
                const file = _d.value;
                writeDelegate(file);
                if (!file.startsWith(`${githubWorkspace}${path.sep}`)) {
                    writeDelegate(`Ignore '${file}' since it is not under GITHUB_WORKSPACE.`);
                    continue;
                }
                if (fs.statSync(file).isDirectory()) {
                    writeDelegate(`Skip directory '${file}'.`);
                    continue;
                }
                const hash = crypto.createHash('sha256');
                const pipeline = util.promisify(stream.pipeline);
                yield pipeline(fs.createReadStream(file), hash);
                result.write(hash.digest());
                count++;
                if (!hasMatch) {
                    hasMatch = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) yield _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        result.end();
        if (hasMatch) {
            writeDelegate(`Found ${count} files to hash.`);
            return result.digest('hex');
        }
        else {
            writeDelegate(`No matches found for glob`);
            return '';
        }
    });
}
exports.hashFiles = hashFiles;
//# sourceMappingURL=internal-hash-files.js.map

/***/ }),

/***/ 1063:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MatchKind = void 0;
/**
 * Indicates whether a pattern matches a path
 */
var MatchKind;
(function (MatchKind) {
    /** Not matched */
    MatchKind[MatchKind["None"] = 0] = "None";
    /** Matched if the path is a directory */
    MatchKind[MatchKind["Directory"] = 1] = "Directory";
    /** Matched if the path is a regular file */
    MatchKind[MatchKind["File"] = 2] = "File";
    /** Matched */
    MatchKind[MatchKind["All"] = 3] = "All";
})(MatchKind = exports.MatchKind || (exports.MatchKind = {}));
//# sourceMappingURL=internal-match-kind.js.map

/***/ }),

/***/ 1849:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.safeTrimTrailingSeparator = exports.normalizeSeparators = exports.hasRoot = exports.hasAbsoluteRoot = exports.ensureAbsoluteRoot = exports.dirname = void 0;
const path = __importStar(__nccwpck_require__(1017));
const assert_1 = __importDefault(__nccwpck_require__(9491));
const IS_WINDOWS = process.platform === 'win32';
/**
 * Similar to path.dirname except normalizes the path separators and slightly better handling for Windows UNC paths.
 *
 * For example, on Linux/macOS:
 * - `/               => /`
 * - `/hello          => /`
 *
 * For example, on Windows:
 * - `C:\             => C:\`
 * - `C:\hello        => C:\`
 * - `C:              => C:`
 * - `C:hello         => C:`
 * - `\               => \`
 * - `\hello          => \`
 * - `\\hello         => \\hello`
 * - `\\hello\world   => \\hello\world`
 */
function dirname(p) {
    // Normalize slashes and trim unnecessary trailing slash
    p = safeTrimTrailingSeparator(p);
    // Windows UNC root, e.g. \\hello or \\hello\world
    if (IS_WINDOWS && /^\\\\[^\\]+(\\[^\\]+)?$/.test(p)) {
        return p;
    }
    // Get dirname
    let result = path.dirname(p);
    // Trim trailing slash for Windows UNC root, e.g. \\hello\world\
    if (IS_WINDOWS && /^\\\\[^\\]+\\[^\\]+\\$/.test(result)) {
        result = safeTrimTrailingSeparator(result);
    }
    return result;
}
exports.dirname = dirname;
/**
 * Roots the path if not already rooted. On Windows, relative roots like `\`
 * or `C:` are expanded based on the current working directory.
 */
function ensureAbsoluteRoot(root, itemPath) {
    assert_1.default(root, `ensureAbsoluteRoot parameter 'root' must not be empty`);
    assert_1.default(itemPath, `ensureAbsoluteRoot parameter 'itemPath' must not be empty`);
    // Already rooted
    if (hasAbsoluteRoot(itemPath)) {
        return itemPath;
    }
    // Windows
    if (IS_WINDOWS) {
        // Check for itemPath like C: or C:foo
        if (itemPath.match(/^[A-Z]:[^\\/]|^[A-Z]:$/i)) {
            let cwd = process.cwd();
            assert_1.default(cwd.match(/^[A-Z]:\\/i), `Expected current directory to start with an absolute drive root. Actual '${cwd}'`);
            // Drive letter matches cwd? Expand to cwd
            if (itemPath[0].toUpperCase() === cwd[0].toUpperCase()) {
                // Drive only, e.g. C:
                if (itemPath.length === 2) {
                    // Preserve specified drive letter case (upper or lower)
                    return `${itemPath[0]}:\\${cwd.substr(3)}`;
                }
                // Drive + path, e.g. C:foo
                else {
                    if (!cwd.endsWith('\\')) {
                        cwd += '\\';
                    }
                    // Preserve specified drive letter case (upper or lower)
                    return `${itemPath[0]}:\\${cwd.substr(3)}${itemPath.substr(2)}`;
                }
            }
            // Different drive
            else {
                return `${itemPath[0]}:\\${itemPath.substr(2)}`;
            }
        }
        // Check for itemPath like \ or \foo
        else if (normalizeSeparators(itemPath).match(/^\\$|^\\[^\\]/)) {
            const cwd = process.cwd();
            assert_1.default(cwd.match(/^[A-Z]:\\/i), `Expected current directory to start with an absolute drive root. Actual '${cwd}'`);
            return `${cwd[0]}:\\${itemPath.substr(1)}`;
        }
    }
    assert_1.default(hasAbsoluteRoot(root), `ensureAbsoluteRoot parameter 'root' must have an absolute root`);
    // Otherwise ensure root ends with a separator
    if (root.endsWith('/') || (IS_WINDOWS && root.endsWith('\\'))) {
        // Intentionally empty
    }
    else {
        // Append separator
        root += path.sep;
    }
    return root + itemPath;
}
exports.ensureAbsoluteRoot = ensureAbsoluteRoot;
/**
 * On Linux/macOS, true if path starts with `/`. On Windows, true for paths like:
 * `\\hello\share` and `C:\hello` (and using alternate separator).
 */
function hasAbsoluteRoot(itemPath) {
    assert_1.default(itemPath, `hasAbsoluteRoot parameter 'itemPath' must not be empty`);
    // Normalize separators
    itemPath = normalizeSeparators(itemPath);
    // Windows
    if (IS_WINDOWS) {
        // E.g. \\hello\share or C:\hello
        return itemPath.startsWith('\\\\') || /^[A-Z]:\\/i.test(itemPath);
    }
    // E.g. /hello
    return itemPath.startsWith('/');
}
exports.hasAbsoluteRoot = hasAbsoluteRoot;
/**
 * On Linux/macOS, true if path starts with `/`. On Windows, true for paths like:
 * `\`, `\hello`, `\\hello\share`, `C:`, and `C:\hello` (and using alternate separator).
 */
function hasRoot(itemPath) {
    assert_1.default(itemPath, `isRooted parameter 'itemPath' must not be empty`);
    // Normalize separators
    itemPath = normalizeSeparators(itemPath);
    // Windows
    if (IS_WINDOWS) {
        // E.g. \ or \hello or \\hello
        // E.g. C: or C:\hello
        return itemPath.startsWith('\\') || /^[A-Z]:/i.test(itemPath);
    }
    // E.g. /hello
    return itemPath.startsWith('/');
}
exports.hasRoot = hasRoot;
/**
 * Removes redundant slashes and converts `/` to `\` on Windows
 */
function normalizeSeparators(p) {
    p = p || '';
    // Windows
    if (IS_WINDOWS) {
        // Convert slashes on Windows
        p = p.replace(/\//g, '\\');
        // Remove redundant slashes
        const isUnc = /^\\\\+[^\\]/.test(p); // e.g. \\hello
        return (isUnc ? '\\' : '') + p.replace(/\\\\+/g, '\\'); // preserve leading \\ for UNC
    }
    // Remove redundant slashes
    return p.replace(/\/\/+/g, '/');
}
exports.normalizeSeparators = normalizeSeparators;
/**
 * Normalizes the path separators and trims the trailing separator (when safe).
 * For example, `/foo/ => /foo` but `/ => /`
 */
function safeTrimTrailingSeparator(p) {
    // Short-circuit if empty
    if (!p) {
        return '';
    }
    // Normalize separators
    p = normalizeSeparators(p);
    // No trailing slash
    if (!p.endsWith(path.sep)) {
        return p;
    }
    // Check '/' on Linux/macOS and '\' on Windows
    if (p === path.sep) {
        return p;
    }
    // On Windows check if drive root. E.g. C:\
    if (IS_WINDOWS && /^[A-Z]:\\$/i.test(p)) {
        return p;
    }
    // Otherwise trim trailing slash
    return p.substr(0, p.length - 1);
}
exports.safeTrimTrailingSeparator = safeTrimTrailingSeparator;
//# sourceMappingURL=internal-path-helper.js.map

/***/ }),

/***/ 6836:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Path = void 0;
const path = __importStar(__nccwpck_require__(1017));
const pathHelper = __importStar(__nccwpck_require__(1849));
const assert_1 = __importDefault(__nccwpck_require__(9491));
const IS_WINDOWS = process.platform === 'win32';
/**
 * Helper class for parsing paths into segments
 */
class Path {
    /**
     * Constructs a Path
     * @param itemPath Path or array of segments
     */
    constructor(itemPath) {
        this.segments = [];
        // String
        if (typeof itemPath === 'string') {
            assert_1.default(itemPath, `Parameter 'itemPath' must not be empty`);
            // Normalize slashes and trim unnecessary trailing slash
            itemPath = pathHelper.safeTrimTrailingSeparator(itemPath);
            // Not rooted
            if (!pathHelper.hasRoot(itemPath)) {
                this.segments = itemPath.split(path.sep);
            }
            // Rooted
            else {
                // Add all segments, while not at the root
                let remaining = itemPath;
                let dir = pathHelper.dirname(remaining);
                while (dir !== remaining) {
                    // Add the segment
                    const basename = path.basename(remaining);
                    this.segments.unshift(basename);
                    // Truncate the last segment
                    remaining = dir;
                    dir = pathHelper.dirname(remaining);
                }
                // Remainder is the root
                this.segments.unshift(remaining);
            }
        }
        // Array
        else {
            // Must not be empty
            assert_1.default(itemPath.length > 0, `Parameter 'itemPath' must not be an empty array`);
            // Each segment
            for (let i = 0; i < itemPath.length; i++) {
                let segment = itemPath[i];
                // Must not be empty
                assert_1.default(segment, `Parameter 'itemPath' must not contain any empty segments`);
                // Normalize slashes
                segment = pathHelper.normalizeSeparators(itemPath[i]);
                // Root segment
                if (i === 0 && pathHelper.hasRoot(segment)) {
                    segment = pathHelper.safeTrimTrailingSeparator(segment);
                    assert_1.default(segment === pathHelper.dirname(segment), `Parameter 'itemPath' root segment contains information for multiple segments`);
                    this.segments.push(segment);
                }
                // All other segments
                else {
                    // Must not contain slash
                    assert_1.default(!segment.includes(path.sep), `Parameter 'itemPath' contains unexpected path separators`);
                    this.segments.push(segment);
                }
            }
        }
    }
    /**
     * Converts the path to it's string representation
     */
    toString() {
        // First segment
        let result = this.segments[0];
        // All others
        let skipSlash = result.endsWith(path.sep) || (IS_WINDOWS && /^[A-Z]:$/i.test(result));
        for (let i = 1; i < this.segments.length; i++) {
            if (skipSlash) {
                skipSlash = false;
            }
            else {
                result += path.sep;
            }
            result += this.segments[i];
        }
        return result;
    }
}
exports.Path = Path;
//# sourceMappingURL=internal-path.js.map

/***/ }),

/***/ 9005:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.partialMatch = exports.match = exports.getSearchPaths = void 0;
const pathHelper = __importStar(__nccwpck_require__(1849));
const internal_match_kind_1 = __nccwpck_require__(1063);
const IS_WINDOWS = process.platform === 'win32';
/**
 * Given an array of patterns, returns an array of paths to search.
 * Duplicates and paths under other included paths are filtered out.
 */
function getSearchPaths(patterns) {
    // Ignore negate patterns
    patterns = patterns.filter(x => !x.negate);
    // Create a map of all search paths
    const searchPathMap = {};
    for (const pattern of patterns) {
        const key = IS_WINDOWS
            ? pattern.searchPath.toUpperCase()
            : pattern.searchPath;
        searchPathMap[key] = 'candidate';
    }
    const result = [];
    for (const pattern of patterns) {
        // Check if already included
        const key = IS_WINDOWS
            ? pattern.searchPath.toUpperCase()
            : pattern.searchPath;
        if (searchPathMap[key] === 'included') {
            continue;
        }
        // Check for an ancestor search path
        let foundAncestor = false;
        let tempKey = key;
        let parent = pathHelper.dirname(tempKey);
        while (parent !== tempKey) {
            if (searchPathMap[parent]) {
                foundAncestor = true;
                break;
            }
            tempKey = parent;
            parent = pathHelper.dirname(tempKey);
        }
        // Include the search pattern in the result
        if (!foundAncestor) {
            result.push(pattern.searchPath);
            searchPathMap[key] = 'included';
        }
    }
    return result;
}
exports.getSearchPaths = getSearchPaths;
/**
 * Matches the patterns against the path
 */
function match(patterns, itemPath) {
    let result = internal_match_kind_1.MatchKind.None;
    for (const pattern of patterns) {
        if (pattern.negate) {
            result &= ~pattern.match(itemPath);
        }
        else {
            result |= pattern.match(itemPath);
        }
    }
    return result;
}
exports.match = match;
/**
 * Checks whether to descend further into the directory
 */
function partialMatch(patterns, itemPath) {
    return patterns.some(x => !x.negate && x.partialMatch(itemPath));
}
exports.partialMatch = partialMatch;
//# sourceMappingURL=internal-pattern-helper.js.map

/***/ }),

/***/ 4536:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Pattern = void 0;
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const pathHelper = __importStar(__nccwpck_require__(1849));
const assert_1 = __importDefault(__nccwpck_require__(9491));
const minimatch_1 = __nccwpck_require__(3973);
const internal_match_kind_1 = __nccwpck_require__(1063);
const internal_path_1 = __nccwpck_require__(6836);
const IS_WINDOWS = process.platform === 'win32';
class Pattern {
    constructor(patternOrNegate, isImplicitPattern = false, segments, homedir) {
        /**
         * Indicates whether matches should be excluded from the result set
         */
        this.negate = false;
        // Pattern overload
        let pattern;
        if (typeof patternOrNegate === 'string') {
            pattern = patternOrNegate.trim();
        }
        // Segments overload
        else {
            // Convert to pattern
            segments = segments || [];
            assert_1.default(segments.length, `Parameter 'segments' must not empty`);
            const root = Pattern.getLiteral(segments[0]);
            assert_1.default(root && pathHelper.hasAbsoluteRoot(root), `Parameter 'segments' first element must be a root path`);
            pattern = new internal_path_1.Path(segments).toString().trim();
            if (patternOrNegate) {
                pattern = `!${pattern}`;
            }
        }
        // Negate
        while (pattern.startsWith('!')) {
            this.negate = !this.negate;
            pattern = pattern.substr(1).trim();
        }
        // Normalize slashes and ensures absolute root
        pattern = Pattern.fixupPattern(pattern, homedir);
        // Segments
        this.segments = new internal_path_1.Path(pattern).segments;
        // Trailing slash indicates the pattern should only match directories, not regular files
        this.trailingSeparator = pathHelper
            .normalizeSeparators(pattern)
            .endsWith(path.sep);
        pattern = pathHelper.safeTrimTrailingSeparator(pattern);
        // Search path (literal path prior to the first glob segment)
        let foundGlob = false;
        const searchSegments = this.segments
            .map(x => Pattern.getLiteral(x))
            .filter(x => !foundGlob && !(foundGlob = x === ''));
        this.searchPath = new internal_path_1.Path(searchSegments).toString();
        // Root RegExp (required when determining partial match)
        this.rootRegExp = new RegExp(Pattern.regExpEscape(searchSegments[0]), IS_WINDOWS ? 'i' : '');
        this.isImplicitPattern = isImplicitPattern;
        // Create minimatch
        const minimatchOptions = {
            dot: true,
            nobrace: true,
            nocase: IS_WINDOWS,
            nocomment: true,
            noext: true,
            nonegate: true
        };
        pattern = IS_WINDOWS ? pattern.replace(/\\/g, '/') : pattern;
        this.minimatch = new minimatch_1.Minimatch(pattern, minimatchOptions);
    }
    /**
     * Matches the pattern against the specified path
     */
    match(itemPath) {
        // Last segment is globstar?
        if (this.segments[this.segments.length - 1] === '**') {
            // Normalize slashes
            itemPath = pathHelper.normalizeSeparators(itemPath);
            // Append a trailing slash. Otherwise Minimatch will not match the directory immediately
            // preceding the globstar. For example, given the pattern `/foo/**`, Minimatch returns
            // false for `/foo` but returns true for `/foo/`. Append a trailing slash to handle that quirk.
            if (!itemPath.endsWith(path.sep) && this.isImplicitPattern === false) {
                // Note, this is safe because the constructor ensures the pattern has an absolute root.
                // For example, formats like C: and C:foo on Windows are resolved to an absolute root.
                itemPath = `${itemPath}${path.sep}`;
            }
        }
        else {
            // Normalize slashes and trim unnecessary trailing slash
            itemPath = pathHelper.safeTrimTrailingSeparator(itemPath);
        }
        // Match
        if (this.minimatch.match(itemPath)) {
            return this.trailingSeparator ? internal_match_kind_1.MatchKind.Directory : internal_match_kind_1.MatchKind.All;
        }
        return internal_match_kind_1.MatchKind.None;
    }
    /**
     * Indicates whether the pattern may match descendants of the specified path
     */
    partialMatch(itemPath) {
        // Normalize slashes and trim unnecessary trailing slash
        itemPath = pathHelper.safeTrimTrailingSeparator(itemPath);
        // matchOne does not handle root path correctly
        if (pathHelper.dirname(itemPath) === itemPath) {
            return this.rootRegExp.test(itemPath);
        }
        return this.minimatch.matchOne(itemPath.split(IS_WINDOWS ? /\\+/ : /\/+/), this.minimatch.set[0], true);
    }
    /**
     * Escapes glob patterns within a path
     */
    static globEscape(s) {
        return (IS_WINDOWS ? s : s.replace(/\\/g, '\\\\')) // escape '\' on Linux/macOS
            .replace(/(\[)(?=[^/]+\])/g, '[[]') // escape '[' when ']' follows within the path segment
            .replace(/\?/g, '[?]') // escape '?'
            .replace(/\*/g, '[*]'); // escape '*'
    }
    /**
     * Normalizes slashes and ensures absolute root
     */
    static fixupPattern(pattern, homedir) {
        // Empty
        assert_1.default(pattern, 'pattern cannot be empty');
        // Must not contain `.` segment, unless first segment
        // Must not contain `..` segment
        const literalSegments = new internal_path_1.Path(pattern).segments.map(x => Pattern.getLiteral(x));
        assert_1.default(literalSegments.every((x, i) => (x !== '.' || i === 0) && x !== '..'), `Invalid pattern '${pattern}'. Relative pathing '.' and '..' is not allowed.`);
        // Must not contain globs in root, e.g. Windows UNC path \\foo\b*r
        assert_1.default(!pathHelper.hasRoot(pattern) || literalSegments[0], `Invalid pattern '${pattern}'. Root segment must not contain globs.`);
        // Normalize slashes
        pattern = pathHelper.normalizeSeparators(pattern);
        // Replace leading `.` segment
        if (pattern === '.' || pattern.startsWith(`.${path.sep}`)) {
            pattern = Pattern.globEscape(process.cwd()) + pattern.substr(1);
        }
        // Replace leading `~` segment
        else if (pattern === '~' || pattern.startsWith(`~${path.sep}`)) {
            homedir = homedir || os.homedir();
            assert_1.default(homedir, 'Unable to determine HOME directory');
            assert_1.default(pathHelper.hasAbsoluteRoot(homedir), `Expected HOME directory to be a rooted path. Actual '${homedir}'`);
            pattern = Pattern.globEscape(homedir) + pattern.substr(1);
        }
        // Replace relative drive root, e.g. pattern is C: or C:foo
        else if (IS_WINDOWS &&
            (pattern.match(/^[A-Z]:$/i) || pattern.match(/^[A-Z]:[^\\]/i))) {
            let root = pathHelper.ensureAbsoluteRoot('C:\\dummy-root', pattern.substr(0, 2));
            if (pattern.length > 2 && !root.endsWith('\\')) {
                root += '\\';
            }
            pattern = Pattern.globEscape(root) + pattern.substr(2);
        }
        // Replace relative root, e.g. pattern is \ or \foo
        else if (IS_WINDOWS && (pattern === '\\' || pattern.match(/^\\[^\\]/))) {
            let root = pathHelper.ensureAbsoluteRoot('C:\\dummy-root', '\\');
            if (!root.endsWith('\\')) {
                root += '\\';
            }
            pattern = Pattern.globEscape(root) + pattern.substr(1);
        }
        // Otherwise ensure absolute root
        else {
            pattern = pathHelper.ensureAbsoluteRoot(Pattern.globEscape(process.cwd()), pattern);
        }
        return pathHelper.normalizeSeparators(pattern);
    }
    /**
     * Attempts to unescape a pattern segment to create a literal path segment.
     * Otherwise returns empty string.
     */
    static getLiteral(segment) {
        let literal = '';
        for (let i = 0; i < segment.length; i++) {
            const c = segment[i];
            // Escape
            if (c === '\\' && !IS_WINDOWS && i + 1 < segment.length) {
                literal += segment[++i];
                continue;
            }
            // Wildcard
            else if (c === '*' || c === '?') {
                return '';
            }
            // Character set
            else if (c === '[' && i + 1 < segment.length) {
                let set = '';
                let closed = -1;
                for (let i2 = i + 1; i2 < segment.length; i2++) {
                    const c2 = segment[i2];
                    // Escape
                    if (c2 === '\\' && !IS_WINDOWS && i2 + 1 < segment.length) {
                        set += segment[++i2];
                        continue;
                    }
                    // Closed
                    else if (c2 === ']') {
                        closed = i2;
                        break;
                    }
                    // Otherwise
                    else {
                        set += c2;
                    }
                }
                // Closed?
                if (closed >= 0) {
                    // Cannot convert
                    if (set.length > 1) {
                        return '';
                    }
                    // Convert to literal
                    if (set) {
                        literal += set;
                        i = closed;
                        continue;
                    }
                }
                // Otherwise fall thru
            }
            // Append
            literal += c;
        }
        return literal;
    }
    /**
     * Escapes regexp special characters
     * https://javascript.info/regexp-escaping
     */
    static regExpEscape(s) {
        return s.replace(/[[\\^$.|?*+()]/g, '\\$&');
    }
}
exports.Pattern = Pattern;
//# sourceMappingURL=internal-pattern.js.map

/***/ }),

/***/ 9117:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SearchState = void 0;
class SearchState {
    constructor(path, level) {
        this.path = path;
        this.level = level;
    }
}
exports.SearchState = SearchState;
//# sourceMappingURL=internal-search-state.js.map

/***/ }),

/***/ 688:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(2603);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 1967:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(688);
const file_command_1 = __nccwpck_require__(4609);
const utils_1 = __nccwpck_require__(2603);
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const oidc_utils_1 = __nccwpck_require__(1030);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('ENV', file_command_1.prepareKeyValueMessage(name, val));
    }
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueFileCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    if (options && options.trimWhitespace === false) {
        return inputs;
    }
    return inputs.map(input => input.trim());
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    const filePath = process.env['GITHUB_OUTPUT'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('OUTPUT', file_command_1.prepareKeyValueMessage(name, value));
    }
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, utils_1.toCommandValue(value));
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    const filePath = process.env['GITHUB_STATE'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('STATE', file_command_1.prepareKeyValueMessage(name, value));
    }
    command_1.issueCommand('save-state', { name }, utils_1.toCommandValue(value));
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
/**
 * Summary exports
 */
var summary_1 = __nccwpck_require__(2377);
Object.defineProperty(exports, "summary", ({ enumerable: true, get: function () { return summary_1.summary; } }));
/**
 * @deprecated use core.summary
 */
var summary_2 = __nccwpck_require__(2377);
Object.defineProperty(exports, "markdownSummary", ({ enumerable: true, get: function () { return summary_2.markdownSummary; } }));
/**
 * Path exports
 */
var path_utils_1 = __nccwpck_require__(312);
Object.defineProperty(exports, "toPosixPath", ({ enumerable: true, get: function () { return path_utils_1.toPosixPath; } }));
Object.defineProperty(exports, "toWin32Path", ({ enumerable: true, get: function () { return path_utils_1.toWin32Path; } }));
Object.defineProperty(exports, "toPlatformPath", ({ enumerable: true, get: function () { return path_utils_1.toPlatformPath; } }));
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 4609:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepareKeyValueMessage = exports.issueFileCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(7147));
const os = __importStar(__nccwpck_require__(2037));
const uuid_1 = __nccwpck_require__(5840);
const utils_1 = __nccwpck_require__(2603);
function issueFileCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueFileCommand = issueFileCommand;
function prepareKeyValueMessage(key, value) {
    const delimiter = `ghadelimiter_${uuid_1.v4()}`;
    const convertedValue = utils_1.toCommandValue(value);
    // These should realistically never happen, but just in case someone finds a
    // way to exploit uuid generation let's not allow keys or values that contain
    // the delimiter.
    if (key.includes(delimiter)) {
        throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
    }
    if (convertedValue.includes(delimiter)) {
        throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
    }
    return `${key}<<${delimiter}${os.EOL}${convertedValue}${os.EOL}${delimiter}`;
}
exports.prepareKeyValueMessage = prepareKeyValueMessage;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 1030:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(8418);
const auth_1 = __nccwpck_require__(5003);
const core_1 = __nccwpck_require__(1967);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.result.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 312:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toPlatformPath = exports.toWin32Path = exports.toPosixPath = void 0;
const path = __importStar(__nccwpck_require__(1017));
/**
 * toPosixPath converts the given path to the posix form. On Windows, \\ will be
 * replaced with /.
 *
 * @param pth. Path to transform.
 * @return string Posix path.
 */
function toPosixPath(pth) {
    return pth.replace(/[\\]/g, '/');
}
exports.toPosixPath = toPosixPath;
/**
 * toWin32Path converts the given path to the win32 form. On Linux, / will be
 * replaced with \\.
 *
 * @param pth. Path to transform.
 * @return string Win32 path.
 */
function toWin32Path(pth) {
    return pth.replace(/[/]/g, '\\');
}
exports.toWin32Path = toWin32Path;
/**
 * toPlatformPath converts the given path to a platform-specific path. It does
 * this by replacing instances of / and \ with the platform-specific path
 * separator.
 *
 * @param pth The path to platformize.
 * @return string The platform-specific path.
 */
function toPlatformPath(pth) {
    return pth.replace(/[/\\]/g, path.sep);
}
exports.toPlatformPath = toPlatformPath;
//# sourceMappingURL=path-utils.js.map

/***/ }),

/***/ 2377:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.summary = exports.markdownSummary = exports.SUMMARY_DOCS_URL = exports.SUMMARY_ENV_VAR = void 0;
const os_1 = __nccwpck_require__(2037);
const fs_1 = __nccwpck_require__(7147);
const { access, appendFile, writeFile } = fs_1.promises;
exports.SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY';
exports.SUMMARY_DOCS_URL = 'https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary';
class Summary {
    constructor() {
        this._buffer = '';
    }
    /**
     * Finds the summary file path from the environment, rejects if env var is not found or file does not exist
     * Also checks r/w permissions.
     *
     * @returns step summary file path
     */
    filePath() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._filePath) {
                return this._filePath;
            }
            const pathFromEnv = process.env[exports.SUMMARY_ENV_VAR];
            if (!pathFromEnv) {
                throw new Error(`Unable to find environment variable for $${exports.SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
            }
            try {
                yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
            }
            catch (_a) {
                throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
            }
            this._filePath = pathFromEnv;
            return this._filePath;
        });
    }
    /**
     * Wraps content in an HTML tag, adding any HTML attributes
     *
     * @param {string} tag HTML tag to wrap
     * @param {string | null} content content within the tag
     * @param {[attribute: string]: string} attrs key-value list of HTML attributes to add
     *
     * @returns {string} content wrapped in HTML element
     */
    wrap(tag, content, attrs = {}) {
        const htmlAttrs = Object.entries(attrs)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join('');
        if (!content) {
            return `<${tag}${htmlAttrs}>`;
        }
        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
    }
    /**
     * Writes text in the buffer to the summary buffer file and empties buffer. Will append by default.
     *
     * @param {SummaryWriteOptions} [options] (optional) options for write operation
     *
     * @returns {Promise<Summary>} summary instance
     */
    write(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
            const filePath = yield this.filePath();
            const writeFunc = overwrite ? writeFile : appendFile;
            yield writeFunc(filePath, this._buffer, { encoding: 'utf8' });
            return this.emptyBuffer();
        });
    }
    /**
     * Clears the summary buffer and wipes the summary file
     *
     * @returns {Summary} summary instance
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.emptyBuffer().write({ overwrite: true });
        });
    }
    /**
     * Returns the current summary buffer as a string
     *
     * @returns {string} string of summary buffer
     */
    stringify() {
        return this._buffer;
    }
    /**
     * If the summary buffer is empty
     *
     * @returns {boolen} true if the buffer is empty
     */
    isEmptyBuffer() {
        return this._buffer.length === 0;
    }
    /**
     * Resets the summary buffer without writing to summary file
     *
     * @returns {Summary} summary instance
     */
    emptyBuffer() {
        this._buffer = '';
        return this;
    }
    /**
     * Adds raw text to the summary buffer
     *
     * @param {string} text content to add
     * @param {boolean} [addEOL=false] (optional) append an EOL to the raw text (default: false)
     *
     * @returns {Summary} summary instance
     */
    addRaw(text, addEOL = false) {
        this._buffer += text;
        return addEOL ? this.addEOL() : this;
    }
    /**
     * Adds the operating system-specific end-of-line marker to the buffer
     *
     * @returns {Summary} summary instance
     */
    addEOL() {
        return this.addRaw(os_1.EOL);
    }
    /**
     * Adds an HTML codeblock to the summary buffer
     *
     * @param {string} code content to render within fenced code block
     * @param {string} lang (optional) language to syntax highlight code
     *
     * @returns {Summary} summary instance
     */
    addCodeBlock(code, lang) {
        const attrs = Object.assign({}, (lang && { lang }));
        const element = this.wrap('pre', this.wrap('code', code), attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML list to the summary buffer
     *
     * @param {string[]} items list of items to render
     * @param {boolean} [ordered=false] (optional) if the rendered list should be ordered or not (default: false)
     *
     * @returns {Summary} summary instance
     */
    addList(items, ordered = false) {
        const tag = ordered ? 'ol' : 'ul';
        const listItems = items.map(item => this.wrap('li', item)).join('');
        const element = this.wrap(tag, listItems);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML table to the summary buffer
     *
     * @param {SummaryTableCell[]} rows table rows
     *
     * @returns {Summary} summary instance
     */
    addTable(rows) {
        const tableBody = rows
            .map(row => {
            const cells = row
                .map(cell => {
                if (typeof cell === 'string') {
                    return this.wrap('td', cell);
                }
                const { header, data, colspan, rowspan } = cell;
                const tag = header ? 'th' : 'td';
                const attrs = Object.assign(Object.assign({}, (colspan && { colspan })), (rowspan && { rowspan }));
                return this.wrap(tag, data, attrs);
            })
                .join('');
            return this.wrap('tr', cells);
        })
            .join('');
        const element = this.wrap('table', tableBody);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds a collapsable HTML details element to the summary buffer
     *
     * @param {string} label text for the closed state
     * @param {string} content collapsable content
     *
     * @returns {Summary} summary instance
     */
    addDetails(label, content) {
        const element = this.wrap('details', this.wrap('summary', label) + content);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML image tag to the summary buffer
     *
     * @param {string} src path to the image you to embed
     * @param {string} alt text description of the image
     * @param {SummaryImageOptions} options (optional) addition image attributes
     *
     * @returns {Summary} summary instance
     */
    addImage(src, alt, options) {
        const { width, height } = options || {};
        const attrs = Object.assign(Object.assign({}, (width && { width })), (height && { height }));
        const element = this.wrap('img', null, Object.assign({ src, alt }, attrs));
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML section heading element
     *
     * @param {string} text heading text
     * @param {number | string} [level=1] (optional) the heading level, default: 1
     *
     * @returns {Summary} summary instance
     */
    addHeading(text, level) {
        const tag = `h${level}`;
        const allowedTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
            ? tag
            : 'h1';
        const element = this.wrap(allowedTag, text);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML thematic break (<hr>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addSeparator() {
        const element = this.wrap('hr', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML line break (<br>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addBreak() {
        const element = this.wrap('br', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML blockquote to the summary buffer
     *
     * @param {string} text quote text
     * @param {string} cite (optional) citation url
     *
     * @returns {Summary} summary instance
     */
    addQuote(text, cite) {
        const attrs = Object.assign({}, (cite && { cite }));
        const element = this.wrap('blockquote', text, attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML anchor tag to the summary buffer
     *
     * @param {string} text link text/content
     * @param {string} href hyperlink
     *
     * @returns {Summary} summary instance
     */
    addLink(text, href) {
        const element = this.wrap('a', text, { href });
        return this.addRaw(element).addEOL();
    }
}
const _summary = new Summary();
/**
 * @deprecated use `core.summary`
 */
exports.markdownSummary = _summary;
exports.summary = _summary;
//# sourceMappingURL=summary.js.map

/***/ }),

/***/ 2603:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 5003:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonalAccessTokenCredentialHandler = exports.BearerCredentialHandler = exports.BasicCredentialHandler = void 0;
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Bearer ${this.token}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`PAT:${this.token}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
//# sourceMappingURL=auth.js.map

/***/ }),

/***/ 8418:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/* eslint-disable @typescript-eslint/no-explicit-any */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpClient = exports.isHttps = exports.HttpClientResponse = exports.HttpClientError = exports.getProxyUrl = exports.MediaTypes = exports.Headers = exports.HttpCodes = void 0;
const http = __importStar(__nccwpck_require__(3685));
const https = __importStar(__nccwpck_require__(5687));
const pm = __importStar(__nccwpck_require__(2426));
const tunnel = __importStar(__nccwpck_require__(4294));
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    const proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let output = Buffer.alloc(0);
                this.message.on('data', (chunk) => {
                    output = Buffer.concat([output, chunk]);
                });
                this.message.on('end', () => {
                    resolve(output.toString());
                });
            }));
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    const parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
        });
    }
    get(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('GET', requestUrl, null, additionalHeaders || {});
        });
    }
    del(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('DELETE', requestUrl, null, additionalHeaders || {});
        });
    }
    post(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('POST', requestUrl, data, additionalHeaders || {});
        });
    }
    patch(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PATCH', requestUrl, data, additionalHeaders || {});
        });
    }
    put(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PUT', requestUrl, data, additionalHeaders || {});
        });
    }
    head(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('HEAD', requestUrl, null, additionalHeaders || {});
        });
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(verb, requestUrl, stream, additionalHeaders);
        });
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    getJson(requestUrl, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            const res = yield this.get(requestUrl, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    postJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.post(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    putJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.put(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    patchJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.patch(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    request(verb, requestUrl, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._disposed) {
                throw new Error('Client has already been disposed.');
            }
            const parsedUrl = new URL(requestUrl);
            let info = this._prepareRequest(verb, parsedUrl, headers);
            // Only perform retries on reads since writes may not be idempotent.
            const maxTries = this._allowRetries && RetryableHttpVerbs.includes(verb)
                ? this._maxRetries + 1
                : 1;
            let numTries = 0;
            let response;
            do {
                response = yield this.requestRaw(info, data);
                // Check if it's an authentication challenge
                if (response &&
                    response.message &&
                    response.message.statusCode === HttpCodes.Unauthorized) {
                    let authenticationHandler;
                    for (const handler of this.handlers) {
                        if (handler.canHandleAuthentication(response)) {
                            authenticationHandler = handler;
                            break;
                        }
                    }
                    if (authenticationHandler) {
                        return authenticationHandler.handleAuthentication(this, info, data);
                    }
                    else {
                        // We have received an unauthorized response but have no handlers to handle it.
                        // Let the response return to the caller.
                        return response;
                    }
                }
                let redirectsRemaining = this._maxRedirects;
                while (response.message.statusCode &&
                    HttpRedirectCodes.includes(response.message.statusCode) &&
                    this._allowRedirects &&
                    redirectsRemaining > 0) {
                    const redirectUrl = response.message.headers['location'];
                    if (!redirectUrl) {
                        // if there's no location to redirect to, we won't
                        break;
                    }
                    const parsedRedirectUrl = new URL(redirectUrl);
                    if (parsedUrl.protocol === 'https:' &&
                        parsedUrl.protocol !== parsedRedirectUrl.protocol &&
                        !this._allowRedirectDowngrade) {
                        throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                    }
                    // we need to finish reading the response before reassigning response
                    // which will leak the open socket.
                    yield response.readBody();
                    // strip authorization header if redirected to a different hostname
                    if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                        for (const header in headers) {
                            // header names are case insensitive
                            if (header.toLowerCase() === 'authorization') {
                                delete headers[header];
                            }
                        }
                    }
                    // let's make the request with the new redirectUrl
                    info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                    response = yield this.requestRaw(info, data);
                    redirectsRemaining--;
                }
                if (!response.message.statusCode ||
                    !HttpResponseRetryCodes.includes(response.message.statusCode)) {
                    // If not a retry code, return immediately instead of retrying
                    return response;
                }
                numTries += 1;
                if (numTries < maxTries) {
                    yield response.readBody();
                    yield this._performExponentialBackoff(numTries);
                }
            } while (numTries < maxTries);
            return response;
        });
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                function callbackForResult(err, res) {
                    if (err) {
                        reject(err);
                    }
                    else if (!res) {
                        // If `err` is not passed, then `res` must be passed.
                        reject(new Error('Unknown error'));
                    }
                    else {
                        resolve(res);
                    }
                }
                this.requestRawWithCallback(info, data, callbackForResult);
            });
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        if (typeof data === 'string') {
            if (!info.options.headers) {
                info.options.headers = {};
            }
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        function handleResult(err, res) {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        }
        const req = info.httpModule.request(info.options, (msg) => {
            const res = new HttpClientResponse(msg);
            handleResult(undefined, res);
        });
        let socket;
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error(`Request timeout: ${info.options.path}`));
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        const parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            for (const handler of this.handlers) {
                handler.prepareRequest(info.options);
            }
        }
        return info;
    }
    _mergeHeaders(headers) {
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers || {}));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        const proxyUrl = pm.getProxyUrl(parsedUrl);
        const useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        // This is `useProxy` again, but we need to check `proxyURl` directly for TypeScripts's flow analysis.
        if (proxyUrl && proxyUrl.hostname) {
            const agentOptions = {
                maxSockets,
                keepAlive: this._keepAlive,
                proxy: Object.assign(Object.assign({}, ((proxyUrl.username || proxyUrl.password) && {
                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                })), { host: proxyUrl.hostname, port: proxyUrl.port })
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
            const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        });
    }
    _processResponse(res, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const statusCode = res.message.statusCode || 0;
                const response = {
                    statusCode,
                    result: null,
                    headers: {}
                };
                // not found leads to null obj returned
                if (statusCode === HttpCodes.NotFound) {
                    resolve(response);
                }
                // get the result from the body
                function dateTimeDeserializer(key, value) {
                    if (typeof value === 'string') {
                        const a = new Date(value);
                        if (!isNaN(a.valueOf())) {
                            return a;
                        }
                    }
                    return value;
                }
                let obj;
                let contents;
                try {
                    contents = yield res.readBody();
                    if (contents && contents.length > 0) {
                        if (options && options.deserializeDates) {
                            obj = JSON.parse(contents, dateTimeDeserializer);
                        }
                        else {
                            obj = JSON.parse(contents);
                        }
                        response.result = obj;
                    }
                    response.headers = res.message.headers;
                }
                catch (err) {
                    // Invalid resource (contents not json);  leaving result obj null
                }
                // note that 3xx redirects are handled by the http layer.
                if (statusCode > 299) {
                    let msg;
                    // if exception/error in body, attempt to get better error
                    if (obj && obj.message) {
                        msg = obj.message;
                    }
                    else if (contents && contents.length > 0) {
                        // it may be the case that the exception is in the body message as string
                        msg = contents;
                    }
                    else {
                        msg = `Failed request: (${statusCode})`;
                    }
                    const err = new HttpClientError(msg, statusCode);
                    err.result = response.result;
                    reject(err);
                }
                else {
                    resolve(response);
                }
            }));
        });
    }
}
exports.HttpClient = HttpClient;
const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2426:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkBypass = exports.getProxyUrl = void 0;
function getProxyUrl(reqUrl) {
    const usingSsl = reqUrl.protocol === 'https:';
    if (checkBypass(reqUrl)) {
        return undefined;
    }
    const proxyVar = (() => {
        if (usingSsl) {
            return process.env['https_proxy'] || process.env['HTTPS_PROXY'];
        }
        else {
            return process.env['http_proxy'] || process.env['HTTP_PROXY'];
        }
    })();
    if (proxyVar) {
        return new URL(proxyVar);
    }
    else {
        return undefined;
    }
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    const noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    const upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (const upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;
//# sourceMappingURL=proxy.js.map

/***/ }),

/***/ 6761:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var Utils = __nccwpck_require__(5182);
var fs = Utils.FileSystem.require(),
	pth = __nccwpck_require__(1017);

fs.existsSync = fs.existsSync || pth.existsSync;

var ZipEntry = __nccwpck_require__(4057),
	ZipFile = __nccwpck_require__(7744);

var isWin = /^win/.test(process.platform);


module.exports = function (/**String*/input) {
	var _zip = undefined,
		_filename = "";

	if (input && typeof input === "string") { // load zip file
		if (fs.existsSync(input)) {
			_filename = input;
			_zip = new ZipFile(input, Utils.Constants.FILE);
		} else {
			throw Utils.Errors.INVALID_FILENAME;
		}
	} else if (input && Buffer.isBuffer(input)) { // load buffer
		_zip = new ZipFile(input, Utils.Constants.BUFFER);
	} else { // create new zip file
		_zip = new ZipFile(null, Utils.Constants.NONE);
	}

	function sanitize(prefix, name) {
		prefix = pth.resolve(pth.normalize(prefix));
		var parts = name.split('/');
		for (var i = 0, l = parts.length; i < l; i++) {
			var path = pth.normalize(pth.join(prefix, parts.slice(i, l).join(pth.sep)));
			if (path.indexOf(prefix) === 0) {
				return path;
			}
		}
		return pth.normalize(pth.join(prefix, pth.basename(name)));
	}

	function getEntry(/**Object*/entry) {
		if (entry && _zip) {
			var item;
			// If entry was given as a file name
			if (typeof entry === "string")
				item = _zip.getEntry(entry);
			// if entry was given as a ZipEntry object
			if (typeof entry === "object" && typeof entry.entryName !== "undefined" && typeof entry.header !== "undefined")
				item = _zip.getEntry(entry.entryName);

			if (item) {
				return item;
			}
		}
		return null;
	}

	return {
		/**
		 * Extracts the given entry from the archive and returns the content as a Buffer object
		 * @param entry ZipEntry object or String with the full path of the entry
		 *
		 * @return Buffer or Null in case of error
		 */
		readFile: function (/**Object*/entry) {
			var item = getEntry(entry);
			return item && item.getData() || null;
		},

		/**
		 * Asynchronous readFile
		 * @param entry ZipEntry object or String with the full path of the entry
		 * @param callback
		 *
		 * @return Buffer or Null in case of error
		 */
		readFileAsync: function (/**Object*/entry, /**Function*/callback) {
			var item = getEntry(entry);
			if (item) {
				item.getDataAsync(callback);
			} else {
				callback(null, "getEntry failed for:" + entry)
			}
		},

		/**
		 * Extracts the given entry from the archive and returns the content as plain text in the given encoding
		 * @param entry ZipEntry object or String with the full path of the entry
		 * @param encoding Optional. If no encoding is specified utf8 is used
		 *
		 * @return String
		 */
		readAsText: function (/**Object*/entry, /**String=*/encoding) {
			var item = getEntry(entry);
			if (item) {
				var data = item.getData();
				if (data && data.length) {
					return data.toString(encoding || "utf8");
				}
			}
			return "";
		},

		/**
		 * Asynchronous readAsText
		 * @param entry ZipEntry object or String with the full path of the entry
		 * @param callback
		 * @param encoding Optional. If no encoding is specified utf8 is used
		 *
		 * @return String
		 */
		readAsTextAsync: function (/**Object*/entry, /**Function*/callback, /**String=*/encoding) {
			var item = getEntry(entry);
			if (item) {
				item.getDataAsync(function (data, err) {
					if (err) {
						callback(data, err);
						return;
					}

					if (data && data.length) {
						callback(data.toString(encoding || "utf8"));
					} else {
						callback("");
					}
				})
			} else {
				callback("");
			}
		},

		/**
		 * Remove the entry from the file or the entry and all it's nested directories and files if the given entry is a directory
		 *
		 * @param entry
		 */
		deleteFile: function (/**Object*/entry) { // @TODO: test deleteFile
			var item = getEntry(entry);
			if (item) {
				_zip.deleteEntry(item.entryName);
			}
		},

		/**
		 * Adds a comment to the zip. The zip must be rewritten after adding the comment.
		 *
		 * @param comment
		 */
		addZipComment: function (/**String*/comment) { // @TODO: test addZipComment
			_zip.comment = comment;
		},

		/**
		 * Returns the zip comment
		 *
		 * @return String
		 */
		getZipComment: function () {
			return _zip.comment || '';
		},

		/**
		 * Adds a comment to a specified zipEntry. The zip must be rewritten after adding the comment
		 * The comment cannot exceed 65535 characters in length
		 *
		 * @param entry
		 * @param comment
		 */
		addZipEntryComment: function (/**Object*/entry, /**String*/comment) {
			var item = getEntry(entry);
			if (item) {
				item.comment = comment;
			}
		},

		/**
		 * Returns the comment of the specified entry
		 *
		 * @param entry
		 * @return String
		 */
		getZipEntryComment: function (/**Object*/entry) {
			var item = getEntry(entry);
			if (item) {
				return item.comment || '';
			}
			return ''
		},

		/**
		 * Updates the content of an existing entry inside the archive. The zip must be rewritten after updating the content
		 *
		 * @param entry
		 * @param content
		 */
		updateFile: function (/**Object*/entry, /**Buffer*/content) {
			var item = getEntry(entry);
			if (item) {
				item.setData(content);
			}
		},

		/**
		 * Adds a file from the disk to the archive
		 *
		 * @param localPath File to add to zip
		 * @param zipPath Optional path inside the zip
		 * @param zipName Optional name for the file
		 */
		addLocalFile: function (/**String*/localPath, /**String=*/zipPath, /**String=*/zipName) {
			if (fs.existsSync(localPath)) {
				if (zipPath) {
					zipPath = zipPath.split("\\").join("/");
					if (zipPath.charAt(zipPath.length - 1) !== "/") {
						zipPath += "/";
					}
				} else {
					zipPath = "";
				}
				var p = localPath.split("\\").join("/").split("/").pop();

				if (zipName) {
					this.addFile(zipPath + zipName, fs.readFileSync(localPath), "", 0)
				} else {
					this.addFile(zipPath + p, fs.readFileSync(localPath), "", 0)
				}
			} else {
				throw Utils.Errors.FILE_NOT_FOUND.replace("%s", localPath);
			}
		},

		/**
		 * Adds a local directory and all its nested files and directories to the archive
		 *
		 * @param localPath
		 * @param zipPath optional path inside zip
		 * @param filter optional RegExp or Function if files match will
		 *               be included.
		 */
		addLocalFolder: function (/**String*/localPath, /**String=*/zipPath, /**=RegExp|Function*/filter) {
			if (filter === undefined) {
				filter = function () {
					return true;
				};
			} else if (filter instanceof RegExp) {
				filter = function (filter) {
					return function (filename) {
						return filter.test(filename);
					}
				}(filter);
			}

			if (zipPath) {
				zipPath = zipPath.split("\\").join("/");
				if (zipPath.charAt(zipPath.length - 1) !== "/") {
					zipPath += "/";
				}
			} else {
				zipPath = "";
			}
			// normalize the path first
			localPath = pth.normalize(localPath);
			localPath = localPath.split("\\").join("/"); //windows fix
			if (localPath.charAt(localPath.length - 1) !== "/")
				localPath += "/";

			if (fs.existsSync(localPath)) {

				var items = Utils.findFiles(localPath),
					self = this;

				if (items.length) {
					items.forEach(function (path) {
						var p = path.split("\\").join("/").replace(new RegExp(localPath.replace(/(\(|\))/g, '\\$1'), 'i'), ""); //windows fix
						if (filter(p)) {
							if (p.charAt(p.length - 1) !== "/") {
								self.addFile(zipPath + p, fs.readFileSync(path), "", 0)
							} else {
								self.addFile(zipPath + p, Buffer.alloc(0), "", 0)
							}
						}
					});
				}
			} else {
				throw Utils.Errors.FILE_NOT_FOUND.replace("%s", localPath);
			}
		},

		/**
		 * Asynchronous addLocalFile
		 * @param localPath
		 * @param callback
		 * @param zipPath optional path inside zip
		 * @param filter optional RegExp or Function if files match will
		 *               be included.
		 */
		addLocalFolderAsync: function (/*String*/localPath, /*Function*/callback, /*String*/zipPath, /*RegExp|Function*/filter) {
			if (filter === undefined) {
				filter = function () {
					return true;
				};
			} else if (filter instanceof RegExp) {
				filter = function (filter) {
					return function (filename) {
						return filter.test(filename);
					}
				}(filter);
			}

			if (zipPath) {
				zipPath = zipPath.split("\\").join("/");
				if (zipPath.charAt(zipPath.length - 1) !== "/") {
					zipPath += "/";
				}
			} else {
				zipPath = "";
			}
			// normalize the path first
			localPath = pth.normalize(localPath);
			localPath = localPath.split("\\").join("/"); //windows fix
			if (localPath.charAt(localPath.length - 1) !== "/")
				localPath += "/";

			var self = this;
			fs.open(localPath, 'r', function (err, fd) {
				if (err && err.code === 'ENOENT') {
					callback(undefined, Utils.Errors.FILE_NOT_FOUND.replace("%s", localPath));
				} else if (err) {
					callback(undefined, err);
				} else {
					var items = Utils.findFiles(localPath);
					var i = -1;

					var next = function () {
						i += 1;
						if (i < items.length) {
							var p = items[i].split("\\").join("/").replace(new RegExp(localPath.replace(/(\(|\))/g, '\\$1'), 'i'), ""); //windows fix
							p = p.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\x20-\x7E]/g, '') // accent fix
							if (filter(p)) {
								if (p.charAt(p.length - 1) !== "/") {
									fs.readFile(items[i], function (err, data) {
										if (err) {
											callback(undefined, err);
										} else {
											self.addFile(zipPath + p, data, '', 0);
											next();
										}
									})
								} else {
									self.addFile(zipPath + p, Buffer.alloc(0), "", 0);
									next();
								}
							} else {
								next();
							}

						} else {
							callback(true, undefined);
						}
					}

					next();
				}
			});
		},

		/**
		 * Allows you to create a entry (file or directory) in the zip file.
		 * If you want to create a directory the entryName must end in / and a null buffer should be provided.
		 * Comment and attributes are optional
		 *
		 * @param entryName
		 * @param content
		 * @param comment
		 * @param attr
		 */
		addFile: function (/**String*/entryName, /**Buffer*/content, /**String*/comment, /**Number*/attr) {
			var entry = new ZipEntry();
			entry.entryName = entryName;
			entry.comment = comment || "";

			if (!attr) {
				if (entry.isDirectory) {
					attr = (0o40755 << 16) | 0x10; // (permissions drwxr-xr-x) + (MS-DOS directory flag)
				} else {
					attr = 0o644 << 16; // permissions -r-wr--r--
				}
			}

			entry.attr = attr;

			entry.setData(content);
			_zip.setEntry(entry);
		},

		/**
		 * Returns an array of ZipEntry objects representing the files and folders inside the archive
		 *
		 * @return Array
		 */
		getEntries: function () {
			if (_zip) {
				return _zip.entries;
			} else {
				return [];
			}
		},

		/**
		 * Returns a ZipEntry object representing the file or folder specified by ``name``.
		 *
		 * @param name
		 * @return ZipEntry
		 */
		getEntry: function (/**String*/name) {
			return getEntry(name);
		},

		getEntryCount: function() {
			return _zip.getEntryCount();
		},

		forEach: function(callback) {
			return _zip.forEach(callback);
		},

		/**
		 * Extracts the given entry to the given targetPath
		 * If the entry is a directory inside the archive, the entire directory and it's subdirectories will be extracted
		 *
		 * @param entry ZipEntry object or String with the full path of the entry
		 * @param targetPath Target folder where to write the file
		 * @param maintainEntryPath If maintainEntryPath is true and the entry is inside a folder, the entry folder
		 *                          will be created in targetPath as well. Default is TRUE
		 * @param overwrite If the file already exists at the target path, the file will be overwriten if this is true.
		 *                  Default is FALSE
		 *
		 * @return Boolean
		 */
		extractEntryTo: function (/**Object*/entry, /**String*/targetPath, /**Boolean*/maintainEntryPath, /**Boolean*/overwrite) {
			overwrite = overwrite || false;
			maintainEntryPath = typeof maintainEntryPath === "undefined" ? true : maintainEntryPath;

			var item = getEntry(entry);
			if (!item) {
				throw Utils.Errors.NO_ENTRY;
			}

			var entryName = item.entryName;

			var target = sanitize(targetPath, maintainEntryPath ? entryName : pth.basename(entryName));

			if (item.isDirectory) {
				target = pth.resolve(target, "..");
				var children = _zip.getEntryChildren(item);
				children.forEach(function (child) {
					if (child.isDirectory) return;
					var content = child.getData();
					if (!content) {
						throw Utils.Errors.CANT_EXTRACT_FILE;
					}
					var childName = sanitize(targetPath, maintainEntryPath ? child.entryName : pth.basename(child.entryName));

					Utils.writeFileTo(childName, content, overwrite);
				});
				return true;
			}

			var content = item.getData();
			if (!content) throw Utils.Errors.CANT_EXTRACT_FILE;

			if (fs.existsSync(target) && !overwrite) {
				throw Utils.Errors.CANT_OVERRIDE;
			}
			Utils.writeFileTo(target, content, overwrite);

			return true;
		},

		/**
		 * Test the archive
		 *
		 */
		test: function () {
			if (!_zip) {
				return false;
			}

			for (var entry in _zip.entries) {
				try {
					if (entry.isDirectory) {
						continue;
					}
					var content = _zip.entries[entry].getData();
					if (!content) {
						return false;
					}
				} catch (err) {
					return false;
				}
			}
			return true;
		},

		/**
		 * Extracts the entire archive to the given location
		 *
		 * @param targetPath Target location
		 * @param overwrite If the file already exists at the target path, the file will be overwriten if this is true.
		 *                  Default is FALSE
		 */
		extractAllTo: function (/**String*/targetPath, /**Boolean*/overwrite) {
			overwrite = overwrite || false;
			if (!_zip) {
				throw Utils.Errors.NO_ZIP;
			}
			_zip.entries.forEach(function (entry) {
				var entryName = sanitize(targetPath, entry.entryName.toString());
				if (entry.isDirectory) {
					Utils.makeDir(entryName);
					return;
				}
				var content = entry.getData();
				if (!content) {
					throw Utils.Errors.CANT_EXTRACT_FILE;
				}
				Utils.writeFileTo(entryName, content, overwrite);
				try {
					fs.utimesSync(entryName, entry.header.time, entry.header.time)
				} catch (err) {
					throw Utils.Errors.CANT_EXTRACT_FILE;
				}
			})
		},

		/**
		 * Asynchronous extractAllTo
		 *
		 * @param targetPath Target location
		 * @param overwrite If the file already exists at the target path, the file will be overwriten if this is true.
		 *                  Default is FALSE
		 * @param callback
		 */
		extractAllToAsync: function (/**String*/targetPath, /**Boolean*/overwrite, /**Function*/callback) {
			if (!callback) {
				callback = function() {}
			}
			overwrite = overwrite || false;
			if (!_zip) {
				callback(new Error(Utils.Errors.NO_ZIP));
				return;
			}

			var entries = _zip.entries;
			var i = entries.length;
			entries.forEach(function (entry) {
				if (i <= 0) return; // Had an error already

				var entryName = pth.normalize(entry.entryName.toString());

				if (entry.isDirectory) {
					Utils.makeDir(sanitize(targetPath, entryName));
					if (--i === 0)
						callback(undefined);
					return;
				}
				entry.getDataAsync(function (content, err) {
					if (i <= 0) return;
					if (err) {
						callback(new Error(err));
						return;
					}
					if (!content) {
						i = 0;
						callback(new Error(Utils.Errors.CANT_EXTRACT_FILE));
						return;
					}

					Utils.writeFileToAsync(sanitize(targetPath, entryName), content, overwrite, function (succ) {
						try {
							fs.utimesSync(pth.resolve(targetPath, entryName), entry.header.time, entry.header.time);
						} catch (err) {
							callback(new Error('Unable to set utimes'));
						}
						if (i <= 0) return;
						if (!succ) {
							i = 0;
							callback(new Error('Unable to write'));
							return;
						}
						if (--i === 0)
							callback(undefined);
					});
				});
			})
		},

		/**
		 * Writes the newly created zip file to disk at the specified location or if a zip was opened and no ``targetFileName`` is provided, it will overwrite the opened zip
		 *
		 * @param targetFileName
		 * @param callback
		 */
		writeZip: function (/**String*/targetFileName, /**Function*/callback) {
			if (arguments.length === 1) {
				if (typeof targetFileName === "function") {
					callback = targetFileName;
					targetFileName = "";
				}
			}

			if (!targetFileName && _filename) {
				targetFileName = _filename;
			}
			if (!targetFileName) return;

			var zipData = _zip.compressToBuffer();
			if (zipData) {
				var ok = Utils.writeFileTo(targetFileName, zipData, true);
				if (typeof callback === 'function') callback(!ok ? new Error("failed") : null, "");
			}
		},

		/**
		 * Returns the content of the entire zip file as a Buffer object
		 *
		 * @return Buffer
		 */
		toBuffer: function (/**Function=*/onSuccess, /**Function=*/onFail, /**Function=*/onItemStart, /**Function=*/onItemEnd) {
			this.valueOf = 2;
			if (typeof onSuccess === "function") {
				_zip.toAsyncBuffer(onSuccess, onFail, onItemStart, onItemEnd);
				return null;
			}
			return _zip.compressToBuffer()
		}
	}
};


/***/ }),

/***/ 9032:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var Utils = __nccwpck_require__(5182),
    Constants = Utils.Constants;

/* The central directory file header */
module.exports = function () {
    var _verMade = 0x0A,
        _version = 0x0A,
        _flags = 0,
        _method = 0,
        _time = 0,
        _crc = 0,
        _compressedSize = 0,
        _size = 0,
        _fnameLen = 0,
        _extraLen = 0,

        _comLen = 0,
        _diskStart = 0,
        _inattr = 0,
        _attr = 0,
        _offset = 0;

    var _dataHeader = {};

    function setTime(val) {
        val = new Date(val);
        _time = (val.getFullYear() - 1980 & 0x7f) << 25  // b09-16 years from 1980
            | (val.getMonth() + 1) << 21                 // b05-08 month
            | val.getDate() << 16                        // b00-04 hour

            // 2 bytes time
            | val.getHours() << 11    // b11-15 hour
            | val.getMinutes() << 5   // b05-10 minute
            | val.getSeconds() >> 1;  // b00-04 seconds divided by 2
    }

    setTime(+new Date());

    return {
        get made () { return _verMade; },
        set made (val) { _verMade = val; },

        get version () { return _version; },
        set version (val) { _version = val },

        get flags () { return _flags },
        set flags (val) { _flags = val; },

        get method () { return _method; },
        set method (val) { _method = val; },

        get time () { return new Date(
            ((_time >> 25) & 0x7f) + 1980,
            ((_time >> 21) & 0x0f) - 1,
            (_time >> 16) & 0x1f,
            (_time >> 11) & 0x1f,
            (_time >> 5) & 0x3f,
            (_time & 0x1f) << 1
        );
        },
        set time (val) {
            setTime(val);
        },

        get crc () { return _crc; },
        set crc (val) { _crc = val; },

        get compressedSize () { return _compressedSize; },
        set compressedSize (val) { _compressedSize = val; },

        get size () { return _size; },
        set size (val) { _size = val; },

        get fileNameLength () { return _fnameLen; },
        set fileNameLength (val) { _fnameLen = val; },

        get extraLength () { return _extraLen },
        set extraLength (val) { _extraLen = val; },

        get commentLength () { return _comLen },
        set commentLength (val) { _comLen = val },

        get diskNumStart () { return _diskStart },
        set diskNumStart (val) { _diskStart = val },

        get inAttr () { return _inattr },
        set inAttr (val) { _inattr = val },

        get attr () { return _attr },
        set attr (val) { _attr = val },

        get offset () { return _offset },
        set offset (val) { _offset = val },

        get encripted () { return (_flags & 1) === 1 },

        get entryHeaderSize () {
            return Constants.CENHDR + _fnameLen + _extraLen + _comLen;
        },

        get realDataOffset () {
            return _offset + Constants.LOCHDR + _dataHeader.fnameLen + _dataHeader.extraLen;
        },

        get dataHeader () {
            return _dataHeader;
        },

        loadDataHeaderFromBinary : function(/*Buffer*/input) {
            var data = input.slice(_offset, _offset + Constants.LOCHDR);
            // 30 bytes and should start with "PK\003\004"
            if (data.readUInt32LE(0) !== Constants.LOCSIG) {
                throw Utils.Errors.INVALID_LOC;
            }
            _dataHeader = {
                // version needed to extract
                version : data.readUInt16LE(Constants.LOCVER),
                // general purpose bit flag
                flags : data.readUInt16LE(Constants.LOCFLG),
                // compression method
                method : data.readUInt16LE(Constants.LOCHOW),
                // modification time (2 bytes time, 2 bytes date)
                time : data.readUInt32LE(Constants.LOCTIM),
                // uncompressed file crc-32 value
                crc : data.readUInt32LE(Constants.LOCCRC),
                // compressed size
                compressedSize : data.readUInt32LE(Constants.LOCSIZ),
                // uncompressed size
                size : data.readUInt32LE(Constants.LOCLEN),
                // filename length
                fnameLen : data.readUInt16LE(Constants.LOCNAM),
                // extra field length
                extraLen : data.readUInt16LE(Constants.LOCEXT)
            }
        },

        loadFromBinary : function(/*Buffer*/data) {
            // data should be 46 bytes and start with "PK 01 02"
            if (data.length !== Constants.CENHDR || data.readUInt32LE(0) !== Constants.CENSIG) {
                throw Utils.Errors.INVALID_CEN;
            }
            // version made by
            _verMade = data.readUInt16LE(Constants.CENVEM);
            // version needed to extract
            _version = data.readUInt16LE(Constants.CENVER);
            // encrypt, decrypt flags
            _flags = data.readUInt16LE(Constants.CENFLG);
            // compression method
            _method = data.readUInt16LE(Constants.CENHOW);
            // modification time (2 bytes time, 2 bytes date)
            _time = data.readUInt32LE(Constants.CENTIM);
            // uncompressed file crc-32 value
            _crc = data.readUInt32LE(Constants.CENCRC);
            // compressed size
            _compressedSize = data.readUInt32LE(Constants.CENSIZ);
            // uncompressed size
            _size = data.readUInt32LE(Constants.CENLEN);
            // filename length
            _fnameLen = data.readUInt16LE(Constants.CENNAM);
            // extra field length
            _extraLen = data.readUInt16LE(Constants.CENEXT);
            // file comment length
            _comLen = data.readUInt16LE(Constants.CENCOM);
            // volume number start
            _diskStart = data.readUInt16LE(Constants.CENDSK);
            // internal file attributes
            _inattr = data.readUInt16LE(Constants.CENATT);
            // external file attributes
            _attr = data.readUInt32LE(Constants.CENATX);
            // LOC header offset
            _offset = data.readUInt32LE(Constants.CENOFF);
        },

        dataHeaderToBinary : function() {
            // LOC header size (30 bytes)
            var data = Buffer.alloc(Constants.LOCHDR);
            // "PK\003\004"
            data.writeUInt32LE(Constants.LOCSIG, 0);
            // version needed to extract
            data.writeUInt16LE(_version, Constants.LOCVER);
            // general purpose bit flag
            data.writeUInt16LE(_flags, Constants.LOCFLG);
            // compression method
            data.writeUInt16LE(_method, Constants.LOCHOW);
            // modification time (2 bytes time, 2 bytes date)
            data.writeUInt32LE(_time, Constants.LOCTIM);
            // uncompressed file crc-32 value
            data.writeUInt32LE(_crc, Constants.LOCCRC);
            // compressed size
            data.writeUInt32LE(_compressedSize, Constants.LOCSIZ);
            // uncompressed size
            data.writeUInt32LE(_size, Constants.LOCLEN);
            // filename length
            data.writeUInt16LE(_fnameLen, Constants.LOCNAM);
            // extra field length
            data.writeUInt16LE(_extraLen, Constants.LOCEXT);
            return data;
        },

        entryHeaderToBinary : function() {
            // CEN header size (46 bytes)
            var data = Buffer.alloc(Constants.CENHDR + _fnameLen + _extraLen + _comLen);
            // "PK\001\002"
            data.writeUInt32LE(Constants.CENSIG, 0);
            // version made by
            data.writeUInt16LE(_verMade, Constants.CENVEM);
            // version needed to extract
            data.writeUInt16LE(_version, Constants.CENVER);
            // encrypt, decrypt flags
            data.writeUInt16LE(_flags, Constants.CENFLG);
            // compression method
            data.writeUInt16LE(_method, Constants.CENHOW);
            // modification time (2 bytes time, 2 bytes date)
            data.writeUInt32LE(_time, Constants.CENTIM);
            // uncompressed file crc-32 value
            data.writeUInt32LE(_crc, Constants.CENCRC);
            // compressed size
            data.writeUInt32LE(_compressedSize, Constants.CENSIZ);
            // uncompressed size
            data.writeUInt32LE(_size, Constants.CENLEN);
            // filename length
            data.writeUInt16LE(_fnameLen, Constants.CENNAM);
            // extra field length
            data.writeUInt16LE(_extraLen, Constants.CENEXT);
            // file comment length
            data.writeUInt16LE(_comLen, Constants.CENCOM);
            // volume number start
            data.writeUInt16LE(_diskStart, Constants.CENDSK);
            // internal file attributes
            data.writeUInt16LE(_inattr, Constants.CENATT);
            // external file attributes
            data.writeUInt32LE(_attr, Constants.CENATX);
            // LOC header offset
            data.writeUInt32LE(_offset, Constants.CENOFF);
            // fill all with
            data.fill(0x00, Constants.CENHDR);
            return data;
        },

        toString : function() {
            return '{\n' +
                '\t"made" : ' + _verMade + ",\n" +
                '\t"version" : ' + _version + ",\n" +
                '\t"flags" : ' + _flags + ",\n" +
                '\t"method" : ' + Utils.methodToString(_method) + ",\n" +
                '\t"time" : ' + this.time + ",\n" +
                '\t"crc" : 0x' + _crc.toString(16).toUpperCase() + ",\n" +
                '\t"compressedSize" : ' + _compressedSize + " bytes,\n" +
                '\t"size" : ' + _size + " bytes,\n" +
                '\t"fileNameLength" : ' + _fnameLen + ",\n" +
                '\t"extraLength" : ' + _extraLen + " bytes,\n" +
                '\t"commentLength" : ' + _comLen + " bytes,\n" +
                '\t"diskNumStart" : ' + _diskStart + ",\n" +
                '\t"inAttr" : ' + _inattr + ",\n" +
                '\t"attr" : ' + _attr + ",\n" +
                '\t"offset" : ' + _offset + ",\n" +
                '\t"entryHeaderSize" : ' + (Constants.CENHDR + _fnameLen + _extraLen + _comLen) + " bytes\n" +
                '}';
        }
    }
};


/***/ }),

/***/ 4958:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

exports.EntryHeader = __nccwpck_require__(9032);
exports.MainHeader = __nccwpck_require__(4408);


/***/ }),

/***/ 4408:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var Utils = __nccwpck_require__(5182),
    Constants = Utils.Constants;

/* The entries in the end of central directory */
module.exports = function () {
    var _volumeEntries = 0,
        _totalEntries = 0,
        _size = 0,
        _offset = 0,
        _commentLength = 0;

    return {
        get diskEntries () { return _volumeEntries },
        set diskEntries (/*Number*/val) { _volumeEntries = _totalEntries = val; },

        get totalEntries () { return _totalEntries },
        set totalEntries (/*Number*/val) { _totalEntries = _volumeEntries = val; },

        get size () { return _size },
        set size (/*Number*/val) { _size = val; },

        get offset () { return _offset },
        set offset (/*Number*/val) { _offset = val; },

        get commentLength () { return _commentLength },
        set commentLength (/*Number*/val) { _commentLength = val; },

        get mainHeaderSize () {
            return Constants.ENDHDR + _commentLength;
        },

        loadFromBinary : function(/*Buffer*/data) {
            // data should be 22 bytes and start with "PK 05 06"
            // or be 56+ bytes and start with "PK 06 06" for Zip64
            if ((data.length !== Constants.ENDHDR || data.readUInt32LE(0) !== Constants.ENDSIG) &&
                (data.length < Constants.ZIP64HDR || data.readUInt32LE(0) !== Constants.ZIP64SIG)) {

                throw Utils.Errors.INVALID_END;
            }

            if (data.readUInt32LE(0) === Constants.ENDSIG) {
                // number of entries on this volume
                _volumeEntries = data.readUInt16LE(Constants.ENDSUB);
                // total number of entries
                _totalEntries = data.readUInt16LE(Constants.ENDTOT);
                // central directory size in bytes
                _size = data.readUInt32LE(Constants.ENDSIZ);
                // offset of first CEN header
                _offset = data.readUInt32LE(Constants.ENDOFF);
                // zip file comment length
                _commentLength = data.readUInt16LE(Constants.ENDCOM);
            } else {
                // number of entries on this volume
                _volumeEntries = Utils.readBigUInt64LE(data, Constants.ZIP64SUB);
                // total number of entries
                _totalEntries = Utils.readBigUInt64LE(data, Constants.ZIP64TOT);
                // central directory size in bytes
                _size = Utils.readBigUInt64LE(data, Constants.ZIP64SIZ);
                // offset of first CEN header
                _offset = Utils.readBigUInt64LE(data, Constants.ZIP64OFF);

                _commentLength = 0;
            }

        },

        toBinary : function() {
           var b = Buffer.alloc(Constants.ENDHDR + _commentLength);
            // "PK 05 06" signature
            b.writeUInt32LE(Constants.ENDSIG, 0);
            b.writeUInt32LE(0, 4);
            // number of entries on this volume
            b.writeUInt16LE(_volumeEntries, Constants.ENDSUB);
            // total number of entries
            b.writeUInt16LE(_totalEntries, Constants.ENDTOT);
            // central directory size in bytes
            b.writeUInt32LE(_size, Constants.ENDSIZ);
            // offset of first CEN header
            b.writeUInt32LE(_offset, Constants.ENDOFF);
            // zip file comment length
            b.writeUInt16LE(_commentLength, Constants.ENDCOM);
            // fill comment memory with spaces so no garbage is left there
            b.fill(" ", Constants.ENDHDR);

            return b;
        },

        toString : function() {
            return '{\n' +
                '\t"diskEntries" : ' + _volumeEntries + ",\n" +
                '\t"totalEntries" : ' + _totalEntries + ",\n" +
                '\t"size" : ' + _size + " bytes,\n" +
                '\t"offset" : 0x' + _offset.toString(16).toUpperCase() + ",\n" +
                '\t"commentLength" : 0x' + _commentLength + "\n" +
            '}';
        }
    }
};

/***/ }),

/***/ 7686:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = function (/*Buffer*/inbuf) {

  var zlib = __nccwpck_require__(9796);
  
  var opts = {chunkSize: (parseInt(inbuf.length / 1024) + 1) * 1024};
  
  return {
    deflate: function () {
      return zlib.deflateRawSync(inbuf, opts);
    },

    deflateAsync: function (/*Function*/callback) {
      var tmp = zlib.createDeflateRaw(opts), parts = [], total = 0;
      tmp.on('data', function (data) {
        parts.push(data);
        total += data.length;
      });
      tmp.on('end', function () {
        var buf = Buffer.alloc(total), written = 0;
        buf.fill(0);
        for (var i = 0; i < parts.length; i++) {
          var part = parts[i];
          part.copy(buf, written);
          written += part.length;
        }
        callback && callback(buf);
      });
      tmp.end(inbuf);
    }
  }
};


/***/ }),

/***/ 3928:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

exports.Deflater = __nccwpck_require__(7686);
exports.Inflater = __nccwpck_require__(2153);

/***/ }),

/***/ 2153:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = function (/*Buffer*/inbuf) {

  var zlib = __nccwpck_require__(9796);

  return {
    inflate: function () {
      return zlib.inflateRawSync(inbuf);
    },

    inflateAsync: function (/*Function*/callback) {
      var tmp = zlib.createInflateRaw(), parts = [], total = 0;
      tmp.on('data', function (data) {
        parts.push(data);
        total += data.length;
      });
      tmp.on('end', function () {
        var buf = Buffer.alloc(total), written = 0;
        buf.fill(0);
        for (var i = 0; i < parts.length; i++) {
          var part = parts[i];
          part.copy(buf, written);
          written += part.length;
        }
        callback && callback(buf);
      });
      tmp.end(inbuf);
    }
  }
};


/***/ }),

/***/ 4522:
/***/ ((module) => {

module.exports = {
    /* The local file header */
    LOCHDR           : 30, // LOC header size
    LOCSIG           : 0x04034b50, // "PK\003\004"
    LOCVER           : 4,	// version needed to extract
    LOCFLG           : 6, // general purpose bit flag
    LOCHOW           : 8, // compression method
    LOCTIM           : 10, // modification time (2 bytes time, 2 bytes date)
    LOCCRC           : 14, // uncompressed file crc-32 value
    LOCSIZ           : 18, // compressed size
    LOCLEN           : 22, // uncompressed size
    LOCNAM           : 26, // filename length
    LOCEXT           : 28, // extra field length

    /* The Data descriptor */
    EXTSIG           : 0x08074b50, // "PK\007\008"
    EXTHDR           : 16, // EXT header size
    EXTCRC           : 4, // uncompressed file crc-32 value
    EXTSIZ           : 8, // compressed size
    EXTLEN           : 12, // uncompressed size

    /* The central directory file header */
    CENHDR           : 46, // CEN header size
    CENSIG           : 0x02014b50, // "PK\001\002"
    CENVEM           : 4, // version made by
    CENVER           : 6, // version needed to extract
    CENFLG           : 8, // encrypt, decrypt flags
    CENHOW           : 10, // compression method
    CENTIM           : 12, // modification time (2 bytes time, 2 bytes date)
    CENCRC           : 16, // uncompressed file crc-32 value
    CENSIZ           : 20, // compressed size
    CENLEN           : 24, // uncompressed size
    CENNAM           : 28, // filename length
    CENEXT           : 30, // extra field length
    CENCOM           : 32, // file comment length
    CENDSK           : 34, // volume number start
    CENATT           : 36, // internal file attributes
    CENATX           : 38, // external file attributes (host system dependent)
    CENOFF           : 42, // LOC header offset

    /* The entries in the end of central directory */
    ENDHDR           : 22, // END header size
    ENDSIG           : 0x06054b50, // "PK\005\006"
    ENDSUB           : 8, // number of entries on this disk
    ENDTOT           : 10, // total number of entries
    ENDSIZ           : 12, // central directory size in bytes
    ENDOFF           : 16, // offset of first CEN header
    ENDCOM           : 20, // zip file comment length

    END64HDR         : 20, // zip64 END header size
    END64SIG         : 0x07064b50, // zip64 Locator signature, "PK\006\007"
    END64START       : 4, // number of the disk with the start of the zip64
    END64OFF         : 8, // relative offset of the zip64 end of central directory
    END64NUMDISKS    : 16, // total number of disks

    ZIP64SIG         : 0x06064b50, // zip64 signature, "PK\006\006"
    ZIP64HDR         : 56, // zip64 record minimum size
    ZIP64LEAD        : 12, // leading bytes at the start of the record, not counted by the value stored in ZIP64SIZE
    ZIP64SIZE        : 4, // zip64 size of the central directory record
    ZIP64VEM         : 12, // zip64 version made by
    ZIP64VER         : 14, // zip64 version needed to extract
    ZIP64DSK         : 16, // zip64 number of this disk
    ZIP64DSKDIR      : 20, // number of the disk with the start of the record directory
    ZIP64SUB         : 24, // number of entries on this disk
    ZIP64TOT         : 32, // total number of entries
    ZIP64SIZB        : 40, // zip64 central directory size in bytes
    ZIP64OFF         : 48, // offset of start of central directory with respect to the starting disk number
    ZIP64EXTRA       : 56, // extensible data sector

    /* Compression methods */
    STORED           : 0, // no compression
    SHRUNK           : 1, // shrunk
    REDUCED1         : 2, // reduced with compression factor 1
    REDUCED2         : 3, // reduced with compression factor 2
    REDUCED3         : 4, // reduced with compression factor 3
    REDUCED4         : 5, // reduced with compression factor 4
    IMPLODED         : 6, // imploded
    // 7 reserved
    DEFLATED         : 8, // deflated
    ENHANCED_DEFLATED: 9, // enhanced deflated
    PKWARE           : 10,// PKWare DCL imploded
    // 11 reserved
    BZIP2            : 12, //  compressed using BZIP2
    // 13 reserved
    LZMA             : 14, // LZMA
    // 15-17 reserved
    IBM_TERSE        : 18, // compressed using IBM TERSE
    IBM_LZ77         : 19, //IBM LZ77 z

    /* General purpose bit flag */
    FLG_ENC          : 0,  // encripted file
    FLG_COMP1        : 1,  // compression option
    FLG_COMP2        : 2,  // compression option
    FLG_DESC         : 4,  // data descriptor
    FLG_ENH          : 8,  // enhanced deflation
    FLG_STR          : 16, // strong encryption
    FLG_LNG          : 1024, // language encoding
    FLG_MSK          : 4096, // mask header values

    /* Load type */
    FILE             : 0,
    BUFFER           : 1,
    NONE             : 2,

    /* 4.5 Extensible data fields */
    EF_ID            : 0,
    EF_SIZE          : 2,

    /* Header IDs */
    ID_ZIP64         : 0x0001,
    ID_AVINFO        : 0x0007,
    ID_PFS           : 0x0008,
    ID_OS2           : 0x0009,
    ID_NTFS          : 0x000a,
    ID_OPENVMS       : 0x000c,
    ID_UNIX          : 0x000d,
    ID_FORK          : 0x000e,
    ID_PATCH         : 0x000f,
    ID_X509_PKCS7    : 0x0014,
    ID_X509_CERTID_F : 0x0015,
    ID_X509_CERTID_C : 0x0016,
    ID_STRONGENC     : 0x0017,
    ID_RECORD_MGT    : 0x0018,
    ID_X509_PKCS7_RL : 0x0019,
    ID_IBM1          : 0x0065,
    ID_IBM2          : 0x0066,
    ID_POSZIP        : 0x4690,

    EF_ZIP64_OR_32   : 0xffffffff,
    EF_ZIP64_OR_16   : 0xffff,
    EF_ZIP64_SUNCOMP : 0,
    EF_ZIP64_SCOMP   : 8,
    EF_ZIP64_RHO     : 16,
    EF_ZIP64_DSN     : 24
};


/***/ }),

/***/ 1255:
/***/ ((module) => {

module.exports = {
    /* Header error messages */
    "INVALID_LOC" : "Invalid LOC header (bad signature)",
    "INVALID_CEN" : "Invalid CEN header (bad signature)",
    "INVALID_END" : "Invalid END header (bad signature)",

    /* ZipEntry error messages*/
    "NO_DATA" : "Nothing to decompress",
    "BAD_CRC" : "CRC32 checksum failed",
    "FILE_IN_THE_WAY" : "There is a file in the way: %s",
    "UNKNOWN_METHOD" : "Invalid/unsupported compression method",

    /* Inflater error messages */
    "AVAIL_DATA" : "inflate::Available inflate data did not terminate",
    "INVALID_DISTANCE" : "inflate::Invalid literal/length or distance code in fixed or dynamic block",
    "TO_MANY_CODES" : "inflate::Dynamic block code description: too many length or distance codes",
    "INVALID_REPEAT_LEN" : "inflate::Dynamic block code description: repeat more than specified lengths",
    "INVALID_REPEAT_FIRST" : "inflate::Dynamic block code description: repeat lengths with no first length",
    "INCOMPLETE_CODES" : "inflate::Dynamic block code description: code lengths codes incomplete",
    "INVALID_DYN_DISTANCE": "inflate::Dynamic block code description: invalid distance code lengths",
    "INVALID_CODES_LEN": "inflate::Dynamic block code description: invalid literal/length code lengths",
    "INVALID_STORE_BLOCK" : "inflate::Stored block length did not match one's complement",
    "INVALID_BLOCK_TYPE" : "inflate::Invalid block type (type == 3)",

    /* ADM-ZIP error messages */
    "CANT_EXTRACT_FILE" : "Could not extract the file",
    "CANT_OVERRIDE" : "Target file already exists",
    "NO_ZIP" : "No zip file was loaded",
    "NO_ENTRY" : "Entry doesn't exist",
    "DIRECTORY_CONTENT_ERROR" : "A directory cannot have content",
    "FILE_NOT_FOUND" : "File not found: %s",
    "NOT_IMPLEMENTED" : "Not implemented",
    "INVALID_FILENAME" : "Invalid filename",
    "INVALID_FORMAT" : "Invalid or unsupported zip format. No END header found"
};

/***/ }),

/***/ 8321:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var fs = (__nccwpck_require__(2895).require)(),
    pth = __nccwpck_require__(1017);
	
fs.existsSync = fs.existsSync || pth.existsSync;

module.exports = function(/*String*/path) {

    var _path = path || "",
        _permissions = 0,
        _obj = newAttr(),
        _stat = null;

    function newAttr() {
        return {
            directory : false,
            readonly : false,
            hidden : false,
            executable : false,
            mtime : 0,
            atime : 0
        }
    }

    if (_path && fs.existsSync(_path)) {
        _stat = fs.statSync(_path);
        _obj.directory = _stat.isDirectory();
        _obj.mtime = _stat.mtime;
        _obj.atime = _stat.atime;
        _obj.executable = !!(1 & parseInt ((_stat.mode & parseInt ("777", 8)).toString (8)[0]));
        _obj.readonly = !!(2 & parseInt ((_stat.mode & parseInt ("777", 8)).toString (8)[0]));
        _obj.hidden = pth.basename(_path)[0] === ".";
    } else {
        console.warn("Invalid path: " + _path)
    }

    return {

        get directory () {
            return _obj.directory;
        },

        get readOnly () {
            return _obj.readonly;
        },

        get hidden () {
            return _obj.hidden;
        },

        get mtime () {
            return _obj.mtime;
        },

        get atime () {
           return _obj.atime;
        },


        get executable () {
            return _obj.executable;
        },

        decodeAttributes : function(val) {

        },

        encodeAttributes : function (val) {

        },

        toString : function() {
           return '{\n' +
               '\t"path" : "' + _path + ",\n" +
               '\t"isDirectory" : ' + _obj.directory + ",\n" +
               '\t"isReadOnly" : ' + _obj.readonly + ",\n" +
               '\t"isHidden" : ' + _obj.hidden + ",\n" +
               '\t"isExecutable" : ' + _obj.executable + ",\n" +
               '\t"mTime" : ' + _obj.mtime + "\n" +
               '\t"aTime" : ' + _obj.atime + "\n" +
           '}';
        }
    }

};


/***/ }),

/***/ 2895:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

exports.require = function() {
  var fs = __nccwpck_require__(7147);
  if (process.versions['electron']) {
	  try {
	    originalFs = __nccwpck_require__(2941);
	    if (Object.keys(originalFs).length > 0) {
	      fs = originalFs;
      }
	  } catch (e) {}
  }
  return fs
};


/***/ }),

/***/ 5182:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(1291);
module.exports.FileSystem = __nccwpck_require__(2895);
module.exports.Constants = __nccwpck_require__(4522);
module.exports.Errors = __nccwpck_require__(1255);
module.exports.FileAttr = __nccwpck_require__(8321);

/***/ }),

/***/ 1291:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var fs = (__nccwpck_require__(2895).require)(),
    pth = __nccwpck_require__(1017);

fs.existsSync = fs.existsSync || pth.existsSync;

module.exports = (function() {

    var crcTable = [],
        Constants = __nccwpck_require__(4522),
        Errors = __nccwpck_require__(1255),

        PATH_SEPARATOR = pth.sep;


    function mkdirSync(/*String*/path) {
        var resolvedPath = path.split(PATH_SEPARATOR)[0];
        path.split(PATH_SEPARATOR).forEach(function(name) {
            if (!name || name.substr(-1,1) === ":") return;
            resolvedPath += PATH_SEPARATOR + name;
            var stat;
            try {
                stat = fs.statSync(resolvedPath);
            } catch (e) {
                fs.mkdirSync(resolvedPath);
            }
            if (stat && stat.isFile())
                throw Errors.FILE_IN_THE_WAY.replace("%s", resolvedPath);
        });
    }

    function findSync(/*String*/dir, /*RegExp*/pattern, /*Boolean*/recoursive) {
        if (typeof pattern === 'boolean') {
            recoursive = pattern;
            pattern = undefined;
        }
        var files = [];
        fs.readdirSync(dir).forEach(function(file) {
            var path = pth.join(dir, file);

            if (fs.statSync(path).isDirectory() && recoursive)
                files = files.concat(findSync(path, pattern, recoursive));

            if (!pattern || pattern.test(path)) {
                files.push(pth.normalize(path) + (fs.statSync(path).isDirectory() ? PATH_SEPARATOR : ""));
            }

        });
        return files;
    }

    function readBigUInt64LE(/*Buffer*/buffer, /*int*/index) {
        var slice = Buffer.from(buffer.slice(index, index + 8));
        slice.swap64();

        return parseInt(`0x${ slice.toString('hex') }`);
    }

    return {
        makeDir : function(/*String*/path) {
            mkdirSync(path);
        },

        crc32 : function(buf) {
            if (typeof buf === 'string') {
                buf = Buffer.alloc(buf.length, buf);
            }
            var b = Buffer.alloc(4);
            if (!crcTable.length) {
                for (var n = 0; n < 256; n++) {
                    var c = n;
                    for (var k = 8; --k >= 0;)  //
                        if ((c & 1) !== 0)  { c = 0xedb88320 ^ (c >>> 1); } else { c = c >>> 1; }
                    if (c < 0) {
                        b.writeInt32LE(c, 0);
                        c = b.readUInt32LE(0);
                    }
                    crcTable[n] = c;
                }
            }
            var crc = 0, off = 0, len = buf.length, c1 = ~crc;
            while(--len >= 0) c1 = crcTable[(c1 ^ buf[off++]) & 0xff] ^ (c1 >>> 8);
            crc = ~c1;
            b.writeInt32LE(crc & 0xffffffff, 0);
            return b.readUInt32LE(0);
        },

        methodToString : function(/*Number*/method) {
            switch (method) {
                case Constants.STORED:
                    return 'STORED (' + method + ')';
                case Constants.DEFLATED:
                    return 'DEFLATED (' + method + ')';
                default:
                    return 'UNSUPPORTED (' + method + ')';
            }

        },

        writeFileTo : function(/*String*/path, /*Buffer*/content, /*Boolean*/overwrite, /*Number*/attr) {
            if (fs.existsSync(path)) {
                if (!overwrite)
                    return false; // cannot overwrite

                var stat = fs.statSync(path);
                if (stat.isDirectory()) {
                    return false;
                }
            }
            var folder = pth.dirname(path);
            if (!fs.existsSync(folder)) {
                mkdirSync(folder);
            }

            var fd;
            try {
                fd = fs.openSync(path, 'w', 438); // 0666
            } catch(e) {
                fs.chmodSync(path, 438);
                fd = fs.openSync(path, 'w', 438);
            }
            if (fd) {
                try {
                    fs.writeSync(fd, content, 0, content.length, 0);
                }
                catch (e){
                    throw e;
                }
                finally {
                    fs.closeSync(fd);
                }
            }
            fs.chmodSync(path, attr || 438);
            return true;
        },

        writeFileToAsync : function(/*String*/path, /*Buffer*/content, /*Boolean*/overwrite, /*Number*/attr, /*Function*/callback) {
            if(typeof attr === 'function') {
                callback = attr;
                attr = undefined;
            }

            fs.exists(path, function(exists) {
                if(exists && !overwrite)
                    return callback(false);

                fs.stat(path, function(err, stat) {
                    if(exists &&stat.isDirectory()) {
                        return callback(false);
                    }

                    var folder = pth.dirname(path);
                    fs.exists(folder, function(exists) {
                        if(!exists)
                            mkdirSync(folder);

                        fs.open(path, 'w', 438, function(err, fd) {
                            if(err) {
                                fs.chmod(path, 438, function() {
                                    fs.open(path, 'w', 438, function(err, fd) {
                                        fs.write(fd, content, 0, content.length, 0, function() {
                                            fs.close(fd, function() {
                                                fs.chmod(path, attr || 438, function() {
                                                    callback(true);
                                                })
                                            });
                                        });
                                    });
                                })
                            } else {
                                if(fd) {
                                    fs.write(fd, content, 0, content.length, 0, function() {
                                        fs.close(fd, function() {
                                            fs.chmod(path, attr || 438, function() {
                                                callback(true);
                                            })
                                        });
                                    });
                                } else {
                                    fs.chmod(path, attr || 438, function() {
                                        callback(true);
                                    })
                                }
                            }
                        });
                    })
                })
            })
        },

        findFiles : function(/*String*/path) {
            return findSync(path, true);
        },

        getAttributes : function(/*String*/path) {

        },

        setAttributes : function(/*String*/path) {

        },

        toBuffer : function(input) {
            if (Buffer.isBuffer(input)) {
                return input;
            } else {
                if (input.length === 0) {
                    return Buffer.alloc(0)
                }
                return Buffer.from(input, 'utf8');
            }
        },

        readBigUInt64LE,

        Constants : Constants,
        Errors : Errors
    }
})();


/***/ }),

/***/ 4057:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var Utils = __nccwpck_require__(5182),
    Headers = __nccwpck_require__(4958),
    Constants = Utils.Constants,
    Methods = __nccwpck_require__(3928);

module.exports = function (/*Buffer*/input) {

    var _entryHeader = new Headers.EntryHeader(),
        _entryName = Buffer.alloc(0),
        _comment = Buffer.alloc(0),
        _isDirectory = false,
        uncompressedData = null,
        _extra = Buffer.alloc(0);

    function getCompressedDataFromZip() {
        if (!input || !Buffer.isBuffer(input)) {
            return Buffer.alloc(0);
        }
        _entryHeader.loadDataHeaderFromBinary(input);
        return input.slice(_entryHeader.realDataOffset, _entryHeader.realDataOffset + _entryHeader.compressedSize)
    }

    function crc32OK(data) {
        // if bit 3 (0x08) of the general-purpose flags field is set, then the CRC-32 and file sizes are not known when the header is written
        if ((_entryHeader.flags & 0x8) !== 0x8) {
           if (Utils.crc32(data) !== _entryHeader.dataHeader.crc) {
               return false;
           }
        } else {
            // @TODO: load and check data descriptor header
            // The fields in the local header are filled with zero, and the CRC-32 and size are appended in a 12-byte structure
            // (optionally preceded by a 4-byte signature) immediately after the compressed data:
        }
        return true;
    }

    function decompress(/*Boolean*/async, /*Function*/callback, /*String*/pass) {
        if(typeof callback === 'undefined' && typeof async === 'string') {
            pass=async;
            async=void 0;
        }
        if (_isDirectory) {
            if (async && callback) {
                callback(Buffer.alloc(0), Utils.Errors.DIRECTORY_CONTENT_ERROR); //si added error.
            }
            return Buffer.alloc(0);
        }

        var compressedData = getCompressedDataFromZip();

        if (compressedData.length === 0) {
            // File is empty, nothing to decompress.
            if (async && callback) callback(compressedData);
            return compressedData;
        }

        var data = Buffer.alloc(_entryHeader.size);

        switch (_entryHeader.method) {
            case Utils.Constants.STORED:
                compressedData.copy(data);
                if (!crc32OK(data)) {
                    if (async && callback) callback(data, Utils.Errors.BAD_CRC);//si added error
                    return Utils.Errors.BAD_CRC;
                } else {//si added otherwise did not seem to return data.
                    if (async && callback) callback(data);
                    return data;
                }
            case Utils.Constants.DEFLATED:
                var inflater = new Methods.Inflater(compressedData);
                if (!async) {
                    var result = inflater.inflate(data);
                    result.copy(data, 0);
                    if (!crc32OK(data)) {
                        console.warn(Utils.Errors.BAD_CRC + " " + _entryName.toString())
                    }
                    return data;
                } else {
                    inflater.inflateAsync(function(result) {
                        result.copy(data, 0);
                        if (!crc32OK(data)) {
                            if (callback) callback(data, Utils.Errors.BAD_CRC); //si added error
                        } else { //si added otherwise did not seem to return data.
                            if (callback) callback(data);
                        }
                    })
                }
                break;
            default:
                if (async && callback) callback(Buffer.alloc(0), Utils.Errors.UNKNOWN_METHOD);
                return Utils.Errors.UNKNOWN_METHOD;
        }
    }

    function compress(/*Boolean*/async, /*Function*/callback) {
        if ((!uncompressedData || !uncompressedData.length) && Buffer.isBuffer(input)) {
            // no data set or the data wasn't changed to require recompression
            if (async && callback) callback(getCompressedDataFromZip());
            return getCompressedDataFromZip();
        }

        if (uncompressedData.length && !_isDirectory) {
            var compressedData;
            // Local file header
            switch (_entryHeader.method) {
                case Utils.Constants.STORED:
                    _entryHeader.compressedSize = _entryHeader.size;

                    compressedData = Buffer.alloc(uncompressedData.length);
                    uncompressedData.copy(compressedData);

                    if (async && callback) callback(compressedData);
                    return compressedData;
                default:
                case Utils.Constants.DEFLATED:

                    var deflater = new Methods.Deflater(uncompressedData);
                    if (!async) {
                        var deflated = deflater.deflate();
                        _entryHeader.compressedSize = deflated.length;
                        return deflated;
                    } else {
                        deflater.deflateAsync(function(data) {
                            compressedData = Buffer.alloc(data.length);
                            _entryHeader.compressedSize = data.length;
                            data.copy(compressedData);
                            callback && callback(compressedData);
                        })
                    }
                    deflater = null;
                    break;
            }
        } else {
            if (async && callback) {
                callback(Buffer.alloc(0));
            } else {
                return Buffer.alloc(0);
            }
        }
    }

    function readUInt64LE(buffer, offset) {
        return (buffer.readUInt32LE(offset + 4) << 4) + buffer.readUInt32LE(offset);
    }

    function parseExtra(data) {
        var offset = 0;
        var signature, size, part;
        while(offset<data.length) {
            signature = data.readUInt16LE(offset);
            offset += 2;
            size = data.readUInt16LE(offset);
            offset += 2;
            part = data.slice(offset, offset+size);
            offset += size;
            if(Constants.ID_ZIP64 === signature) {
                parseZip64ExtendedInformation(part);
            }
        }
    }

    //Override header field values with values from the ZIP64 extra field
    function parseZip64ExtendedInformation(data) {
        var size, compressedSize, offset, diskNumStart;

        if(data.length >= Constants.EF_ZIP64_SCOMP) {
            size = readUInt64LE(data, Constants.EF_ZIP64_SUNCOMP);
            if(_entryHeader.size === Constants.EF_ZIP64_OR_32) {
                _entryHeader.size = size;
            }
        }
        if(data.length >= Constants.EF_ZIP64_RHO) {
            compressedSize = readUInt64LE(data, Constants.EF_ZIP64_SCOMP);
            if(_entryHeader.compressedSize === Constants.EF_ZIP64_OR_32) {
                _entryHeader.compressedSize = compressedSize;
            }
        }
        if(data.length >= Constants.EF_ZIP64_DSN) {
            offset = readUInt64LE(data, Constants.EF_ZIP64_RHO);
            if(_entryHeader.offset === Constants.EF_ZIP64_OR_32) {
                _entryHeader.offset = offset;
            }
        }
        if(data.length >= Constants.EF_ZIP64_DSN+4) {
            diskNumStart = data.readUInt32LE(Constants.EF_ZIP64_DSN);
            if(_entryHeader.diskNumStart === Constants.EF_ZIP64_OR_16) {
                _entryHeader.diskNumStart = diskNumStart;
            }
        }
    }


    return {
        get entryName () { return _entryName.toString(); },
        get rawEntryName() { return _entryName; },
        set entryName (val) {
            _entryName = Utils.toBuffer(val);
            var lastChar = _entryName[_entryName.length - 1];
            _isDirectory = (lastChar === 47) || (lastChar === 92);
            _entryHeader.fileNameLength = _entryName.length;
        },

        get extra () { return _extra; },
        set extra (val) {
            _extra = val;
            _entryHeader.extraLength = val.length;
            parseExtra(val);
        },

        get comment () { return _comment.toString(); },
        set comment (val) {
            _comment = Utils.toBuffer(val);
            _entryHeader.commentLength = _comment.length;
        },

        get name () { var n = _entryName.toString(); return _isDirectory ? n.substr(n.length - 1).split("/").pop() : n.split("/").pop(); },
        get isDirectory () { return _isDirectory },

        getCompressedData : function() {
            return compress(false, null)
        },

        getCompressedDataAsync : function(/*Function*/callback) {
            compress(true, callback)
        },

        setData : function(value) {
            uncompressedData = Utils.toBuffer(value);
            if (!_isDirectory && uncompressedData.length) {
                _entryHeader.size = uncompressedData.length;
                _entryHeader.method = Utils.Constants.DEFLATED;
                _entryHeader.crc = Utils.crc32(value);
                _entryHeader.changed = true;
            } else { // folders and blank files should be stored
                _entryHeader.method = Utils.Constants.STORED;
            }
        },

        getData : function(pass) {
            if (_entryHeader.changed) {
				return uncompressedData;
			} else {
				return decompress(false, null, pass);
            }
        },

        getDataAsync : function(/*Function*/callback, pass) {
			if (_entryHeader.changed) {
				callback(uncompressedData)
			} else {
				decompress(true, callback, pass)
            }
        },

        set attr(attr) { _entryHeader.attr = attr; },
        get attr() { return _entryHeader.attr; },

        set header(/*Buffer*/data) {
            _entryHeader.loadFromBinary(data);
        },

        get header() {
            return _entryHeader;
        },

        packHeader : function() {
            var header = _entryHeader.entryHeaderToBinary();
            // add
            _entryName.copy(header, Utils.Constants.CENHDR);
            if (_entryHeader.extraLength) {
                _extra.copy(header, Utils.Constants.CENHDR + _entryName.length)
            }
            if (_entryHeader.commentLength) {
                _comment.copy(header, Utils.Constants.CENHDR + _entryName.length + _entryHeader.extraLength, _comment.length);
            }
            return header;
        },

        toString : function() {
            return '{\n' +
                '\t"entryName" : "' + _entryName.toString() + "\",\n" +
                '\t"name" : "' + (_isDirectory ? _entryName.toString().replace(/\/$/, '').split("/").pop() : _entryName.toString().split("/").pop()) + "\",\n" +
                '\t"comment" : "' + _comment.toString() + "\",\n" +
                '\t"isDirectory" : ' + _isDirectory + ",\n" +
                '\t"header" : ' + _entryHeader.toString().replace(/\t/mg, "\t\t").replace(/}/mg, "\t}")  + ",\n" +
                '\t"compressedData" : <' + (input && input.length  + " bytes buffer" || "null") + ">\n" +
                '\t"data" : <' + (uncompressedData && uncompressedData.length  + " bytes buffer" || "null") + ">\n" +
                '}';
        }
    }
};


/***/ }),

/***/ 7744:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var ZipEntry = __nccwpck_require__(4057),
	Headers = __nccwpck_require__(4958),
	Utils = __nccwpck_require__(5182);

module.exports = function (/*String|Buffer*/input, /*Number*/inputType) {
	var entryList = [],
		entryTable = {},
		_comment = Buffer.alloc(0),
		filename = "",
		fs = Utils.FileSystem.require(),
		inBuffer = null,
		mainHeader = new Headers.MainHeader(),
		loadedEntries = false;

	if (inputType === Utils.Constants.FILE) {
		// is a filename
		filename = input;
		inBuffer = fs.readFileSync(filename);
		readMainHeader();
	} else if (inputType === Utils.Constants.BUFFER) {
		// is a memory buffer
		inBuffer = input;
		readMainHeader();
	} else {
		// none. is a new file
		loadedEntries = true;
	}

	function iterateEntries(callback) {
		const totalEntries = mainHeader.diskEntries; // total number of entries
		let index = mainHeader.offset; // offset of first CEN header

		for (let i = 0; i < totalEntries; i++) {
			let tmp = index;
			const entry = new ZipEntry(inBuffer);

			entry.header = inBuffer.slice(tmp, tmp += Utils.Constants.CENHDR);
			entry.entryName = inBuffer.slice(tmp, tmp += entry.header.fileNameLength);

			index += entry.header.entryHeaderSize;

			callback(entry);
		}
	}

	function readEntries() {
		loadedEntries = true;
		entryTable = {};
		entryList = new Array(mainHeader.diskEntries);  // total number of entries
		var index = mainHeader.offset;  // offset of first CEN header
		for (var i = 0; i < entryList.length; i++) {

			var tmp = index,
				entry = new ZipEntry(inBuffer);
			entry.header = inBuffer.slice(tmp, tmp += Utils.Constants.CENHDR);

			entry.entryName = inBuffer.slice(tmp, tmp += entry.header.fileNameLength);

			if (entry.header.extraLength) {
				entry.extra = inBuffer.slice(tmp, tmp += entry.header.extraLength);
			}

			if (entry.header.commentLength)
				entry.comment = inBuffer.slice(tmp, tmp + entry.header.commentLength);

			index += entry.header.entryHeaderSize;

			entryList[i] = entry;
			entryTable[entry.entryName] = entry;
		}
	}

	function readMainHeader() {
		var i = inBuffer.length - Utils.Constants.ENDHDR, // END header size
			max = Math.max(0, i - 0xFFFF), // 0xFFFF is the max zip file comment length
			n = max,
			endStart = inBuffer.length,
			endOffset = -1, // Start offset of the END header
			commentEnd = 0; 

		for (i; i >= n; i--) {
			if (inBuffer[i] !== 0x50) continue; // quick check that the byte is 'P'
			if (inBuffer.readUInt32LE(i) === Utils.Constants.ENDSIG) { // "PK\005\006"
				endOffset = i;
				commentEnd = i;
				endStart = i + Utils.Constants.ENDHDR;
				// We already found a regular signature, let's look just a bit further to check if there's any zip64 signature
				n = i - Utils.Constants.END64HDR;
				continue;
			}

			if (inBuffer.readUInt32LE(i) === Utils.Constants.END64SIG) {
				// Found a zip64 signature, let's continue reading the whole zip64 record
				n = max;
				continue;
			}

			if (inBuffer.readUInt32LE(i) == Utils.Constants.ZIP64SIG) {
				// Found the zip64 record, let's determine it's size
				endOffset = i;
				endStart = i + Utils.readBigUInt64LE(inBuffer, i + Utils.Constants.ZIP64SIZE) + Utils.Constants.ZIP64LEAD;
				break;
			}
		}

		if (!~endOffset)
			throw Utils.Errors.INVALID_FORMAT;

		mainHeader.loadFromBinary(inBuffer.slice(endOffset, endStart));
		if (mainHeader.commentLength) {
			_comment = inBuffer.slice(commentEnd + Utils.Constants.ENDHDR);
		}
		// readEntries();
	}

	return {
		/**
		 * Returns an array of ZipEntry objects existent in the current opened archive
		 * @return Array
		 */
		get entries() {
			if (!loadedEntries) {
				readEntries();
			}
			return entryList;
		},

		/**
		 * Archive comment
		 * @return {String}
		 */
		get comment() {
			return _comment.toString();
		},
		set comment(val) {
			mainHeader.commentLength = val.length;
			_comment = val;
		},

		getEntryCount: function() {
			if (!loadedEntries) {
				return mainHeader.diskEntries;
			}

			return entryList.length;
		},

		forEach: function(callback) {
			if (!loadedEntries) {
				iterateEntries(callback);
				return;
			}

			entryList.forEach(callback);
		},

		/**
		 * Returns a reference to the entry with the given name or null if entry is inexistent
		 *
		 * @param entryName
		 * @return ZipEntry
		 */
		getEntry: function (/*String*/entryName) {
			if (!loadedEntries) {
				readEntries();
			}
			return entryTable[entryName] || null;
		},

		/**
		 * Adds the given entry to the entry list
		 *
		 * @param entry
		 */
		setEntry: function (/*ZipEntry*/entry) {
			if (!loadedEntries) {
				readEntries();
			}
			entryList.push(entry);
			entryTable[entry.entryName] = entry;
			mainHeader.totalEntries = entryList.length;
		},

		/**
		 * Removes the entry with the given name from the entry list.
		 *
		 * If the entry is a directory, then all nested files and directories will be removed
		 * @param entryName
		 */
		deleteEntry: function (/*String*/entryName) {
			if (!loadedEntries) {
				readEntries();
			}
			var entry = entryTable[entryName];
			if (entry && entry.isDirectory) {
				var _self = this;
				this.getEntryChildren(entry).forEach(function (child) {
					if (child.entryName !== entryName) {
						_self.deleteEntry(child.entryName)
					}
				})
			}
			entryList.splice(entryList.indexOf(entry), 1);
			delete(entryTable[entryName]);
			mainHeader.totalEntries = entryList.length;
		},

		/**
		 *  Iterates and returns all nested files and directories of the given entry
		 *
		 * @param entry
		 * @return Array
		 */
		getEntryChildren: function (/*ZipEntry*/entry) {
			if (!loadedEntries) {
				readEntries();
			}
			if (entry.isDirectory) {
				var list = [],
					name = entry.entryName,
					len = name.length;

				entryList.forEach(function (zipEntry) {
					if (zipEntry.entryName.substr(0, len) === name) {
						list.push(zipEntry);
					}
				});
				return list;
			}
			return []
		},

		/**
		 * Returns the zip file
		 *
		 * @return Buffer
		 */
		compressToBuffer: function () {
			if (!loadedEntries) {
				readEntries();
			}
			if (entryList.length > 1) {
				entryList.sort(function (a, b) {
					var nameA = a.entryName.toLowerCase();
					var nameB = b.entryName.toLowerCase();
					if (nameA < nameB) {
						return -1
					}
					if (nameA > nameB) {
						return 1
					}
					return 0;
				});
			}

			var totalSize = 0,
				dataBlock = [],
				entryHeaders = [],
				dindex = 0;

			mainHeader.size = 0;
			mainHeader.offset = 0;

			entryList.forEach(function (entry) {
				// compress data and set local and entry header accordingly. Reason why is called first
				var compressedData = entry.getCompressedData();
				// data header
				entry.header.offset = dindex;
				var dataHeader = entry.header.dataHeaderToBinary();
				var entryNameLen = entry.rawEntryName.length;
				var extra = entry.extra.toString();
				var postHeader = Buffer.alloc(entryNameLen + extra.length);
				entry.rawEntryName.copy(postHeader, 0);
				postHeader.fill(extra, entryNameLen);

				var dataLength = dataHeader.length + postHeader.length + compressedData.length;

				dindex += dataLength;

				dataBlock.push(dataHeader);
				dataBlock.push(postHeader);
				dataBlock.push(compressedData);

				var entryHeader = entry.packHeader();
				entryHeaders.push(entryHeader);
				mainHeader.size += entryHeader.length;
				totalSize += (dataLength + entryHeader.length);
			});

			totalSize += mainHeader.mainHeaderSize; // also includes zip file comment length
			// point to end of data and beginning of central directory first record
			mainHeader.offset = dindex;

			dindex = 0;
			var outBuffer = Buffer.alloc(totalSize);
			dataBlock.forEach(function (content) {
				content.copy(outBuffer, dindex); // write data blocks
				dindex += content.length;
			});
			entryHeaders.forEach(function (content) {
				content.copy(outBuffer, dindex); // write central directory entries
				dindex += content.length;
			});

			var mh = mainHeader.toBinary();
			if (_comment) {
				_comment.copy(mh, Utils.Constants.ENDHDR); // add zip file comment
			}

			mh.copy(outBuffer, dindex); // write main header

			return outBuffer
		},

		toAsyncBuffer: function (/*Function*/onSuccess, /*Function*/onFail, /*Function*/onItemStart, /*Function*/onItemEnd) {
			if (!loadedEntries) {
				readEntries();
			}
			if (entryList.length > 1) {
				entryList.sort(function (a, b) {
					var nameA = a.entryName.toLowerCase();
					var nameB = b.entryName.toLowerCase();
					if (nameA > nameB) {
						return -1
					}
					if (nameA < nameB) {
						return 1
					}
					return 0;
				});
			}

			var totalSize = 0,
				dataBlock = [],
				entryHeaders = [],
				dindex = 0;

			mainHeader.size = 0;
			mainHeader.offset = 0;

			var compress = function (entryList) {
				var self = arguments.callee;
				if (entryList.length) {
					var entry = entryList.pop();
					var name = entry.entryName + entry.extra.toString();
					if (onItemStart) onItemStart(name);
					entry.getCompressedDataAsync(function (compressedData) {
						if (onItemEnd) onItemEnd(name);

						entry.header.offset = dindex;
						// data header
						var dataHeader = entry.header.dataHeaderToBinary();
						var postHeader;
						try {
							postHeader = Buffer.alloc(name.length, name);  // using alloc will work on node  5.x+
						} catch(e){
							postHeader = new Buffer(name); // use deprecated method if alloc fails...
						}
						var dataLength = dataHeader.length + postHeader.length + compressedData.length;

						dindex += dataLength;

						dataBlock.push(dataHeader);
						dataBlock.push(postHeader);
						dataBlock.push(compressedData);

						var entryHeader = entry.packHeader();
						entryHeaders.push(entryHeader);
						mainHeader.size += entryHeader.length;
						totalSize += (dataLength + entryHeader.length);

						if (entryList.length) {
							self(entryList);
						} else {


							totalSize += mainHeader.mainHeaderSize; // also includes zip file comment length
							// point to end of data and beginning of central directory first record
							mainHeader.offset = dindex;

							dindex = 0;
							var outBuffer = Buffer.alloc(totalSize);
							dataBlock.forEach(function (content) {
								content.copy(outBuffer, dindex); // write data blocks
								dindex += content.length;
							});
							entryHeaders.forEach(function (content) {
								content.copy(outBuffer, dindex); // write central directory entries
								dindex += content.length;
							});

							var mh = mainHeader.toBinary();
							if (_comment) {
								_comment.copy(mh, Utils.Constants.ENDHDR); // add zip file comment
							}

							mh.copy(outBuffer, dindex); // write main header

							onSuccess(outBuffer);
						}
					});
				}
			};

			compress(entryList);
		}
	}
};


/***/ }),

/***/ 9417:
/***/ ((module) => {

"use strict";

module.exports = balanced;
function balanced(a, b, str) {
  if (a instanceof RegExp) a = maybeMatch(a, str);
  if (b instanceof RegExp) b = maybeMatch(b, str);

  var r = range(a, b, str);

  return r && {
    start: r[0],
    end: r[1],
    pre: str.slice(0, r[0]),
    body: str.slice(r[0] + a.length, r[1]),
    post: str.slice(r[1] + b.length)
  };
}

function maybeMatch(reg, str) {
  var m = str.match(reg);
  return m ? m[0] : null;
}

balanced.range = range;
function range(a, b, str) {
  var begs, beg, left, right, result;
  var ai = str.indexOf(a);
  var bi = str.indexOf(b, ai + 1);
  var i = ai;

  if (ai >= 0 && bi > 0) {
    begs = [];
    left = str.length;

    while (i >= 0 && !result) {
      if (i == ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length == 1) {
        result = [ begs.pop(), bi ];
      } else {
        beg = begs.pop();
        if (beg < left) {
          left = beg;
          right = bi;
        }

        bi = str.indexOf(b, i + 1);
      }

      i = ai < bi && ai >= 0 ? ai : bi;
    }

    if (begs.length) {
      result = [ left, right ];
    }
  }

  return result;
}


/***/ }),

/***/ 3717:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var concatMap = __nccwpck_require__(6891);
var balanced = __nccwpck_require__(9417);

module.exports = expandTop;

var escSlash = '\0SLASH'+Math.random()+'\0';
var escOpen = '\0OPEN'+Math.random()+'\0';
var escClose = '\0CLOSE'+Math.random()+'\0';
var escComma = '\0COMMA'+Math.random()+'\0';
var escPeriod = '\0PERIOD'+Math.random()+'\0';

function numeric(str) {
  return parseInt(str, 10) == str
    ? parseInt(str, 10)
    : str.charCodeAt(0);
}

function escapeBraces(str) {
  return str.split('\\\\').join(escSlash)
            .split('\\{').join(escOpen)
            .split('\\}').join(escClose)
            .split('\\,').join(escComma)
            .split('\\.').join(escPeriod);
}

function unescapeBraces(str) {
  return str.split(escSlash).join('\\')
            .split(escOpen).join('{')
            .split(escClose).join('}')
            .split(escComma).join(',')
            .split(escPeriod).join('.');
}


// Basically just str.split(","), but handling cases
// where we have nested braced sections, which should be
// treated as individual members, like {a,{b,c},d}
function parseCommaParts(str) {
  if (!str)
    return [''];

  var parts = [];
  var m = balanced('{', '}', str);

  if (!m)
    return str.split(',');

  var pre = m.pre;
  var body = m.body;
  var post = m.post;
  var p = pre.split(',');

  p[p.length-1] += '{' + body + '}';
  var postParts = parseCommaParts(post);
  if (post.length) {
    p[p.length-1] += postParts.shift();
    p.push.apply(p, postParts);
  }

  parts.push.apply(parts, p);

  return parts;
}

function expandTop(str) {
  if (!str)
    return [];

  // I don't know why Bash 4.3 does this, but it does.
  // Anything starting with {} will have the first two bytes preserved
  // but *only* at the top level, so {},a}b will not expand to anything,
  // but a{},b}c will be expanded to [a}c,abc].
  // One could argue that this is a bug in Bash, but since the goal of
  // this module is to match Bash's rules, we escape a leading {}
  if (str.substr(0, 2) === '{}') {
    str = '\\{\\}' + str.substr(2);
  }

  return expand(escapeBraces(str), true).map(unescapeBraces);
}

function identity(e) {
  return e;
}

function embrace(str) {
  return '{' + str + '}';
}
function isPadded(el) {
  return /^-?0\d/.test(el);
}

function lte(i, y) {
  return i <= y;
}
function gte(i, y) {
  return i >= y;
}

function expand(str, isTop) {
  var expansions = [];

  var m = balanced('{', '}', str);
  if (!m || /\$$/.test(m.pre)) return [str];

  var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
  var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
  var isSequence = isNumericSequence || isAlphaSequence;
  var isOptions = m.body.indexOf(',') >= 0;
  if (!isSequence && !isOptions) {
    // {a},b}
    if (m.post.match(/,.*\}/)) {
      str = m.pre + '{' + m.body + escClose + m.post;
      return expand(str);
    }
    return [str];
  }

  var n;
  if (isSequence) {
    n = m.body.split(/\.\./);
  } else {
    n = parseCommaParts(m.body);
    if (n.length === 1) {
      // x{{a,b}}y ==> x{a}y x{b}y
      n = expand(n[0], false).map(embrace);
      if (n.length === 1) {
        var post = m.post.length
          ? expand(m.post, false)
          : [''];
        return post.map(function(p) {
          return m.pre + n[0] + p;
        });
      }
    }
  }

  // at this point, n is the parts, and we know it's not a comma set
  // with a single entry.

  // no need to expand pre, since it is guaranteed to be free of brace-sets
  var pre = m.pre;
  var post = m.post.length
    ? expand(m.post, false)
    : [''];

  var N;

  if (isSequence) {
    var x = numeric(n[0]);
    var y = numeric(n[1]);
    var width = Math.max(n[0].length, n[1].length)
    var incr = n.length == 3
      ? Math.abs(numeric(n[2]))
      : 1;
    var test = lte;
    var reverse = y < x;
    if (reverse) {
      incr *= -1;
      test = gte;
    }
    var pad = n.some(isPadded);

    N = [];

    for (var i = x; test(i, y); i += incr) {
      var c;
      if (isAlphaSequence) {
        c = String.fromCharCode(i);
        if (c === '\\')
          c = '';
      } else {
        c = String(i);
        if (pad) {
          var need = width - c.length;
          if (need > 0) {
            var z = new Array(need + 1).join('0');
            if (i < 0)
              c = '-' + z + c.slice(1);
            else
              c = z + c;
          }
        }
      }
      N.push(c);
    }
  } else {
    N = concatMap(n, function(el) { return expand(el, false) });
  }

  for (var j = 0; j < N.length; j++) {
    for (var k = 0; k < post.length; k++) {
      var expansion = pre + N[j] + post[k];
      if (!isTop || isSequence || expansion)
        expansions.push(expansion);
    }
  }

  return expansions;
}



/***/ }),

/***/ 6891:
/***/ ((module) => {

module.exports = function (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        var x = fn(xs[i], i);
        if (isArray(x)) res.push.apply(res, x);
        else res.push(x);
    }
    return res;
};

var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),

/***/ 3973:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = minimatch
minimatch.Minimatch = Minimatch

var path = { sep: '/' }
try {
  path = __nccwpck_require__(1017)
} catch (er) {}

var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {}
var expand = __nccwpck_require__(3717)

var plTypes = {
  '!': { open: '(?:(?!(?:', close: '))[^/]*?)'},
  '?': { open: '(?:', close: ')?' },
  '+': { open: '(?:', close: ')+' },
  '*': { open: '(?:', close: ')*' },
  '@': { open: '(?:', close: ')' }
}

// any single thing other than /
// don't need to escape / when using new RegExp()
var qmark = '[^/]'

// * => any number of characters
var star = qmark + '*?'

// ** when dots are allowed.  Anything goes, except .. and .
// not (^ or / followed by one or two dots followed by $ or /),
// followed by anything, any number of times.
var twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?'

// not a ^ or / followed by a dot,
// followed by anything, any number of times.
var twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?'

// characters that need to be escaped in RegExp.
var reSpecials = charSet('().*{}+?[]^$\\!')

// "abc" -> { a:true, b:true, c:true }
function charSet (s) {
  return s.split('').reduce(function (set, c) {
    set[c] = true
    return set
  }, {})
}

// normalizes slashes.
var slashSplit = /\/+/

minimatch.filter = filter
function filter (pattern, options) {
  options = options || {}
  return function (p, i, list) {
    return minimatch(p, pattern, options)
  }
}

function ext (a, b) {
  a = a || {}
  b = b || {}
  var t = {}
  Object.keys(b).forEach(function (k) {
    t[k] = b[k]
  })
  Object.keys(a).forEach(function (k) {
    t[k] = a[k]
  })
  return t
}

minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return minimatch

  var orig = minimatch

  var m = function minimatch (p, pattern, options) {
    return orig.minimatch(p, pattern, ext(def, options))
  }

  m.Minimatch = function Minimatch (pattern, options) {
    return new orig.Minimatch(pattern, ext(def, options))
  }

  return m
}

Minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return Minimatch
  return minimatch.defaults(def).Minimatch
}

function minimatch (p, pattern, options) {
  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required')
  }

  if (!options) options = {}

  // shortcut: comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    return false
  }

  // "" only matches ""
  if (pattern.trim() === '') return p === ''

  return new Minimatch(pattern, options).match(p)
}

function Minimatch (pattern, options) {
  if (!(this instanceof Minimatch)) {
    return new Minimatch(pattern, options)
  }

  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required')
  }

  if (!options) options = {}
  pattern = pattern.trim()

  // windows support: need to use /, not \
  if (path.sep !== '/') {
    pattern = pattern.split(path.sep).join('/')
  }

  this.options = options
  this.set = []
  this.pattern = pattern
  this.regexp = null
  this.negate = false
  this.comment = false
  this.empty = false

  // make the set of regexps etc.
  this.make()
}

Minimatch.prototype.debug = function () {}

Minimatch.prototype.make = make
function make () {
  // don't do it more than once.
  if (this._made) return

  var pattern = this.pattern
  var options = this.options

  // empty patterns and comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    this.comment = true
    return
  }
  if (!pattern) {
    this.empty = true
    return
  }

  // step 1: figure out negation, etc.
  this.parseNegate()

  // step 2: expand braces
  var set = this.globSet = this.braceExpand()

  if (options.debug) this.debug = console.error

  this.debug(this.pattern, set)

  // step 3: now we have a set, so turn each one into a series of path-portion
  // matching patterns.
  // These will be regexps, except in the case of "**", which is
  // set to the GLOBSTAR object for globstar behavior,
  // and will not contain any / characters
  set = this.globParts = set.map(function (s) {
    return s.split(slashSplit)
  })

  this.debug(this.pattern, set)

  // glob --> regexps
  set = set.map(function (s, si, set) {
    return s.map(this.parse, this)
  }, this)

  this.debug(this.pattern, set)

  // filter out everything that didn't compile properly.
  set = set.filter(function (s) {
    return s.indexOf(false) === -1
  })

  this.debug(this.pattern, set)

  this.set = set
}

Minimatch.prototype.parseNegate = parseNegate
function parseNegate () {
  var pattern = this.pattern
  var negate = false
  var options = this.options
  var negateOffset = 0

  if (options.nonegate) return

  for (var i = 0, l = pattern.length
    ; i < l && pattern.charAt(i) === '!'
    ; i++) {
    negate = !negate
    negateOffset++
  }

  if (negateOffset) this.pattern = pattern.substr(negateOffset)
  this.negate = negate
}

// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
minimatch.braceExpand = function (pattern, options) {
  return braceExpand(pattern, options)
}

Minimatch.prototype.braceExpand = braceExpand

function braceExpand (pattern, options) {
  if (!options) {
    if (this instanceof Minimatch) {
      options = this.options
    } else {
      options = {}
    }
  }

  pattern = typeof pattern === 'undefined'
    ? this.pattern : pattern

  if (typeof pattern === 'undefined') {
    throw new TypeError('undefined pattern')
  }

  if (options.nobrace ||
    !pattern.match(/\{.*\}/)) {
    // shortcut. no need to expand.
    return [pattern]
  }

  return expand(pattern)
}

// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
Minimatch.prototype.parse = parse
var SUBPARSE = {}
function parse (pattern, isSub) {
  if (pattern.length > 1024 * 64) {
    throw new TypeError('pattern is too long')
  }

  var options = this.options

  // shortcuts
  if (!options.noglobstar && pattern === '**') return GLOBSTAR
  if (pattern === '') return ''

  var re = ''
  var hasMagic = !!options.nocase
  var escaping = false
  // ? => one single character
  var patternListStack = []
  var negativeLists = []
  var stateChar
  var inClass = false
  var reClassStart = -1
  var classStart = -1
  // . and .. never match anything that doesn't start with .,
  // even when options.dot is set.
  var patternStart = pattern.charAt(0) === '.' ? '' // anything
  // not (start or / followed by . or .. followed by / or end)
  : options.dot ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))'
  : '(?!\\.)'
  var self = this

  function clearStateChar () {
    if (stateChar) {
      // we had some state-tracking character
      // that wasn't consumed by this pass.
      switch (stateChar) {
        case '*':
          re += star
          hasMagic = true
        break
        case '?':
          re += qmark
          hasMagic = true
        break
        default:
          re += '\\' + stateChar
        break
      }
      self.debug('clearStateChar %j %j', stateChar, re)
      stateChar = false
    }
  }

  for (var i = 0, len = pattern.length, c
    ; (i < len) && (c = pattern.charAt(i))
    ; i++) {
    this.debug('%s\t%s %s %j', pattern, i, re, c)

    // skip over any that are escaped.
    if (escaping && reSpecials[c]) {
      re += '\\' + c
      escaping = false
      continue
    }

    switch (c) {
      case '/':
        // completely not allowed, even escaped.
        // Should already be path-split by now.
        return false

      case '\\':
        clearStateChar()
        escaping = true
      continue

      // the various stateChar values
      // for the "extglob" stuff.
      case '?':
      case '*':
      case '+':
      case '@':
      case '!':
        this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c)

        // all of those are literals inside a class, except that
        // the glob [!a] means [^a] in regexp
        if (inClass) {
          this.debug('  in class')
          if (c === '!' && i === classStart + 1) c = '^'
          re += c
          continue
        }

        // if we already have a stateChar, then it means
        // that there was something like ** or +? in there.
        // Handle the stateChar, then proceed with this one.
        self.debug('call clearStateChar %j', stateChar)
        clearStateChar()
        stateChar = c
        // if extglob is disabled, then +(asdf|foo) isn't a thing.
        // just clear the statechar *now*, rather than even diving into
        // the patternList stuff.
        if (options.noext) clearStateChar()
      continue

      case '(':
        if (inClass) {
          re += '('
          continue
        }

        if (!stateChar) {
          re += '\\('
          continue
        }

        patternListStack.push({
          type: stateChar,
          start: i - 1,
          reStart: re.length,
          open: plTypes[stateChar].open,
          close: plTypes[stateChar].close
        })
        // negation is (?:(?!js)[^/]*)
        re += stateChar === '!' ? '(?:(?!(?:' : '(?:'
        this.debug('plType %j %j', stateChar, re)
        stateChar = false
      continue

      case ')':
        if (inClass || !patternListStack.length) {
          re += '\\)'
          continue
        }

        clearStateChar()
        hasMagic = true
        var pl = patternListStack.pop()
        // negation is (?:(?!js)[^/]*)
        // The others are (?:<pattern>)<type>
        re += pl.close
        if (pl.type === '!') {
          negativeLists.push(pl)
        }
        pl.reEnd = re.length
      continue

      case '|':
        if (inClass || !patternListStack.length || escaping) {
          re += '\\|'
          escaping = false
          continue
        }

        clearStateChar()
        re += '|'
      continue

      // these are mostly the same in regexp and glob
      case '[':
        // swallow any state-tracking char before the [
        clearStateChar()

        if (inClass) {
          re += '\\' + c
          continue
        }

        inClass = true
        classStart = i
        reClassStart = re.length
        re += c
      continue

      case ']':
        //  a right bracket shall lose its special
        //  meaning and represent itself in
        //  a bracket expression if it occurs
        //  first in the list.  -- POSIX.2 2.8.3.2
        if (i === classStart + 1 || !inClass) {
          re += '\\' + c
          escaping = false
          continue
        }

        // handle the case where we left a class open.
        // "[z-a]" is valid, equivalent to "\[z-a\]"
        if (inClass) {
          // split where the last [ was, make sure we don't have
          // an invalid re. if so, re-walk the contents of the
          // would-be class to re-translate any characters that
          // were passed through as-is
          // TODO: It would probably be faster to determine this
          // without a try/catch and a new RegExp, but it's tricky
          // to do safely.  For now, this is safe and works.
          var cs = pattern.substring(classStart + 1, i)
          try {
            RegExp('[' + cs + ']')
          } catch (er) {
            // not a valid class!
            var sp = this.parse(cs, SUBPARSE)
            re = re.substr(0, reClassStart) + '\\[' + sp[0] + '\\]'
            hasMagic = hasMagic || sp[1]
            inClass = false
            continue
          }
        }

        // finish up the class.
        hasMagic = true
        inClass = false
        re += c
      continue

      default:
        // swallow any state char that wasn't consumed
        clearStateChar()

        if (escaping) {
          // no need
          escaping = false
        } else if (reSpecials[c]
          && !(c === '^' && inClass)) {
          re += '\\'
        }

        re += c

    } // switch
  } // for

  // handle the case where we left a class open.
  // "[abc" is valid, equivalent to "\[abc"
  if (inClass) {
    // split where the last [ was, and escape it
    // this is a huge pita.  We now have to re-walk
    // the contents of the would-be class to re-translate
    // any characters that were passed through as-is
    cs = pattern.substr(classStart + 1)
    sp = this.parse(cs, SUBPARSE)
    re = re.substr(0, reClassStart) + '\\[' + sp[0]
    hasMagic = hasMagic || sp[1]
  }

  // handle the case where we had a +( thing at the *end*
  // of the pattern.
  // each pattern list stack adds 3 chars, and we need to go through
  // and escape any | chars that were passed through as-is for the regexp.
  // Go through and escape them, taking care not to double-escape any
  // | chars that were already escaped.
  for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
    var tail = re.slice(pl.reStart + pl.open.length)
    this.debug('setting tail', re, pl)
    // maybe some even number of \, then maybe 1 \, followed by a |
    tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (_, $1, $2) {
      if (!$2) {
        // the | isn't already escaped, so escape it.
        $2 = '\\'
      }

      // need to escape all those slashes *again*, without escaping the
      // one that we need for escaping the | character.  As it works out,
      // escaping an even number of slashes can be done by simply repeating
      // it exactly after itself.  That's why this trick works.
      //
      // I am sorry that you have to see this.
      return $1 + $1 + $2 + '|'
    })

    this.debug('tail=%j\n   %s', tail, tail, pl, re)
    var t = pl.type === '*' ? star
      : pl.type === '?' ? qmark
      : '\\' + pl.type

    hasMagic = true
    re = re.slice(0, pl.reStart) + t + '\\(' + tail
  }

  // handle trailing things that only matter at the very end.
  clearStateChar()
  if (escaping) {
    // trailing \\
    re += '\\\\'
  }

  // only need to apply the nodot start if the re starts with
  // something that could conceivably capture a dot
  var addPatternStart = false
  switch (re.charAt(0)) {
    case '.':
    case '[':
    case '(': addPatternStart = true
  }

  // Hack to work around lack of negative lookbehind in JS
  // A pattern like: *.!(x).!(y|z) needs to ensure that a name
  // like 'a.xyz.yz' doesn't match.  So, the first negative
  // lookahead, has to look ALL the way ahead, to the end of
  // the pattern.
  for (var n = negativeLists.length - 1; n > -1; n--) {
    var nl = negativeLists[n]

    var nlBefore = re.slice(0, nl.reStart)
    var nlFirst = re.slice(nl.reStart, nl.reEnd - 8)
    var nlLast = re.slice(nl.reEnd - 8, nl.reEnd)
    var nlAfter = re.slice(nl.reEnd)

    nlLast += nlAfter

    // Handle nested stuff like *(*.js|!(*.json)), where open parens
    // mean that we should *not* include the ) in the bit that is considered
    // "after" the negated section.
    var openParensBefore = nlBefore.split('(').length - 1
    var cleanAfter = nlAfter
    for (i = 0; i < openParensBefore; i++) {
      cleanAfter = cleanAfter.replace(/\)[+*?]?/, '')
    }
    nlAfter = cleanAfter

    var dollar = ''
    if (nlAfter === '' && isSub !== SUBPARSE) {
      dollar = '$'
    }
    var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast
    re = newRe
  }

  // if the re is not "" at this point, then we need to make sure
  // it doesn't match against an empty path part.
  // Otherwise a/* will match a/, which it should not.
  if (re !== '' && hasMagic) {
    re = '(?=.)' + re
  }

  if (addPatternStart) {
    re = patternStart + re
  }

  // parsing just a piece of a larger pattern.
  if (isSub === SUBPARSE) {
    return [re, hasMagic]
  }

  // skip the regexp for non-magical patterns
  // unescape anything in it, though, so that it'll be
  // an exact match against a file etc.
  if (!hasMagic) {
    return globUnescape(pattern)
  }

  var flags = options.nocase ? 'i' : ''
  try {
    var regExp = new RegExp('^' + re + '$', flags)
  } catch (er) {
    // If it was an invalid regular expression, then it can't match
    // anything.  This trick looks for a character after the end of
    // the string, which is of course impossible, except in multi-line
    // mode, but it's not a /m regex.
    return new RegExp('$.')
  }

  regExp._glob = pattern
  regExp._src = re

  return regExp
}

minimatch.makeRe = function (pattern, options) {
  return new Minimatch(pattern, options || {}).makeRe()
}

Minimatch.prototype.makeRe = makeRe
function makeRe () {
  if (this.regexp || this.regexp === false) return this.regexp

  // at this point, this.set is a 2d array of partial
  // pattern strings, or "**".
  //
  // It's better to use .match().  This function shouldn't
  // be used, really, but it's pretty convenient sometimes,
  // when you just want to work with a regex.
  var set = this.set

  if (!set.length) {
    this.regexp = false
    return this.regexp
  }
  var options = this.options

  var twoStar = options.noglobstar ? star
    : options.dot ? twoStarDot
    : twoStarNoDot
  var flags = options.nocase ? 'i' : ''

  var re = set.map(function (pattern) {
    return pattern.map(function (p) {
      return (p === GLOBSTAR) ? twoStar
      : (typeof p === 'string') ? regExpEscape(p)
      : p._src
    }).join('\\\/')
  }).join('|')

  // must match entire pattern
  // ending in a * or ** will make it less strict.
  re = '^(?:' + re + ')$'

  // can match anything, as long as it's not this.
  if (this.negate) re = '^(?!' + re + ').*$'

  try {
    this.regexp = new RegExp(re, flags)
  } catch (ex) {
    this.regexp = false
  }
  return this.regexp
}

minimatch.match = function (list, pattern, options) {
  options = options || {}
  var mm = new Minimatch(pattern, options)
  list = list.filter(function (f) {
    return mm.match(f)
  })
  if (mm.options.nonull && !list.length) {
    list.push(pattern)
  }
  return list
}

Minimatch.prototype.match = match
function match (f, partial) {
  this.debug('match', f, this.pattern)
  // short-circuit in the case of busted things.
  // comments, etc.
  if (this.comment) return false
  if (this.empty) return f === ''

  if (f === '/' && partial) return true

  var options = this.options

  // windows: need to use /, not \
  if (path.sep !== '/') {
    f = f.split(path.sep).join('/')
  }

  // treat the test path as a set of pathparts.
  f = f.split(slashSplit)
  this.debug(this.pattern, 'split', f)

  // just ONE of the pattern sets in this.set needs to match
  // in order for it to be valid.  If negating, then just one
  // match means that we have failed.
  // Either way, return on the first hit.

  var set = this.set
  this.debug(this.pattern, 'set', set)

  // Find the basename of the path by looking for the last non-empty segment
  var filename
  var i
  for (i = f.length - 1; i >= 0; i--) {
    filename = f[i]
    if (filename) break
  }

  for (i = 0; i < set.length; i++) {
    var pattern = set[i]
    var file = f
    if (options.matchBase && pattern.length === 1) {
      file = [filename]
    }
    var hit = this.matchOne(file, pattern, partial)
    if (hit) {
      if (options.flipNegate) return true
      return !this.negate
    }
  }

  // didn't get any hits.  this is success if it's a negative
  // pattern, failure otherwise.
  if (options.flipNegate) return false
  return this.negate
}

// set partial to true to test if, for example,
// "/a/b" matches the start of "/*/b/*/d"
// Partial means, if you run out of file before you run
// out of pattern, then that's fine, as long as all
// the parts match.
Minimatch.prototype.matchOne = function (file, pattern, partial) {
  var options = this.options

  this.debug('matchOne',
    { 'this': this, file: file, pattern: pattern })

  this.debug('matchOne', file.length, pattern.length)

  for (var fi = 0,
      pi = 0,
      fl = file.length,
      pl = pattern.length
      ; (fi < fl) && (pi < pl)
      ; fi++, pi++) {
    this.debug('matchOne loop')
    var p = pattern[pi]
    var f = file[fi]

    this.debug(pattern, p, f)

    // should be impossible.
    // some invalid regexp stuff in the set.
    if (p === false) return false

    if (p === GLOBSTAR) {
      this.debug('GLOBSTAR', [pattern, p, f])

      // "**"
      // a/**/b/**/c would match the following:
      // a/b/x/y/z/c
      // a/x/y/z/b/c
      // a/b/x/b/x/c
      // a/b/c
      // To do this, take the rest of the pattern after
      // the **, and see if it would match the file remainder.
      // If so, return success.
      // If not, the ** "swallows" a segment, and try again.
      // This is recursively awful.
      //
      // a/**/b/**/c matching a/b/x/y/z/c
      // - a matches a
      // - doublestar
      //   - matchOne(b/x/y/z/c, b/**/c)
      //     - b matches b
      //     - doublestar
      //       - matchOne(x/y/z/c, c) -> no
      //       - matchOne(y/z/c, c) -> no
      //       - matchOne(z/c, c) -> no
      //       - matchOne(c, c) yes, hit
      var fr = fi
      var pr = pi + 1
      if (pr === pl) {
        this.debug('** at the end')
        // a ** at the end will just swallow the rest.
        // We have found a match.
        // however, it will not swallow /.x, unless
        // options.dot is set.
        // . and .. are *never* matched by **, for explosively
        // exponential reasons.
        for (; fi < fl; fi++) {
          if (file[fi] === '.' || file[fi] === '..' ||
            (!options.dot && file[fi].charAt(0) === '.')) return false
        }
        return true
      }

      // ok, let's see if we can swallow whatever we can.
      while (fr < fl) {
        var swallowee = file[fr]

        this.debug('\nglobstar while', file, fr, pattern, pr, swallowee)

        // XXX remove this slice.  Just pass the start index.
        if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
          this.debug('globstar found match!', fr, fl, swallowee)
          // found a match.
          return true
        } else {
          // can't swallow "." or ".." ever.
          // can only swallow ".foo" when explicitly asked.
          if (swallowee === '.' || swallowee === '..' ||
            (!options.dot && swallowee.charAt(0) === '.')) {
            this.debug('dot detected!', file, fr, pattern, pr)
            break
          }

          // ** swallows a segment, and continue.
          this.debug('globstar swallow a segment, and continue')
          fr++
        }
      }

      // no match was found.
      // However, in partial mode, we can't say this is necessarily over.
      // If there's more *pattern* left, then
      if (partial) {
        // ran out of file
        this.debug('\n>>> no match, partial?', file, fr, pattern, pr)
        if (fr === fl) return true
      }
      return false
    }

    // something other than **
    // non-magic patterns just have to match exactly
    // patterns with magic have been turned into regexps.
    var hit
    if (typeof p === 'string') {
      if (options.nocase) {
        hit = f.toLowerCase() === p.toLowerCase()
      } else {
        hit = f === p
      }
      this.debug('string match', p, f, hit)
    } else {
      hit = f.match(p)
      this.debug('pattern match', p, f, hit)
    }

    if (!hit) return false
  }

  // Note: ending in / means that we'll get a final ""
  // at the end of the pattern.  This can only match a
  // corresponding "" at the end of the file.
  // If the file ends in /, then it can only match a
  // a pattern that ends in /, unless the pattern just
  // doesn't have any more for it. But, a/b/ should *not*
  // match "a/b/*", even though "" matches against the
  // [^/]*? pattern, except in partial mode, where it might
  // simply not be reached yet.
  // However, a/b/ should still satisfy a/*

  // now either we fell off the end of the pattern, or we're done.
  if (fi === fl && pi === pl) {
    // ran out of pattern and filename at the same time.
    // an exact hit!
    return true
  } else if (fi === fl) {
    // ran out of file, but still had pattern left.
    // this is ok if we're doing the match as part of
    // a glob fs traversal.
    return partial
  } else if (pi === pl) {
    // ran out of pattern, still have file left.
    // this is only acceptable if we're on the very last
    // empty segment of a file with a trailing slash.
    // a/* should match a/b/
    var emptyFileEnd = (fi === fl - 1) && (file[fi] === '')
    return emptyFileEnd
  }

  // should be unreachable.
  throw new Error('wtf?')
}

// replace stuff like \* with *
function globUnescape (s) {
  return s.replace(/\\(.)/g, '$1')
}

function regExpEscape (s) {
  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}


/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(1808);
var tls = __nccwpck_require__(4404);
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var events = __nccwpck_require__(2361);
var assert = __nccwpck_require__(9491);
var util = __nccwpck_require__(3837);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 5840:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "v1", ({
  enumerable: true,
  get: function () {
    return _v.default;
  }
}));
Object.defineProperty(exports, "v3", ({
  enumerable: true,
  get: function () {
    return _v2.default;
  }
}));
Object.defineProperty(exports, "v4", ({
  enumerable: true,
  get: function () {
    return _v3.default;
  }
}));
Object.defineProperty(exports, "v5", ({
  enumerable: true,
  get: function () {
    return _v4.default;
  }
}));
Object.defineProperty(exports, "NIL", ({
  enumerable: true,
  get: function () {
    return _nil.default;
  }
}));
Object.defineProperty(exports, "version", ({
  enumerable: true,
  get: function () {
    return _version.default;
  }
}));
Object.defineProperty(exports, "validate", ({
  enumerable: true,
  get: function () {
    return _validate.default;
  }
}));
Object.defineProperty(exports, "stringify", ({
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
}));
Object.defineProperty(exports, "parse", ({
  enumerable: true,
  get: function () {
    return _parse.default;
  }
}));

var _v = _interopRequireDefault(__nccwpck_require__(8628));

var _v2 = _interopRequireDefault(__nccwpck_require__(6409));

var _v3 = _interopRequireDefault(__nccwpck_require__(5122));

var _v4 = _interopRequireDefault(__nccwpck_require__(9120));

var _nil = _interopRequireDefault(__nccwpck_require__(5332));

var _version = _interopRequireDefault(__nccwpck_require__(1595));

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ 4569:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('md5').update(bytes).digest();
}

var _default = md5;
exports["default"] = _default;

/***/ }),

/***/ 5332:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports["default"] = _default;

/***/ }),

/***/ 2746:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports["default"] = _default;

/***/ }),

/***/ 814:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports["default"] = _default;

/***/ }),

/***/ 807:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = rng;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;

function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    _crypto.default.randomFillSync(rnds8Pool);

    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/***/ }),

/***/ 5274:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('sha1').update(bytes).digest();
}

var _default = sha1;
exports["default"] = _default;

/***/ }),

/***/ 8950:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports["default"] = _default;

/***/ }),

/***/ 8628:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.default)(b);
}

var _default = v1;
exports["default"] = _default;

/***/ }),

/***/ 6409:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _md = _interopRequireDefault(__nccwpck_require__(4569));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports["default"] = _default;

/***/ }),

/***/ 5998:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = _default;
exports.URL = exports.DNS = void 0;

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ 5122:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default = v4;
exports["default"] = _default;

/***/ }),

/***/ 9120:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _sha = _interopRequireDefault(__nccwpck_require__(5274));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports["default"] = _default;

/***/ }),

/***/ 6900:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _regex = _interopRequireDefault(__nccwpck_require__(814));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports["default"] = _default;

/***/ }),

/***/ 1595:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var _default = version;
exports["default"] = _default;

/***/ }),

/***/ 6144:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core = __importStar(__nccwpck_require__(2186));
const core_1 = __nccwpck_require__(2186);
const glob = __importStar(__nccwpck_require__(8090));
const adm_zip_1 = __importDefault(__nccwpck_require__(6761));
const fs_1 = __importDefault(__nccwpck_require__(7147));
const path_1 = __importDefault(__nccwpck_require__(1017));
const search_1 = __nccwpck_require__(3930);
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const zip = new adm_zip_1.default();
        const dest = core.getInput("dest");
        const input = core.getInput("files");
        console.log({
            env: process.env,
            dest,
            input,
        });
        const patterns = input.split(" ");
        const globber = yield glob.create(patterns.join("\n"));
        const files = yield globber.glob();
        if (files.length === 0) {
            console.log("No files found");
            return;
        }
        const lca = (0, search_1.getMultiPathLCA)(files);
        (0, core_1.debug)(`[lca] ${lca}`);
        files.forEach((file) => {
            const fileStat = fs_1.default.lstatSync(file);
            const relative = path_1.default.relative(lca, file);
            (0, core_1.debug)(`[rel] ${relative}`);
            if (!fileStat.isDirectory()) {
                const dirname = path_1.default.normalize(path_1.default.dirname(relative));
                if (dirname === ".") {
                    zip.addLocalFile(file);
                }
                else {
                    zip.addLocalFile(file, dirname);
                }
                console.log(`[+] ${file} with dirname ${dirname} to zip`);
            }
        });
        const destPath = path_1.default.join(process.env.GITHUB_WORKSPACE, dest);
        zip.writeZip(destPath);
        console.log(`\nZipped file ${dest} successfully`);
    });
}
run();


/***/ }),

/***/ 3930:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getMultiPathLCA = void 0;
const path = __importStar(__nccwpck_require__(1017));
/**
 * If multiple paths are specific, the least common ancestor (LCA) of the search paths is used as
 * the delimiter to control the directory structure for the artifact. This function returns the LCA
 * when given an array of search paths
 *
 * Example 1: The patterns `/foo/` and `/bar/` returns `/`
 *
 * Example 2: The patterns `~/foo/bar/*` and `~/foo/voo/two/*` and `~/foo/mo/` returns `~/foo`
 */
function getMultiPathLCA(searchPaths) {
    if (searchPaths.length < 2) {
        throw new Error("At least two search paths must be provided");
    }
    const commonPaths = new Array();
    const splitPaths = new Array();
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
    function isPathTheSame() {
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
exports.getMultiPathLCA = getMultiPathLCA;


/***/ }),

/***/ 2941:
/***/ ((module) => {

module.exports = eval("require")("original-fs");


/***/ }),

/***/ 9491:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 6113:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 2361:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 7147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 3685:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 5687:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 1808:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 2037:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 1017:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 2781:
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ 4404:
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ 3837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ 9796:
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(6144);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;