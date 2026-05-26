import 'dotenv/config';
import mysql from 'mysql2/promise';

async function fixCharset(dbUrl, dbName) {
  if (!dbUrl) {
    console.error(`Skipping ${dbName} because DATABASE_URL is not set.`);
    return;
  }
  
  console.log(`Connecting to ${dbName}...`);
  try {
    const conn = await mysql.createConnection(dbUrl);
    
    console.log(`Altering database ${dbName} to utf8mb4...`);
    await conn.query(`ALTER DATABASE ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    
    const [tables] = await conn.query(`SHOW TABLES`);
    
    for (const row of tables) {
      const tableName = Object.values(row)[0];
      console.log(`Altering table ${tableName} to utf8mb4...`);
      await conn.query(`ALTER TABLE ${tableName} CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    }
    
    await conn.end();
    console.log(`Successfully updated charset for ${dbName} and all its tables!`);
  } catch (err) {
    console.error(`Error updating ${dbName}:`, err.message);
  }
}

async function run() {
  console.log("=== FIXING DB_BLOG ===");
  // We read from the current process environment (which dotenv will populate)
  await fixCharset(process.env.DATABASE_URL, 'db_blog');
  
  console.log("=== FIXING DB_QUES ===");
  // Just in case db_ques uses a different URL, we'll replace db_blog with db_ques
  if (process.env.DATABASE_URL) {
    const quesUrl = process.env.DATABASE_URL.replace('db_blog', 'db_ques');
    await fixCharset(quesUrl, 'db_ques');
  }
  
  console.log("Done!");
}

run();
