const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

const OLD_DB_NAME = 'Englishom';
const NEW_DB_NAME = 'englishom';

async function main() {
    try {
        // Use connect method to connect to the server
        await client.connect();
        console.log('Connected successfully to MongoDB server');

        const oldDb = client.db(OLD_DB_NAME);
        const newDb = client.db(NEW_DB_NAME);

        // List all collections in the old DB
        const collections = await oldDb.listCollections().toArray();

        if (collections.length === 0) {
            console.log(`No collections found in ${OLD_DB_NAME}. Are you sure it exists?`);
            return;
        }

        console.log(`Found ${collections.length} collections to migrate...`);

        for (const colInfo of collections) {
            const colName = colInfo.name;
            if (colName === 'system.views') continue; // Skip views

            console.log(`\nMigrating collection: ${colName}`);

            const sourceCol = oldDb.collection(colName);
            const destCol = newDb.collection(colName);

            // Get all documents
            const docs = await sourceCol.find({}).toArray();

            if (docs.length > 0) {
                // Optional: clear destination first to avoid duplicates if re-running
                // await destCol.deleteMany({}); 

                try {
                    await destCol.insertMany(docs, { ordered: false });
                    console.log(`  ✓ Copied ${docs.length} documents.`);
                } catch (e) {
                    console.log(`  ⚠ Some documents might be duplicates (Ignored). Copied what we could.`);
                }
            } else {
                console.log(`  - (Empty collection)`);
            }
        }

        console.log('\n------------------------------------------------');
        console.log('🎉 MIGRATION COMPLETE!');
        console.log('------------------------------------------------');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await client.close();
    }
}

main();
