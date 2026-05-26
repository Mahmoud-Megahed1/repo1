import 'dotenv/config';
import mysql from 'mysql2/promise';

async function testInsert() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL is not set.");
    return;
  }
  
  console.log("Connecting to db_blog...");
  try {
    const conn = await mysql.createConnection(dbUrl);
    
    // Check connection charset
    const [vars] = await conn.query("SHOW VARIABLES LIKE 'character_set_%'");
    console.log("Connection Charset Variables:");
    console.table(vars);
    
    await conn.end();
  } catch (err) {
    console.error("Error:", err.message);
  }
}

testInsert();
