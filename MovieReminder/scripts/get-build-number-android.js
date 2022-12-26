const fs = require('fs');

const appBuildGradlePath = process.argv[2];
const appBuildGrade = fs.readFileSync(appBuildGradlePath, 'utf-8');

const result = appBuildGrade.match(/versionCode (\d+)/);
const versionNumber = result[1];
console.log(versionNumber);
