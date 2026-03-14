const fs = require('fs');
const path = require('path');

const requiredPaths = [
  'apps',
  'packages',
  'tools',
  'docs',
  'bruno',
  'tools/codex/prompts',
  'tools/codex/rules',
  'docs/getting-started',
  'docs/conventions'
];

let hasError = false;

for (const relativePath of requiredPaths) {
  const absolutePath = path.join(process.cwd(), relativePath);
  if (!fs.existsSync(absolutePath)) {
    console.error(`Missing required path: ${relativePath}`);
    hasError = true;
  }
}

if (hasError) {
  process.exit(1);
}

console.log('Repository structure looks OK.');
