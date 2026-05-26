import { readFileSync, existsSync, readdirSync } from 'fs';
import path from 'path';

function findProxyPass(filePath) {
  try {
    if (!existsSync(filePath)) return;
    const content = readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let currentServer = '';
    let currentLocation = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('server_name')) currentServer = line;
      if (line.startsWith('location')) currentLocation = line;
      if (line.startsWith('proxy_pass')) {
        console.log(`${filePath}:${i+1} | ${currentServer} | ${currentLocation} | ${line}`);
      }
    }
  } catch(e) {}
}

const nginxDir = '/etc/nginx';
if (existsSync(nginxDir)) {
  findProxyPass(path.join(nginxDir, 'nginx.conf'));
  
  const confdDir = path.join(nginxDir, 'conf.d');
  if (existsSync(confdDir)) {
    for (const file of readdirSync(confdDir)) {
      findProxyPass(path.join(confdDir, file));
    }
  }
  
  const sitesAvailable = path.join(nginxDir, 'sites-available');
  if (existsSync(sitesAvailable)) {
    for (const file of readdirSync(sitesAvailable)) {
      findProxyPass(path.join(sitesAvailable, file));
    }
  }
  
  const sitesEnabled = path.join(nginxDir, 'sites-enabled');
  if (existsSync(sitesEnabled)) {
    for (const file of readdirSync(sitesEnabled)) {
      findProxyPass(path.join(sitesEnabled, file));
    }
  }
}
