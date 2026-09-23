export const AUTHORIZED_SITE_EDITORS = [
  'Lázaro Luis',
  'Francisco Faztudo',
  'Maria Victoria',
  'Maria Victória'
];

/**
 * Checks if the specified username corresponds to one of the 3 authorized
 * site content administrators: Lázaro Luis, Francisco Faztudo, or Maria Victoria.
 * Case-insensitive and accent-insensitive.
 */
export const isAuthorizedSiteEditor = (user: string | null | undefined): boolean => {
  if (!user) return false;
  
  const clean = (s: string) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

  const cleanAuthorized = [
    'lazaro luis',
    'francisco faztudo',
    'maria victoria'
  ];

  if (cleanAuthorized.includes(clean(user))) return true;

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('fyp_authorized_site_editors');
      if (stored) {
        const dynamicList: string[] = JSON.parse(stored);
        if (Array.isArray(dynamicList) && dynamicList.some((d) => clean(d) === clean(user))) {
          return true;
        }
      }
    } catch {
      // ignore
    }
  }

  return false;
};

export const addAuthorizedSiteEditor = (user: string): void => {
  if (typeof window === 'undefined' || !user) return;
  try {
    const stored = localStorage.getItem('fyp_authorized_site_editors');
    const list: string[] = stored ? JSON.parse(stored) : [];
    if (!list.includes(user)) {
      list.push(user);
      localStorage.setItem('fyp_authorized_site_editors', JSON.stringify(list));
    }
  } catch (e) {
    console.warn('Erro ao salvar editor autorizado:', e);
  }
};
