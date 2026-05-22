import fs from 'fs';
import path from 'path';

const isLinux = process.platform === 'linux';

if (isLinux) {
  const distDir = path.resolve('dist');
  
  const symlinks = [
    {
      target: '/var/www/repo1/frontend/the-a1-code-landing-page/dist/public',
      link: path.join(distDir, 'Landingpage')
    },
    {
      target: '/var/www/repo1/frontend/englishom-level-test/dist/public',
      link: path.join(distDir, 'test')
    },
    {
      target: '/var/www/repo1/frontend/englishom-ques/dist/public',
      link: path.join(distDir, 'ques')
    },
    {
      target: '/var/www/repo1/frontend/englishom-blog/dist/public',
      link: path.join(distDir, 'blog')
    },
    {
      target: '/var/www/repo1/frontend/englishom-dashboard/dist/public',
      link: path.join(distDir, 'dashboard')
    },
    {
      target: '/var/www/repo1/frontend/englishom-student-progress/dist',
      link: path.join(distDir, 'progress')
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
