# yarn-npm-performance
This package can be used to get performance information for your repo when comparing `yarn` and `npm install`.

The test cases are below:

- `yarn`, no lockfile, no `node_modules`
- `yarn`, has lockfile, no `node_modules`
- `yarn`, has lockfile, has `node_modules`
- `npm install`, no `node_modules`
- `npm install`, has `node_modules`

This will run each test case 7 times, with the output is provided via CLI and as a simple CSV. Test are run sequentially to ensure a more accurate performance time. It may take a while due to this, so please be patient.

## Installation
This is a tool that is intended to be run **on** your repo and not in it and therefore should be installed globally via `npm install @andrew-codes/yarn-npm-performance -g`.

## Running
Change into your repo's directory and run `yarn-npm-performance`. This will run one test run for each test case. Optionally provide a number of test runs to process via `yarn-npm-performance 7`. Once finished, you will find the output in the file `yarn-versus-npm-install-performance.csv`.