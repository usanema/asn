import fs from 'fs';
const pages = [
  'src/pages/index.astro', 'src/pages/pl/index.astro', 'src/pages/de/index.astro',
  'src/pages/about.astro', 'src/pages/pl/about.astro', 'src/pages/de/about.astro',
  'src/pages/uslugi.astro', 'src/pages/pl/uslugi.astro', 'src/pages/de/uslugi.astro',
  'src/pages/doswiadczenie.astro', 'src/pages/pl/doswiadczenie.astro', 'src/pages/de/doswiadczenie.astro',
  'src/pages/kontakt.astro', 'src/pages/pl/kontakt.astro', 'src/pages/de/kontakt.astro',
  'src/components/Header.astro', 'src/components/Footer.astro'
];

const uuidMap = {
  'home_page': '1e05640b-6166-498d-aab4-c2a9d73d76b1',
  'about_page': '39b770e0-6ca4-4561-aa3e-dc97654447a2',
  'services_page': '8b2b279d-8b12-46e9-a4aa-6322e3714933',
  'experience_page': '6200a314-ded6-4568-aff7-16b2b38a1318',
  'global_settings': '89bdd237-97cc-4a97-b41d-697817425ae7'
};

for (const file of pages) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');
    
    // We match: data-directus={setAttr({ collection: 'X', item: anything, fields: 'Y' })}
    content = content.replace(/data-directus=\{setAttr\(\{ collection: '([^']+)', item: [^,]+, fields: '([^']+)' \}\)\}/g, (match, collection, fields) => {
      const uuid = uuidMap[collection] || '1';
      return `data-directus={setAttr({ collection: '${collection}', item: pageData?.id || '${uuid}', fields: '${fields}' })}`;
    });
    
    fs.writeFileSync(file, content, 'utf-8');
  }
}
console.log("Fixed!");
