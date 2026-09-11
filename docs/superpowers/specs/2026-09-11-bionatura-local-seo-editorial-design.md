# Bionatura Local SEO and Editorial Design

## Objective

Improve Bionatura's organic visibility for useful local searches around Los Pacos and Fuengirola while adding an editorial section that gives visitors practical reasons to discover products and return to the site.

The primary Spanish search themes are:

- productos biológicos Fuengirola;
- frutería Fuengirola;
- productos de temporada Fuengirola;
- huerto en Los Pacos;
- producto local Fuengirola;
- verduras y huevos de proximidad;
- aceite de oliva bio and kombucha bio when those products are relevant.

These phrases must appear naturally where they describe visible content. The implementation must not use keyword stuffing, doorway pages, hidden copy, invented reviews, or the obsolete `meta keywords` tag.

## Audience and languages

The site serves residents and visitors around Fuengirola, especially Los Pacos. Every new editorial page will be available in Spanish, English, Finnish, and Danish.

Spanish is the source version. Each translation must preserve the practical meaning and local names while sounding natural in its language. Translated pages must not be machine-like literal copies. Place names such as Bionatura, Los Pacos, and Fuengirola remain unchanged.

## Editorial concept

The new primary navigation section is named **Huerto y recetas** in Spanish, with natural equivalents in the other three languages. It combines three closely related formats:

1. Seasonal guides that help customers understand what may be available.
2. Simple recipes using products shown in the catalog.
3. First-hand notes about Bionatura's growing and collection model in Los Pacos.

This hybrid is preferred over a generic news feed because evergreen guides and complete recipes remain useful without requiring an artificial publishing cadence. New posts can still be added when there is a genuine update from the garden.

## Information architecture

Add one localized editorial index and localized article detail routes:

- Spanish index: `/es/huerto-recetas/`
- English index: `/en/garden-recipes/`
- Finnish index: `/fi/puutarha-reseptit/`
- Danish index: `/da/have-opskrifter/`

Each article has a stable internal ID and a localized slug in every language. Canonical URLs point to the current language version. Each article exposes four language alternates plus an `x-default` link to Spanish.

The editorial index appears in desktop navigation, the mobile menu, and the footer. Existing pages link to relevant articles, and articles link back to the catalog, related products, contact, and other useful articles. Breadcrumbs use three levels on details: home, Huerto y recetas, article.

## Initial content

Launch with six complete editorial items, each translated into all four languages:

1. **Qué productos están de temporada en Fuengirola** — a seasonal guide explaining that actual availability is confirmed before collection.
2. **Cómo elegir tomates de huerto** — practical signs of freshness, storage advice, and a link to tomatoes in the catalog.
3. **Ensalada de tomate, cebolla roja y aceite de oliva bio** — a complete recipe with servings, preparation time, ingredients, and ordered instructions.
4. **Calabacines mediterráneos sencillos** — a complete recipe using courgettes and olive oil, with servings, preparation and cooking times, ingredients, and ordered instructions.
5. **Qué significa comprar producto biológico y local** — a careful guide that avoids unsupported certification or environmental claims.
6. **Del huerto de Los Pacos a tu cesta** — an accurate explanation of the catalog, availability confirmation, order list, WhatsApp consultation, and previously arranged collection.

Every item includes:

- a localized title and description;
- a short introduction and structured body sections;
- one existing, relevant Bionatura or product photograph with localized alt text;
- a type of `article` or `recipe`;
- a genuine publication date fixed at launch and an optional modification date only when content changes materially;
- Bionatura as the author or reviewer;
- related product IDs and related article IDs;
- one clear next action.

The copy must not invent prices, stock, opening hours, certifications, health benefits, customer opinions, delivery services, or a public shop address.

## Content model

Keep editorial content in typed source data within the Astro project. A single article record owns the stable ID, type, image, dates, relationships, and four localized variants. Recipe-only properties are required when the type is `recipe`.

The model must enforce:

- all four locales are present;
- every localized slug is unique within its locale;
- every related product exists;
- every related article exists and is not self-referential;
- recipes contain at least one ingredient, one instruction, a serving yield, and the relevant preparation or cooking times;
- non-recipe articles cannot emit recipe-only structured data.

No CMS, database, user accounts, comments, ratings, or automatic article generation are included. Content changes continue through the repository.

## Page experience

### Editorial index

The index opens with a concise local introduction, then presents featured and recent content in responsive cards. Cards show the real photograph, content type, title, short description, and a readable publication date. Filters or search are not needed for six items.

### Article detail

The detail view uses a comfortable reading width, a strong hero image, visible author and date information, and section headings that accurately summarize the content. Recipe pages give ingredients and numbered steps clear visual separation. A related-products block uses existing product data rather than duplicating it.

The mascot may appear once as a small guide near the final call to action. It must not dominate the article or repeat the welcome overlay.

All layouts must work at mobile, tablet, and desktop sizes, preserve keyboard navigation, use semantic headings, and maintain visible focus states.

## On-page and technical SEO

Update the existing localized home, catalog, about, contact, and gallery titles and descriptions so they explain Bionatura's offer and location naturally. The Spanish homepage should clearly connect Bionatura with biological and seasonal products in Fuengirola and the garden in Los Pacos. Other languages should target equivalent user intent, not repeat the Spanish phrases verbatim.

Each index and detail page includes:

- a unique title and meta description;
- an absolute canonical URL;
- complete `hreflang` alternates and Spanish `x-default`;
- Open Graph and X sharing metadata;
- an appropriate share image using the visible article photograph;
- crawlable internal links with descriptive anchor text;
- one visible H1 and a logical heading hierarchy.

Astro's sitemap integration must include all localized editorial URLs. `robots.txt` continues to advertise the production sitemap. The root language redirect remains excluded from indexing.

## Structured data

Retain `Organization` because the confirmed Calle Tórtolas address is the registered office and must not be represented as a storefront or collection point.

Enhance site-wide structured data with:

- `WebSite` for the Bionatura site;
- `Organization` with confirmed legal details and `areaServed` for Fuengirola;
- `BreadcrumbList` matching the visible breadcrumb path.

Editorial indexes emit `CollectionPage` and an `ItemList` of visible articles. Standard articles emit `Article`. Recipe pages emit `Recipe` with the visible name, description, image, author, dates, yield, times, ingredients, and instructions. Structured data must never contain facts absent from the rendered page.

Do not emit ratings, reviews, nutrition, prices, availability, product offers, opening hours, or `LocalBusiness` until Bionatura supplies verified facts that make those properties accurate.

## Internal linking

The home page links to the editorial index and one useful seasonal item. The catalog links relevant product cards or sections to recipes and guides without distracting from preparation of the order list. The about and contact pages link to the Los Pacos article. Article pages link to related catalog products and no more than three related articles.

Links must be descriptive in every language. Avoid repetitive exact-match anchors across every page.

## Trust and local accuracy

Use Bionatura as the named publisher and content reviewer. First-hand claims must remain limited to facts already confirmed in the site or provided by Bionatura. The registered address stays on legal pages; collection remains described as arranged in advance in Los Pacos.

The website implementation can improve relevance and crawlability, but local visibility also depends on the external Google Business Profile, reviews, links, distance, and prominence. Search Console verification and Business Profile management are operational follow-up tasks and do not require placeholder credentials in the repository.

## Performance and accessibility

Reuse the existing responsive image component and optimized local assets. Editorial photographs must reserve layout space, use appropriate responsive sizes, and lazy-load below the fold. Do not introduce a client-side framework or large content library for static articles.

Every image has meaningful localized alt text unless decorative. Dates use semantic `time` elements. Recipe lists, article cards, breadcrumbs, and navigation have accessible names and correct landmark structure.

## Validation and acceptance criteria

The feature is complete when:

1. All six items render in all four languages, producing 24 article pages and four editorial indexes.
2. Every editorial page has the expected canonical and five alternate links: four locales plus `x-default`.
3. Navigation and breadcrumbs preserve the equivalent editorial page when switching language.
4. Sitemap output contains all index and detail URLs and `robots.txt` points to the production sitemap.
5. Each article has a unique localized title, description, H1, visible author, date, and relevant image.
6. Recipe structured data contains all required visible recipe properties; article pages emit `Article`, not `Recipe`.
7. Organization data does not present the registered office as a shop or collection point.
8. Existing order-list, WhatsApp, catalog, gallery, legal, and navigation flows remain functional.
9. Automated unit and browser tests cover routing, locale parity, metadata, structured data, internal links, responsive navigation, and accessibility.
10. `npm test` and `npm run build` succeed before the changes are published.

## Out of scope

- Guaranteed rankings or a promised ranking date.
- Paid advertising, backlink purchasing, or review generation.
- Google Business Profile or Search Console account changes.
- A CMS, editorial login, newsletter, comments, ratings, or article search.
- Invented business facts, certifications, stock, prices, opening hours, or customer testimonials.
