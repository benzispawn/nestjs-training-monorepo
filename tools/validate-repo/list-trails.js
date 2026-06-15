const fs = require('fs');
const path = require('path');

const appsDir = path.join(process.cwd(), 'apps');

function listTrailDirs(baseDir) {
  const result = [];

  if (!fs.existsSync(baseDir)) return result;

  const categories = fs
    .readdirSync(baseDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory());

  for (const category of categories) {
    const categoryPath = path.join(baseDir, category.name);
    const trails = fs
      .readdirSync(categoryPath, { withFileTypes: true })
      .filter((entry) => entry.isDirectory());

    for (const trail of trails) {
      result.push(`${category.name}/${trail.name}`);
    }
  }

  return result;
}

const trails = listTrailDirs(appsDir);

if (!trails.length) {
  console.log('No trails found.');
  process.exit(0);
}

console.log('Available trails:');
for (const trail of trails) {
  console.log(`- ${trail}`);
}
