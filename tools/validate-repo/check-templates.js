const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const rootDir = process.cwd();
const templateTypes = [
  'generic',
  'rest',
  'feature-toggle',
  'feature-toggle-removal',
  'supergraph',
  'bff-endpoint',
];

function copyPath(source, destination) {
  fs.cpSync(source, destination, {
    recursive: true,
    force: true,
    errorOnExist: false,
  });
}

function symlinkNodeModules(targetDir) {
  const source = path.join(rootDir, 'node_modules');
  const destination = path.join(targetDir, 'node_modules');

  if (fs.existsSync(source) && !fs.existsSync(destination)) {
    fs.symlinkSync(source, destination, 'dir');
  }
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (result.status !== 0) {
    const fullCommand = [command, ...args].join(' ');
    throw new Error(`Command failed in ${cwd}: ${fullCommand}`);
  }
}

function prepareWorkspace() {
  const tempRoot = fs.mkdtempSync(
    path.join(os.tmpdir(), 'nestjs-training-template-check-'),
  );

  fs.mkdirSync(path.join(tempRoot, 'apps'), { recursive: true });
  fs.mkdirSync(path.join(tempRoot, 'packages'), { recursive: true });
  fs.mkdirSync(path.join(tempRoot, 'tools'), { recursive: true });

  copyPath(
    path.join(rootDir, 'packages', 'templates'),
    path.join(tempRoot, 'packages', 'templates'),
  );
  copyPath(
    path.join(rootDir, 'tools', 'create-trail'),
    path.join(tempRoot, 'tools', 'create-trail'),
  );
  copyPath(
    path.join(rootDir, 'package.json'),
    path.join(tempRoot, 'package.json'),
  );
  copyPath(
    path.join(rootDir, 'tsconfig.base.json'),
    path.join(tempRoot, 'tsconfig.base.json'),
  );
  copyPath(
    path.join(rootDir, 'eslint.config.mjs'),
    path.join(tempRoot, 'eslint.config.mjs'),
  );
  copyPath(
    path.join(rootDir, '.prettierrc'),
    path.join(tempRoot, '.prettierrc'),
  );
  symlinkNodeModules(tempRoot);

  return tempRoot;
}

function checkTemplate(tempRoot, type, index) {
  const name = `${String(index + 1).padStart(2, '0')}-${type}`;

  run(
    'node',
    [
      'tools/create-trail/create-trail.js',
      '--category',
      'generated',
      '--name',
      name,
      '--type',
      type,
    ],
    tempRoot,
  );

  const trailDir = path.join(tempRoot, 'apps', 'generated', name);
  const packageJson = fs.readFileSync(
    path.join(trailDir, 'package.json'),
    'utf8',
  );

  if (packageJson.includes('__VERSION_')) {
    throw new Error(`Unresolved version token in ${trailDir}/package.json`);
  }

  const commands = [
    ['npm', ['run', 'build']],
    ['npm', ['run', 'lint']],
    ['npm', ['run', 'test:unit']],
    ['npm', ['run', 'test:e2e']],
  ];

  for (const [command, args] of commands) {
    run(command, args, trailDir);
  }
}

function main() {
  const tempRoot = prepareWorkspace();

  console.log(`Template check workspace: ${tempRoot}`);

  templateTypes.forEach((type, index) => {
    console.log(`Checking template: ${type}`);
    checkTemplate(tempRoot, type, index);
  });

  console.log('Template checks passed.');
}

main();
