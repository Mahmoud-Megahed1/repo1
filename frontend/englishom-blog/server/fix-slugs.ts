import { getDb } from "./db";
import { blogPosts } from "../drizzle/schema";
import { eq } from "drizzle-orm";

async function fixSlugs() {
  console.log("Fetching all posts...");
  const db = await getDb();
  if (!db) {
    console.error("Database not available.");
    process.exit(1);
  }
  const posts = await db.select().from(blogPosts);
  let fixedCount = 0;

  for (const post of posts) {
    if (!post.slug) continue;
    
    // Clean the slug using the exact same logic as the frontend
    const cleanSlug = post.slug
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\u0600-\u06FF-]/g, "");

    if (cleanSlug !== post.slug) {
      console.log(`Fixing slug for post ID ${post.id}:`);
      console.log(`  OLD: ${post.slug}`);
      console.log(`  NEW: ${cleanSlug}`);
      
      await db.update(blogPosts)
        .set({ slug: cleanSlug })
        .where(eq(blogPosts.id, post.id));
        
      fixedCount++;
    }
  }

  console.log(`\nFinished! Fixed ${fixedCount} slugs.`);
  process.exit(0);
}

fixSlugs().catch(console.error);
