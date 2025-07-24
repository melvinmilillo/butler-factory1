// Файл: src/pages/rss.xml.js (Версия 2.1 - Исправленная)
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

// ИСПРАВЛЕНИЕ: Мы не импортируем consts.ts, а задаем константы прямо здесь
const SITE_TITLE = 'ButlerSPB';
const SITE_DESCRIPTION = 'ButlerSPB';

export async function GET(context) {
	const posts = await getCollection('posts');
	
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		customData: `
            <yandex:logo>${context.site}favicon.ico</yandex:logo>
            <yandex:logo type="square">${context.site}favicon.ico</yandex:logo>
        `,
        xmlns: {
            'yandex': 'http://news.yandex.ru',
            'media': 'http://search.yahoo.com/mrss/',
            'content': 'http://purl.org/rss/1.0/modules/content/'
        },
		items: posts.map((post) => {
            const rawHtml = marked.parse(post.body);
            const cleanHtml = sanitizeHtml(rawHtml, {
                allowedTags: [ 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ol', 'ul', 'li', 'a', 'br', 'img', 'figure', 'figcaption', 'b', 'strong', 'i', 'em', 's', 'strike', 'del', 'blockquote' ],
                allowedAttributes: {
                    'a': [ 'href' ],
                    'img': [ 'src', 'alt' ]
                }
            });

            return {
                link: `/blog/${post.slug}/`,
                title: post.data.title,
                pubDate: post.data.pubDate,
                description: post.data.description,
                customData: `<content:encoded><![CDATA[${cleanHtml}]]></content:encoded>`,
            }
        }),
	});
}
