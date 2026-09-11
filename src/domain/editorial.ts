import type { ImageMetadata } from 'astro';
import type { Locale } from '../i18n/config';

export type Localized<T> = Record<Locale, T>;

export interface EditorialSection {
  heading: string;
  paragraphs: string[];
}

export interface EditorialLocaleContent {
  slug: string;
  title: string;
  description: string;
  intro: string;
  imageAlt: string;
  sections: EditorialSection[];
  ctaLabel: string;
}

export interface RecipeContent {
  yield: Localized<string>;
  prepTime: string;
  cookTime?: string;
  ingredients: Localized<string[]>;
  instructions: Localized<string[]>;
}

interface EditorialItemBase {
  id: string;
  publishedAt: string;
  modifiedAt?: string;
  image: ImageMetadata;
  locales: Localized<EditorialLocaleContent>;
  relatedProductIds: string[];
  relatedArticleIds: string[];
}

export interface ArticleEditorialItem extends EditorialItemBase {
  type: 'article';
  recipe?: never;
}

export interface RecipeEditorialItem extends EditorialItemBase {
  type: 'recipe';
  recipe: RecipeContent;
}

export type EditorialItem = ArticleEditorialItem | RecipeEditorialItem;

const locales: readonly Locale[] = ['es', 'en', 'fi', 'da'];

function assertText(value: unknown, label: string, itemId: string): asserts value is string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${label} missing for editorial item ${itemId}`);
  }
}

function assertLocalizedText(value: unknown, label: string, itemId: string): asserts value is Localized<string> {
  if (!value || typeof value !== 'object') throw new Error(`${label} missing for editorial item ${itemId}`);
  for (const locale of locales) assertText((value as Partial<Localized<string>>)[locale], `${label} for ${locale}`, itemId);
}

function assertLocalizedList(value: unknown, label: string, itemId: string): asserts value is Localized<string[]> {
  if (!value || typeof value !== 'object') throw new Error(`${label} missing for editorial item ${itemId}`);
  for (const locale of locales) {
    const list = (value as Partial<Localized<string[]>>)[locale];
    if (!Array.isArray(list) || list.length === 0 || list.some((entry) => typeof entry !== 'string' || entry.trim() === '')) {
      throw new Error(`${label} missing for ${locale} in editorial item ${itemId}`);
    }
  }
}

function assertLocaleContent(item: EditorialItem, locale: Locale): void {
  const content = item.locales?.[locale];
  if (!content) throw new Error(`locale ${locale} missing for editorial item ${item.id}`);
  assertText(content.slug, `slug for ${locale}`, item.id);
  assertText(content.title, `title for ${locale}`, item.id);
  assertText(content.description, `description for ${locale}`, item.id);
  assertText(content.intro, `intro for ${locale}`, item.id);
  assertText(content.imageAlt, `imageAlt for ${locale}`, item.id);
  assertText(content.ctaLabel, `ctaLabel for ${locale}`, item.id);
  if (!Array.isArray(content.sections) || content.sections.length === 0) {
    throw new Error(`sections missing for ${locale} in editorial item ${item.id}`);
  }
  for (const section of content.sections) {
    assertText(section?.heading, `section heading for ${locale}`, item.id);
    if (!Array.isArray(section?.paragraphs) || section.paragraphs.length === 0) {
      throw new Error(`section paragraphs missing for ${locale} in editorial item ${item.id}`);
    }
    for (const paragraph of section.paragraphs) assertText(paragraph, `section paragraph for ${locale}`, item.id);
  }
}

function assertRecipe(item: EditorialItem): void {
  const recipe = (item as { recipe?: RecipeContent }).recipe;
  if (item.type === 'article') {
    if (recipe !== undefined) throw new Error(`article cannot have recipe data: ${item.id}`);
    return;
  }

  if (!recipe) throw new Error(`recipe data missing for editorial item ${item.id}`);
  assertLocalizedText(recipe.yield, 'recipe yield', item.id);
  assertText(recipe.prepTime, 'recipe prepTime', item.id);
  if (!/^PT(?:\d+H)?(?:\d+M)?(?:\d+S)?$/.test(recipe.prepTime) || recipe.prepTime === 'PT') {
    throw new Error(`recipe prepTime must be ISO 8601 for editorial item ${item.id}`);
  }
  if (recipe.cookTime !== undefined && (!/^PT(?:\d+H)?(?:\d+M)?(?:\d+S)?$/.test(recipe.cookTime) || recipe.cookTime === 'PT')) {
    throw new Error(`recipe cookTime must be ISO 8601 for editorial item ${item.id}`);
  }
  assertLocalizedList(recipe.ingredients, 'recipe ingredients', item.id);
  assertLocalizedList(recipe.instructions, 'recipe instructions', item.id);
}

export function assertValidEditorial(items: EditorialItem[], productIds: readonly string[]): void {
  const itemIds = new Set<string>();
  const productIdSet = new Set(productIds);
  const slugsByLocale = new Map<Locale, Set<string>>(locales.map((locale) => [locale, new Set()]));

  for (const item of items) {
    assertText(item?.id, 'id', item?.id ?? 'unknown');
    if (itemIds.has(item.id)) throw new Error(`duplicate editorial item id: ${item.id}`);
    itemIds.add(item.id);
    assertText(item.publishedAt, 'publishedAt', item.id);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(item.publishedAt)) throw new Error(`publishedAt must be YYYY-MM-DD for editorial item ${item.id}`);
    if (item.modifiedAt !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(item.modifiedAt)) throw new Error(`modifiedAt must be YYYY-MM-DD for editorial item ${item.id}`);
    if (!item.image) throw new Error(`image missing for editorial item ${item.id}`);
    if (!Array.isArray(item.relatedProductIds)) throw new Error(`relatedProductIds missing for editorial item ${item.id}`);
    if (!Array.isArray(item.relatedArticleIds)) throw new Error(`relatedArticleIds missing for editorial item ${item.id}`);

    for (const locale of locales) {
      assertLocaleContent(item, locale);
      const slug = item.locales[locale].slug;
      const slugs = slugsByLocale.get(locale)!;
      if (slugs.has(slug)) throw new Error(`duplicate localized slug for ${locale}: ${slug}`);
      slugs.add(slug);
    }
    assertRecipe(item);
    for (const productId of item.relatedProductIds) {
      if (!productIdSet.has(productId)) throw new Error(`invalid related product id ${productId} in editorial item ${item.id}`);
    }
  }

  for (const item of items) {
    for (const articleId of item.relatedArticleIds) {
      if (articleId === item.id) throw new Error(`editorial item cannot relate to itself: ${item.id}`);
      if (!itemIds.has(articleId)) throw new Error(`invalid related article id ${articleId} in editorial item ${item.id}`);
    }
  }
}
