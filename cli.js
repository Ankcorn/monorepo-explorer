const { program } = require("commander");
const version = require("./package.json").version;
const { listSizes, showAllDependencies } = require("./index.js");

function commaSeparatedList(value) {
  return value.split(",");
}

program
  .version(version)
  .usage("[options] [directory path]")
  .option(
    "-e, --dirFilter <directories>",
    "comma separated directory list",
    commaSeparatedList
  )
  .option("-s, --deps");

program.parse();

const options = program.opts();

if (!program.args.length) {
  throw Error("Missing argument: directory");
}

let dirFilter =
  options.dirFilter !== undefined ? options.dirFilter : ["!.git", "!*modules"];

const mod = program.args[0];

if (options.deps) {
  showAllDependencies(mod, dirFilter);
} else {
  listSizes(mod, dirFilter);
}
