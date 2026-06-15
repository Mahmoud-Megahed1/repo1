import fs from "fs/promises";
import path from "path";

export async function storagePut(key: string, data: Buffer, contentType: string) {
  const uploadsDir = path.resolve(process.cwd(), "uploads");
  const filePath = path.resolve(uploadsDir, key);
  
  // Ensure the directory exists
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  
  // Write the file
  await fs.writeFile(filePath, data);

  return {
    url: `/blog/api/uploads/${key}`,
    key
  };
}
