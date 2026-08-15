import fs from 'fs';

function refactorFiles(files, config) {
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf-8');
    const parts = content.split('---');
    if (parts.length < 3) continue;

    let frontmatter = parts[1];
    let body = parts.slice(2).join('---');

    let varsToInject = [];

    for (const item of config) {
      const { varName, regex, isSetHtml = false, isAttribute = false } = item;

      body = body.replace(regex, (match, p1) => {
        varsToInject.push(`const ${varName} = attrs.${varName} || \`${p1.trim()}\`;`);
        
        if (isAttribute) {
          return match.replace(`"${p1}"`, `{${varName}}`);
        } else if (isSetHtml) {
          return match.replace(/>([\s\S]*?)<\//, ` set:html={${varName}}></`);
        } else {
          return match.replace(p1, `{${varName}}`);
        }
      });
    }

    for (const v of varsToInject) {
      const vName = v.split('=')[0].trim();
      if (!frontmatter.includes(vName)) {
        frontmatter += v + '\n';
      }
    }

    const newContent = '---' + frontmatter + '---' + body;
    fs.writeFileSync(file, newContent, 'utf-8');
    console.log(`Refactored ${file}`);
  }
}

// ================= ABOUT =================
refactorFiles(
  ['src/pages/about.astro', 'src/pages/pl/about.astro', 'src/pages/de/about.astro'],
  [
    {
      varName: 'heroBadge',
      regex: /<span class="material-symbols-outlined text-\[18px\]">hub<\/span>\s*<span>([\s\S]*?)<\/span>/,
      isSetHtml: false
    },
    {
      varName: 'whyUsTitle',
      regex: /<h2 class="font-display text-headline-md text-primary mb-4">([\s\S]*?)<\/h2>/,
      isSetHtml: true
    },
    {
      varName: 'whyUs1Title',
      regex: /<span class="material-symbols-outlined text-3xl">verified_user<\/span>[\s\S]*?<\/div>\s*<h3 class="font-display text-headline-sm text-primary mb-4">([\s\S]*?)<\/h3>/,
      isSetHtml: false
    },
    {
      varName: 'whyUs1Desc',
      regex: /<span class="material-symbols-outlined text-3xl">verified_user<\/span>[\s\S]*?<\/div>\s*<h3 class="font-display text-headline-sm text-primary mb-4">[\s\S]*?<\/h3>\s*<p class="text-on-surface-variant">([\s\S]*?)<\/p>/,
      isSetHtml: false
    },
    {
      varName: 'whyUs2Title',
      regex: /<span class="material-symbols-outlined text-3xl">psychology<\/span>[\s\S]*?<\/div>\s*<h3 class="font-display text-headline-sm text-primary mb-4">([\s\S]*?)<\/h3>/,
      isSetHtml: false
    },
    {
      varName: 'whyUs2Desc',
      regex: /<span class="material-symbols-outlined text-3xl">psychology<\/span>[\s\S]*?<\/div>\s*<h3 class="font-display text-headline-sm text-primary mb-4">[\s\S]*?<\/h3>\s*<p class="text-on-surface-variant">([\s\S]*?)<\/p>/,
      isSetHtml: false
    },
    {
      varName: 'whyUs3Title',
      regex: /<span class="material-symbols-outlined text-3xl">handshake<\/span>[\s\S]*?<\/div>\s*<h3 class="font-display text-headline-sm text-primary mb-4">([\s\S]*?)<\/h3>/,
      isSetHtml: false
    },
    {
      varName: 'whyUs3Desc',
      regex: /<span class="material-symbols-outlined text-3xl">handshake<\/span>[\s\S]*?<\/div>\s*<h3 class="font-display text-headline-sm text-primary mb-4">[\s\S]*?<\/h3>\s*<p class="text-on-surface-variant">([\s\S]*?)<\/p>/,
      isSetHtml: false
    },
    {
      varName: 'metric1Value',
      regex: /<div class="font-display text-display font-bold text-secondary-fixed mb-2">(15\+)<\/div>/,
      isSetHtml: false
    },
    {
      varName: 'metric1Label',
      regex: /<div class="font-display text-display font-bold text-secondary-fixed mb-2">15\+<\/div>\s*<div class="font-bold text-label-md uppercase tracking-wider text-white\/80">([\s\S]*?)<\/div>/,
      isSetHtml: false
    },
    {
      varName: 'metric2Value',
      regex: /<div class="font-display text-display font-bold text-secondary-fixed mb-2">(500\+)<\/div>/,
      isSetHtml: false
    },
    {
      varName: 'metric2Label',
      regex: /<div class="font-display text-display font-bold text-secondary-fixed mb-2">500\+<\/div>\s*<div class="font-bold text-label-md uppercase tracking-wider text-white\/80">([\s\S]*?)<\/div>/,
      isSetHtml: false
    },
    {
      varName: 'metric3Value',
      regex: /<div class="font-display text-display font-bold text-secondary-fixed mb-2">(12)<\/div>/,
      isSetHtml: false
    },
    {
      varName: 'metric3Label',
      regex: /<div class="font-display text-display font-bold text-secondary-fixed mb-2">12<\/div>\s*<div class="font-bold text-label-md uppercase tracking-wider text-white\/80">([\s\S]*?)<\/div>/,
      isSetHtml: false
    },
    {
      varName: 'metric4Value',
      regex: /<div class="font-display text-display font-bold text-secondary-fixed mb-2">(100%)<\/div>/,
      isSetHtml: false
    },
    {
      varName: 'metric4Label',
      regex: /<div class="font-display text-display font-bold text-secondary-fixed mb-2">100%<\/div>\s*<div class="font-bold text-label-md uppercase tracking-wider text-white\/80">([\s\S]*?)<\/div>/,
      isSetHtml: false
    },
    {
      varName: 'ctaTitle',
      regex: /<h2 class="font-display text-headline-md text-primary mb-6">([\s\S]*?)<\/h2>/,
      isSetHtml: true
    },
    {
      varName: 'ctaDesc',
      regex: /<p class="text-body-lg text-on-surface-variant mb-10">([\s\S]*?)<\/p>/,
      isSetHtml: false
    },
    {
      varName: 'ctaBtn',
      regex: /<a href="\/[a-z]*\/?kontakt" class="inline-flex items-center gap-2 px-8 py-4 bg-navy text-white font-display text-label-md rounded-DEFAULT hover:bg-secondary transition-all group">\s*([\s\S]*?)\s*<span/,
      isSetHtml: false
    }
  ]
);
