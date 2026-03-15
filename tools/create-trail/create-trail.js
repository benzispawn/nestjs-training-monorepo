const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = {};

  for (let i = 0; i < argv.length; i += 1) {
    const current = argv[i];

    if (current.startsWith('--')) {
      const key = current.slice(2);
      const value = argv[i + 1] && !argv[i + 1].startsWith('--')
        ? argv[i + 1]
        : true;

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

  const missing = required.filter((key) => !args[key]);

  if (missing.length) {
    console.error(`Missing required arguments: ${missing.join(', ')}`);
    console.error('Usage: npm run generate:trail -- --category validation --name 01-zod-request-validation --type rest');
    process.exit(1);
  }
}

function getTemplateFiles(type) {
  if (type === 'rest') {
    return [
      ['package.json.template', 'package.json'],
      ['tsconfig.json.template', 'tsconfig.json'],
      ['jest.config.js.template', 'jest.config.js'],
      ['.env.example.template', '.env.example'],
      ['src/main.ts.template', 'src/main.ts'],
      ['src/app.module.ts.template', 'src/app.module.ts'],
      ['src/app.controller.ts.template', 'src/app.controller.ts'],
      ['src/app.service.ts.template', 'src/app.service.ts'],
      ['test/unit/app.service.spec.ts.template', 'test/unit/app.service.spec.ts'],
      ['test/e2e/health.test.ts.template', 'test/e2e/health.test.ts'],
      ['docs/README.md.template', 'docs/README.md'],
      ['docs/TASK.md.template', 'docs/TASK.md'],
      ['docs/DONE.md.template', 'docs/DONE.md'],
    ];
  }

  return [
    ['package.json.template', 'package.json'],
    ['tsconfig.json.template', 'tsconfig.json'],
    ['jest.config.js.template', 'jest.config.js'],
    ['.env.example.template', '.env.example'],
    ['src/main.ts.template', 'src/main.ts'],
    ['docs/README.md.template', 'docs/README.md'],
    ['docs/TASK.md.template', 'docs/TASK.md'],
    ['docs/DONE.md.template', 'docs/DONE.md'],
  ];
}

function copyTemplateFile(templatePath, destinationPath, tokens) {
  const content = readFile(templatePath);
  const finalContent = replaceTokens(content, tokens);
  writeFile(destinationPath, finalContent);
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
    graphql: 'nest-graphql-template',
    supergraph: 'nest-supergraph-template',
    testing: 'testing-template',
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

  const tokens = {
    '__TRAIL_NAME__': trailName,
    '__TRAIL_TITLE__': titleFromName(trailName),
    '__TRAIL_DESCRIPTION__': descriptionFromType(type, trailName),
    '__TRAIL_OBJECTIVE__': objectiveFromCategory(category, trailName),
    '__TSCONFIG_RELATIVE_PATH__': getRelativeTsconfigPath(targetDir),
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

  const files = getTemplateFiles(type);

  for (const [templateRelative, targetRelative] of files) {
    const templatePath = path.join(templateBase, templateRelative);
    const destinationPath = path.join(targetDir, targetRelative);
    copyTemplateFile(templatePath, destinationPath, tokens);
  }

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
