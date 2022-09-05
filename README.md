# Monorepo Explorer

Find out valuable information about your Yarn Workspaces monorepo. 

## Features

* 💿 determine each workspace's size on the disk
  * usage: `node cli.js <path to your monorepo>`
  * before executing this command, run `yarn install` in your repo
* 🪞 show all versions of an installed package (duplicate finder)
  * usage `node cli.js <path to your monorepo> --deps`
  * before executing this command, run `yarn install` in your repo

## Example

`node cli.js <path to your monorepo> --deps`

The command lists dependencies and all of the modules in your monorepo that use this dependency with the defined and installed version numbers.

### Output

```
typescript  -  Installed versions: 1 (4.6.2) 
  packages/utils/typescript/package.json: 4.6.2 uses 4.6.2 
  packages/core/strapi/package.json: 4.6.2 uses 4.6.2 
  packages/core/helper-plugin/package.json: 4.6.2 uses 4.6.2 
  packages/core/admin/package.json: 4.6.2 uses 4.6.2 
 
reselect  -  Installed versions: 2 (4.0.0, 4.1.6) 
  packages/utils/babel-plugin-switch-ee-ce/package.json: 4.0.0 uses 4.0.0 
  packages/plugins/documentation/package.json: ^4.0.0 uses 4.1.6 
  packages/core/content-type-builder/package.json: ^4.0.0 uses 4.1.6 
  packages/core/admin/package.json: ^4.0.0 uses 4.1.6 
 
bcryptjs  -  Installed versions: 1 (2.4.3) 
  packages/plugins/users-permissions/package.json: 2.4.3 uses 2.4.3 
  packages/plugins/documentation/package.json: 2.4.3 uses 2.4.3 
  packages/core/strapi/package.json: 2.4.3 uses 2.4.3 
  packages/core/admin/package.json: 2.4.3 uses 2.4.3 
 
@testing-library/react-hooks  -  Installed versions: 2 (3.7.0, 8.0.1) 
  packages/plugins/users-permissions/package.json: 8.0.1 uses 8.0.1 
  packages/core/upload/package.json: 3.7.0 uses 3.7.0 
  packages/core/helper-plugin/package.json: 3.7.0 uses 3.7.0 
  packages/core/admin/package.json: 3.7.0 uses 3.7.0 
```
