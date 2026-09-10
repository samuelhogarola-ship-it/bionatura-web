import type { ImageMetadata } from 'astro';
import marketStallTeam from '@/assets/media/bionatura-market-stall-team.jpeg';
import growerGreenhouse from '@/assets/media/bionatura-grower-greenhouse.jpeg';
import woodenBirdhouses from '@/assets/media/daily-wooden-birdhouses.jpeg';
import beetChard from '@/assets/media/garden-rain-beet-chard.jpeg';
import seedlingBeds from '@/assets/media/garden-seedling-beds-greenhouse.jpeg';
import mixedLeafRows from '@/assets/media/garden-mixed-leaf-rows.jpeg';
import lettuceFennel from '@/assets/media/garden-rows-lettuce-fennel.jpeg';
import tomatoHarvest from '@/assets/media/preparation-tomato-harvest.jpeg';
import kalePlants from '@/assets/media/products-kale-plants.jpeg';
import lettuceRow from '@/assets/media/products-lettuce-row.jpeg';
import marketDisplay from '@/assets/media/bionatura-market-stall-display.jpeg';
import type { Locale } from '@/i18n/config';

export type MediaGroup = 'garden' | 'products' | 'preparation' | 'bionatura' | 'daily';
type LocalizedText = Record<Locale, string>;

export interface MediaItem {
  id: string;
  type: 'image';
  group: MediaGroup;
  asset: ImageMetadata;
  alt: LocalizedText;
  caption: LocalizedText;
  width: number;
  height: number;
  demoOnly: false;
}

const text = (es: string, en: string, fi: string, da: string): LocalizedText => ({ es, en, fi, da });

const image = (
  id: string,
  group: MediaGroup,
  asset: ImageMetadata,
  alt: LocalizedText,
  caption: LocalizedText,
): MediaItem => ({ id, type: 'image', group, asset, alt, caption, width: asset.width, height: asset.height, demoOnly: false });

export const mediaItems: MediaItem[] = [
  image('mixed-leaf-rows', 'garden', mixedLeafRows,
    text('Surcos de hojas verdes y acelgas junto a un pequeño invernadero.', 'Rows of leafy greens and chard beside a small polytunnel.', 'Lehtivihannes- ja lehtimangoldirivejä pienen kasvihuoneen vieressä.', 'Rækker med bladgrønt og bladbede ved siden af et lille drivhus.'),
    text('Cultivos de hoja vistos entre los surcos.', 'Leaf crops seen between the rows.', 'Lehtikasveja penkkien välissä.', 'Bladafgrøder set mellem rækkerne.')),
  image('beet-chard-after-rain', 'garden', beetChard,
    text('Hojas de acelga con tallos rojos y gotas de lluvia en el huerto.', 'Chard leaves with red stems and raindrops in the garden.', 'Punavartisia lehtimangoldeja sadepisaroineen kasvimaalla.', 'Bladbeder med røde stængler og regndråber i køkkenhaven.'),
    text('Detalle de hojas después de la lluvia.', 'Leaf detail after the rain.', 'Lehtien yksityiskohta sateen jälkeen.', 'Bladdetalje efter regnen.')),
  image('lettuce-fennel-rows', 'garden', lettuceFennel,
    text('Filas de lechugas y plantas de hinojo con edificios al fondo.', 'Rows of lettuce and fennel plants with buildings in the background.', 'Salaatti- ja fenkolirivejä, taustalla rakennuksia.', 'Rækker med salat og fennikel med bygninger i baggrunden.'),
    text('Una vista amplia de las líneas de cultivo.', 'A broad view across the growing rows.', 'Laaja näkymä viljelyriveille.', 'Et bredt kig over dyrkningsrækkerne.')),
  image('seedling-beds', 'garden', seedlingBeds,
    text('Bancales recién preparados con plantas jóvenes junto a un invernadero.', 'Freshly prepared beds with young plants beside a polytunnel.', 'Vastavalmisteltuja penkkejä ja nuoria taimia kasvihuoneen vieressä.', 'Nyklargjorte bede med unge planter ved siden af et drivhus.'),
    text('Bancales y riego en una fase temprana de cultivo.', 'Beds and irrigation at an early growing stage.', 'Penkkejä ja kastelua kasvun alkuvaiheessa.', 'Bede og vanding i en tidlig dyrkningsfase.')),
  image('lettuce-row', 'products', lettuceRow,
    text('Primer plano de una fila de lechugas verdes con gotas de agua.', 'Close view of a row of green lettuces with water droplets.', 'Lähikuva vihreästä salaattirivistä vesipisaroineen.', 'Nærbillede af en række grønne salathoveder med vanddråber.'),
    text('Lechugas creciendo en línea.', 'Lettuces growing in a row.', 'Rivissä kasvavia salaatteja.', 'Salathoveder, der vokser på række.')),
  image('kale-plants', 'products', kalePlants,
    text('Plantas de col rizada creciendo entre líneas de riego.', 'Kale plants growing between irrigation lines.', 'Lehtikaalia kasvamassa kasteluletkujen välissä.', 'Grønkålsplanter mellem vandingsslanger.'),
    text('Hojas de col rizada en el terreno.', 'Kale leaves in the soil.', 'Lehtikaalin lehtiä maassa.', 'Grønkålsblade i jorden.')),
  image('tomato-harvest', 'preparation', tomatoHarvest,
    text('Una persona muestra tomates junto a una carretilla llena de la cosecha.', 'A person holds up tomatoes beside a wheelbarrow full of the harvest.', 'Henkilö esittelee tomaatteja sadolla täytetyn kottikärryn vieressä.', 'En person viser tomater ved siden af en trillebør fyldt med høsten.'),
    text('Una cosecha de tomates fotografiada al terminar el trabajo.', 'A tomato harvest photographed after the work.', 'Tomaattisato kuvattuna työn jälkeen.', 'En tomathøst fotograferet efter arbejdet.')),
  image('grower-greenhouse', 'bionatura', growerGreenhouse,
    text('Una persona de pie entre hileras jóvenes delante de un invernadero.', 'A person standing among young rows in front of a polytunnel.', 'Henkilö seisoo nuorten taimien riveissä kasvihuoneen edessä.', 'En person står mellem unge planterækker foran et drivhus.'),
    text('El trabajo entre bancales e invernadero.', 'Work between the beds and the polytunnel.', 'Työtä penkkien ja kasvihuoneen välissä.', 'Arbejdet mellem bedene og drivhuset.')),
  image('market-stall-team', 'bionatura', marketStallTeam,
    text('Dos personas sonríen tras una mesa con alimentos, conservas y casitas de madera.', 'Two people smile behind a table with food, preserves and wooden birdhouses.', 'Kaksi henkilöä hymyilee ruokia, säilykkeitä ja puisia linnunpönttöjä sisältävän pöydän takana.', 'To personer smiler bag et bord med fødevarer, konserves og fuglehuse i træ.'),
    text('Bionatura en una muestra de productos.', 'Bionatura at a product display.', 'Bionatura tuotteiden esittelyssä.', 'Bionatura ved en produktfremvisning.')),
  image('market-stall-display', 'daily', marketDisplay,
    text('Mesa de exposición con fruta, verdura, tarros, botellas y casitas de madera.', 'Display table with fruit, vegetables, jars, bottles and wooden birdhouses.', 'Esittelypöytä, jolla on hedelmiä, vihanneksia, purkkeja, pulloja ja puisia linnunpönttöjä.', 'Udstillingsbord med frugt, grønt, glas, flasker og fuglehuse i træ.'),
    text('Una selección reunida para mostrarla.', 'A selection gathered for display.', 'Valikoima koottuna esille.', 'Et udvalg samlet til fremvisning.')),
  image('wooden-birdhouses', 'daily', woodenBirdhouses,
    text('Varias casitas de madera de diferentes formas expuestas en estanterías.', 'Several wooden birdhouses in different shapes displayed on shelves.', 'Useita erimuotoisia puisia linnunpönttöjä hyllyillä.', 'Flere fuglehuse i træ i forskellige former udstillet på hylder.'),
    text('Casitas de madera vistas en el espacio de trabajo.', 'Wooden birdhouses seen in the work area.', 'Puisia linnunpönttöjä työtilassa.', 'Fuglehuse i træ set i arbejdsområdet.')),
];

export const mediaGroups: MediaGroup[] = ['garden', 'products', 'preparation', 'bionatura', 'daily'];
export const mediaForGroup = (group: MediaGroup) => mediaItems.filter((item) => item.group === group);

export const mediaGroupCopy: Record<Locale, Record<MediaGroup, { title: string; intro: string }>> = {
  es: {
    garden: { title: 'El huerto', intro: 'Bancales, lluvia, riego y distintas fases del cultivo.' },
    products: { title: 'Entre las hojas', intro: 'Primeros planos de algunas plantas visibles en las fotografías.' },
    preparation: { title: 'La cosecha', intro: 'Momentos en los que el trabajo y el producto se encuentran.' },
    bionatura: { title: 'Personas y proyecto', intro: 'Imágenes de las personas y de una muestra de productos de Bionatura.' },
    daily: { title: 'El día a día', intro: 'Objetos y escenas que también forman parte de estas imágenes.' },
  },
  en: {
    garden: { title: 'The garden', intro: 'Beds, rain, irrigation and different stages of growth.' },
    products: { title: 'Among the leaves', intro: 'Close views of some of the plants visible in the photographs.' },
    preparation: { title: 'The harvest', intro: 'Moments where the work and the produce meet.' },
    bionatura: { title: 'People and project', intro: 'Images of the people and a Bionatura product display.' },
    daily: { title: 'Daily life', intro: 'Objects and scenes that are also part of these photographs.' },
  },
  fi: {
    garden: { title: 'Kasvimaa', intro: 'Penkkejä, sadetta, kastelua ja kasvun eri vaiheita.' },
    products: { title: 'Lehtien keskellä', intro: 'Lähikuvia valokuvissa näkyvistä kasveista.' },
    preparation: { title: 'Sato', intro: 'Hetkiä, joissa työ ja sato kohtaavat.' },
    bionatura: { title: 'Ihmiset ja projekti', intro: 'Kuvia ihmisistä ja Bionaturan tuote-esittelystä.' },
    daily: { title: 'Arki', intro: 'Esineitä ja kohtauksia, jotka kuuluvat myös näihin kuviin.' },
  },
  da: {
    garden: { title: 'Køkkenhaven', intro: 'Bede, regn, vanding og forskellige vækstfaser.' },
    products: { title: 'Mellem bladene', intro: 'Nærbilleder af nogle af planterne på fotografierne.' },
    preparation: { title: 'Høsten', intro: 'Øjeblikke, hvor arbejdet og afgrøderne mødes.' },
    bionatura: { title: 'Mennesker og projekt', intro: 'Billeder af menneskerne og en fremvisning af Bionaturas produkter.' },
    daily: { title: 'Hverdagen', intro: 'Genstande og scener, der også er en del af disse fotografier.' },
  },
};
