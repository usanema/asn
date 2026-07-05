/**
 * Helper to fetch data from PocketBase API
 */
export async function fetchApi({ collection, endpoint, locale = 'en', query = {}, isList = false }) {
  // Support both 'collection' and 'endpoint' parameter names during migration
  const colName = collection || endpoint;
  // Normalize collection names (e.g. 'home-page' -> 'home_page')
  const col = colName.replace(/-/g, '_');

  const baseUrl = import.meta.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
  const url = new URL(`${baseUrl}/api/collections/${col}/records`);

  // Add locale filter if applicable (except for global_settings or general collections without locale)
  if (locale && col !== 'global_setting' && col !== 'global_settings') {
    url.searchParams.append('filter', `locale = '${locale}'`);
  }

  // Append any extra query params
  Object.entries(query).forEach(([key, value]) => {
    if (key !== 'locale' && key !== 'populate') {
      url.searchParams.append(key, value);
    }
  });

  const headers = {};
  if (import.meta.env.POCKETBASE_TOKEN) {
    headers['Authorization'] = import.meta.env.POCKETBASE_TOKEN;
  }

  try {
    const res = await fetch(url.toString(), { headers });
    if (!res.ok) {
      throw new Error(`Failed to fetch from PocketBase: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    
    // PocketBase returns { items: [...] } for collection queries
    if (data.items && Array.isArray(data.items)) {
      if (isList || col === 'navigation' || col === 'navigations') {
        return data.items;
      }
      return data.items[0] || null;
    }
    
    return data;
  } catch (error) {
    console.warn(`[PocketBase Mock] Failed to fetch '${col}'. Falling back to local mock data. (${error.message})`);
    return getMockData(col, locale);
  }
}

/**
 * Zwraca adres URL do pliku/obrazka z PocketBase
 */
export function getMedia(filename, record) {
  if (filename == null) {
    return null;
  }
  // Jeśli to pełny link (np. zewnętrzny CDN)
  if (typeof filename === 'string' && (filename.startsWith('http') || filename.startsWith('//'))) {
    return filename;
  }
  // Jeśli to lokalny plik z PocketBase
  const baseUrl = import.meta.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
  if (record && record.id && record.collectionId) {
    return `${baseUrl}/api/files/${record.collectionId}/${record.id}/${filename}`;
  }
  return filename;
}

/**
 * Mock data for local development when PocketBase is not running or collections are not created yet.
 */
function getMockData(col, locale = 'en') {
  if (col.startsWith('global_setting')) {
    return {
      id: "mock_global_id",
      collectionId: "mock_global_col",
      backgroundColor: "#fcf8fa", // Domyślny z Industrial Precision
      logoText: "ASN Weld & Inspection Network",
      logo: null
    };
  }
  
  if (col.startsWith('navigation')) {
    const t = {
      en: [
        { id: "nav1", title: "Home", path: "/" },
        { id: "nav2", title: "About", path: "/about.html" },
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
        heroTitle: "Ekspercka wiedza.<br/><span class=\"text-secondary\">Realna odpowiedzialność.</span>",
        heroDesc: "Profesjonalne usługi inżynieryjne i koordynacja projektów w obszarach spawalnictwa, NDT i ochrony antykorozyjnej. Zapewniamy precyzję tam, gdzie bezpieczeństwo jest priorytetem.",
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
        heroTitle: "Ekspercka wiedza.<br/><span class=\"text-secondary\">Realna odpowiedzialność.</span>",
        heroDesc: "Profesjonalne usługi inżynieryjne i koordynacja projektów w obszarach spawalnictwa, NDT i ochrony antykorozyjnej. Zapewniamy precyzję tam, gdzie bezpieczeństwo jest priorytetem.",
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

  return null;
}
