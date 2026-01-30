/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

// Import locale objects
const en = require('./locales/en.ts').default;
const ar = require('./locales/ar.ts').default;

const outputDir = path.resolve(__dirname, '../locales');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`📁 Created output directory: ${outputDir}`);
}

// Map of locale names to their content
const locales = { en, ar };

for (const [localeName, content] of Object.entries(locales)) {
  const filePath = path.join(outputDir, `${localeName}.json`);

  fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf8');
  console.log(`✅ Generated ${filePath}`);
}
