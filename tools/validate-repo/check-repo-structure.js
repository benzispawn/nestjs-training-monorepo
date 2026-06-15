const fs = require('fs');
const path = require('path');

function pathExists(relativePath) {
  return fs.existsSync(path.join(process.cwd(), relativePath));
}

function readJson(relativePath) {
  const absolutePath = path.join(process.cwd(), relativePath);
  return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
}

function reportMissing(relativePath) {
  console.error(`Missing required path: ${relativePath}`);
  hasError = true;
}

function reportInvalid(message) {
  console.error(message);
  hasError = true;
}

const requiredPaths = [
  'apps',
  'packages',
  'tools',
  'docs',
  'bruno',
  'tools/codex/prompts',
  'tools/codex/rules',
  'docs/getting-started',
  'docs/conventions',
];

let hasError = false;

for (const relativePath of requiredPaths) {
  if (!pathExists(relativePath)) {
    reportMissing(relativePath);
  }
}

function validateRootPackage() {
  if (!pathExists('package.json')) {
    reportMissing('package.json');
    return;
  }

  const packageJson = readJson('package.json');
  const requiredScripts = [
    'list:trails',
    'trail:info',
    'check:repo',
    'check:templates',
    'generate:trail',
    'build',
    'lint',
    'test',
    'check',
  ];

  for (const scriptName of requiredScripts) {
    if (!packageJson.scripts || !packageJson.scripts[scriptName]) {
      reportInvalid(`Missing root package script: ${scriptName}`);
    }
  }
}

function validateTemplates() {
  const genericTemplateFiles = [
    'package.json.template',
    'tsconfig.json.template',
    'jest.config.js.template',
    '.env.example.template',
    'src/main.ts.template',
    'docs/README.md.template',
    'docs/TASK.md.template',
    'docs/DONE.md.template',
  ];

  const nestAppTemplateFiles = [
    'package.json.template',
    'tsconfig.json.template',
    'jest.config.js.template',
    '.env.example.template',
    'src/main.ts.template',
    'src/app.module.ts.template',
    'src/app.controller.ts.template',
    'src/app.service.ts.template',
    'test/unit/app.service.spec.ts.template',
    'test/e2e/health.test.ts.template',
    'docs/README.md.template',
    'docs/TASK.md.template',
    'docs/DONE.md.template',
  ];

  const httpTemplateFiles = [
    ...nestAppTemplateFiles,
    'src/http-json-client.ts.template',
    'src/mock-services.ts.template',
  ];

  const templates = {
    'packages/templates/trail-template': genericTemplateFiles,
    'packages/templates/nest-rest-template': nestAppTemplateFiles,
    'packages/templates/feature-toggle-template': [
      ...httpTemplateFiles,
      'src/feature-toggle-client.ts.template',
    ],
    'packages/templates/feature-toggle-removal-template': [
      ...httpTemplateFiles,
      'src/feature-toggle-client.ts.template',
    ],
    'packages/templates/nest-supergraph-template': [
      ...httpTemplateFiles,
      'src/catalog-client.ts.template',
      'src/pricing-client.ts.template',
    ],
    'packages/templates/bff-endpoint-template': [
      ...httpTemplateFiles,
      'src/feature-toggle-client.ts.template',
      'src/supergraph-client.ts.template',
    ],
  };

  for (const [templateDir, files] of Object.entries(templates)) {
    if (!pathExists(templateDir)) {
      reportMissing(templateDir);
      continue;
    }

    for (const file of files) {
      const relativePath = path.join(templateDir, file);
      if (!pathExists(relativePath)) {
        reportMissing(relativePath);
      }
    }

    const packageTemplatePath = path.join(templateDir, 'package.json.template');
    if (pathExists(packageTemplatePath)) {
      const packageTemplate = readJson(packageTemplatePath);

      if (!packageTemplate.dependencies) {
        reportInvalid(`Missing dependencies in ${packageTemplatePath}`);
      }

      if (!packageTemplate.devDependencies) {
        reportInvalid(`Missing devDependencies in ${packageTemplatePath}`);
      }
    }
  }
}

function listTrailDirs() {
  const appsDir = path.join(process.cwd(), 'apps');
  const result = [];

  if (!fs.existsSync(appsDir)) return result;

  const categories = fs
    .readdirSync(appsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory());

  for (const category of categories) {
    const categoryPath = path.join(appsDir, category.name);
    const trails = fs
      .readdirSync(categoryPath, { withFileTypes: true })
      .filter((entry) => entry.isDirectory());

    for (const trail of trails) {
      result.push(`${category.name}/${trail.name}`);
    }
  }

  return result;
}

function validateTrail(trail) {
  const requiredTrailPaths = [
    'src',
    'test/unit',
    'test/e2e',
    'docs/README.md',
    'docs/TASK.md',
    'docs/DONE.md',
    'package.json',
    'tsconfig.json',
  ];

  for (const trailPath of requiredTrailPaths) {
    const relativePath = path.join('apps', trail, trailPath);
    if (!pathExists(relativePath)) {
      reportMissing(relativePath);
    }
  }

  const packageJsonPath = path.join('apps', trail, 'package.json');
  if (!pathExists(packageJsonPath)) return;

  const packageJson = readJson(packageJsonPath);
  const requiredScripts = [
    'start',
    'start:dev',
    'build',
    'lint',
    'test',
    'check',
  ];

  if (!packageJson.name || !packageJson.name.startsWith('@trails/')) {
    reportInvalid(`Invalid workspace name in apps/${trail}/package.json`);
  }

  for (const scriptName of requiredScripts) {
    if (!packageJson.scripts || !packageJson.scripts[scriptName]) {
      reportInvalid(
        `Missing script "${scriptName}" in apps/${trail}/package.json`,
      );
    }
  }
}

validateRootPackage();
validateTemplates();

for (const trail of listTrailDirs()) {
  validateTrail(trail);
}

if (hasError) {
  process.exit(1);
}

console.log('Repository structure looks OK.');
