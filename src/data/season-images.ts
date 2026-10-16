import spring from '@/assets/media/season-spring.png';
import summer from '@/assets/media/season-summer.png';
import autumn from '@/assets/media/season-autumn.png';
import winter from '@/assets/media/season-winter.png';
import type { Season } from '@/domain/catalog';
import type { Locale } from '@/i18n/config';

export const seasonImages: Record<Season, { asset: ImageMetadata; alt: Record<Locale, string> }> = {
  spring: {
    asset: spring,
    alt: {
      es: 'Cosecha de primavera con fresas, hojas verdes y patatas en un huerto mediterráneo.',
      en: 'Spring harvest with strawberries, leafy greens and potatoes in a Mediterranean garden.',
      fi: 'Kevätsato: mansikoita, lehtivihanneksia ja perunoita välimerellisessä puutarhassa.',
      da: 'Forårshøst med jordbær, bladgrønt og kartofler i en middelhavshave.',
    },
  },
  summer: {
    asset: summer,
    alt: {
      es: 'Cosecha de verano con tomates, pimientos, calabacines y fresas en el huerto.',
      en: 'Summer harvest with tomatoes, peppers, courgettes and strawberries in the garden.',
      fi: 'Kesäsato: tomaatteja, paprikoita, kesäkurpitsoja ja mansikoita puutarhassa.',
      da: 'Sommerhøst med tomater, peberfrugter, squash og jordbær i haven.',
    },
  },
  autumn: {
    asset: autumn,
    alt: {
      es: 'Cosecha de otoño con patatas, pimientos y cebollas del huerto.',
      en: 'Autumn harvest with potatoes, peppers and onions from the garden.',
      fi: 'Syyssato: perunoita, paprikoita ja sipuleita puutarhasta.',
      da: 'Efterårshøst med kartofler, peberfrugter og løg fra haven.',
    },
  },
  winter: {
    asset: winter,
    alt: {
      es: 'Cosecha de invierno con naranjas, cebollas y hojas verdes en el huerto mediterráneo.',
      en: 'Winter harvest with oranges, onions and leafy greens in a Mediterranean garden.',
      fi: 'Talvisato: appelsiineja, sipuleita ja lehtivihanneksia välimerellisessä puutarhassa.',
      da: 'Vinterhøst med appelsiner, løg og bladgrønt i en middelhavshave.',
    },
  },
};
