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

  // Use connection client directly to avoid uninitialized mongoose.connection.db issues
  const db = mongoose.connection.client.db('englishom');

  // List all files in GridFS bucket 'appFiles' matching specific patterns
  console.log('\n--- Listing GridFS files for LISTEN lessons ---');
  const files = await db.collection('appFiles.files').find({
    filename: { $regex: /LISTEN/i }
  }).toArray();
  
  console.log(`Found ${files.length} files matching 'LISTEN'.`);

  for (const file of files) {
    console.log(`- File: ${file.filename} (Size: ${file.length} bytes, Uploaded: ${file.uploadDate})`);
    
    // Download and print JSON files
    if (file.filename.endsWith('.json')) {
      const chunks = await db.collection('appFiles.chunks').find({ files_id: file._id }).sort({ n: 1 }).toArray();
      const buffer = Buffer.concat(chunks.map(c => c.data.buffer));
      console.log(`  Content: ${buffer.toString('utf-8')}`);
    }
  }

  // Also query if there is any other files for LEVEL_A1/2
  console.log('\n--- Listing all GridFS files for LEVEL_A1/2/ ---');
  const levelA1Files = await db.collection('appFiles.files').find({
    filename: { $regex: /LEVEL_A1\/2\//i }
  }).toArray();
  console.log(`Found ${levelA1Files.length} files matching 'LEVEL_A1/2/'.`);
  for (const file of levelA1Files) {
    console.log(`- File: ${file.filename} (Size: ${file.length} bytes, Uploaded: ${file.uploadDate})`);
  }

  // Also query if there is any other files for LEVEL_A2/2
  console.log('\n--- Listing all GridFS files for LEVEL_A2/2/ ---');
  const levelA2Files = await db.collection('appFiles.files').find({
    filename: { $regex: /LEVEL_A2\/2\//i }
  }).toArray();
  console.log(`Found ${levelA2Files.length} files matching 'LEVEL_A2/2/'.`);
  for (const file of levelA2Files) {
    console.log(`- File: ${file.filename} (Size: ${file.length} bytes, Uploaded: ${file.uploadDate})`);
  }

  await mongoose.disconnect();
  console.log('\nDisconnected.');
}

run().catch(console.error);
