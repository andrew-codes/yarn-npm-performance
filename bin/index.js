const execSync = require('child_process').execSync;
const fs = require('fs');

const yarn = 'yarn';
const npm = 'npm';

const runTest = ({tool, cleanNodeModules, cleanLockFile}) => {
    if (cleanNodeModules) {
        execSync('rm -rf node_modules');
    }
    let version;
    let hrStop;
    if (tool === yarn) {
        if (cleanLockFile) {
            try {
                execSync('rm yarn.lock');
            }
            catch (error) {
            }
        }
        else {
            execSync('yarn generate-lock-entry');
        }
        version = execSync('yarn --version');
        const hrStart = process.hrtime();
        execSync(`yarn`);
        hrStop = process.hrtime(hrStart);
    } else {
        version = execSync('npm --version');
        const hrStart = process.hrtime();
        execSync(`npm install`);
        hrStop = process.hrtime(hrStart);
    }
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
        cleanLockFile: true,
    }
];

const testRunCount = 15;
const testRuns = testCases.reduce((output, testCase) => output.concat(new Array(testRunCount).fill(testCase)), []);
const testRunOutput = testRuns.map((testRun) => runTest(testRun).join(',')).join('\r\n');
console.log(testRunOutput);
fs.writeFile('yarn-versus-npm-install-performance.csv', testRunOutput, (error) => {
    if (error) {
        throw new Error(error);
    }
});