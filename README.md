
# prebuild-ci

Use CI like [travis](https://travis-ci.org/) and [appveyor](https://www.appveyor.com/) to auto upload [prebuilds](https://github.com/mafintosh/prebuild).

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
