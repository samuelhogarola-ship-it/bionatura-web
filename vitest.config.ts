import { getViteConfig } from 'astro/config';

const config = {
  root: '.',
  test: { include: ['tests/unit/**/*.test.ts'] },
};

export default getViteConfig(config);
