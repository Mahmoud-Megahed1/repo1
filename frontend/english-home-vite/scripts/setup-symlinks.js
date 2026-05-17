import fs from 'fs';
import path from 'path';

const isLinux = process.platform === 'linux';

if (isLinux) {
  const distDir = path.resolve('dist');
  
  const symlinks = [
    {
      target: '/var/www/repo1/englishom-landing-complete/englishom-landing/dist/public',
      link: path.join(distDir, 'Landingpage')
    },
    {
      target: '/var/www/repo1/englishom-placement-test-final/englishom-placement-test/dist/public',
      link: path.join(distDir, 'test')
    }
  ];

  symlinks.forEach(({ target, link }) => {
    try {
      // Safely delete existing file/symlink (even if broken)
      try {
        fs.unlinkSync(link);
      } catch (e) {
        // Ignore error if it doesn't exist
      }
      
      if (fs.existsSync(target)) {
        fs.symlinkSync(target, link, 'dir');
        console.log(`Successfully created symlink: ${link} -> ${target}`);
      } else {
        console.warn(`Target directory does not exist, skipping: ${target}`);
      }
    } catch (err) {
      console.error(`Failed to create symlink for ${link}:`, err.message);
    }
  });
} else {
  console.log('Not on Linux. Skipping symlink creation.');
}
