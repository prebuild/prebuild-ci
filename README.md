
# prebuild-ci

Use CI like [travis](https://travis-ci.org/) and [appveyor](https://www.appveyor.com/) to auto upload [prebuilds](https://github.com/mafintosh/prebuild).

## Motivation

It's great to provide prebuilds with your native node modules, so consumers don't have to compile them on install - a pre made binary will simply be fetched.
It can however be cumbersome to create those binaries yourself, you need to run the appropriate scripts on every OS you desire to ship.
This module provides an alternative by creating and uploading those binaries in the CI environments you use, so for example using travis and appveyor you can
cover all node versions on mac OS, linux and windows, automatically!

## Usage

Add `prebuild-ci` to your `"test"` script or CI configuration, like this:

```json
  "scripts": {
    "test": "mocha && prebuild-ci"  
  }
```

Also configure your CI environments to set the environment variable `PREBUILD_TOKEN` to your [prebuild upload token](https://github.com/mafintosh/prebuild#create-github-token).

Then, whenever a CI job passes _and_ updates `"version"` in the module's `package.json`, the prebuild for the current environment will be uploaded to GitHub.

That means that in order to have prebuilds for all desired os / node combinations, make sure to run each of those in a CI job.

## Installation

```bash
$ npm install --save prebuild-ci
```

## License

MIT
