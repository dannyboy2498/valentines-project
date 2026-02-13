import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const distPath = path.resolve(process.cwd(), 'dist');

if (!fs.existsSync(distPath)) {
    console.log('Dist folder not found. Run build first.');
    process.exit(1);
}

let cname = '';

// Try to get from environment variable first (CI/CD)
if (process.env.VITE_CNAME) {
    cname = process.env.VITE_CNAME;
}
// Otherwise try to parse .env file locally
else if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/^VITE_CNAME=(.*)$/m);
    if (match && match[1]) {
        cname = match[1].trim().replace(/['"]/g, '');
    }
}

if (cname) {
    fs.writeFileSync(path.join(distPath, 'CNAME'), cname);
    console.log(`✅ CNAME file created for: ${cname}`);
} else {
    console.log('ℹ️ No VITE_CNAME found. Skipping CNAME generation.');
}
