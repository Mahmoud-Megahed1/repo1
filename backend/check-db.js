const mongoose = require('mongoose');

const dbUrl = 'mongodb://127.0.0.1:27017/englishom';

async function run() {
  console.log('Connecting to database...');
  await mongoose.connect(dbUrl);
  console.log('Connected!');

  const db = mongoose.connection.db;

  // List all files in GridFS bucket
  console.log('\n--- Listing GridFS files ---');
  const files = await db.collection('fs.files').find({}).toArray();
  console.log(`Found ${files.length} files in GridFS.`);

  for (const file of files) {
    if (file.filename.includes('json') || file.filename.includes('LISTEN')) {
      console.log(`- File: ${file.filename} (Size: ${file.length} bytes, Uploaded: ${file.uploadDate})`);
      
      // Let's download and print JSON files
      if (file.filename.endsWith('.json')) {
        const chunks = await db.collection('fs.chunks').find({ files_id: file._id }).sort({ n: 1 }).toArray();
        const buffer = Buffer.concat(chunks.map(c => c.data.buffer));
        console.log(`  Content: ${buffer.toString('utf-8')}`);
      }
    }
  }

  await mongoose.disconnect();
  console.log('\nDisconnected.');
}

run().catch(console.error);
