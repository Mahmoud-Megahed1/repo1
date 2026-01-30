const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

async function verifyMongo() {
    const dbUrl = process.env.DATABASE_URL;
    console.log('---------------------------------------------------');
    console.log('Checking MongoDB Connection...');
    console.log(`URL: ${dbUrl ? dbUrl.replace(/:([^:@]+)@/, ':****@') : 'UNDEFINED'}`); // Hide password

    if (!dbUrl) {
        console.error('ERROR: DATABASE_URL is not defined in .env');
        process.exit(1);
    }

    try {
        await mongoose.connect(dbUrl);
        console.log('✅ Connected successfully to MongoDB!');

        const admin = mongoose.connection.db.admin();
        const buildInfo = await admin.buildInfo();
        const serverStatus = await admin.serverStatus();

        console.log('---------------------------------------------------');
        console.log(`MongoDB Version: ${buildInfo.version}`);
        console.log(`Git Version: ${buildInfo.gitVersion}`);
        console.log(`Modules: ${buildInfo.modules.join(', ') || 'None'}`);
        console.log(`Replica Set: ${serverStatus.repl ? 'Yes' : 'No'}`);
        console.log('---------------------------------------------------');

        if (serverStatus.repl) {
            console.log('✅ Replica Set is active (Transactions Supported)');
        } else {
            console.log('❌ Replica Set is NOT active (Transactions might fail)');
        }

        if (parseFloat(buildInfo.version) < 5.0) {
            console.log('⚠️  WARNING: Version is OLD (< 5.0). Upgrade recommended for modern features.');
        } else {
            console.log('✅ Version is Modern (>= 5.0).');
        }

    } catch (error) {
        console.error('❌ Connection Failed:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('---------------------------------------------------');
    }
}

verifyMongo();
