import fs from 'fs';

const pages = [
  'src/pages/index.astro', 'src/pages/pl/index.astro', 'src/pages/de/index.astro',
  'src/pages/about.astro', 'src/pages/pl/about.astro', 'src/pages/de/about.astro',
  'src/pages/uslugi.astro', 'src/pages/pl/uslugi.astro', 'src/pages/de/uslugi.astro',
  'src/pages/doswiadczenie.astro', 'src/pages/pl/doswiadczenie.astro', 'src/pages/de/doswiadczenie.astro',
  'src/pages/kontakt.astro', 'src/pages/pl/kontakt.astro', 'src/pages/de/kontakt.astro'
];

for (const file of pages) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');
    
    content = content.replace(/data-directus=\{pageData\?\.id \? setAttr\(\{ collection: '([^']+)', item: pageData\.id, fields: '([^']+)' \}\) : undefined\}/g, "data-directus={setAttr({ collection: '$1', fields: '$2' })}");
    
    fs.writeFileSync(file, content, 'utf-8');
  }
}
console.log("Fixed visual editor tags for singletons!");
