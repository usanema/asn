import fs from 'fs';

const files = [
  'src/pages/index.astro',
  'src/pages/pl/index.astro',
  'src/pages/de/index.astro'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');

  // Split file into frontmatter and body
  // Astro files usually start with --- and end frontmatter with ---
  const parts = content.split('---');
  if (parts.length < 3) {
    console.error("Couldn't parse frontmatter in", file);
    continue;
  }

  let frontmatter = parts[1];
  let body = parts.slice(2).join('---');

  const varsToInject = `
const heroBtnService = attrs.heroBtnService || "Poznaj nasze usługi";
const heroBtnAbout = attrs.heroBtnAbout || "About ASN Network";
const pillarsTitle = attrs.pillarsTitle || "Filary naszej działalności";
const pillar1Title = attrs.pillar1Title || "Spawalnictwo i technika spawalnicza";
const pillar1Desc = attrs.pillar1Desc || "Kompleksowa koordynacja procesów spawalniczych, dobór technologii oraz optymalizacja parametrów zgodnie z normami ISO 3834 i EN 1090.";
const pillar2Title = attrs.pillar2Title || "Badania Nieniszczące (NDT)";
const pillar2Desc = attrs.pillar2Desc || "Niezależny nadzór i realizacja badań VT, PT, MT, UT, RT. Gwarantujemy precyzję pomiarową i najwyższe standardy kontroli jakości.";
const pillar3Title = attrs.pillar3Title || "Ochrona Antykorozyjna";
const pillar3Desc = attrs.pillar3Desc || "Nadzór nad procesami przygotowania powierzchni i aplikacji powłok. Trwałość struktur i pełna zgodność ze specyfikacją projektu.";
const modelTitle = attrs.modelTitle || "Współpraca na najwyższym poziomie";
const modelSubTitle = attrs.modelSubTitle || "Model Współpracy, który daje pewność.";
const modelDesc = attrs.modelDesc || "Nasze podejście opiera się na pełnej transparentności i inżynierskiej precyzji. Jako niezależny partner, chronimy interesy inwestora na każdym etapie realizacji - od weryfikacji dokumentacji, przez nadzór na budowie, aż po odbiory końcowe.";
const supportTitle = attrs.supportTitle || "Kompleksowe wsparcie";
const supportDesc = attrs.supportDesc || "Twój projekt w rękach ekspertów.";
const whyTitle = attrs.whyTitle || "Dlaczego my?";
const whyDesc = attrs.whyDesc || "Wybierając ASN Network, zyskujesz partnera, dla którego jakość i bezpieczeństwo to nie tylko wymóg, ale fundament działania.";
const why1Title = attrs.why1Title || "Niezależność";
const why1Desc = attrs.why1Desc || "Jesteśmy obiektywni i w 100% chronimy interesy inwestora lub generalnego wykonawcy.";
const why2Title = attrs.why2Title || "Doświadczenie";
const why2Desc = attrs.why2Desc || "Lata praktyki na największych europejskich projektach infrastrukturalnych i przemysłowych.";
const why3Title = attrs.why3Title || "Kompleksowość";
const why3Desc = attrs.why3Desc || "Od audytu projektu, przez nadzór produkcyjny, po finalne badania NDT - wszystko w jednym miejscu.";
const why4Title = attrs.why4Title || "Certyfikacje";
const why4Desc = attrs.why4Desc || "Nasi inżynierowie posiadają pełne uprawnienia (IWE, IWI, certyfikaty NDT level 2 i 3, FROSIO/NACE).";
const locationTitle = attrs.locationTitle || "Centrala w sercu Europy";
const locationDesc = attrs.locationDesc || "Nasza główna siedziba znajduje się w Bremie (Niemcy) - przemysłowym centrum Europy. Stąd koordynujemy projekty na terenie całego kontynentu, zapewniając błyskawiczną reakcję i najwyższą jakość nadzoru dla naszych międzynarodowych klientów.";
const locationBtn = attrs.locationBtn || "Skontaktuj się z centralą";
`;

  if (!frontmatter.includes('const heroBtnService')) {
    frontmatter += varsToInject;
  }

  // Safely replace in body ONLY
  body = body.replace(/>\\s*Poznaj nasze usługi\\s*</g, '>{heroBtnService}<');
  body = body.replace(/>\\s*About ASN Network\\s*</g, '>{heroBtnAbout}<');
  body = body.replace(/>\\s*Über das ASN-Netzwerk\\s*</g, '>{heroBtnAbout}<');
  
  body = body.replace(/<h2 class="font-display text-headline-md text-primary mb-4">Filary naszej działalności<\/h2>/g, '<h2 class="font-display text-headline-md text-primary mb-4" set:html={pillarsTitle}></h2>');
  
  body = body.replace(/<h3 class="font-display text-headline-sm text-primary mb-4">Spawalnictwo i technika spawalnicza<\/h3>/g, '<h3 class="font-display text-headline-sm text-primary mb-4" set:html={pillar1Title}></h3>');
  body = body.replace(/Kompleksowa koordynacja procesów spawalniczych, dobór technologii oraz optymalizacja parametrów zgodnie z normami ISO 3834 i EN 1090\./g, '{pillar1Desc}');
  
  body = body.replace(/<h3 class="font-display text-headline-sm text-primary mb-4">Badania Nieniszczące \(NDT\)<\/h3>/g, '<h3 class="font-display text-headline-sm text-primary mb-4" set:html={pillar2Title}></h3>');
  body = body.replace(/Niezależny nadzór i realizacja badań VT, PT, MT, UT, RT\. Gwarantujemy precyzję pomiarową i najwyższe standardy kontroli jakości\./g, '{pillar2Desc}');
  
  body = body.replace(/<h3 class="font-display text-headline-sm text-primary mb-4">Ochrona Antykorozyjna<\/h3>/g, '<h3 class="font-display text-headline-sm text-primary mb-4" set:html={pillar3Title}></h3>');
  body = body.replace(/Nadzór nad procesami przygotowania powierzchni i aplikacji powłok\. Trwałość struktur i pełna zgodność ze specyfikacją projektu\./g, '{pillar3Desc}');
  
  body = body.replace(/Współpraca na najwyższym poziomie/g, '{modelTitle}');
  body = body.replace(/Model Współpracy, który daje pewność\./g, '{modelSubTitle}');
  body = body.replace(/Nasze podejście opiera się na pełnej transparentności i inżynierskiej precyzji\. Jako niezależny partner, chronimy interesy inwestora na każdym etapie realizacji - od weryfikacji dokumentacji, przez nadzór na budowie, aż po odbiory końcowe\./g, '{modelDesc}');
  
  body = body.replace(/<span class="text-primary font-bold uppercase tracking-wider text-sm mb-2 block">Kompleksowe wsparcie<\/span>/g, '<span class="text-primary font-bold uppercase tracking-wider text-sm mb-2 block">{supportTitle}</span>');
  body = body.replace(/<h2 class="font-display text-headline-sm md:text-headline-md text-navy mb-8">Twój projekt w rękach ekspertów\.<\/h2>/g, '<h2 class="font-display text-headline-sm md:text-headline-md text-navy mb-8" set:html={supportDesc}></h2>');
  
  body = body.replace(/<h2 class="font-display text-headline-md text-primary mb-4">Dlaczego my\?<\/h2>/g, '<h2 class="font-display text-headline-md text-primary mb-4" set:html={whyTitle}></h2>');
  body = body.replace(/Wybierając ASN Network, zyskujesz partnera, dla którego jakość i bezpieczeństwo to nie tylko wymóg, ale fundament działania\./g, '{whyDesc}');
  
  body = body.replace(/<h3 class="font-display text-title-lg text-primary mb-2">Niezależność<\/h3>/g, '<h3 class="font-display text-title-lg text-primary mb-2" set:html={why1Title}></h3>');
  body = body.replace(/Jesteśmy obiektywni i w 100% chronimy interesy inwestora lub generalnego wykonawcy\./g, '{why1Desc}');
  
  body = body.replace(/<h3 class="font-display text-title-lg text-primary mb-2">Doświadczenie<\/h3>/g, '<h3 class="font-display text-title-lg text-primary mb-2" set:html={why2Title}></h3>');
  body = body.replace(/Lata praktyki na największych europejskich projektach infrastrukturalnych i przemysłowych\./g, '{why2Desc}');
  
  body = body.replace(/<h3 class="font-display text-title-lg text-primary mb-2">Kompleksowość<\/h3>/g, '<h3 class="font-display text-title-lg text-primary mb-2" set:html={why3Title}></h3>');
  body = body.replace(/Od audytu projektu, przez nadzór produkcyjny, po finalne badania NDT - wszystko w jednym miejscu\./g, '{why3Desc}');
  
  body = body.replace(/<h3 class="font-display text-title-lg text-primary mb-2">Certyfikacje<\/h3>/g, '<h3 class="font-display text-title-lg text-primary mb-2" set:html={why4Title}></h3>');
  body = body.replace(/Nasi inżynierowie posiadają pełne uprawnienia \(IWE, IWI, certyfikaty NDT level 2 i 3, FROSIO\/NACE\)\./g, '{why4Desc}');

  body = body.replace(/Centrala w sercu Europy/g, '{locationTitle}');
  body = body.replace(/Nasza główna siedziba znajduje się w Bremie \(Niemcy\) - przemysłowym centrum Europy\. Stąd koordynujemy projekty na terenie całego kontynentu, zapewniając błyskawiczną reakcję i najwyższą jakość nadzoru dla naszych międzynarodowych klientów\./g, '{locationDesc}');
  body = body.replace(/>\\s*Skontaktuj się z centralą\\s*</g, '>{locationBtn}<');
  body = body.replace(/>\\s*Kontakt z centralą\\s*</g, '>{locationBtn}<'); // another variant

  const newContent = '---' + frontmatter + '---' + body;
  fs.writeFileSync(file, newContent, 'utf-8');
}
console.log('index.astro fully refactored safely.');
