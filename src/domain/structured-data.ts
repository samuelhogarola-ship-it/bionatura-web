import { business } from '@/data/business';
import { products } from '@/data/products';
import { pathFor, type Locale, type PageKey } from '@/i18n/config';

export interface StructuredBreadcrumbItem {
  label: string;
  href?: string;
}

interface StructuredDataInput {
  locale: Locale;
  page: PageKey;
  current: string;
  baseUrl?: URL;
  canonicalPath?: string;
  breadcrumbs?: StructuredBreadcrumbItem[];
}

export function buildPageStructuredData({
  locale,
  page,
  current,
  baseUrl = new URL('https://bionatura.es'),
  canonicalPath,
  breadcrumbs,
}: StructuredDataInput): Record<string, unknown>[] {
  const siteUrl = new URL('/', baseUrl).href;
  const currentUrl = new URL(canonicalPath ?? pathFor(locale, page), baseUrl).href;
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}#organization`,
    name: business.legalName,
    alternateName: business.name,
    url: siteUrl,
    taxID: business.taxId,
    areaServed: { '@type': 'City', name: 'Fuengirola' },
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.registeredAddress.value.street,
      postalCode: business.registeredAddress.value.postalCode,
      addressLocality: business.registeredAddress.value.locality,
      addressCountry: business.registeredAddress.value.country,
    },
  };
  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}#website`,
    name: business.name,
    url: siteUrl,
    inLanguage: ['es', 'en', 'fi', 'da'],
    publisher: { '@id': `${siteUrl}#organization` },
  };
  const home = { es: 'Inicio', en: 'Home', fi: 'Etusivu', da: 'Forside' }[locale];
  const breadcrumbItems = breadcrumbs ?? (page === 'home' ? [] : [
    { label: home, href: pathFor(locale, 'home') },
    { label: current, href: pathFor(locale, page) },
  ]);
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: new URL(item.href ?? currentUrl, baseUrl).href,
    })),
  };

  const pageSchemas: Record<string, unknown>[] = [];
  if (page === 'catalog') {
    const serviceType = {
      es: 'Reparto a domicilio de fruta, verdura y productos biológicos',
      en: 'Home delivery of organic fruit, vegetables and produce',
      fi: 'Luomuhedelmien, vihannesten ja tuotteiden kotiinkuljetus',
      da: 'Hjemmelevering af økologisk frugt, grønt og varer',
    }[locale];
    pageSchemas.push({
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${currentUrl}#delivery-service`,
      serviceType,
      provider: { '@id': `${siteUrl}#organization` },
      areaServed: [
        { '@type': 'City', name: 'Fuengirola' },
        { '@type': 'Place', name: 'Torreblanca' },
      ],
      url: currentUrl,
    });
    pageSchemas.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${currentUrl}#catalog`,
      name: current,
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Thing',
          name: product.name[locale],
          ...(product.availability === 'consult' ? {} : { description: product.shortDescription[locale] }),
        },
      })),
    });
  }

  return breadcrumbItems.length > 0
    ? [website, organization, breadcrumb, ...pageSchemas]
    : [website, organization, ...pageSchemas];
}
