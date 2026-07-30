/**
 * Helper to fetch content data from Directus CMS or fall back to local multilingual data
 */
export async function fetchApi({ collection, endpoint, locale = 'en', query = {}, isList = false }) {
  const colName = collection || endpoint;
  const col = colName.replace(/-/g, '_');

  const directusUrl = import.meta.env.DIRECTUS_URL || import.meta.env.VITE_DIRECTUS_URL || process?.env?.DIRECTUS_URL;
  const directusToken = import.meta.env.DIRECTUS_TOKEN || import.meta.env.VITE_DIRECTUS_TOKEN || process?.env?.DIRECTUS_TOKEN;

  if (directusUrl) {
    try {
      const url = new URL(`${directusUrl}/items/${col}`);
      url.searchParams.append('fields', '*.*');
      const res = await fetch(url.toString(), {
        headers: directusToken ? { 'Authorization': `Bearer ${directusToken}` } : {}
      });
      if (res.ok) {
        const json = await res.json();
        const rawData = json.data;
        if (rawData) {
          const processItem = (item) => {
            if (!item) return null;
            let merged = { ...item };
            if (item.translations && Array.isArray(item.translations)) {
              const trans = item.translations.find(t => 
                t.languages_code === locale || 
                t.language === locale || 
                t.languages_id === locale || 
                (typeof t.languages_code === 'object' && t.languages_code?.code === locale)
              ) || item.translations[0] || {};
              merged = { ...merged, ...trans };
            }
            return merged;
          };

          if (Array.isArray(rawData)) {
            const processed = rawData.map(processItem);
            if (isList || col.startsWith('navigation')) {
              return processed;
            }
            return processed[0] || null;
          } else {
            return processItem(rawData);
          }
        }
      }
    } catch (err) {
      console.warn(`[Directus] Failed to fetch ${col} from ${directusUrl}, using local fallback:`, err.message);
    }
  }

  const data = getLocalData(col, locale);
  if (data && data.items && Array.isArray(data.items)) {
    if (isList || col.startsWith('navigation')) {
      return data.items;
    }
    return data.items[0] || null;
  }
  return data;
}

/**
 * Returns URL for media files (handles Directus asset UUIDs and external/local paths)
 */
export function getMedia(filename, record) {
  if (filename == null) {
    return null;
  }
  if (typeof filename === 'string' && (filename.startsWith('http') || filename.startsWith('//') || filename.startsWith('/logo.png'))) {
    return filename;
  }
  const directusUrl = import.meta.env.DIRECTUS_URL || import.meta.env.VITE_DIRECTUS_URL;
  if (directusUrl && typeof filename === 'string') {
    return `${directusUrl}/assets/${filename.replace(/^assets\//, '')}`;
  }
  return filename;
}

/**
 * Complete multilingual fallback content data representing all website texts and images
 */
function getLocalData(col, locale = 'en') {
  if (col.startsWith('global_setting')) {
    const t = {
      en: {
        logoText: "ASN Weld & Inspection Network",
        footerText: "© 2024 ASN Weld & Inspection Network. All rights reserved. Brema Headquarters.",
        footerDesc: "Professional engineering network specializing in the coordination and supervision of welding processes and NDT testing. Headquartered in Bremen, European reach.",
        footerServicesLabel: "Services",
        footerLegalLabel: "Legal",
        weldingLabel: "Welding Coordination",
        ndtLabel: "NDT Testing",
        corrosionLabel: "Anti-Corrosion Protection",
        qaqcLabel: "QA/QC Support"
      },
      pl: {
        logoText: "ASN Weld & Inspection Network",
        footerText: "© 2024 ASN Weld & Inspection Network. Wszelkie prawa zastrzeżone. Centrala Brema.",
        footerDesc: "Profesjonalna sieć inżynieryjna specjalizująca się w koordynacji i nadzorze procesów spawalniczych oraz badaniach NDT. Siedziba w Bremie, zasięg europejski.",
        footerServicesLabel: "Usługi",
        footerLegalLabel: "Informacje prawne",
        weldingLabel: "Spawalnictwo",
        ndtLabel: "Badania NDT",
        corrosionLabel: "Ochrona Antykorozyjna",
        qaqcLabel: "Wsparcie QA/QC"
      },
      de: {
        logoText: "ASN Weld & Inspection Network",
        footerText: "© 2024 ASN Weld & Inspection Network. Alle Rechte vorbehalten. Hauptsitz Bremen.",
        footerDesc: "Professionelles Ingenieurnetzwerk, spezialisiert auf die Koordination und Überwachung von Schweißprozessen und ZfP-Prüfungen. Hauptsitz in Bremen, europaweite Reichweite.",
        footerServicesLabel: "Dienstleistungen",
        footerLegalLabel: "Rechtliches",
        weldingLabel: "Schweißkoordination",
        ndtLabel: "ZfP-Prüfung",
        corrosionLabel: "Korrosionsschutz",
        qaqcLabel: "QA/QC Unterstützung"
      }
    };
    const trans = t[locale] || t['en'];
    return {
      id: "mock_global_id",
      backgroundColor: "#fcf8fa",
      colorPrimary: "#112c3f",
      colorSecondary: "#e65c00",
      colorNavy: "#0b1d2a",
      colorSurface: "#ffffff",
      colorText: "#1f2937",
      logo: "/logo.png",
      ...trans
    };
  }
  
  if (col.startsWith('navigation')) {
    const t = {
      en: [
        { id: "nav1", title: "Home", path: "/" },
        { id: "nav2", title: "About Us", path: "/about.html" },
        { id: "nav3", title: "Services", path: "/uslugi.html" },
        { id: "nav4", title: "Experience", path: "/doswiadczenie.html" },
        { id: "nav5", title: "Contact", path: "/kontakt.html" }
      ],
      pl: [
        { id: "nav1", title: "Strona Główna", path: "/" },
        { id: "nav2", title: "O nas", path: "/about.html" },
        { id: "nav3", title: "Usługi", path: "/uslugi.html" },
        { id: "nav4", title: "Doświadczenie", path: "/doswiadczenie.html" },
        { id: "nav5", title: "Kontakt", path: "/kontakt.html" }
      ],
      de: [
        { id: "nav1", title: "Startseite", path: "/" },
        { id: "nav2", title: "Über uns", path: "/about.html" },
        { id: "nav3", title: "Dienstleistungen", path: "/uslugi.html" },
        { id: "nav4", title: "Erfahrung", path: "/doswiadczenie.html" },
        { id: "nav5", title: "Kontakt", path: "/kontakt.html" }
      ]
    };
    return t[locale] || t['en'];
  }

  if (col.startsWith('home_page')) {
    const t = {
      en: { 
        title: "Home Page", 
        seoTitle: "Home | ASN Weld & Inspection Network", 
        seoDesc: "Professional engineering network specializing in the coordination and supervision of welding processes and NDT testing.",
        heroBadge: "Engineering Excellence",
        heroTitle: "Expert Knowledge.<br/><span class=\"text-secondary\">Real Responsibility.</span>",
        heroDesc: "Professional engineering services and project coordination in welding, NDT, and anti-corrosion protection. We ensure precision where safety is a priority.",
        heroBtnService: "Explore our services",
        heroBtnAbout: "About ASN Network",
        heroImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBrGiolNSi1aj_eMj1dC52n6Fhn9p1dzew3rJjbium6Hcp0su75LUGgByvEvfD7gzxGp6dkOqMh4sDXy5yUXgpQujccUM6Igb5FOBweEzo5oiELmnPTZFp3HeqCcWxzH0JlyKhYpKb8AN_yCCzbt_697NM4eYFHYx68s0z4LxT19W_czhbgEk9HExO1APRQli5cfWmoCZdipk2ZqcVJQfAEZCl3VJwEXF1keSSA4XtPYcoMlMFW7uZeRnGsvWpOY63Kbj49EQHhV8",
        pillarsTitle: "Our Core Pillars",
        pillar1Title: "Welding & Welding Technology",
        pillar1Desc: "Comprehensive coordination of welding processes, technology selection, and parameter optimization according to ISO 3834 and EN 1090 standards.",
        pillar2Title: "Non-Destructive Testing (NDT)",
        pillar2Desc: "Independent supervision and execution of VT, PT, MT, UT, and RT inspections. We guarantee measurement precision and the highest quality control standards.",
        pillar3Title: "Anti-Corrosion Protection",
        pillar3Desc: "Supervision over surface preparation and coating application processes. Structural durability and full compliance with project specifications.",
        modelTitle: "Competence-Based Cooperation Model",
        modelSubTitle: "ASN Weld & Inspection Network is not a recruitment agency. We are a specialized engineering company delivering projects under <span class=\"text-secondary-fixed\">service contracts (Werkvertrag) or process outsourcing</span>.",
        modelDesc: "We take full responsibility for the delivered results, offering real technical and factual support at every project stage. We focus on solving problems, not just supplying resources.",
        modelList: [
          "Quality and deadline guarantee",
          "Proprietary know-how and tools",
          "Transparent billing based on results"
        ],
        modelImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdDq9lwIV5DN0ed-ttRHDyOZ-VzD9VQMf75uiJDYszJoSi_mkRdsLIp0ZYuslkK7em6qzLY2SmZRlo6A2NYG2o1wO1UzvtatgaoM6B-dPQjXsHCvcPYWD6qHhi36u_ip8JRETX98BQWiUZsiMUPkotL4AbCX7xMKUIkg8aoaDW_3AZ8sFo4p349TYK5wKTlkpEQDJiKf1GwCmQACeV5QVm-9A-XHNsH6cKQYLnhKf21GdOXy4v6wFWMmcqJo10UgiOoBiTWhAnXfI",
        supportTitle: "Technical Support Areas",
        supportDesc: "We provide expert support during critical stages of product and structure lifecycles.",
        supportItems: [
          { icon: "fact_check", title: "QA/QC" },
          { icon: "assignment_turned_in", title: "QS/QM" },
          { icon: "description", title: "Technical Documentation" },
          { icon: "engineering", title: "Engineering Support" },
          { icon: "schema", title: "Project Coordination" }
        ],
        whyTitle: "Why ASN?",
        whyDesc: "Our market advantage stems from direct industry experience and an understanding of our clients' operational challenges.",
        why1Title: "Flexibility", why1Desc: "Rapid response to project needs and adaptation to requirements.",
        why2Title: "Reliability", why2Desc: "Partnership based on trust and keeping our word.",
        why3Title: "Responsibility", why3Desc: "We don't just report errors; we actively support their elimination and implementation of corrective actions.",
        why4Title: "Practice", why4Desc: "Our specialists are seasoned practitioners with years of tenure in Offshore, Oil&Gas, and energy sectors.",
        why5Title: "Competence Network", why5Desc: "We connect the top experts in the industry, creating a unique technical knowledge ecosystem managed from our Bremen headquarters.",
        bremaTitle: "Headquarters in Bremen",
        bremaDesc: "ASN Weld & Inspection Network UG is headquartered in Bremen, a strategic hub on the map of European industry. From here, we coordinate our operations across Europe, ensuring a unified standard of service.<br/><br/>Our goal is to build enduring relationships with clients and a network of outstanding specialists for whom engineering is a passion supported by a solid theoretical and practical foundation.",
        bremaImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYNJUdF8iJGjIp_gSgXSNT4HFetvsvTY46A5dgKZayiiZguisQxpMCCNQQbqF0LO90IOZJcUprOCQkcZA9DfmWpslXe9FJ5Vih2xRZlBUS6kfcVmKzh-q29Kr4N6FbNOd3ZwMQ3r5BNrHGFBCa17mTLc24q_OEnV75qK5_dNFc9tFk0nbXlT-DUFdbnVMqrJZGmG7aH6GAafobNcp3055byb8fimpS5Qjy-1Cg6nBGqt6TexplE_TXmAMPyd9c_9sI2bSpc7wbTfw",
        bremaBadgeTitle: "Brema Headquarters",
        bremaBadgeSub: "Germany, Hanseatic City of Bremen",
        contactTitle: "Get in Touch With Us",
        contactDesc: "Have questions about our services or looking for a project partner? Our experts are at your disposal.",
        phoneLabel: "Call us", phoneVal: "+49 (0) 421 XXX XX XX",
        emailLabel: "Send an email", emailVal: "office@asn-network.de",
        officeLabel: "Office address", officeVal: "Bremen, Germany",
        formNameLabel: "Full Name", formEmailLabel: "Business Email", formTopicLabel: "Subject", formMsgLabel: "Message", formSubmitLabel: "Send Inquiry"
      },
      pl: { 
        title: "Strona Główna", 
        seoTitle: "Główna | ASN Weld & Inspection Network", 
        seoDesc: "Witamy w ASN Weld & Inspection Network. Profesjonalny nadzór i koordynacja spawalnicza.",
        heroBadge: "Engineering Excellence",
        heroTitle: "Ekspercka wiedza.<br/><span class=\"text-secondary\">Realna odpowiedzialność.</span>",
        heroDesc: "Profesjonalne usługi inżynieryjne i koordynacja projektów w obszarach spawalnictwa, NDT i ochrony antykorozyjnej. Zapewniamy precyzję tam, gdzie bezpieczeństwo jest priorytetem.",
        heroBtnService: "Poznaj nasze usługi",
        heroBtnAbout: "O nas",
        heroImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBrGiolNSi1aj_eMj1dC52n6Fhn9p1dzew3rJjbium6Hcp0su75LUGgByvEvfD7gzxGp6dkOqMh4sDXy5yUXgpQujccUM6Igb5FOBweEzo5oiELmnPTZFp3HeqCcWxzH0JlyKhYpKb8AN_yCCzbt_697NM4eYFHYx68s0z4LxT19W_czhbgEk9HExO1APRQli5cfWmoCZdipk2ZqcVJQfAEZCl3VJwEXF1keSSA4XtPYcoMlMFW7uZeRnGsvWpOY63Kbj49EQHhV8",
        pillarsTitle: "Filary naszej działalności",
        pillar1Title: "Spawalnictwo i technika spawalnicza",
        pillar1Desc: "Kompleksowa koordynacja procesów spawalniczych, dobór technologii oraz optymalizacja parametrów zgodnie z normami ISO 3834 i EN 1090.",
        pillar2Title: "Badania Nieniszczące (NDT)",
        pillar2Desc: "Niezależny nadzór i realizacja badań VT, PT, MT, UT, RT. Gwarantujemy precyzję pomiarową i najwyższe standardy kontroli jakości.",
        pillar3Title: "Ochrona Antykorozyjna",
        pillar3Desc: "Nadzór nad procesami przygotowania powierzchni i aplikacji powłok. Trwałość struktur i pełna zgodność ze specyfikacją projektu.",
        modelTitle: "Model współpracy oparty na kompetencjach",
        modelSubTitle: "ASN Weld & Inspection Network to nie agencja rekrutacyjna. Jesteśmy wyspecjalizowaną spółką inżynieryjną realizującą projekty w modelu <span class=\"text-secondary-fixed\">Werkvertrag (umowa o dzieło) lub outsourcingu procesowego</span>.",
        modelDesc: "Bierzemy pełną odpowiedzialność za dostarczone rezultaty, oferując realne wsparcie techniczne i merytoryczne na każdym etapie projektu. Skupiamy się na rozwiązywaniu problemów, a nie tylko dostarczaniu zasobów.",
        modelList: [
          "Gwarancja jakości i terminowości",
          "Własne know-how i narzędzia",
          "Transparentne rozliczanie efektów"
        ],
        modelImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdDq9lwIV5DN0ed-ttRHDyOZ-VzD9VQMf75uiJDYszJoSi_mkRdsLIp0ZYuslkK7em6qzLY2SmZRlo6A2NYG2o1wO1UzvtatgaoM6B-dPQjXsHCvcPYWD6qHhi36u_ip8JRETX98BQWiUZsiMUPkotL4AbCX7xMKUIkg8aoaDW_3AZ8sFo4p349TYK5wKTlkpEQDJiKf1GwCmQACeV5QVm-9A-XHNsH6cKQYLnhKf21GdOXy4v6wFWMmcqJo10UgiOoBiTWhAnXfI",
        supportTitle: "Obszary wsparcia technicznego",
        supportDesc: "Zapewniamy wsparcie eksperckie w kluczowych etapach cyklu życia produktu i konstrukcji.",
        supportItems: [
          { icon: "fact_check", title: "QA/QC" },
          { icon: "assignment_turned_in", title: "QS/QM" },
          { icon: "description", title: "Dokumentacja Techniczna" },
          { icon: "engineering", title: "Engineering Support" },
          { icon: "schema", title: "Koordynacja Projektów" }
        ],
        whyTitle: "Dlaczego ASN?",
        whyDesc: "Nasza przewaga rynkowa wynika z bezpośredniego doświadczenia w przemyśle i zrozumienia wyzwań operacyjnych naszych klientów.",
        why1Title: "Elastyczność", why1Desc: "Szybka reakcja na potrzeby projektu i adaptacja do wymagań.",
        why2Title: "Niezawodność", why2Desc: "Partnerstwo oparte na zaufaniu i dotrzymywaniu słowa.",
        why3Title: "Odpowiedzialność", why3Desc: "Nie tylko raportujemy błędy, ale aktywnie wspieramy w ich eliminacji i wdrażaniu działań korygujących.",
        why4Title: "Praktyka", why4Desc: "Nasi specjaliści to praktycy z wieloletnim stażem w branżach Offshore, Oil&Gas oraz energetyce.",
        why5Title: "Sieć Kompetencji", why5Desc: "Łączymy najlepszych ekspertów w branży, tworząc unikalny ekosystem wiedzy technicznej zarządzany z naszej centrali w Bremie.",
        bremaTitle: "Centrala w Bremie",
        bremaDesc: "ASN Weld & Inspection Network UG ma swoją siedzibę w Bremie, strategicznym punkcie na mapie europejskiego przemysłu. Stąd koordynujemy nasze działania w całej Europie, dbając o jednolity standard usług.<br/><br/>Naszym celem jest budowanie trwałych relacji z klientami oraz sieci wybitnych specjalistów, dla których inżynieria to pasja podparta solidnym fundamentem teoretycznym i praktycznym.",
        bremaImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYNJUdF8iJGjIp_gSgXSNT4HFetvsvTY46A5dgKZayiiZguisQxpMCCNQQbqF0LO90IOZJcUprOCQkcZA9DfmWpslXe9FJ5Vih2xRZlBUS6kfcVmKzh-q29Kr4N6FbNOd3ZwMQ3r5BNrHGFBCa17mTLc24q_OEnV75qK5_dNFc9tFk0nbXlT-DUFdbnVMqrJZGmG7aH6GAafobNcp3055byb8fimpS5Qjy-1Cg6nBGqt6TexplE_TXmAMPyd9c_9sI2bSpc7wbTfw",
        bremaBadgeTitle: "Brema Headquarters",
        bremaBadgeSub: "Niemcy, Hanseatic City of Bremen",
        contactTitle: "Skontaktuj się z nami",
        contactDesc: "Masz pytania dotyczące naszych usług lub szukasz partnera do realizacji projektu? Nasi eksperci są do Twojej dyspozycji.",
        phoneLabel: "Zadzwoń do nas", phoneVal: "+49 (0) 421 XXX XX XX",
        emailLabel: "Napisz e-mail", emailVal: "office@asn-network.de",
        officeLabel: "Adres biura", officeVal: "Bremen, Germany",
        formNameLabel: "Imię i Nazwisko", formEmailLabel: "E-mail służbowy", formTopicLabel: "Temat rozmowy", formMsgLabel: "Wiadomość", formSubmitLabel: "Wyślij zapytanie"
      },
      de: { 
        title: "Startseite", 
        seoTitle: "Startseite | ASN Weld & Inspection Network", 
        seoDesc: "Willkommen bei ASN Weld & Inspection Network. Professionelle Schweißaufsicht und NDT.",
        heroBadge: "Engineering Excellence",
        heroTitle: "Expertenwissen.<br/><span class=\"text-secondary\">Echte Verantwortung.</span>",
        heroDesc: "Professionelle Ingenieurdienstleistungen und Projektkoordination in den Bereichen Schweißtechnik, ZfP und Korrosionsschutz. Wir sorgen für Präzision, wo Sicherheit Priorität hat.",
        heroBtnService: "Dienstleistungen entdecken",
        heroBtnAbout: "Über ASN Network",
        heroImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBrGiolNSi1aj_eMj1dC52n6Fhn9p1dzew3rJjbium6Hcp0su75LUGgByvEvfD7gzxGp6dkOqMh4sDXy5yUXgpQujccUM6Igb5FOBweEzo5oiELmnPTZFp3HeqCcWxzH0JlyKhYpKb8AN_yCCzbt_697NM4eYFHYx68s0z4LxT19W_czhbgEk9HExO1APRQli5cfWmoCZdipk2ZqcVJQfAEZCl3VJwEXF1keSSA4XtPYcoMlMFW7uZeRnGsvWpOY63Kbj49EQHhV8",
        pillarsTitle: "Unsere Kernsäulen",
        pillar1Title: "Schweißtechnik und Überwachung",
        pillar1Desc: "Umfassende Koordination von Schweißprozessen, Technologieauswahl und Parameteroptimierung nach den Normen ISO 3834 und EN 1090.",
        pillar2Title: "Zerstörungsfreie Prüfung (ZfP)",
        pillar2Desc: "Unabhängige Überwachung und Durchführung von VT-, PT-, MT-, UT- und RT-Prüfungen. Wir garantieren Messpräzision und höchste Qualitätskontrollstandards.",
        pillar3Title: "Korrosionsschutz",
        pillar3Desc: "Überwachung von Oberflächenvorbereitungs- und Beschichtungsapplikationsprozessen. Strukturhaltbarkeit und volle Übereinstimmung mit Projektspezifikationen.",
        modelTitle: "Kompetenzbasiertes Kooperationsmodell",
        modelSubTitle: "Das ASN Weld & Inspection Network ist keine Personalagentur. Wir sind ein spezialisiertes Ingenieurunternehmen, das Projekte im Rahmen von <span class=\"text-secondary-fixed\">Werkverträgen oder Prozess-Outsourcing</span> realisiert.",
        modelDesc: "Wir übernehmen die volle Verantwortung für die gelieferten Ergebnisse und bieten in jeder Projektphase echte technische und fachliche Unterstützung. Wir konzentrieren uns auf Problemlösungen, nicht nur auf die Bereitstellung von Ressourcen.",
        modelList: [
          "Qualitäts- und Termingarantie",
          "Eigener Know-how und eigene Werkzeuge",
          "Transparente Abrechnung nach Ergebnissen"
        ],
        modelImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdDq9lwIV5DN0ed-ttRHDyOZ-VzD9VQMf75uiJDYszJoSi_mkRdsLIp0ZYuslkK7em6qzLY2SmZRlo6A2NYG2o1wO1UzvtatgaoM6B-dPQjXsHCvcPYWD6qHhi36u_ip8JRETX98BQWiUZsiMUPkotL4AbCX7xMKUIkg8aoaDW_3AZ8sFo4p349TYK5wKTlkpEQDJiKf1GwCmQACeV5QVm-9A-XHNsH6cKQYLnhKf21GdOXy4v6wFWMmcqJo10UgiOoBiTWhAnXfI",
        supportTitle: "Bereiche der technischen Unterstützung",
        supportDesc: "Wir bieten Expertenunterstützung in kritischen Phasen der Produkt- und Strukturlebenszyklen.",
        supportItems: [
          { icon: "fact_check", title: "QA/QC" },
          { icon: "assignment_turned_in", title: "QS/QM" },
          { icon: "description", title: "Technische Dokumentation" },
          { icon: "engineering", title: "Engineering Support" },
          { icon: "schema", title: "Projektkoordination" }
        ],
        whyTitle: "Warum ASN?",
        whyDesc: "Unser Marktvorteil ergibt sich aus direkter Branchenerfahrung und dem Verständnis für die operativen Herausforderungen unserer Kunden.",
        why1Title: "Flexibilität", why1Desc: "Schnelle Reaktion auf Projektanforderungen und Anpassung an Vorgaben.",
        why2Title: "Zuverlässigkeit", why2Desc: "Partnerschaft auf Basis von Vertrauen und Worttreue.",
        why3Title: "Verantwortung", why3Desc: "Wir melden nicht nur Fehler, sondern unterstützen aktiv bei deren Beseitigung und der Umsetzung von Korrekturmaßnahmen.",
        why4Title: "Praxis", why4Desc: "Unsere Spezialisten sind erfahrene Praktiker mit langjähriger Tätigkeit in den Bereichen Offshore, Oil&Gas und Energie.",
        why5Title: "Kompetenznetzwerk", why5Desc: "Wir verbinden die besten Experten der Branche in einem einzigartigen Ökosystem technischen Wissens, das von unserem Hauptsitz in Bremen aus verwaltet wird.",
        bremaTitle: "Hauptsitz in Bremen",
        bremaDesc: "Die ASN Weld & Inspection Network UG hat ihren Hauptsitz in Bremen, einem strategischen Knotenpunkt auf der Karte der europäischen Industrie. Von hier aus koordinieren wir unsere Aktivitäten europaweit und sorgen für einen einheitlichen Servicestandard.<br/><br/>Unser Ziel ist es, langfristige Beziehungen zu Kunden und einem Netzwerk herausragender Spezialisten aufzubauen, für die Ingenieurwesen eine Leidenschaft mit solidem theoretischem und praktischem Fundament ist.",
        bremaImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYNJUdF8iJGjIp_gSgXSNT4HFetvsvTY46A5dgKZayiiZguisQxpMCCNQQbqF0LO90IOZJcUprOCQkcZA9DfmWpslXe9FJ5Vih2xRZlBUS6kfcVmKzh-q29Kr4N6FbNOd3ZwMQ3r5BNrHGFBCa17mTLc24q_OEnV75qK5_dNFc9tFk0nbXlT-DUFdbnVMqrJZGmG7aH6GAafobNcp3055byb8fimpS5Qjy-1Cg6nBGqt6TexplE_TXmAMPyd9c_9sI2bSpc7wbTfw",
        bremaBadgeTitle: "Hauptsitz Bremen",
        bremaBadgeSub: "Deutschland, Hansestadt Bremen",
        contactTitle: "Kontaktieren Sie uns",
        contactDesc: "Haben Sie Fragen zu unseren Dienstleistungen oder suchen Sie einen Partner für die Projektdurchführung? Unsere Experten stehen Ihnen gerne zur Verfügung.",
        phoneLabel: "Rufen Sie uns an", phoneVal: "+49 (0) 421 XXX XX XX",
        emailLabel: "E-Mail schreiben", emailVal: "office@asn-network.de",
        officeLabel: "Büroadresse", officeVal: "Bremen, Deutschland",
        formNameLabel: "Vor- und Nachname", formEmailLabel: "Geschäftliche E-Mail", formTopicLabel: "Thema", formMsgLabel: "Nachricht", formSubmitLabel: "Anfrage senden"
      }
    };
    return t[locale] || t['en'];
  }

  if (col.startsWith('about_page')) {
    const t = {
      en: { 
        title: "About Us", 
        seoTitle: "About Us | ASN Weld & Inspection Network", 
        seoDesc: "Learn more about the ASN Weld & Inspection Network.",
        badge: "About ASN Network",
        mainTitle: "Quality Experts.<br/><span class=\"text-secondary\">Business Partners.</span>",
        mainContent: "<p class=\"mb-6\">Our market advantage stems from direct industry experience and an understanding of our clients' operational challenges. We connect the best experts in the industry, creating a unique technical knowledge ecosystem managed from our headquarters in Bremen.</p><p>We are proud to be the foundation of safety in the most important branches of European industry, from Offshore to the energy sector.</p>",
        heroImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYNJUdF8iJGjIp_gSgXSNT4HFetvsvTY46A5dgKZayiiZguisQxpMCCNQQbqF0LO90IOZJcUprOCQkcZA9DfmWpslXe9FJ5Vih2xRZlBUS6kfcVmKzh-q29Kr4N6FbNOd3ZwMQ3r5BNrHGFBCa17mTLc24q_OEnV75qK5_dNFc9tFk0nbXlT-DUFdbnVMqrJZGmG7aH6GAafobNcp3055byb8fimpS5Qjy-1Cg6nBGqt6TexplE_TXmAMPyd9c_9sI2bSpc7wbTfw",
        philosophyTitle: "Our Philosophy",
        phil1Icon: "verified_user", phil1Title: "Uncompromising Quality", phil1Desc: "We don't take shortcuts. In the world of welding and NDT, quality translates directly into human and environmental safety.",
        phil2Icon: "psychology", phil2Title: "Knowledge & Experience", phil2Desc: "We employ certified experts with years of experience. We know how to interpret standards in the face of production reality.",
        phil3Icon: "handshake", phil3Title: "Business Partnership", phil3Desc: "Your success is our success. We work hand-in-hand with your team, solving problems at the source and optimizing processes.",
        stat1Val: "15+", stat1Lbl: "Years Experience",
        stat2Val: "500+", stat2Lbl: "Completed Audits",
        stat3Val: "12", stat3Lbl: "European Countries",
        stat4Val: "100%", stat4Lbl: "Compliance Guarantee",
        ctaTitle: "Ready for Professional Technical Support?",
        ctaDesc: "Contact our headquarters in Bremen to discuss your project requirements.",
        ctaBtn: "Contact Us Today"
      },
      pl: { 
        title: "O nas", 
        seoTitle: "O nas | ASN Weld & Inspection Network", 
        seoDesc: "Poznaj bliżej sieć inżynieryjną ASN Weld & Inspection Network.",
        badge: "O sieci ASN",
        mainTitle: "Eksperci od jakości.<br/><span class=\"text-secondary\">Partnerzy w biznesie.</span>",
        mainContent: "<p class=\"mb-6\">Nasza przewaga rynkowa wynika z bezpośredniego doświadczenia w przemyśle i zrozumienia wyzwań operacyjnych naszych klientów. Łączymy najlepszych ekspertów w branży, tworząc unikalny ekosystem wiedzy technicznej zarządzany z naszej centrali w Bremie.</p><p>Jesteśmy dumni, że stajemy się fundamentem bezpieczeństwa w najważniejszych gałęziach europejskiego przemysłu, od Offshore po energetykę.</p>",
        heroImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYNJUdF8iJGjIp_gSgXSNT4HFetvsvTY46A5dgKZayiiZguisQxpMCCNQQbqF0LO90IOZJcUprOCQkcZA9DfmWpslXe9FJ5Vih2xRZlBUS6kfcVmKzh-q29Kr4N6FbNOd3ZwMQ3r5BNrHGFBCa17mTLc24q_OEnV75qK5_dNFc9tFk0nbXlT-DUFdbnVMqrJZGmG7aH6GAafobNcp3055byb8fimpS5Qjy-1Cg6nBGqt6TexplE_TXmAMPyd9c_9sI2bSpc7wbTfw",
        philosophyTitle: "Nasza Filozofia",
        phil1Icon: "verified_user", phil1Title: "Bezkompromisowa Jakość", phil1Desc: "Nie idziemy na skróty. W świecie spawalnictwa i badań NDT jakość przekłada się bezpośrednio na bezpieczeństwo ludzi i środowiska.",
        phil2Icon: "psychology", phil2Title: "Wiedza i Doświadczenie", phil2Desc: "Zatrudniamy certyfikowanych ekspertów z wieloletnim stażem. Wiemy jak interpretować normy w zderzeniu z realiami produkcyjnymi.",
        phil3Icon: "handshake", phil3Title: "Partnerstwo Biznesowe", phil3Desc: "Twój sukces jest naszym sukcesem. Pracujemy ramię w ramię z Twoim zespołem, rozwiązując problemy u źródła i optymalizując procesy.",
        stat1Val: "15+", stat1Lbl: "Lat Doświadczenia",
        stat2Val: "500+", stat2Lbl: "Przeprowadzonych Audytów",
        stat3Val: "12", stat3Lbl: "Krajów Europy",
        stat4Val: "100%", stat4Lbl: "Gwarancji Zgodności",
        ctaTitle: "Gotowy na profesjonalne wsparcie techniczne?",
        ctaDesc: "Skontaktuj się z naszą centralą w Bremie, aby omówić wymagania Twojego projektu.",
        ctaBtn: "Skontaktuj się z nami"
      },
      de: { 
        title: "Über uns", 
        seoTitle: "Über uns | ASN Weld & Inspection Network", 
        seoDesc: "Erfahren Sie mehr über das ASN Weld & Inspection Network.",
        badge: "Über das ASN-Netzwerk",
        mainTitle: "Qualitätsexperten.<br/><span class=\"text-secondary\">Geschäftspartner.</span>",
        mainContent: "<p class=\"mb-6\">Unser Marktvorteil ergibt sich aus direkter Branchenerfahrung und dem Verständnis für die operativen Herausforderungen unserer Kunden. Wir vereinen die besten Experten der Branche in einem einzigartigen Ökosystem technischen Wissens, das von unserem Hauptsitz in Bremen aus verwaltet wird.</p><p>Wir sind stolz darauf, das Fundament für Sicherheit in den wichtigsten Zweigen der europäischen Industrie zu bilden, von Offshore bis zur Energiewirtschaft.</p>",
        heroImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYNJUdF8iJGjIp_gSgXSNT4HFetvsvTY46A5dgKZayiiZguisQxpMCCNQQbqF0LO90IOZJcUprOCQkcZA9DfmWpslXe9FJ5Vih2xRZlBUS6kfcVmKzh-q29Kr4N6FbNOd3ZwMQ3r5BNrHGFBCa17mTLc24q_OEnV75qK5_dNFc9tFk0nbXlT-DUFdbnVMqrJZGmG7aH6GAafobNcp3055byb8fimpS5Qjy-1Cg6nBGqt6TexplE_TXmAMPyd9c_9sI2bSpc7wbTfw",
        philosophyTitle: "Unsere Philosophie",
        phil1Icon: "verified_user", phil1Title: "Kompromisslose Qualität", phil1Desc: "We don't take shortcuts. In der Welt der Schweißtechnik und ZfP übersetzt sich Qualität direkt in die Sicherheit von Mensch und Umwelt.",
        phil2Icon: "psychology", phil2Title: "Wissen und Erfahrung", phil2Desc: "Wir beschäftigen zertifizierte Experten mit langjähriger Erfahrung. Wir wissen, wie Normen in der Produktionsrealität zu interpretieren sind.",
        phil3Icon: "handshake", phil3Title: "Geschäftspartnerschaft", phil3Desc: "Ihr Erfolg ist unser Erfolg. Wir arbeiten Hand in Hand mit Ihrem Team, lösen Probleme an der Quelle und optimieren Prozesse.",
        stat1Val: "15+", stat1Lbl: "Jahre Erfahrung",
        stat2Val: "500+", stat2Lbl: "Durchgeführte Audits",
        stat3Val: "12", stat3Lbl: "Europäische Länder",
        stat4Val: "100%", stat4Lbl: "Konformitätsgarantie",
        ctaTitle: "Bereit für professionelle technische Unterstützung?",
        ctaDesc: "Kontaktieren Sie unseren Hauptsitz in Bremen, um Ihre Projektanforderungen zu besprechen.",
        ctaBtn: "Kontaktieren Sie uns heute"
      }
    };
    return t[locale] || t['en'];
  }

  if (col.startsWith('services_page')) {
    const t = {
      en: {
        title: "Services",
        seoTitle: "Services | ASN Weld & Inspection Network",
        seoDesc: "Comprehensive technical support in welding, non-destructive testing, and anti-corrosion protection.",
        badge: "PROFESSIONALISM & QUALITY",
        heroTitle: "Our Services",
        heroDesc: "Comprehensive technical support in welding, non-destructive testing, and anti-corrosion protection for heavy industry and energy sectors.",
        pillar1Title: "Welding Coordination & Supervision (IWE/EWE)",
        pillar1Desc: "Full oversight of welding processes according to EN ISO 3834, EN 1090, and offshore standards.",
        pillar1Image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCozDnJai0fc5h24His7_lwuuvRkWNw7ycEntToxRTQvtqihRfEzRqgqf9dkI9NuXpMLgVWdHjLSYsns1jsacdBgfQFRgdEslR605HA0H65G9DYwgS-8YehgjaxGWEWBz1yHb-6dtWQ8no6mXE8xH6tKBApAcTuOZ0oEnrcWAzF2Bn-Fr21IqvEPbl2ReUaDnlz7vMN1dP5upquIj9c3ofTTr4jaGCMnZU3dePX71czqNmU_wxU-a9rgymTke6XBiR6XrstC1w2Rdw",
        pillar1List: [
          "WPQR / WPS qualification oversight and documentation review",
          "Welder certification supervision according to ISO 9606",
          "Quality control during fabrication and final inspection"
        ],
        pillar2Title: "Non-Destructive Testing (NDT / VT, PT, MT, UT, RT)",
        pillar2Desc: "Certified inspections by level II and III personnel according to ISO 9712.",
        pillar2Image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800",
        pillar2List: [
          "Visual (VT), Penetrant (PT), and Magnetic Particle (MT) inspections",
          "Ultrasonic (UT) and Radiographic (RT) testing evaluation",
          "NDT procedure development and level III consulting"
        ],
        pillar3Title: "Anti-Corrosion Protection & FROSIO/NACE Inspection",
        pillar3Desc: "Comprehensive coating inspections, surface preparation analysis, and quality assurance.",
        pillar3Image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800",
        pillar3List: [
          "Surface cleanliness and roughness evaluation",
          "Dry film thickness (DFT) and wet film thickness (WFT) measurements",
          "FROSIO/NACE inspector supervision and reporting"
        ],
        processTitle: "Our Approach to Project Assurance",
        proc1Title: "1. Initial Audit", proc1Desc: "Comprehensive review of documentation, requirements, and existing procedures.",
        proc2Title: "2. Strategy & Team", proc2Desc: "Selecting certified specialists and tailoring testing protocols.",
        proc3Title: "3. Execution & Oversight", proc3Desc: "Active supervision on-site with transparent progress tracking.",
        proc4Title: "4. Final Certification", proc4Desc: "Complete quality documentation and compliance sign-off.",
        ctaTitle: "Need Custom Engineering Support?",
        ctaDesc: "Contact our specialists to design a quality assurance protocol tailored to your project.",
        ctaBtn: "Consult an Expert"
      },
      pl: {
        title: "Usługi",
        seoTitle: "Usługi | ASN Weld & Inspection Network",
        seoDesc: "Kompleksowe wsparcie techniczne w zakresie spawalnictwa, badań nieniszczących oraz ochrony antykorozyjnej.",
        badge: "PROFESJONALIZM I JAKOŚĆ",
        heroTitle: "Nasze Usługi",
        heroDesc: "Kompleksowe wsparcie techniczne w zakresie spawalnictwa, badań nieniszczących oraz ochrony antykorozyjnej dla przemysłu ciężkiego i energetyki.",
        pillar1Title: "Koordynacja i Nadzór Spawalniczy (IWE/EWE)",
        pillar1Desc: "Pełny nadzór nad procesami spawania zgodnie z normami EN ISO 3834, EN 1090 oraz standardami offshore.",
        pillar1Image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCozDnJai0fc5h24His7_lwuuvRkWNw7ycEntToxRTQvtqihRfEzRqgqf9dkI9NuXpMLgVWdHjLSYsns1jsacdBgfQFRgdEslR605HA0H65G9DYwgS-8YehgjaxGWEWBz1yHb-6dtWQ8no6mXE8xH6tKBApAcTuOZ0oEnrcWAzF2Bn-Fr21IqvEPbl2ReUaDnlz7vMN1dP5upquIj9c3ofTTr4jaGCMnZU3dePX71czqNmU_wxU-a9rgymTke6XBiR6XrstC1w2Rdw",
        pillar1List: [
          "Nadzór nad kwalifikowaniem technologii spawania (WPQR / WPS)",
          "Weryfikacja uprawnień spawalniczych wg normy ISO 9606",
          "Kontrola jakości podczas produkcji i odbiory końcowe"
        ],
        pillar2Title: "Badania Nieniszczące (NDT / VT, PT, MT, UT, RT)",
        pillar2Desc: "Certyfikowane inspekcje wykonywane przez personel drugiego i trzeciego stopnia według normy ISO 9712.",
        pillar2Image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800",
        pillar2List: [
          "Badania wizualne (VT), penetracyjne (PT) i magnetyczno-proszkowe (MT)",
          "Ocena badań ultradźwiękowych (UT) i radiograficznych (RT)",
          "Opracowywanie instrukcji NDT i doradztwo poziomu III"
        ],
        pillar3Title: "Ochrona Antykorozyjna i Inspekcje FROSIO/NACE",
        pillar3Desc: "Kompleksowe inspekcje powłok malarskich, analiza przygotowania powierzchni i kontrola jakości.",
        pillar3Image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800",
        pillar3List: [
          "Ocena czystości i chropowatości powierzchni przed aplikacją",
          "Pomiary grubości powłok na sucho (DFT) i na mokro (WFT)",
          "Nadzór inspekcyjny certyfikowanych inspektorów FROSIO/NACE"
        ],
        processTitle: "Nasze podejście do zapewnienia jakości",
        proc1Title: "1. Audyt Wstępny", proc1Desc: "Przegląd dokumentacji, wymagań kontraktowych i procedur produkcyjnych.",
        proc2Title: "2. Strategia i Zespół", proc2Desc: "Dobór certyfikowanych specjalistów i dostosowanie planu inspekcji.",
        proc3Title: "3. Nadzór i Realizacja", proc3Desc: "Aktywna kontrola na placu budowy lub na warsztacie wraz z raportowaniem.",
        proc4Title: "4. Certyfikacja Końcowa", proc4Desc: "Kompletowanie dokumentacji jakościowej i zatwierdzenie zgodności.",
        ctaTitle: "Potrzebujesz dedykowanego wsparcia inżynieryjnego?",
        ctaDesc: "Skontaktuj się z naszymi specjalistami, aby opracować plan kontroli jakości dopasowany do Twojego projektu.",
        ctaBtn: "Skonsultuj z ekspertem"
      },
      de: {
        title: "Dienstleistungen",
        seoTitle: "Dienstleistungen | ASN Weld & Inspection Network",
        seoDesc: "Umfassende technische Unterstützung in den Bereichen Schweißtechnik, ZfP und Korrosionsschutz.",
        badge: "PROFESSIONALITÄT & QUALITÄT",
        heroTitle: "Unsere Dienstleistungen",
        heroDesc: "Umfassende technische Unterstützung in den Bereichen Schweißtechnik, zerstörungsfreie Prüfung und Korrosionsschutz für die Schwerindustrie und den Energiesektor.",
        pillar1Title: "Schweißkoordination & Überwachung (IWE/EWE)",
        pillar1Desc: "Vollständige Überwachung von Schweißprozessen gemäß EN ISO 3834, EN 1090 und Offshore-Standards.",
        pillar1Image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCozDnJai0fc5h24His7_lwuuvRkWNw7ycEntToxRTQvtqihRfEzRqgqf9dkI9NuXpMLgVWdHjLSYsns1jsacdBgfQFRgdEslR605HA0H65G9DYwgS-8YehgjaxGWEWBz1yHb-6dtWQ8no6mXE8xH6tKBApAcTuOZ0oEnrcWAzF2Bn-Fr21IqvEPbl2ReUaDnlz7vMN1dP5upquIj9c3ofTTr4jaGCMnZU3dePX71czqNmU_wxU-a9rgymTke6XBiR6XrstC1w2Rdw",
        pillar1List: [
          "Überwachung von Verfahrensprüfungen (WPQR / WPS) und Dokumentationsprüfung",
          "Überprüfung der Schweißerprüfungen nach ISO 9606",
          "Qualitätskontrolle während der Fertigung und Endabnahme"
        ],
        pillar2Title: "Zerstörungsfreie Prüfung (ZfP / VT, PT, MT, UT, RT)",
        pillar2Desc: "Zertifizierte Inspektionen durch Personal der Stufen II und III gemäß ISO 9712.",
        pillar2Image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800",
        pillar2List: [
          "Sicht- (VT), Eindring- (PT) und Magnetpulverprüfungen (MT)",
          "Auswertung von Ultraschall- (UT) und Durchstrahlungsprüfungen (RT)",
          "Entwicklung von ZfP-Anweisungen und Beratung Stufe III"
        ],
        pillar3Title: "Korrosionsschutz & FROSIO/NACE-Inspektion",
        pillar3Desc: "Umfassende Beschichtungsinspektionen, Analyse der Oberflächenvorbereitung und Qualitätssicherung.",
        pillar3Image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800",
        pillar3List: [
          "Bewertung der Oberflächensauberkeit und -rauheit vor der Applikation",
          "Messungen der Trocken- (DFT) und Nassschichtdicke (WFT)",
          "Inspektionsüberwachung durch zertifizierte FROSIO/NACE-Inspektoren"
        ],
        processTitle: "Unser Ansatz zur Qualitätssicherung",
        proc1Title: "1. Ausgangsaudit", proc1Desc: "Überprüfung der Dokumentation, der vertraglichen Anforderungen und der Verfahren.",
        proc2Title: "2. Strategie & Team", proc2Desc: "Auswahl zertifizierter Spezialisten und Anpassung des Prüfplans.",
        proc3Title: "3. Durchführung & Überwachung", proc3Desc: "Aktive Kontrolle auf der Baustelle oder in der Werkstatt mit Reporting.",
        proc4Title: "4. Endabnahme & Zertifizierung", proc4Desc: "Zusammenstellung der Qualitätsdokumentation und Konformitätsbestätigung.",
        ctaTitle: "Benötigen Sie maßgeschneiderte technische Unterstützung?",
        ctaDesc: "Kontaktieren Sie unsere Spezialisten, um einen auf Ihr Projekt zugeschnittenen Qualitätssicherungsplan zu erstellen.",
        ctaBtn: "Mit einem Experten sprechen"
      }
    };
    return t[locale] || t['en'];
  }

  if (col.startsWith('experience_page')) {
    const t = {
      en: {
        title: "Experience",
        seoTitle: "Experience | ASN Weld & Inspection Network",
        seoDesc: "Learn about our experience and technical responsibility model.",
        badge: "OUR IDENTITY",
        heroTitle: "Knowledge, Experience, Responsibility.",
        heroDesc: "ASN Weld & Inspection Network is a team of experts dedicated to the welding and NDT industry. We deliver complete technical solutions based on the highest engineering standards.",
        modelTitle: "Cooperation Model: Werkvertrag & Outsourcing",
        modelDesc: "<p class=\"mb-4\">Our business model is based on service contracts (Werkvertrag) and full technical process outsourcing. We take full responsibility for the final project result, weld quality, and compliance with NDT standards.</p>",
        stat1Val: "15+", stat1Lbl: "Years in Offshore Industry",
        stat2Val: "100%", stat2Lbl: "Compliance with EN/ISO",
        stat3Val: "50+", stat3Lbl: "Completed Major Projects",
        image1: "https://images.unsplash.com/photo-1541888946425-d0abb18086f6?auto=format&fit=crop&q=80&w=800",
        projectsTitle: "Industrial Sectors & Experience",
        projectsDesc: "We provide high-level supervision across Europe's most demanding sectors.",
        projectsList: [
          { title: "Offshore & Wind Energy", desc: "Supervision of substructure fabrication, foundations (Monopiles, Jackets), and offshore wind farm components." },
          { title: "Oil & Gas Industry", desc: "Quality inspection and NDT for pipelines, pressure vessels, and refinery steel installations." },
          { title: "Heavy Steel Structures", desc: "Welding coordination for bridges, industrial halls, and crane constructions compliant with EN 1090 EXC3/EXC4." },
          { title: "Power & Shipbuilding", desc: "QA/QC oversight for critical shipyard fabrications and conventional/nuclear power plants." }
        ],
        certTitle: "Qualifications & Standards",
        certDesc: "Our personnel hold international credentials ensuring total regulatory compliance.",
        certList: [
          "International / European Welding Engineers (IWE / EWE)",
          "ISO 9712 Level II & III NDT Inspectors (VT, PT, MT, UT, RT)",
          "FROSIO / NACE Coating & Anti-corrosion Inspectors",
          "SCC / VCA Safety Certified Engineers"
        ],
        ctaTitle: "Partner With Experienced Engineers",
        ctaDesc: "Let's discuss how our technical oversight can secure your next industrial project.",
        ctaBtn: "Start Dialogue"
      },
      pl: {
        title: "Doświadczenie",
        seoTitle: "Doświadczenie | ASN Weld & Inspection Network",
        seoDesc: "Poznaj nasze doświadczenie i model odpowiedzialności technicznej.",
        badge: "NASZA TOŻSAMOŚĆ",
        heroTitle: "Wiedza, Doświadczenie, Odpowiedzialność.",
        heroDesc: "ASN Weld & Inspection Network to zespół ekspertów dedykowany branży spawalniczej i NDT. Nie dostarczamy jedynie zasobów – dostarczamy kompletne rozwiązania techniczne oparte na najwyższych standardach inżynieryjnych.",
        modelTitle: "Model Współpracy: Werkvertrag & Outsourcing",
        modelDesc: "<p class=\"mb-4\">Nasz model biznesowy opiera się na umowach o dzieło (Werkvertrag) oraz pełnym outsourcingu procesów technicznych. W przeciwieństwie do agencji pracy, bierzemy pełną odpowiedzialność za końcowy rezultat projektu, jakość spoin oraz zgodność z normami NDT.</p>",
        stat1Val: "15+", stat1Lbl: "Lat w branży Offshore",
        stat2Val: "100%", stat2Lbl: "Zgodności z normami EN/ISO",
        stat3Val: "50+", stat3Lbl: "Zrealizowanych kontraktów",
        image1: "https://images.unsplash.com/photo-1541888946425-d0abb18086f6?auto=format&fit=crop&q=80&w=800",
        projectsTitle: "Sektory Przemysłowe i Doświadczenie",
        projectsDesc: "Świadczymy nadzór techniczny na najwyższym poziomie w najbardziej wymagających sektorach Europy.",
        projectsList: [
          { title: "Offshore i Energetyka Wiatrowa", desc: "Nadzór nad produkcją podkonstrukcji morskich, fundamentów (Monopiles, Jackets) oraz elementów farm wiatrowych." },
          { title: "Przemysł Naftowy i Gazowniczy", desc: "Kontrola jakości i badania NDT rurociągów, zbiorników ciśnieniowych oraz instalacji rafineryjnych." },
          { title: "Ciężkie Konstrukcje Stalowe", desc: "Koordynacja spawalnicza przy budowie mostów, hal przemysłowych oraz konstrukcji dźwigowych wg EN 1090 EXC3/EXC4." },
          { title: "Energetyka i Przemysł Stoczniowy", desc: "Nadzór QA/QC nad kluczowymi konstrukcjami stoczniowymi oraz elektrowniami konwencjonalnymi i jądrowymi." }
        ],
        certTitle: "Kwalifikacje i Standardy",
        certDesc: "Nasz personel posiada międzynarodowe uprawnienia gwarantujące pełną zgodność regulacyjną.",
        certList: [
          "Międzynarodowi / Europejscy Inżynierowie Spawalnictwa (IWE / EWE)",
          "Inspektorzy NDT 2 i 3 stopnia wg normy ISO 9712 (VT, PT, MT, UT, RT)",
          "Inspektorzy ochrony antykorozyjnej i powłok malarskich FROSIO / NACE",
          "Inżynierowie z certyfikatami bezpieczeństwa SCC / VCA"
        ],
        ctaTitle: "Zaufaj doświadczonym inżynierom",
        ctaDesc: "Porozmawiajmy o tym, jak nasz nadzór techniczny może zabezpieczyć realizację Twojego kolejnego projektu.",
        ctaBtn: "Rozpocznij dialog"
      },
      de: {
        title: "Erfahrung",
        seoTitle: "Erfahrung | ASN Weld & Inspection Network",
        seoDesc: "Erfahren Sie mehr über unsere Erfahrung und unser technisches Verantwortungsmodell.",
        badge: "UNSERE IDENTITÄT",
        heroTitle: "Wissen, Erfahrung, Verantwortung.",
        heroDesc: "Das ASN Weld & Inspection Network ist ein Expertenteam für die Schweiß- und ZfP-Branche. Wir liefern komplette technische Lösungen nach höchsten Ingenieursstandards.",
        modelTitle: "Kooperationsmodell: Werkvertrag & Outsourcing",
        modelDesc: "<p class=\"mb-4\">Unser Geschäftsmodell basiert auf Werkverträgen und dem vollständigen Outsourcing technischer Prozesse. Wir übernehmen die volle Verantwortung für das Endergebnis des Projekts, die Schweißnahtqualität und die Einhaltung der ZfP-Normen.</p>",
        stat1Val: "15+", stat1Lbl: "Jahre in der Offshore-Industrie",
        stat2Val: "100%", stat2Lbl: "Konformität mit EN/ISO",
        stat3Val: "50+", stat3Lbl: "Abgeschlossene Großprojekte",
        image1: "https://images.unsplash.com/photo-1541888946425-d0abb18086f6?auto=format&fit=crop&q=80&w=800",
        projectsTitle: "Industriesektoren & Erfahrung",
        projectsDesc: "Wir bieten technische Überwachung auf höchstem Niveau in den anspruchsvollsten Sektoren Europas.",
        projectsList: [
          { title: "Offshore & Windenergie", desc: "Überwachung der Fertigung von Unterkonstruktionen, Fundamenten (Monopiles, Jackets) und Komponenten für Offshore-Windparks." },
          { title: "Öl- und Gasindustrie", desc: "Qualitätskontrolle und ZfP für Rohrleitungen, Druckbehälter und raffinerietechnische Stahlinstallationen." },
          { title: "Schwerer Stahlbau", desc: "Schweißkoordination bei Brücken, Industriehallen und Krananlagen gemäß EN 1090 EXC3/EXC4." },
          { title: "Energie- und Schiffbau", desc: "QA/QC-Überwachung für kritische Werftkonstruktionen sowie konventionelle und Kernkraftwerke." }
        ],
        certTitle: "Qualifikationen & Standards",
        certDesc: "Unser Personal verfügt über internationale Zertifizierungen für uneingeschränkte Regelkonformität.",
        certList: [
          "International / European Welding Engineers (IWE / EWE)",
          "ISO 9712 Stufe II & III ZfP-Inspektoren (VT, PT, MT, UT, RT)",
          "FROSIO / NACE Korrosionsschutz- und Beschichtungsinspektoren",
          "SCC / VCA sicherheitszertifizierte Ingenieure"
        ],
        ctaTitle: "Vertrauen Sie erfahrenen Ingenieuren",
        ctaDesc: "Lassen Sie uns besprechen, wie unsere technische Überwachung Ihr nächstes Industrieprojekt absichern kann.",
        ctaBtn: "Dialog starten"
      }
    };
    return t[locale] || t['en'];
  }

  if (col.startsWith('contact_page')) {
    const t = {
      en: {
        title: "Contact",
        seoTitle: "Contact | ASN Weld & Inspection Network",
        seoDesc: "Get in touch with our engineering team in Bremen.",
        badge: "Bremen Headquarters, Germany",
        heroTitle: "Get in Touch With Us",
        heroDesc: "We are your strategic partner in welding coordination, NDT testing, and anti-corrosion protection management. We invite you to technical dialogue.",
        formTitle: "Contact Form",
        addressTitle: "Headquarters Address",
        addressText: "ASN Weld & Inspection Network GmbH<br/>Am Wall 120<br/>28195 Bremen, Germany",
        emailText: "contact@asn-network.de",
        phoneText: "+49 (0) 421 123 4567",
        mapImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVWmA8wM3MxEXmQ9Y2wEOiG8OGB6YWeZWuw7WVdnr_itAAshRpJ31ULVbofn_fl5bbpaalep6vqVYaG3_UwPD5EgW3V91P0awyRLjMRiU-tXIWKvgcMNvjz-FVbtJ_pC_vEXyQZwHpNXigv39IpxU2_cusbMD19NRdw5b0UuXQ1o7zt34A8GnQziGUOd8tDOK_RLuh0sOWhO1WOeSJ7fsdenBaZP1FbsDgTqAHhPa6hWZIT_1CJlgeoZv0aQ1wBD_PHQE3sdO668I",
        nameLabel: "Full Name", emailLabel: "Business Email", topicLabel: "Subject", msgLabel: "Message", submitLabel: "Send Inquiry"
      },
      pl: {
        title: "Kontakt",
        seoTitle: "Kontakt | ASN Weld & Inspection Network",
        seoDesc: "Skontaktuj się z naszym zespołem inżynieryjnym w Bremie.",
        badge: "Centrala Bremen, Niemcy",
        heroTitle: "Skontaktuj się z nami",
        heroDesc: "Jesteśmy Twoim strategicznym partnerem w zakresie spawalnictwa, badań NDT oraz zarządzania ochroną antykorozyjną. Zapraszamy do dialogu technicznego.",
        formTitle: "Formularz zgłoszeniowy",
        addressTitle: "Adres centrali",
        addressText: "ASN Weld & Inspection Network GmbH<br/>Am Wall 120<br/>28195 Bremen, Niemcy",
        emailText: "contact@asn-network.de",
        phoneText: "+49 (0) 421 123 4567",
        mapImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVWmA8wM3MxEXmQ9Y2wEOiG8OGB6YWeZWuw7WVdnr_itAAshRpJ31ULVbofn_fl5bbpaalep6vqVYaG3_UwPD5EgW3V91P0awyRLjMRiU-tXIWKvgcMNvjz-FVbtJ_pC_vEXyQZwHpNXigv39IpxU2_cusbMD19NRdw5b0UuXQ1o7zt34A8GnQziGUOd8tDOK_RLuh0sOWhO1WOeSJ7fsdenBaZP1FbsDgTqAHhPa6hWZIT_1CJlgeoZv0aQ1wBD_PHQE3sdO668I",
        nameLabel: "Imię i Nazwisko", emailLabel: "E-mail służbowy", topicLabel: "Temat rozmowy", msgLabel: "Wiadomość", submitLabel: "Wyślij zapytanie"
      },
      de: {
        title: "Kontakt",
        seoTitle: "Kontakt | ASN Weld & Inspection Network",
        seoDesc: "Kontaktieren Sie unser Ingenieurteam in Bremen.",
        badge: "Hauptsitz Bremen, Deutschland",
        heroTitle: "Kontaktieren Sie uns",
        heroDesc: "Wir sind Ihr strategischer Partner für Schweißkoordination, ZfP-Prüfungen und Korrosionsschutzmanagement. Wir laden Sie zum technischen Dialog ein.",
        formTitle: "Kontaktformular",
        addressTitle: "Adresse des Hauptsitzes",
        addressText: "ASN Weld & Inspection Network GmbH<br/>Am Wall 120<br/>28195 Bremen, Deutschland",
        emailText: "contact@asn-network.de",
        phoneText: "+49 (0) 421 123 4567",
        mapImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVWmA8wM3MxEXmQ9Y2wEOiG8OGB6YWeZWuw7WVdnr_itAAshRpJ31ULVbofn_fl5bbpaalep6vqVYaG3_UwPD5EgW3V91P0awyRLjMRiU-tXIWKvgcMNvjz-FVbtJ_pC_vEXyQZwHpNXigv39IpxU2_cusbMD19NRdw5b0UuXQ1o7zt34A8GnQziGUOd8tDOK_RLuh0sOWhO1WOeSJ7fsdenBaZP1FbsDgTqAHhPa6hWZIT_1CJlgeoZv0aQ1wBD_PHQE3sdO668I",
        nameLabel: "Vor- und Nachname", emailLabel: "Geschäftliche E-Mail", topicLabel: "Thema", msgLabel: "Nachricht", submitLabel: "Anfrage senden"
      }
    };
    return t[locale] || t['en'];
  }

  return null;
}
