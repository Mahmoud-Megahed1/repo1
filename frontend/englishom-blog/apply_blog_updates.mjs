import 'dotenv/config';
import mysql from 'mysql2/promise';

async function run() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }

  console.log("Connecting to Database to apply blog column updates...");
  try {
    const conn = await mysql.createConnection(process.env.DATABASE_URL);

    const columnsToAdd = [
      { name: "customAuthorNameEn", type: "VARCHAR(255)" },
      { name: "customAuthorNameAr", type: "VARCHAR(255)" },
      { name: "showDate", type: "BOOLEAN DEFAULT TRUE" },
      { name: "dateDisplayType", type: "VARCHAR(20) DEFAULT 'published'" },
    ];

    for (const col of columnsToAdd) {
      try {
        await conn.query(`ALTER TABLE blog_posts ADD COLUMN ${col.name} ${col.type};`);
        console.log(`Added column ${col.name} to blog_posts.`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME' || err.message.includes("Duplicate column name")) {
          console.log(`Column ${col.name} already exists in blog_posts.`);
        } else {
          console.warn(`Warning adding column ${col.name}:`, err.message);
        }
      }
    }

    await conn.end();
    console.log("Database updates complete!");
  } catch (err) {
    console.error("Error connecting to database:", err.message);
  }
}

run();
