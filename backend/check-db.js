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

  const adminDb = mongoose.connection.client.db('admin');
  
  // List all databases
  console.log('\n--- Listing all databases ---');
  const dbs = await adminDb.admin().listDatabases();
  console.log(dbs.databases);

  // For the current database, list all collections
  const currentDb = mongoose.connection.db;
  console.log(`\n--- Listing collections in current database (${currentDb.databaseName}) ---`);
  const collections = await currentDb.listCollections().toArray();
  console.log(collections.map(c => c.name));

  // Let's check for any collection name that contains 'files'
  for (const col of collections) {
    if (col.name.includes('files')) {
      const count = await currentDb.collection(col.name).countDocuments();
      console.log(`Collection ${col.name} has ${count} documents.`);
      
      // Let's print first few documents to see what is in there
      const docs = await currentDb.collection(col.name).find({}).limit(5).toArray();
      console.log(`Sample docs from ${col.name}:`, docs);
    }
  }

  await mongoose.disconnect();
  console.log('\nDisconnected.');
}

run().catch(console.error);
