// Файл: postbuild.js (Версия 2.0, с правильным доменом)
import fs from 'fs/promises';
import path from 'path';

// ВАЖНО: Адрес вашего сайта Netlify
const siteUrl = 'https://butlerspb-blog.netlify.app'; 
const publicDir = './dist';

async function generateSitemap() {
    console.log('--- Запуск генератора Sitemap.xml ---');
    try {
        const files = await fs.readdir(publicDir, { recursive: true });
        const htmlFiles = files.filter(file => file.endsWith('.html'));

        const urls = htmlFiles.map(file => {
            let relativePath = path.join('/', file).replace(/\\/g, '/');
            if (relativePath.endsWith('index.html')) {
                relativePath = relativePath.slice(0, -10);
            } else if (relativePath.endsWith('.html')) {
                relativePath = relativePath.slice(0, -5);
            }
            return `
    <url>
        <loc>${siteUrl}${relativePath}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>0.8</priority>
    </url>`;
        });

        const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.join('')}
</urlset>`;

        await fs.writeFile(path.join(publicDir, 'sitemap.xml'), sitemapContent);
        console.log(`[✔] Sitemap.xml успешно сгенерирован! Найдено ${urls.length} страниц.`);

    } catch (error) {
        console.error('[!] Ошибка при генерации Sitemap.xml:', error);
    }
}

generateSitemap();
