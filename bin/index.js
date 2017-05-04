#!/usr/bin/env node

const execSync = require('child_process').execSync;
const fs = require('fs');

const yarn = 'yarn';
const npm = 'npm';
const stdio = {stdio: ['ignore', 'ignore', process.stderr]};

const runTest = ({tool, cleanNodeModules, cleanLockFile}, testRunCount) => {
    console.log(`Starting test case ${tool}; node_modules:${!cleanNodeModules}, lockfile:${!cleanLockFile}`);
    if (cleanNodeModules) {
        console.log('Test Setup: Removing node_modules');
        execSync('rm -rf node_modules', stdio);
    }

    let versionCommand;
    let installCommand;
    if (tool === yarn) {
        if (cleanLockFile) {
            try {
                console.log('Test Setup: removing yarn.lock file');
                execSync('rm yarn.lock', stdio);
            }
            catch (error) {
            }
        }
        else {
            console.log('Test Setup: Generate a yarn.lock file');
            execSync('yarn generate-lock-entry', stdio);
        }
        versionCommand = 'yarn --version';
        installCommand = 'yarn';
    } else {
        versionCommand = 'npm --version';
        installCommand = 'npm install';
    }
    const version = execSync(versionCommand);
    console.log(`Running test ${testRunCount}`);
    const hrStart = process.hrtime();
    execSync(installCommand, stdio);
    const hrStop = process.hrtime(hrStart);
    return [tool, version, cleanNodeModules.toString(), cleanLockFile.toString(), hrStop[0] + hrStop[1] / 100000000];
};

const testCases = [
    {
        tool: 'yarn',
        cleanNodeModules: true,
        cleanLockFile: true,
    },
    {
        tool: 'yarn',
        cleanNodeModules: true,
        cleanLockFile: false,
    },
    {
        tool: 'yarn',
        cleanNodeModules: false,
        cleanLockFile: false,
    },
    {
        tool: 'npm',
        cleanNodeModules: true,
        cleanLockFile: true,
    },
    {
        tool: 'npm',
        cleanNodeModules: false,
        cleanLockFile: false,
    }
];

const testRunCount = process.argv[2] ? parseInt(process.argv[2]) : 1;
const testRuns = testCases.reduce((output, testCase) => output.concat(new Array(testRunCount).fill(testCase)), []);
const testRunOutput = testRuns.map((testRun, index) => runTest(testRun, index).join(',')).join('\r\n');
console.log(testRunOutput);
fs.writeFile('yarn-versus-npm-install-performance.csv', testRunOutput, (error) => {
    if (error) {
        throw new Error(error);
    }
});