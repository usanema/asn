import fs from 'fs';
import path from 'path';

function injectVisualEditor(filePath, collectionName) {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  const parts = content.split('---');
  if (parts.length < 3) return;
  
  let frontmatter = parts[1];
  let body = parts.slice(2).join('---');
  
  // Add import if not exists
  if (!frontmatter.includes("import { setAttr } from '@directus/visual-editing';")) {
    frontmatter = frontmatter.replace(/(import .*?;)/, "$1\nimport { setAttr } from '@directus/visual-editing';");
  }
  
  // Replace set:html={xxx}
  body = body.replace(/set:html=\{([a-zA-Z0-9_]+)\}/g, (match, p1) => {
    return `data-directus={pageData?.id ? setAttr({ collection: '${collectionName}', item: pageData.id, fields: '${p1}' }) : undefined} set:html={${p1}}`;
  });
  
  // Replace {xxxDesc} inside tags
  body = body.replace(/(<[a-zA-Z0-9]+[^>]*)>(?:\s*)\{([a-zA-Z0-9_]+Desc)\}(?:\s*)(<\/[a-zA-Z0-9]+>)/g, (match, p1, p2, p3) => {
    if (match.includes('data-directus')) return match; // already injected
    return `${p1} data-directus={pageData?.id ? setAttr({ collection: '${collectionName}', item: pageData.id, fields: '${p2}' }) : undefined}>\n                            {${p2}}\n                        ${p3}`;
  });

  // Replace images
  // <img ... src={heroImage} />
  body = body.replace(/(<img[^>]*src=\{([a-zA-Z0-9_]+)\}[^>]*>)/g, (match, p1, p2) => {
    if (match.includes('data-directus')) return match;
    // We assume the original field name is the same as the variable name, e.g., heroImage
    return match.replace('<img', `<img data-directus={pageData?.id ? setAttr({ collection: '${collectionName}', item: pageData.id, fields: '${p2}' }) : undefined}`);
  });

  fs.writeFileSync(filePath, '---' + frontmatter + '---' + body, 'utf-8');
  console.log(`Injected Visual Editor attributes into ${filePath}`);
}

const pages = [
  { file: 'src/pages/index.astro', collection: 'home_page' },
  { file: 'src/pages/pl/index.astro', collection: 'home_page' },
  { file: 'src/pages/de/index.astro', collection: 'home_page' },
  
  { file: 'src/pages/about.astro', collection: 'about_page' },
  { file: 'src/pages/pl/about.astro', collection: 'about_page' },
  { file: 'src/pages/de/about.astro', collection: 'about_page' },
  
  { file: 'src/pages/uslugi.astro', collection: 'services_page' },
  { file: 'src/pages/pl/uslugi.astro', collection: 'services_page' },
  { file: 'src/pages/de/uslugi.astro', collection: 'services_page' },
  
  { file: 'src/pages/doswiadczenie.astro', collection: 'experience_page' },
  { file: 'src/pages/pl/doswiadczenie.astro', collection: 'experience_page' },
  { file: 'src/pages/de/doswiadczenie.astro', collection: 'experience_page' },
  
  { file: 'src/pages/kontakt.astro', collection: 'contact_page' },
  { file: 'src/pages/pl/kontakt.astro', collection: 'contact_page' },
  { file: 'src/pages/de/kontakt.astro', collection: 'contact_page' }
];

for (const page of pages) {
  // Try to extract the real collection name from the frontmatter to be safe
  if (fs.existsSync(page.file)) {
    const content = fs.readFileSync(page.file, 'utf-8');
    const match = content.match(/collection:\s*'([^']+)'/);
    if (match) {
        page.collection = match[1];
    }
    injectVisualEditor(page.file, page.collection);
  }
}
