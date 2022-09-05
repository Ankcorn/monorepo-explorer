const { promisify } = require("util");
const { join } = require("path");
const fs = require("fs/promises");
const fastFolderSize = require("fast-folder-size");
const readdirp = require("readdirp");
const fastFolderSizeAsync = promisify(fastFolderSize);
const semver = require("semver");
const lockfile = require("@yarnpkg/lockfile");

const directoryExists = async (path) => {
  try {
    await fs.access(path);
    return true;
  } catch (error) {
    return false;
  }
};

const listSizes = async (dirPath, directoryFilter) => {
  const moduleList = [];

  for await (const entry of readdirp(dirPath, {
    fileFilter: "package.json",
    directoryFilter,
  })) {
    const { path } = entry;
    const modulePath = path.split("package.json")[0];
    const pathToNodeModules = join(dirPath, modulePath, "node_modules");

    if (await directoryExists(pathToNodeModules)) {
      const bytes = await fastFolderSizeAsync(pathToNodeModules);
      moduleList.push({
        pathToNodeModules,
        size: bytes,
      });
    }
  }

  moduleList
    .sort((b, a) => a.size - b.size)
    .map(
      (i) => `${i.pathToNodeModules}, ${(i.size / 1000 / 1000).toFixed(2)} MB`
    )
    .forEach((line) => console.log(line));
};

const showAllDependencies = async (dirPath, directoryFilter) => {
  const allDeps = {};

  let file = await fs.readFile(join(dirPath, "yarn.lock"), "utf8");
  let { object: lockedDependencies } = lockfile.parse(file);

  for await (const entry of readdirp(dirPath, {
    fileFilter: "package.json",
    directoryFilter,
  })) {
    const { path } = entry;
    const { dependencies, devDependencies } = require(join(dirPath, path));

    if (dependencies) {
      Object.entries({ ...dependencies, ...devDependencies }).map(([k, v]) => {
        if (!allDeps[k]) {
          allDeps[k] = [];
        }
        allDeps[k].push({ path, v });
      });
    }
  }

  Object.entries(allDeps)
    .sort(([, a], [, b]) => a.length - b.length)
    .forEach((line) => {
      const dependencyName = line[0];
      const used = line[1];
      let minVersion;
      try {
        minVersion = semver.minVersion(`${used.map((i) => i.v).join(" || ")}`);
      } catch (e) {
        minVersion = "unknown";
      }

      const installedDependencies = new Set();
      used.forEach((item) => {
        let packageAndVersion = `${dependencyName}@${item.v}`;
        let found = lockedDependencies[packageAndVersion];
        if (found) {
          installedDependencies.add(found.version);
        }
      });

      const installedVersions = semver
        .sort([...installedDependencies])
        .join(", ");

      if (installedDependencies.size) {
        console.log(
          "\x1b[36m%s\x1b[0m",
          dependencyName,
          " - ",
          `Installed versions: ${installedDependencies.size} (${installedVersions}) \n`,
          used.reduce((acc, o) => {
            const installedVersion =
              lockedDependencies[`${dependencyName}@${o.v}`];
            acc += ` ${o.path}: ${o.v} uses ${installedVersion?.version} \n `;
            return acc;
          }, "")
        );
      }
    });
};

exports.listSizes = listSizes;
exports.showAllDependencies = showAllDependencies;
