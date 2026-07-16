/**
 * Helper to fetch content data
 */
export async function fetchApi({ collection, endpoint, locale = 'en', query = {}, isList = false }) {
  const colName = collection || endpoint;
  const col = colName.replace(/-/g, '_');

  const data = getLocalData(col, locale);
  if (data && data.items && Array.isArray(data.items)) {
    if (isList || col === 'navigation' || col === 'navigations') {
      return data.items;
    }
    return data.items[0] || null;
  }
  return data;
}

/**
 * Returns URL for media files
 */
export function getMedia(filename, record) {
  if (filename == null) {
    return null;
  }
  if (typeof filename === 'string' && (filename.startsWith('http') || filename.startsWith('//'))) {
    return filename;
  }
  return filename;
}

/**
 * Complete multilingual content data
 */
function getLocalData(col, locale = 'en') {
  if (col.startsWith('global_setting')) {
    return {
      id: "mock_global_id",
      collectionId: "mock_global_col",
      backgroundColor: "#fcf8fa",
      colorPrimary: "#112c3f",
      colorSecondary: "#e65c00",
      colorNavy: "#0b1d2a",
      colorSurface: "#ffffff",
      colorText: "#1f2937",
      logoText: "ASN Weld & Inspection Network",
      footerText: "© 2024 ASN Weld & Inspection Network. All rights reserved. Brema Headquarters.",
      logo: "/logo.png"
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
        heroTitle: "Expert Knowledge.<br/><span class=\"text-secondary\">Real Responsibility.</span>",
        heroDesc: "Professional engineering services and project coordination in welding, NDT, and anti-corrosion protection. We ensure precision where safety is a priority.",
        heroImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBrGiolNSi1aj_eMj1dC52n6Fhn9p1dzew3rJjbium6Hcp0su75LUGgByvEvfD7gzxGp6dkOqMh4sDXy5yUXgpQujccUM6Igb5FOBweEzo5oiELmnPTZFp3HeqCcWxzH0JlyKhYpKb8AN_yCCzbt_697NM4eYFHYx68s0z4LxT19W_czhbgEk9HExO1APRQli5cfWmoCZdipk2ZqcVJQfAEZCl3VJwEXF1keSSA4XtPYcoMlMFW7uZeRnGsvWpOY63Kbj49EQHhV8"
      },
      pl: { 
        title: "Strona Główna", 
        seoTitle: "Główna | ASN Weld & Inspection Network", 
        seoDesc: "Witamy w ASN Weld & Inspection Network. Profesjonalny nadzór i koordynacja spawalnicza.",
        heroTitle: "Ekspercka wiedza.<br/><span class=\"text-secondary\">Realna odpowiedzialność.</span>",
        heroDesc: "Profesjonalne usługi inżynieryjne i koordynacja projektów w obszarach spawalnictwa, NDT i ochrony antykorozyjnej. Zapewniamy precyzję tam, gdzie bezpieczeństwo jest priorytetem.",
        heroImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBrGiolNSi1aj_eMj1dC52n6Fhn9p1dzew3rJjbium6Hcp0su75LUGgByvEvfD7gzxGp6dkOqMh4sDXy5yUXgpQujccUM6Igb5FOBweEzo5oiELmnPTZFp3HeqCcWxzH0JlyKhYpKb8AN_yCCzbt_697NM4eYFHYx68s0z4LxT19W_czhbgEk9HExO1APRQli5cfWmoCZdipk2ZqcVJQfAEZCl3VJwEXF1keSSA4XtPYcoMlMFW7uZeRnGsvWpOY63Kbj49EQHhV8"
      },
      de: { 
        title: "Startseite", 
        seoTitle: "Startseite | ASN Weld & Inspection Network", 
        seoDesc: "Willkommen bei ASN Weld & Inspection Network. Professionelle Schweißaufsicht und NDT.",
        heroTitle: "Expertenwissen.<br/><span class=\"text-secondary\">Echte Verantwortung.</span>",
        heroDesc: "Professionelle Ingenieurdienstleistungen und Projektkoordination in den Bereichen Schweißtechnik, ZfP und Korrosionsschutz. Wir sorgen für Präzision, wo Sicherheit Priorität hat.",
        heroImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBrGiolNSi1aj_eMj1dC52n6Fhn9p1dzew3rJjbium6Hcp0su75LUGgByvEvfD7gzxGp6dkOqMh4sDXy5yUXgpQujccUM6Igb5FOBweEzo5oiELmnPTZFp3HeqCcWxzH0JlyKhYpKb8AN_yCCzbt_697NM4eYFHYx68s0z4LxT19W_czhbgEk9HExO1APRQli5cfWmoCZdipk2ZqcVJQfAEZCl3VJwEXF1keSSA4XtPYcoMlMFW7uZeRnGsvWpOY63Kbj49EQHhV8"
      },
    };
    return t[locale] || t['en'];
  }

  if (col.startsWith('about_page')) {
    const t = {
      en: { 
        title: "About Us", 
        seoTitle: "About Us | ASN Weld & Inspection Network", 
        seoDesc: "Learn more about the ASN Weld & Inspection Network.",
        mainTitle: "Quality Experts.<br/><span class=\"text-secondary\">Business Partners.</span>",
        mainContent: "<p class=\"mb-6\">Our market advantage stems from direct industry experience and an understanding of our clients' operational challenges. We connect the best experts in the industry, creating a unique technical knowledge ecosystem managed from our headquarters in Bremen.</p><p>We are proud to be the foundation of safety in the most important branches of European industry, from Offshore to the energy sector.</p>"
      },
      pl: { 
        title: "O nas", 
        seoTitle: "O nas | ASN Weld & Inspection Network", 
        seoDesc: "Poznaj bliżej sieć inżynieryjną ASN Weld & Inspection Network.",
        mainTitle: "Eksperci od jakości.<br/><span class=\"text-secondary\">Partnerzy w biznesie.</span>",
        mainContent: "<p class=\"mb-6\">Nasza przewaga rynkowa wynika z bezpośredniego doświadczenia w przemyśle i zrozumienia wyzwań operacyjnych naszych klientów. Łączymy najlepszych ekspertów w branży, tworząc unikalny ekosystem wiedzy technicznej zarządzany z naszej centrali w Bremie.</p><p>Jesteśmy dumni, że stajemy się fundamentem bezpieczeństwa w najważniejszych gałęziach europejskiego przemysłu, od Offshore po energetykę.</p>"
      },
      de: { 
        title: "Über uns", 
        seoTitle: "Über uns | ASN Weld & Inspection Network", 
        seoDesc: "Erfahren Sie mehr über das ASN Weld & Inspection Network.",
        mainTitle: "Qualitätsexperten.<br/><span class=\"text-secondary\">Geschäftspartner.</span>",
        mainContent: "<p class=\"mb-6\">Unser Marktvorteil ergibt sich aus direkter Branchenerfahrung und dem Verständnis für die operativen Herausforderungen unserer Kunden. Wir vereinen die besten Experten der Branche in einem einzigartigen Ökosystem technischen Wissens, das von unserem Hauptsitz in Bremen aus verwaltet wird.</p><p>Wir sind stolz darauf, das Fundament für Sicherheit in den wichtigsten Zweigen der europäischen Industrie zu bilden, von Offshore bis zur Energiewirtschaft.</p>"
      },
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
        pillar2Title: "Non-Destructive Testing (NDT / VT, PT, MT, UT, RT)",
        pillar2Desc: "Certified inspections by level II and III personnel according to ISO 9712.",
        pillar2Image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800",
        pillar3Title: "Anti-Corrosion Protection & FROSIO/NACE Inspection",
        pillar3Desc: "Comprehensive coating inspections, surface preparation analysis, and quality assurance.",
        pillar3Image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800"
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
        pillar2Title: "Badania Nieniszczące (NDT / VT, PT, MT, UT, RT)",
        pillar2Desc: "Certyfikowane inspekcje wykonywane przez personel drugiego i trzeciego stopnia według normy ISO 9712.",
        pillar2Image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800",
        pillar3Title: "Ochrona Antykorozyjna i Inspekcje FROSIO/NACE",
        pillar3Desc: "Kompleksowe inspekcje powłok malarskich, analiza przygotowania powierzchni i kontrola jakości.",
        pillar3Image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800"
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
        pillar2Title: "Zerstörungsfreie Prüfung (ZfP / VT, PT, MT, UT, RT)",
        pillar2Desc: "Zertifizierte Inspektionen durch Personal der Stufen II und III gemäß ISO 9712.",
        pillar2Image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800",
        pillar3Title: "Korrosionsschutz & FROSIO/NACE-Inspektion",
        pillar3Desc: "Umfassende Beschichtungsinspektionen, Analyse der Oberflächenvorbereitung und Qualitätssicherung.",
        pillar3Image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800"
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
        image1: "https://images.unsplash.com/photo-1541888946425-d0abb18086f6?auto=format&fit=crop&q=80&w=800"
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
        image1: "https://images.unsplash.com/photo-1541888946425-d0abb18086f6?auto=format&fit=crop&q=80&w=800"
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
        image1: "https://images.unsplash.com/photo-1541888946425-d0abb18086f6?auto=format&fit=crop&q=80&w=800"
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
        phoneText: "+49 (0) 421 123 4567"
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
        phoneText: "+49 (0) 421 123 4567"
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
        phoneText: "+49 (0) 421 123 4567"
      }
    };
    return t[locale] || t['en'];
  }

  return null;
}
