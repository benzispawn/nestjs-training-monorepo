const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = {};

  for (let i = 0; i < argv.length; i += 1) {
    const current = argv[i];

    if (current.startsWith('--')) {
      const key = current.slice(2);
      const value =
        argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : true;

      args[key] = value;

      if (value !== true) {
        i += 1;
      }
    }
  }

  return args;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
}

function replaceTokens(content, tokens) {
  return Object.entries(tokens).reduce((acc, [key, value]) => {
    return acc.split(key).join(value);
  }, content);
}

function readRootPackageJson() {
  return JSON.parse(readFile(path.join(process.cwd(), 'package.json')));
}

function getPackageVersion(packageJson, dependencyName) {
  const version =
    packageJson.dependencies?.[dependencyName] ??
    packageJson.devDependencies?.[dependencyName];

  if (!version) {
    throw new Error(`Missing root dependency version for ${dependencyName}`);
  }

  return version;
}

function getRelativeTsconfigPath(targetDir) {
  const rootTsconfig = path.join(process.cwd(), 'tsconfig.base.json');
  return path.relative(targetDir, rootTsconfig).replace(/\\/g, '/');
}

function titleFromName(name) {
  return name
    .split('-')
    .map((part) => {
      if (/^\d+$/.test(part)) return part;
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(' ');
}

function descriptionFromType(type, name) {
  const typeLabel = type ? `${type.toUpperCase()} ` : '';
  return `Trilha ${typeLabel}de ${name}.`;
}

function objectiveFromCategory(category, name) {
  return `Praticar ${name} dentro da categoria ${category}.`;
}

function validateInput(args) {
  const required = ['category', 'name'];
  const supportedTypes = [
    'generic',
    'rest',
    'feature-toggle',
    'feature-toggle-removal',
    'supergraph',
    'bff-endpoint',
  ];

  const missing = required.filter((key) => !args[key]);

  if (missing.length) {
    console.error(`Missing required arguments: ${missing.join(', ')}`);
    console.error(
      'Usage: npm run generate:trail -- --category validation --name 01-zod-request-validation --type rest',
    );
    process.exit(1);
  }

  if (args.type && !supportedTypes.includes(args.type)) {
    console.error(`Unsupported trail type: ${args.type}`);
    console.error(`Supported trail types: ${supportedTypes.join(', ')}`);
    process.exit(1);
  }
}

function copyTemplateFile(templatePath, destinationPath, tokens) {
  const content = readFile(templatePath);
  const finalContent = replaceTokens(content, tokens);
  writeFile(destinationPath, finalContent);
}

function getDestinationRelativePath(templateRelativePath) {
  return templateRelativePath.endsWith('.template')
    ? templateRelativePath.slice(0, -'.template'.length)
    : templateRelativePath;
}

function listTemplateFiles(templateBase, currentDir = templateBase) {
  const result = [];
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      result.push(...listTemplateFiles(templateBase, entryPath));
      continue;
    }

    const relativePath = path
      .relative(templateBase, entryPath)
      .replace(/\\/g, '/');
    result.push(relativePath);
  }

  return result;
}

function copyTemplateDirectory(templateBase, targetDir, tokens) {
  const files = listTemplateFiles(templateBase);

  for (const templateRelative of files) {
    const targetRelative = getDestinationRelativePath(templateRelative);
    const templatePath = path.join(templateBase, templateRelative);
    const destinationPath = path.join(targetDir, targetRelative);
    copyTemplateFile(templatePath, destinationPath, tokens);
  }
}

function createTrailStructure(targetDir) {
  ensureDir(path.join(targetDir, 'src'));
  ensureDir(path.join(targetDir, 'test/unit'));
  ensureDir(path.join(targetDir, 'test/e2e'));
  ensureDir(path.join(targetDir, 'docs'));
  ensureDir(path.join(targetDir, 'bruno'));
}

function getTemplateName(type) {
  const templatesByType = {
    generic: 'trail-template',
    rest: 'nest-rest-template',
    'feature-toggle': 'feature-toggle-template',
    'feature-toggle-removal': 'feature-toggle-removal-template',
    supergraph: 'nest-supergraph-template',
    'bff-endpoint': 'bff-endpoint-template',
  };

  return templatesByType[type] || 'trail-template';
}

function createFromTemplate(args) {
  const category = args.category;
  const trailName = args.name;
  const type = args.type || 'generic';

  const targetDir = path.join(process.cwd(), 'apps', category, trailName);

  if (fs.existsSync(targetDir)) {
    console.error(`Trail already exists: apps/${category}/${trailName}`);
    process.exit(1);
  }

  createTrailStructure(targetDir);
  const rootPackageJson = readRootPackageJson();

  const tokens = {
    __TRAIL_NAME__: trailName,
    __TRAIL_TITLE__: titleFromName(trailName),
    __TRAIL_DESCRIPTION__: descriptionFromType(type, trailName),
    __TRAIL_OBJECTIVE__: objectiveFromCategory(category, trailName),
    __TSCONFIG_RELATIVE_PATH__: getRelativeTsconfigPath(targetDir),
    __VERSION_ESLINT__: getPackageVersion(rootPackageJson, 'eslint'),
    __VERSION_JEST__: getPackageVersion(rootPackageJson, 'jest'),
    __VERSION_NEST_COMMON__: getPackageVersion(
      rootPackageJson,
      '@nestjs/common',
    ),
    __VERSION_NEST_CORE__: getPackageVersion(rootPackageJson, '@nestjs/core'),
    __VERSION_NEST_TESTING__: getPackageVersion(
      rootPackageJson,
      '@nestjs/testing',
    ),
    __VERSION_REFLECT_METADATA__: getPackageVersion(
      rootPackageJson,
      'reflect-metadata',
    ),
    __VERSION_RXJS__: getPackageVersion(rootPackageJson, 'rxjs'),
    __VERSION_SUPERTEST__: getPackageVersion(rootPackageJson, 'supertest'),
    __VERSION_TAP__: getPackageVersion(rootPackageJson, 'tap'),
    __VERSION_TS_JEST__: getPackageVersion(rootPackageJson, 'ts-jest'),
    __VERSION_TS_NODE__: getPackageVersion(rootPackageJson, 'ts-node'),
    __VERSION_TSCONFIG_PATHS__: getPackageVersion(
      rootPackageJson,
      'tsconfig-paths',
    ),
    __VERSION_TYPES_JEST__: getPackageVersion(rootPackageJson, '@types/jest'),
    __VERSION_TYPES_NODE__: getPackageVersion(rootPackageJson, '@types/node'),
    __VERSION_TYPES_SUPERTEST__: getPackageVersion(
      rootPackageJson,
      '@types/supertest',
    ),
    __VERSION_TYPESCRIPT__: getPackageVersion(rootPackageJson, 'typescript'),
  };

  const templateName = getTemplateName(type);
  const templateBase = path.join(
    process.cwd(),
    'packages',
    'templates',
    templateName,
  );

  if (!fs.existsSync(templateBase)) {
    console.error(`Template not found: ${templateName}`);
    process.exit(1);
  }

  copyTemplateDirectory(templateBase, targetDir, tokens);

  writeFile(path.join(targetDir, 'test/unit/.gitkeep'), '');
  writeFile(path.join(targetDir, 'test/e2e/.gitkeep'), '');
  writeFile(path.join(targetDir, 'bruno/.gitkeep'), '');

  console.log(`Trail created successfully: apps/${category}/${trailName}`);
  console.log(`Workspace name: @trails/${trailName}`);
  console.log(`Next steps:`);
  console.log(`- Fill docs in apps/${category}/${trailName}/docs`);
  console.log(`- Implement code in apps/${category}/${trailName}/src`);
  console.log(`- Add tests in apps/${category}/${trailName}/test`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  validateInput(args);
  createFromTemplate(args);
}

main();
