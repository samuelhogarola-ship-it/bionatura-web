import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import WhatsAppAction from '../../src/components/order/WhatsAppAction.astro';
import type { ValidatedField } from '../../src/data/business';

describe('WhatsAppAction', () => {
  it('renders a native link with a valid href for an injected confirmed fixture', async () => {
    const container = await AstroContainer.create();
    const whatsapp: ValidatedField<string> = { status: 'confirmed', value: '+34 611 222 333' };
    const html = await container.renderToString(WhatsAppAction, { props: { locale: 'es', whatsapp } });

    expect(html).toMatch(/<a\b/);
    expect(html).toContain('href="https://wa.me/34611222333?text=');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });
});
