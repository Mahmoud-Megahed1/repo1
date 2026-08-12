const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Try to load env variables from .env or backend_prod.env
let dbUrl = 'mongodb://127.0.0.1:27017/englishom';

const envPaths = [
  path.join(__dirname, '.env'),
  path.join(__dirname, '..', 'backend_prod.env'),
  path.join(__dirname, '..', '.env')
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    console.log(`Loading env from ${envPath}`);
    require('dotenv').config({ path: envPath });
  }
}

if (process.env.DATABASE_URL) {
  dbUrl = process.env.DATABASE_URL;
  // Mask password for security in logs
  const maskedUrl = dbUrl.replace(/\/\/([^:]+):([^@]+)@/, '//xxxx:xxxx@');
  console.log(`Using DATABASE_URL from env: ${maskedUrl}`);
} else {
  console.log(`DATABASE_URL not found in env, using default: ${dbUrl}`);
}

async function run() {
  console.log('Connecting to database...');
  await mongoose.connect(dbUrl);
  console.log('Connected!');

  const db = mongoose.connection.db;

  // List all files in GridFS bucket 'appFiles'
  console.log('\n--- Listing GridFS files in appFiles ---');
  const files = await db.collection('appFiles.files').find({}).toArray();
  console.log(`Found ${files.length} files in GridFS (appFiles).`);

  for (const file of files) {
    if (file.filename.includes('json') || file.filename.includes('LISTEN')) {
      console.log(`- File: ${file.filename} (Size: ${file.length} bytes, Uploaded: ${file.uploadDate})`);
      
      // Let's download and print JSON files
      if (file.filename.endsWith('.json')) {
        const chunks = await db.collection('appFiles.chunks').find({ files_id: file._id }).sort({ n: 1 }).toArray();
        const buffer = Buffer.concat(chunks.map(c => c.data.buffer));
        console.log(`  Content: ${buffer.toString('utf-8')}`);
      }
    }
  }

  await mongoose.disconnect();
  console.log('\nDisconnected.');
}

run().catch(console.error);
