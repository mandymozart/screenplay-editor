import express from 'express';
import path from 'path';
import fs from 'fs/promises';

const app = express();
const PORT = 3000;

async function startServer() {
    app.use(express.static(path.join(process.cwd(), 'public')));

    const apiDir = path.join(process.cwd(), 'src/server/api');
    const files = await fs.readdir(apiDir);

    files.forEach(async (file) => {
        if (file.endsWith('.js')) {
            const handler = (await import(`./api/${file}`)).default;
            app.use(`/api/${path.basename(file, '.js')}`, handler);
        }
    });

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

startServer().catch((err) => {
    console.error('Failed to start server:', err);
});
