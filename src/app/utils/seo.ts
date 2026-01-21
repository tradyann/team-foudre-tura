import { Meta, Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

export interface SeoData {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  path?: string;
  lang?: string;
  type?: 'website' | 'article';
  baseUrl?: string;
  datePublished?: string;
}

const DEFAULT_LANG = 'en';
const DEFAULT_DOMAIN = 'https://www.turaracing.com';

export function setAlternateLinks({
  document,
  baseUrl = DEFAULT_DOMAIN,
  translations,
  basePath = 'blog' // 👈 par défaut 'blog', mais overridable
}: {
  document: Document;
  baseUrl?: string;
  translations: { [lang: string]: string };
  basePath?: string;
}) {
    // 🔄 Supprimer les anciennes balises alternate
    const existing = document.querySelectorAll('link[rel="alternate"]');
    existing.forEach(el => el.remove());

    // 🔁 Ajouter les nouvelles balises
    Object.entries(translations).forEach(([lang, slug]) => {
      let href = baseUrl;

      if (lang === DEFAULT_LANG) {
        // Si langue par défaut (ex: en)
        if (basePath) {
          href += `/${basePath}`;
          if (slug) href += `/${slug}`;
        } else if (slug) {
          href += `/${slug}`;
        }
      } else {
        href += `/${lang}`;
        if (basePath) {
          href += `/${basePath}`;
          if (slug) href += `/${slug}`;
        } else if (slug) {
          href += `/${slug}`;
        }
      }

      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', lang);
      link.setAttribute('href', href);
      document.head.appendChild(link);
    });

    // 🌍 Ajouter x-default
    const defaultSlug = translations[DEFAULT_LANG];
    let defaultHref = baseUrl;

    if (basePath) {
      defaultHref += `/${basePath}`;
      if (defaultSlug) defaultHref += `/${defaultSlug}`;
    } else if (defaultSlug) {
      defaultHref += `/${defaultSlug}`;
    }

    const defaultLink = document.createElement('link');
    defaultLink.setAttribute('rel', 'alternate');
    defaultLink.setAttribute('hreflang', 'x-default');
    defaultLink.setAttribute('href', defaultHref);
    document.head.appendChild(defaultLink);
}

export async function setSeoTagsFromTranslation(
  translateService: TranslateService,
  titleService: Title,
  metaService: Meta,
  keys: string[], // [titleKey, descriptionKey, keywordsKey?, imageKey?]
  lang: string = DEFAULT_LANG,
  extra?: {
    type?: 'website' | 'article';
    imageFallback?: string;
    url?: string;
    siteName?: string;
    datePublished?: string;
    document?: Document;
  }
) {
  const translations = await firstValueFrom(translateService.get(keys));

  const [titleKey, descKey, keywordsKey, imageKey] = keys;

  const title = translations[titleKey] || '';
  const description = descKey ? translations[descKey] : '';
  const keywords = keywordsKey ? translations[keywordsKey] : '';
  const image = imageKey ? translations[imageKey] : extra?.imageFallback || '';
  const url = extra?.url || DEFAULT_DOMAIN;
  const type = extra?.type || 'website';
  const siteName = extra?.siteName || 'novaxbet';

  // Standard tags
  titleService.setTitle(title);
  if (description) metaService.updateTag({ name: 'description', content: description });
  if (keywords) metaService.updateTag({ name: 'keywords', content: keywords });
  metaService.updateTag({ name: 'robots', content: 'index, follow' });

  // Open Graph
  metaService.updateTag({ property: 'og:title', content: title });
  if (description) metaService.updateTag({ property: 'og:description', content: description });
  if (image) metaService.updateTag({ property: 'og:image', content: image });
  metaService.updateTag({ property: 'og:url', content: url });
  metaService.updateTag({ property: 'og:type', content: type });
  metaService.updateTag({ property: 'og:site_name', content: siteName });
  metaService.updateTag({ property: 'og:locale', content: lang === DEFAULT_LANG ? 'en_GB' : 'fr_FR' });

  // Twitter
  metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
  metaService.updateTag({ name: 'twitter:title', content: title });
  if (description) metaService.updateTag({ name: 'twitter:description', content: description });
  if (image) metaService.updateTag({ name: 'twitter:image', content: image });

  // Optionally datePublished
  if (extra?.datePublished) {
    metaService.updateTag({ property: 'article:published_time', content: extra.datePublished });
  }

  const doc = extra?.document;

  if (doc) {
    const existingCanonical = doc.querySelector("link[rel='canonical']");
    if (existingCanonical) {
      existingCanonical.setAttribute('href', url);
    } else {
      const link = doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', url);
      doc.head.appendChild(link);
    }
  }
}

// export function buildCanonicalUrl({
//   base = DEFAULT_DOMAIN,
//   lang = DEFAULT_LANG,
//   path = ''
// }: {
//   base?: string;
//   lang?: string;
//   path?: string;
// }): string {
//   const cleanPath = path.replace(/^\/|\/$/g, '');
//   return lang === DEFAULT_LANG ? `${base}/${cleanPath}` : `${base}/${lang}/${cleanPath}`;
// }

// export function setFullSeoTags(
//   titleService: Title,
//   metaService: Meta,
//   data: SeoData,
//   document: Document
// ) {
//   const {
//     title,
//     description,
//     keywords,
//     image,
//     path = '',
//     lang = DEFAULT_LANG,
//     type = 'article',
//     baseUrl = DEFAULT_DOMAIN,
//     datePublished // "2023-10-01T12:00:00Z"  // Add this if available Date Format: Use ISO 8601 format
//   } = data;

//   const canonicalUrl = buildCanonicalUrl({ base: baseUrl, lang, path });

//   // Standard
//   titleService.setTitle(title);
//   if (description) metaService.updateTag({ name: 'description', content: description });
//   if (keywords) metaService.updateTag({ name: 'keywords', content: keywords });
//   metaService.updateTag({ name: 'robots', content: 'index, follow' });

  
//   // ✅ Canonical
//   const existingCanonical = document.querySelector("link[rel='canonical']");
//   if (existingCanonical) {
//     existingCanonical.setAttribute('href', canonicalUrl);
//   } else {
//     const link = document.createElement('link');
//     link.setAttribute('rel', 'canonical');
//     link.setAttribute('href', canonicalUrl);
//     document.head.appendChild(link);
//   }

//   document.documentElement.lang = lang;

//   // Open Graph
//   metaService.updateTag({ property: 'og:title', content: title });
//   if (description) metaService.updateTag({ property: 'og:description', content: description });
//   if (image) metaService.updateTag({ property: 'og:image', content: image });
//     metaService.updateTag({ property: 'og:url', content: canonicalUrl });
//     metaService.updateTag({ property: 'og:type', content: type });
//     metaService.updateTag({ property: 'og:site_name', content: 'novaxbet' });
//     metaService.updateTag({ property: 'og:locale', content: lang === DEFAULT_LANG ? 'en_GB': 'fr_FR' });
//   // Add datePublished as an Open Graph tag if provided
//   if (datePublished) {
//     metaService.updateTag({ property: 'article:published_time', content: datePublished });
//   }

//   // Twitter
//   metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
//   metaService.updateTag({ name: 'twitter:title', content: title });
//   if (description) metaService.updateTag({ name: 'twitter:description', content: description });
//   if (image) metaService.updateTag({ name: 'twitter:image', content: image });
// }

// export function generateBlogJsonLd(article: {
//   title: string;
//   description: string;
//   image: string;
//   slug: string;
//   lang?: string;
//   datePublished?: string;
//   author?: string;
//   baseUrl?: string;
// }) {
//   const {
//     title,
//     description,
//     image,
//     slug,
//     lang = DEFAULT_LANG,
//     datePublished = new Date().toISOString(),
//     author = 'novaxbet',
//     baseUrl = DEFAULT_DOMAIN
//   } = article;

//   const url = lang === DEFAULT_LANG ? `${baseUrl}/blog/${slug}` : `${baseUrl}/${lang}/blog/${slug}`;

//   return {
//     '@context': 'https://schema.org',
//     '@type': 'BlogPosting',
//     headline: title,
//     description: description,
//     image: [image],
//     datePublished: datePublished,
//     author: {
//       '@type': 'Person',
//       name: author
//     },
//     publisher: {
//       '@type': 'Organization',
//       name: 'novaxbet',
//       logo: {
//         '@type': 'ImageObject',
//         url: `${baseUrl}/assets/logo.svg`
//       }
//     },
//     mainEntityOfPage: {
//       '@type': 'WebPage',
//       '@id': url
//     }
//   };
// }