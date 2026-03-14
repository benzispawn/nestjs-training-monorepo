const fs = require('fs');
const path = require('path');

const [, , trailArg] = process.argv;

if (!trailArg) {
  console.error('Usage: npm run trail:info -- category/trail-name');
  process.exit(1);
}

const trailPath = path.join(process.cwd(), 'apps', trailArg);

if (!fs.existsSync(trailPath)) {
  console.error(`Trail not found: apps/${trailArg}`);
  process.exit(1);
}

const packageJsonPath = path.join(trailPath, 'package.json');
const readmePath = path.join(trailPath, 'docs', 'README.md');
const taskPath = path.join(trailPath, 'docs', 'TASK.md');
const donePath = path.join(trailPath, 'docs', 'DONE.md');

console.log(`Trail: ${trailArg}`);
console.log(`Path: apps/${trailArg}`);

if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  console.log(`Workspace: ${packageJson.name}`);
  console.log(`Description: ${packageJson.description}`);
}

console.log(`Docs available:`);
console.log(`- README: ${fs.existsSync(readmePath) ? 'yes' : 'no'}`);
console.log(`- TASK: ${fs.existsSync(taskPath) ? 'yes' : 'no'}`);
console.log(`- DONE: ${fs.existsSync(donePath) ? 'yes' : 'no'}`);
