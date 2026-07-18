const fs = require('fs');
const path = require('path');

function replaceInDir(dir, searchStr, replaceStr) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            replaceInDir(fullPath, searchStr, replaceStr);
        } else if (entry.isFile() && /\.(ts|tsx|json)$/.test(entry.name)) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes(searchStr)) {
                const newContent = content.split(searchStr).join(replaceStr);
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

replaceInDir('d:\\new project\\project3\\frontend\\english-home-vite\\src', 'إنجلش هوم', 'إنجلشوم');
replaceInDir('d:\\new project\\project3\\frontend\\englishom-student-progress\\src', 'إنجلش هوم', 'إنجلشوم');
console.log('Done.');
