import fs from 'fs';
import path from 'path';

function loadLayout() {
    const configPath = path.join(`./`, `layout.json`)
    if (!fs.existsSync(configPath)) {
        console.error(`Error: layout.json not found.`, configPath);
        process.exit(1);
    }
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    return config;
}

const layout = loadLayout();

export { loadLayout, layout };