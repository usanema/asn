import fs from 'fs';

function replaceInFiles(files, varsToInject, replacements) {
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');
    const parts = content.split('---');
    if (parts.length < 3) continue;

    let frontmatter = parts[1];
    let body = parts.slice(2).join('---');

    // Only inject if not already injected
    if (!frontmatter.includes(varsToInject.trim().split('\\n')[0])) {
      frontmatter += varsToInject;
    }

    for (const [search, replace] of replacements) {
      if (typeof search === 'string') {
        body = body.split(search).join(replace);
      } else {
        body = body.replace(search, replace);
      }
    }

    fs.writeFileSync(file, '---' + frontmatter + '---' + body, 'utf-8');
  }
}

// ================= INDEX =================
replaceInFiles(
  ['src/pages/index.astro', 'src/pages/pl/index.astro', 'src/pages/de/index.astro'],
  `
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
`,
  [
    [/\\s*Poznaj nasze usługi\\s*/g, '{heroBtnService}'],
    [/\\s*About ASN Network\\s*/g, '{heroBtnAbout}'],
    [/\\s*Über das ASN-Netzwerk\\s*/g, '{heroBtnAbout}'],
    [/>Filary naszej działalności</g, ' set:html={pillarsTitle}>'],
    [/>Unsere Säulen</g, ' set:html={pillarsTitle}>'],
    [/>Spawalnictwo i technika spawalnicza</g, ' set:html={pillar1Title}>'],
    [/>Badania Nieniszczące \\(NDT\\)</g, ' set:html={pillar2Title}>'],
    [/>Ochrona Antykorozyjna</g, ' set:html={pillar3Title}>'],
    [/Kompleksowa koordynacja procesów spawalniczych, dobór technologii oraz optymalizacja parametrów zgodnie z normami ISO 3834 i EN 1090\\./g, '{pillar1Desc}'],
    [/Niezależny nadzór i realizacja badań VT, PT, MT, UT, RT\\. Gwarantujemy precyzję pomiarową i najwyższe standardy kontroli jakości\\./g, '{pillar2Desc}'],
    [/Nadzór nad procesami przygotowania powierzchni i aplikacji powłok\\. Trwałość struktur i pełna zgodność ze specyfikacją projektu\\./g, '{pillar3Desc}'],
    [/>Współpraca na najwyższym poziomie</g, ' set:html={modelTitle}>'],
    [/>Model Współpracy, który daje pewność\\.</g, ' set:html={modelSubTitle}>'],
    [/Nasze podejście opiera się na pełnej transparentności i inżynierskiej precyzji\\. Jako niezależny partner, chronimy interesy inwestora na każdym etapie realizacji - od weryfikacji dokumentacji, przez nadzór na budowie, aż po odbiory końcowe\\./g, '{modelDesc}'],
    [/>Kompleksowe wsparcie</g, ' set:html={supportTitle}>'],
    [/>Twój projekt w rękach ekspertów\\.</g, ' set:html={supportDesc}>'],
    [/>Dlaczego my\\?</g, ' set:html={whyTitle}>'],
    [/Wybierając ASN Network, zyskujesz partnera, dla którego jakość i bezpieczeństwo to nie tylko wymóg, ale fundament działania\\./g, '{whyDesc}'],
    [/>Niezależność</g, ' set:html={why1Title}>'],
    [/Jesteśmy obiektywni i w 100% chronimy interesy inwestora lub generalnego wykonawcy\\./g, '{why1Desc}'],
    [/>Doświadczenie</g, ' set:html={why2Title}>'],
    [/Lata praktyki na największych europejskich projektach infrastrukturalnych i przemysłowych\\./g, '{why2Desc}'],
    [/>Kompleksowość</g, ' set:html={why3Title}>'],
    [/Od audytu projektu, przez nadzór produkcyjny, po finalne badania NDT - wszystko w jednym miejscu\\./g, '{why3Desc}'],
    [/>Certyfikacje</g, ' set:html={why4Title}>'],
    [/Nasi inżynierowie posiadają pełne uprawnienia \\(IWE, IWI, certyfikaty NDT level 2 i 3, FROSIO\\/NACE\\)\\./g, '{why4Desc}'],
    [/>Centrala w sercu Europy</g, ' set:html={locationTitle}>'],
    [/Nasza główna siedziba znajduje się w Bremie \\(Niemcy\\) - przemysłowym centrum Europy\\. Stąd koordynujemy projekty na terenie całego kontynentu, zapewniając błyskawiczną reakcję i najwyższą jakość nadzoru dla naszych międzynarodowych klientów\\./g, '{locationDesc}'],
    [/Skontaktuj się z centralą/g, '{locationBtn}'],
    [/Kontakt z centralą/g, '{locationBtn}']
  ]
);

// ================= ABOUT =================
replaceInFiles(
  ['src/pages/about.astro', 'src/pages/pl/about.astro', 'src/pages/de/about.astro'],
  `
const heroTitle = attrs.heroTitle || "Nasza Historia i Misja";
const heroDesc = attrs.heroDesc || "Od lokalnych projektów do europejskiej sieci inżynierskiej.";
const missionTitle = attrs.missionTitle || "Misja";
const missionDesc = attrs.missionDesc || "Zapewnienie najwyższego poziomu bezpieczeństwa i jakości w europejskim przemyśle.";
const visionTitle = attrs.visionTitle || "Wizja";
const visionDesc = attrs.visionDesc || "Stworzenie najbardziej zaufanej sieci inżynierskiej w Europie.";
const metricsTitle = attrs.metricsTitle || "Liczby, które mówią same za siebie";
const metric1Value = attrs.metric1Value || "15+";
const metric1Label = attrs.metric1Label || "Lat doświadczenia";
const metric2Value = attrs.metric2Value || "500+";
const metric2Label = attrs.metric2Label || "Zakończonych projektów";
const metric3Value = attrs.metric3Value || "50+";
const metric3Label = attrs.metric3Label || "Inżynierów w sieci";
const metric4Value = attrs.metric4Value || "12";
const metric4Label = attrs.metric4Label || "Krajów działania";
const whyUsTitle = attrs.whyUsTitle || "Dlaczego my?";
const whyUsDesc = attrs.whyUsDesc || "Jesteśmy ekspertami.";
const storyTitle = attrs.storyTitle || "Historia";
const storyDesc = attrs.storyDesc || "Nasza droga do sukcesu.";
const teamTitle = attrs.teamTitle || "Nasz zespół";
const teamDesc = attrs.teamDesc || "Eksperci, na których możesz polegać.";
const ctaTitle = attrs.ctaTitle || "Gotowy na współpracę?";
const ctaDesc = attrs.ctaDesc || "Skontaktuj się z nami już dziś.";
const ctaBtn = attrs.ctaBtn || "Skontaktuj się";
`,
  [
    // These mappings need to match the specific hardcoded strings in about.astro.
    // Let's first read about.astro to make sure they match! I will just do a generic replacement later for about.
  ]
);

console.log('Finished refactor script definition.');
