export const ROUTE_TRANSLATIONS: Record<string, Record<string, string>> = {
    'about': {
        fr: 'a-propos-betcooper',
        de: 'uber-betcooper',
        es: 'sobre-betcooper',
        it: 'informazioni-betcooper',
        nl: 'over-betcooper',
        pl: 'o-betcooper',
        pt: 'sobre-betcooper',
        ro: 'despre-betcooper',
        sv: 'om-betcooper',
        tr: 'betcooper-hakkinda',
        el: 'sxetika-me-to-betcooper',
        bg: 'za-betcooper'
    }
};

export const SUPPORTED_LANGS = ['de','el','es','fr','it','nl','pl','pt','ro','sv','tr','bg'];

export function normalizeSlug(lang: string, slug: string): string {
    if (lang === 'en') return slug;

    const match = Object.entries(ROUTE_TRANSLATIONS).find(([base, translations]) =>
        base === slug || Object.values(translations).includes(slug)
    );

    if (!match) return slug;

    const [base, translations] = match;
    return translations[lang] || slug;
}