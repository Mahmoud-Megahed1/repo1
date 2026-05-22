export async function storagePut(key: string, data: Buffer, contentType: string) {
  // Mock implementation for development
  return {
    url: `https://files.manuscdn.com/${key}`,
    key
  };
}
