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
      const { varName, regex, isSetHtml = false, global = false } = item;

      let matchCount = 0;
      const rx = new RegExp(regex, global ? 'g' : '');
      
      body = body.replace(rx, (match, p1) => {
        matchCount++;
        const currentVarName = varName.includes('#') ? varName.replace('#', matchCount) : varName;
        varsToInject.push(`const ${currentVarName} = attrs.${currentVarName} || \`${p1.trim()}\`;`);
        
        if (isSetHtml) {
          return match.replace(/>([\s\S]*?)<\//, ` set:html={${currentVarName}}></`);
        } else {
          return match.replace(p1, `{${currentVarName}}`);
        }
      });
    }

    // Append varsToInject to frontmatter if not already there
    for (const v of varsToInject) {
      const vName = v.split('=')[0].trim();
      if (!frontmatter.includes(vName)) {
        frontmatter += v + '\\n';
      }
    }

    const newContent = '---' + frontmatter + '---' + body;
    fs.writeFileSync(file, newContent, 'utf-8');
    console.log(`Refactored ${file}`);
  }
}

// ================= DOSWIADCZENIE =================
refactorFiles(
  ['src/pages/doswiadczenie.astro', 'src/pages/pl/doswiadczenie.astro', 'src/pages/de/doswiadczenie.astro'],
  [
    {
      varName: 'modelAdv1Title',
      regex: /<span class="material-symbols-outlined text-secondary text-3xl">assignment_turned_in<\/span>\s*<div>\s*<h4 class="font-display font-bold text-primary mb-1">([\s\S]*?)<\/h4>/,
      isSetHtml: true
    },
    {
      varName: 'modelAdv1Desc',
      regex: /<span class="material-symbols-outlined text-secondary text-3xl">assignment_turned_in<\/span>\s*<div>\s*<h4 class="font-display font-bold text-primary mb-1">[\s\S]*?<\/h4>\s*<p class="text-sm text-on-surface-variant">([\s\S]*?)<\/p>/
    },
    {
      varName: 'modelAdv2Title',
      regex: /<span class="material-symbols-outlined text-secondary text-3xl">verified_user<\/span>\s*<div>\s*<h4 class="font-display font-bold text-primary mb-1">([\s\S]*?)<\/h4>/,
      isSetHtml: true
    },
    {
      varName: 'modelAdv2Desc',
      regex: /<span class="material-symbols-outlined text-secondary text-3xl">verified_user<\/span>\s*<div>\s*<h4 class="font-display font-bold text-primary mb-1">[\s\S]*?<\/h4>\s*<p class="text-sm text-on-surface-variant">([\s\S]*?)<\/p>/
    },
    {
      varName: 'imageOverlayText',
      regex: /<p class="text-white font-display text-lg font-bold">([\s\S]*?)<\/p>/,
      isSetHtml: true
    },
    {
      varName: 'whyAsnTitle',
      regex: /<h2 class="font-display text-3xl font-bold text-primary mb-3">([\s\S]*?)<\/h2>/,
      isSetHtml: true
    },
    {
      varName: 'whyAsnDesc',
      regex: /<p class="text-on-surface-variant max-w-xl mx-auto">([\s\S]*?)<\/p>/
    },
    {
      varName: 'whyAsn#Title',
      regex: /<div class="bg-surface p-8 rounded-xl border border-outline-variant\/30 shadow-sm">\s*<div class="w-12 h-1 bg-secondary mb-6"><\/div>\s*<h3 class="font-display text-xl font-bold text-primary mb-3">([\s\S]*?)<\/h3>/,
      isSetHtml: true,
      global: true
    },
    {
      varName: 'whyAsn#Desc',
      regex: /<div class="bg-surface p-8 rounded-xl border border-outline-variant\/30 shadow-sm">\s*<div class="w-12 h-1 bg-secondary mb-6"><\/div>\s*<h3 class="font-display text-xl font-bold text-primary mb-3">[\s\S]*?<\/h3>\s*<p class="text-sm text-on-surface-variant leading-relaxed">([\s\S]*?)<\/p>/,
      global: true
    }
  ]
);

// ================= KONTAKT =================
refactorFiles(
  ['src/pages/kontakt.astro', 'src/pages/pl/kontakt.astro', 'src/pages/de/kontakt.astro'],
  [
    {
      varName: 'labelName',
      regex: /<label class="font-bold text-xs text-on-surface uppercase tracking-wider block">([^<]*?Name|Imię[^<]*?)<\/label>/,
      isSetHtml: true
    },
    {
      varName: 'labelEmail',
      regex: /<label class="font-bold text-xs text-on-surface uppercase tracking-wider block">([^<]*?Email[^<]*?)<\/label>/,
      isSetHtml: true
    },
    {
      varName: 'labelSubject',
      regex: /<label class="font-bold text-xs text-on-surface uppercase tracking-wider block">([^<]*?Topic|Temat[^<]*?)<\/label>/,
      isSetHtml: true
    },
    {
      varName: 'labelMessage',
      regex: /<label class="font-bold text-xs text-on-surface uppercase tracking-wider block">([^<]*?Message|Wiadomość[^<]*?)<\/label>/,
      isSetHtml: true
    },
    {
      varName: 'btnSubmit',
      regex: /<button class="w-full md:w-auto bg-primary text-white px-8 py-4 font-bold rounded-lg hover:bg-secondary transition-all flex items-center justify-center gap-2 shadow-md group" type="submit">\s*([\s\S]*?)\s*<span/,
    },
    {
      varName: 'labelConsent',
      regex: /<label class="text-xs text-on-surface-variant cursor-pointer select-none" for="consent_[a-z]+">([\s\S]*?)<\/label>/,
      isSetHtml: true
    }
  ]
);
