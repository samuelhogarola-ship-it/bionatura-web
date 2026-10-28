import type { Locale } from '../i18n/config';
import type { Product, QuantityOption, Season } from '../domain/catalog';
import { assertValidCatalog } from '../domain/catalog';

type Copy = Record<Locale, string>;
const copy = (es: string, en: string, fi: string, da: string): Copy => ({ es, en, fi, da });

const makeProduct = (
  id: string, slug: Copy, name: Copy, description: Copy, imageAlt: Copy, categoryId: string,
  seasonList: Season[], alwaysAvailable: boolean, quantityOptions: QuantityOption[], featured = false, recommended = false,
): Product => ({
  id, slug, name, shortDescription: description, categoryId, seasons: seasonList, alwaysAvailable,
  quantityOptions, allowCustomQuantity: true, imageId: `product-${id}`, imageAlt,
  featured, recommended, demoOnly: false,
});

const bottle: QuantityOption = {
  id: 'bottle', value: 1, unit: 'unit',
  labels: { es: '1 botella', en: '1 bottle', fi: '1 pullo', da: '1 flaske' },
};

type CatalogRow = readonly [id: string, es: string, en: string, fi: string, da: string];

const consultationQuantity: QuantityOption = {
  id: 'consult', value: 'consult', unit: 'custom',
  labels: { es: 'Cantidad a consultar', en: 'Quantity on request', fi: 'Määrä kysyttäessä', da: 'Mængde efter forespørgsel' },
};

const makeConsultProduct = ([id, es, en, fi, da]: CatalogRow, categoryId: 'vegetables' | 'fruit'): Product => ({
  id,
  slug: copy(id, id, id, id),
  name: copy(es, en, fi, da),
  shortDescription: copy(
    'Producto bio o de cultivo responsable. Disponibilidad y precio a consultar.',
    'Organic or responsibly grown produce. Availability and price on request.',
    'Luomu- tai vastuullisesti kasvatettu tuote. Saatavuus ja hinta kysyttäessä.',
    'Økologisk eller ansvarligt dyrket vare. Tilgængelighed og pris oplyses ved forespørgsel.',
  ),
  categoryId,
  seasons: [],
  alwaysAvailable: false,
  availability: 'consult',
  quantityOptions: [consultationQuantity],
  allowCustomQuantity: true,
  imageId: 'catalog-list',
  imageAlt: copy(es, en, fi, da),
  featured: false,
  recommended: false,
  demoOnly: false,
});

const vegetableRows: CatalogRow[] = [
  ['garlic', 'Ajo', 'Garlic', 'Valkosipuli', 'Hvidløg'],
  ['chard', 'Acelga', 'Chard', 'Lehtimangoldi', 'Sølvbede'],
  ['avocado', 'Aguacate', 'Avocado', 'Avokado', 'Avocado'],
  ['basil', 'Albahaca', 'Basil', 'Basilika', 'Basilikum'],
  ['artichoke', 'Alcachofa', 'Artichoke', 'Artisokka', 'Artiskok'],
  ['asparagus', 'Espárragos', 'Asparagus', 'Parsa', 'Asparges'],
  ['aubergine', 'Berenjenas', 'Aubergines', 'Munakoisot', 'Auberginer'],
  ['celery-bag', 'Apio en bolsa', 'Bagged celery', 'Selleri pussissa', 'Selleri i pose'],
  ['celery-kilo', 'Apio por kilo', 'Celery by the kilo', 'Selleri kiloittain', 'Selleri pr. kilo'],
  ['sweet-potato', 'Boniato', 'Sweet potato', 'Bataatti', 'Sød kartoffel'],
  ['celeriac', 'Apio bulbo', 'Celeriac', 'Mukulaselleri', 'Knoldselleri'],
  ['broccoli-unit', 'Brócoli por unidad', 'Broccoli by the unit', 'Parsakaali kappaleittain', 'Broccoli pr. stk.'],
  ['broccoli-kilo', 'Brócoli por kilo', 'Broccoli by the kilo', 'Parsakaali kiloittain', 'Broccoli pr. kilo'],
  ['sweetcorn', 'Mazorcas dulces', 'Sweetcorn cobs', 'Maissintähkät', 'Majskolber'],
  ['butternut-squash', 'Calabaza cacahuete', 'Butternut squash', 'Myskikurpitsa', 'Butternutgræskar'],
  ['white-onion', 'Cebolla blanca', 'White onion', 'Valkoinen sipuli', 'Hvidt løg'],
  ['spring-onion-bunch', 'Cebolleta en manojo', 'Bunched spring onions', 'Kevätsipulinippu', 'Forårsløg i bundt'],
  ['spring-onion-kilo', 'Cebolleta por kilo', 'Spring onions by the kilo', 'Kevätsipuli kiloittain', 'Forårsløg pr. kilo'],
  ['coriander', 'Cilantro', 'Coriander', 'Korianteri', 'Koriander'],
  ['oyster-mushroom', 'Seta ostra', 'Oyster mushroom', 'Osterivinokas', 'Østershat'],
  ['curly-kale', 'Col rizada', 'Curly kale', 'Lehtikaali', 'Grønkål'],
  ['red-cabbage-kilo', 'Col roja por kilo', 'Red cabbage by the kilo', 'Punakaali kiloittain', 'Rødkål pr. kilo'],
  ['chinese-cabbage', 'Col china', 'Chinese cabbage', 'Kiinankaali', 'Kinakål'],
  ['cauliflower', 'Coliflor por pieza', 'Cauliflower by the unit', 'Kukkakaali kappaleittain', 'Blomkål pr. stk.'],
  ['kale-bunch', 'Kale en manojo', 'Bunched kale', 'Lehtikaalinippu', 'Grønkål i bundt'],
  ['spinach', 'Espinacas', 'Spinach', 'Pinaatti', 'Spinat'],
  ['kohlrabi', 'Colrabi', 'Kohlrabi', 'Kyssäkaali', 'Knudekål'],
  ['peas', 'Guisantes', 'Peas', 'Herneet', 'Ærter'],
  ['broad-beans', 'Habas', 'Broad beans', 'Härkäpavut', 'Hestebønner'],
  ['fennel', 'Hinojo', 'Fennel', 'Fenkoli', 'Fennikel'],
  ['ginger', 'Jengibre', 'Ginger', 'Inkivääri', 'Ingefær'],
  ['green-beans-bunch', 'Judías en manojo', 'Bunched green beans', 'Vihreä papunippu', 'Grønne bønner i bundt'],
  ['flat-beans', 'Judías planas', 'Flat beans', 'Litteät pavut', 'Flade bønner'],
  ['round-beans', 'Judías redondas', 'Round beans', 'Pyöreät pavut', 'Runde bønner'],
  ['lettuce', 'Lechuga', 'Lettuce', 'Salaatti', 'Salat'],
  ['bagged-lettuce', 'Lechuga en bolsa', 'Bagged lettuce', 'Salaatti pussissa', 'Salat i pose'],
  ['mushroom', 'Champiñón', 'Mushroom', 'Herkkusieni', 'Champignon'],
  ['turnip-bunch', 'Nabo en manojo', 'Bunched turnips', 'Naurisnippu', 'Majroer i bundt'],
  ['iceberg-lettuce', 'Lechuga iceberg', 'Iceberg lettuce', 'Jäävuorisalaatti', 'Icebergsalat'],
  ['white-potato', 'Patata blanca', 'White potato', 'Vaalea peruna', 'Hvid kartoffel'],
  ['red-potato', 'Patata roja', 'Red potato', 'Punainen peruna', 'Rød kartoffel'],
  ['endive', 'Endivia', 'Endive', 'Endiivi', 'Endivie'],
  ['spanish-cucumber', 'Pepino español', 'Spanish cucumber', 'Espanjalainen kurkku', 'Spansk agurk'],
  ['dutch-cucumber', 'Pepino holandés', 'Dutch cucumber', 'Hollantilainen kurkku', 'Hollandsk agurk'],
  ['parsley', 'Perejil', 'Parsley', 'Persilja', 'Persille'],
  ['leeks', 'Puerros', 'Leeks', 'Purjo', 'Porrer'],
  ['ramiro-red-pepper', 'Pimiento Ramiro rojo', 'Red Ramiro pepper', 'Punainen Ramiro-paprika', 'Rød Ramiro-peberfrugt'],
  ['frying-pepper', 'Pimiento de freír', 'Frying pepper', 'Paistopaprika', 'Stegepeber'],
  ['red-california-pepper', 'Pimiento California rojo', 'Red California pepper', 'Punainen California-paprika', 'Rød California-peberfrugt'],
  ['green-california-pepper', 'Pimiento California verde', 'Green California pepper', 'Vihreä California-paprika', 'Grøn California-peberfrugt'],
  ['rocket', 'Rúcula', 'Rocket', 'Rucola', 'Rucola'],
  ['beetroot-bunch', 'Remolacha en manojo', 'Bunched beetroot', 'Punajuurinippu', 'Rødbeder i bundt'],
  ['beetroot-kilo', 'Remolacha por kilo', 'Beetroot by the kilo', 'Punajuuri kiloittain', 'Rødbeder pr. kilo'],
  ['cooked-beetroot', 'Remolacha cocida', 'Cooked beetroot', 'Keitetty punajuuri', 'Kogte rødbeder'],
  ['romanesco', 'Romanesco', 'Romanesco', 'Romanesco-kaali', 'Romanesco-kål'],
  ['carrot-bunch', 'Zanahoria en manojo', 'Bunched carrots', 'Porkkananippu', 'Gulerødder i bundt'],
  ['carrots-kilo', 'Zanahorias por kilo', 'Carrots by the kilo', 'Porkkanat kiloittain', 'Gulerødder pr. kilo'],
  ['cherry-tomato', 'Tomate cherry', 'Cherry tomatoes', 'Kirsikkatomaatit', 'Cherrytomater'],
  ['radish', 'Rabanito', 'Radish', 'Retiisi', 'Radise'],
];

const fruitRows: CatalogRow[] = [
  ['apricot', 'Albaricoque', 'Apricot', 'Aprikoosi', 'Abrikos'],
  ['blueberry', 'Arándano', 'Blueberry', 'Mustikka', 'Blåbær'],
  ['persimmon', 'Caqui', 'Persimmon', 'Kaki', 'Kakifrugt'],
  ['cherry', 'Cereza', 'Cherry', 'Kirsikka', 'Kirsebær'],
  ['plum', 'Ciruela', 'Plum', 'Luumu', 'Blomme'],
  ['black-greengage', 'Ciruela Claudia negra', 'Black greengage', 'Musta reineclaude-luumu', 'Sort reine claude-blomme'],
  ['custard-apple', 'Chirimoya', 'Custard apple', 'Cherimoya', 'Cherimoya'],
  ['medjool-dates', 'Dátiles Salomón', 'Solomon dates', 'Salomon-taatelit', 'Salomon-dadler'],
  ['aloe-plant', 'Aloe planta por kilo', 'Aloe plant by the kilo', 'Aloe-kasvi kiloittain', 'Aloeplante pr. kilo'],
  ['raspberry', 'Frambuesa', 'Raspberry', 'Vadelma', 'Hindbær'],
  ['strawberry-box', 'Fresa en caja', 'Boxed strawberries', 'Mansikat rasiassa', 'Jordbær i bakke'],
  ['loose-strawberry', 'Fresa suelta', 'Loose strawberries', 'Irtomansikat', 'Løse jordbær'],
  ['fresh-figs', 'Higos frescos', 'Fresh figs', 'Tuoreet viikunat', 'Friske figner'],
  ['dried-figs', 'Higos secos', 'Dried figs', 'Kuivatut viikunat', 'Tørrede figner'],
  ['kiwi', 'Kiwi', 'Kiwi', 'Kiivi', 'Kiwi'],
  ['lime', 'Lima', 'Lime', 'Limetti', 'Limefrugt'],
  ['lemon', 'Limón', 'Lemon', 'Sitruuna', 'Citron'],
  ['pomegranate', 'Granada', 'Pomegranate', 'Granaattiomena', 'Granatæble'],
  ['fresh-turmeric', 'Cúrcuma fresca', 'Fresh turmeric', 'Tuore kurkuma', 'Frisk gurkemeje'],
  ['mandarin', 'Mandarina', 'Mandarin', 'Mandariini', 'Mandarinfrugt'],
  ['lychee', 'Litchi', 'Lychee', 'Litsi', 'Litchifrugt'],
  ['red-apples', 'Manzanas rojas', 'Red apples', 'Punaiset omenat', 'Røde æbler'],
  ['golden-apples', 'Manzanas Golden', 'Golden apples', 'Golden-omenat', 'Golden-æbler'],
  ['evelina-apples', 'Manzana Evelina', 'Evelina apple', 'Evelina-omena', 'Evelina-æble'],
  ['julieta-apples', 'Manzana Julieta', 'Julieta apple', 'Julieta-omena', 'Julieta-æble'],
  ['mango', 'Mango', 'Mango', 'Mangohedelmä', 'Mangofrugt'],
  ['peach', 'Melocotón', 'Peach', 'Persikka', 'Fersken'],
  ['yellow-melon', 'Melón amarillo', 'Yellow melon', 'Keltainen meloni', 'Gul melon'],
  ['galia-melon', 'Melón Galia', 'Galia melon', 'Galia-meloni', 'Galia-melon'],
  ['piel-de-sapo-melon', 'Melón piel de sapo', 'Piel de sapo melon', 'Piel de sapo -meloni', 'Piel de sapo-melon'],
  ['cantaloupe-melon', 'Melón cantalupo', 'Cantaloupe melon', 'Cantaloupe-meloni', 'Cantaloupe-melon'],
  ['orange-juice', 'Naranja de zumo', 'Juicing oranges', 'Mehuappelsiinit', 'Juiceappelsiner'],
  ['blackberry', 'Moras', 'Blackberries', 'Karhunvatukat', 'Brombær'],
  ['nectarine', 'Nectarina', 'Nectarine', 'Nektariini', 'Nektarin'],
  ['loose-walnuts', 'Nueces sueltas', 'Loose walnuts', 'Irtosaksanpähkinät', 'Løse valnødder'],
  ['pecans', 'Nueces pecanas', 'Pecans', 'Pekaanipähkinät', 'Pekannødder'],
  ['pear', 'Pera', 'Pear', 'Päärynä', 'Pære'],
  ['loquat', 'Níspero', 'Loquat', 'Mispeli', 'Mispelfrugt'],
  ['pineapple', 'Piña por kilo', 'Pineapple by the kilo', 'Ananas kiloittain', 'Ananas pr. kilo'],
  ['papaya', 'Papaya', 'Papaya', 'Papaija', 'Papajafrugt'],
  ['flat-peach', 'Paraguaya', 'Flat peach', 'Litteä persikka', 'Flad fersken'],
  ['banana', 'Plátano', 'Banana', 'Banaani', 'Banan'],
  ['grapefruit', 'Pomelo', 'Grapefruit', 'Greippi', 'Grapefrugt'],
  ['watermelon', 'Sandía', 'Watermelon', 'Vesimeloni', 'Vandmelon'],
  ['black-red-grapes', 'Uvas negras o rojas', 'Black or red grapes', 'Mustat tai punaiset viinirypäleet', 'Sorte eller røde vindruer'],
  ['white-grapes', 'Uvas blancas', 'White grapes', 'Vaaleat viinirypäleet', 'Grønne vindruer'],
  ['gold-kiwi', 'Kiwi gold', 'Gold kiwi', 'Kultakiivi', 'Guldkiwi'],
  ['coconut', 'Coco', 'Coconut', 'Kookospähkinä', 'Kokosnød'],
  ['passion-fruit', 'Maracuyá', 'Passion fruit', 'Passionhedelmä', 'Passionsfrugt'],
];

export const products: Product[] = [
  makeProduct('tomato', copy('tomate', 'tomato', 'tomaatti', 'tomat'), copy('Tomates', 'Tomatoes', 'Tomaatit', 'Tomater'), copy('Tomates de temporada, recogidos cuando alcanzan su mejor punto.', 'Seasonal tomatoes, harvested at their best.', 'Sesongin tomaatteja, poimittu parhaimmillaan.', 'Sæsontomater, høstet når de er bedst.'), copy('Tomates recién recogidos con el huerto de Bionatura al fondo.', 'Freshly harvested tomatoes with the Bionatura garden behind.', 'Vastapoimittuja tomaatteja Bionaturan puutarhassa.', 'Friskplukkede tomater med Bionaturas have i baggrunden.'), 'vegetables', ['summer'], false, [{ id: '1kg', value: 1, unit: 'kg' }, { id: '2kg', value: 2, unit: 'kg' }], true),
  makeProduct('potato', copy('patata', 'potato', 'peruna', 'kartoffel'), copy('Patatas', 'Potatoes', 'Perunat', 'Kartofler'), copy('Patatas de cultivo local, firmes y con todo su sabor.', 'Locally grown potatoes, firm and full of flavour.', 'Paikallisesti kasvatettuja, kiinteitä ja maukkaita perunoita.', 'Lokalt dyrkede kartofler, faste og smagfulde.'), copy('Patatas recién cosechadas en el huerto de Bionatura.', 'Freshly harvested potatoes in the Bionatura garden.', 'Vastanostettuja perunoita Bionaturan puutarhassa.', 'Nyhøstede kartofler i Bionaturas have.'), 'vegetables', ['spring', 'autumn'], false, [{ id: '1kg', value: 1, unit: 'kg' }]),
  makeProduct('pepper', copy('pimiento', 'pepper', 'paprika', 'peberfrugt'), copy('Pimientos', 'Peppers', 'Paprikat', 'Peberfrugter'), copy('Pimientos frescos, crujientes y llenos de color.', 'Fresh, crisp peppers full of colour.', 'Tuoreita ja rapeita paprikoita.', 'Friske, sprøde peberfrugter fulde af farve.'), copy('Pimientos rojos y verdes delante del huerto de Bionatura.', 'Red and green peppers in front of the Bionatura garden.', 'Punaisia ja vihreitä paprikoita Bionaturan puutarhassa.', 'Røde og grønne peberfrugter foran Bionaturas have.'), 'vegetables', ['summer', 'autumn'], false, [{ id: '500g', value: 500, unit: 'g' }]),
  makeProduct('courgette', copy('calabacín', 'courgette', 'kesäkurpitsa', 'squash'), copy('Calabacines', 'Courgettes', 'Kesäkurpitsat', 'Squash'), copy('Calabacines tiernos de cosecha cercana.', 'Tender courgettes from the local harvest.', 'Mureita kesäkurpitsoja lähisadosta.', 'Møre squash fra den lokale høst.'), copy('Calabacines frescos en el huerto de Bionatura.', 'Fresh courgettes in the Bionatura garden.', 'Tuoreita kesäkurpitsoja Bionaturan puutarhassa.', 'Friske squash i Bionaturas have.'), 'vegetables', ['summer'], false, [{ id: '1kg', value: 1, unit: 'kg' }]),
  makeProduct('orange', copy('naranja', 'orange', 'appelsiini', 'appelsin'), copy('Naranjas', 'Oranges', 'Appelsiinit', 'Appelsiner'), copy('Naranjas aromáticas de temporada, seleccionadas a mano.', 'Fragrant seasonal oranges, selected by hand.', 'Tuoksuvia sesonkiappelsiineja käsin valittuina.', 'Duftende sæsonappelsiner, udvalgt i hånden.'), copy('Naranjas con hojas en el huerto de Bionatura.', 'Oranges with leaves in the Bionatura garden.', 'Appelsiineja lehtineen Bionaturan puutarhassa.', 'Appelsiner med blade i Bionaturas have.'), 'fruit', ['winter', 'spring'], false, [{ id: '1kg', value: 1, unit: 'kg' }]),
  makeProduct('strawberry', copy('fresa', 'strawberry', 'mansikka', 'jordbær'), copy('Fresas', 'Strawberries', 'Mansikat', 'Jordbær'), copy('Fresas maduras, dulces y delicadas.', 'Ripe, sweet and delicate strawberries.', 'Kypsiä, makeita ja herkkiä mansikoita.', 'Modne, søde og delikate jordbær.'), copy('Fresas recién recogidas en el huerto de Bionatura.', 'Freshly picked strawberries in the Bionatura garden.', 'Vastapoimittuja mansikoita Bionaturan puutarhassa.', 'Friskplukkede jordbær i Bionaturas have.'), 'fruit', ['spring', 'summer'], false, [{ id: '250g', value: 250, unit: 'g' }]),
  makeProduct('onion', copy('cebolla', 'onion', 'sipuli', 'løg'), copy('Cebollas', 'Onions', 'Sipulit', 'Løg'), copy('Cebollas de guarda, aromáticas y versátiles.', 'Aromatic, versatile storage onions.', 'Aromaattisia ja monikäyttöisiä sipuleita.', 'Aromatiske og alsidige løg.'), copy('Cebollas doradas cosechadas en Bionatura.', 'Golden onions harvested at Bionatura.', 'Bionaturassa korjattuja keltasipuleita.', 'Gule løg høstet hos Bionatura.'), 'vegetables', ['autumn', 'winter'], false, [{ id: '1kg', value: 1, unit: 'kg' }]),
  makeProduct('red-onion', copy('cebolla-roja', 'red-onion', 'punasipuli', 'roedloeg'), copy('Cebolla roja', 'Red onions', 'Punasipulit', 'Rødløg'), copy('Cebolla roja de sabor suave, ideal para ensaladas y cocina diaria.', 'Mild red onions, ideal for salads and everyday cooking.', 'Mietoja punasipuleita salaatteihin ja arkiruokiin.', 'Milde rødløg til salater og hverdagsmad.'), copy('Cebollas rojas recién cosechadas en el huerto de Bionatura.', 'Freshly harvested red onions in the Bionatura garden.', 'Vastanostettuja punasipuleita Bionaturan puutarhassa.', 'Nyhøstede rødløg i Bionaturas have.'), 'vegetables', ['autumn', 'winter'], false, [{ id: '1kg', value: 1, unit: 'kg' }]),
  makeProduct('egg', copy('huevo', 'egg', 'muna', 'aeg'), copy('Huevos caseros', 'Farm eggs', 'Tilamunat', 'Gårdæg'), copy('Huevos caseros frescos, disponibles por media docena o una docena.', 'Fresh farm eggs, available by half-dozen or dozen.', 'Tuoreita tilamunia kuuden tai kahdentoista munan erissä.', 'Friske gårdæg i halve eller hele dusin.'), copy('Huevos caseros sueltos, sin caja, en el huerto de Bionatura.', 'Loose farm eggs without a carton in the Bionatura garden.', 'Irrallisia tilamunia ilman kennoa Bionaturan puutarhassa.', 'Løse gårdæg uden bakke i Bionaturas have.'), 'eggs', [], true, [
    { id: 'half-dozen', value: 0.5, unit: 'dozen', labels: { es: 'Media docena', en: 'Half a dozen', fi: 'Puoli tusinaa', da: 'Et halvt dusin' } },
    { id: 'dozen', value: 1, unit: 'dozen', labels: { es: 'Una docena', en: 'One dozen', fi: 'Yksi tusina', da: 'Et dusin' } },
  ]),
  makeProduct('kombucha', copy('kombucha-bio', 'organic-kombucha', 'luomu-kombucha', 'oekologisk-kombucha'), copy('Kombucha bio', 'Organic kombucha', 'Luomukombucha', 'Økologisk kombucha'), copy('Kombucha bio refrescante y naturalmente fermentada.', 'Refreshing, naturally fermented organic kombucha.', 'Raikas, luonnollisesti fermentoitu luomukombucha.', 'Forfriskende, naturligt fermenteret økologisk kombucha.'), copy('Botella sin marca de kombucha bio en el huerto de Bionatura.', 'Unbranded bottle of organic kombucha in the Bionatura garden.', 'Etiketitön luomukombuchapullo Bionaturan puutarhassa.', 'Flaske uden mærke med økologisk kombucha i Bionaturas have.'), 'drinks', [], true, [bottle]),
  makeProduct('olive-oil', copy('aceite-oliva-bio', 'organic-olive-oil', 'luomu-oliivioljy', 'oekologisk-olivenolie'), copy('Aceite de oliva bio', 'Organic olive oil', 'Luomuoliiviöljy', 'Økologisk olivenolie'), copy('Aceite de oliva virgen extra bio para la cocina diaria.', 'Organic extra virgin olive oil for everyday cooking.', 'Luomu-ekstraneitsytoliiviöljyä arkiruokaan.', 'Økologisk ekstra jomfruolivenolie til hverdagsmad.'), copy('Botella sin marca de aceite de oliva bio en el huerto de Bionatura.', 'Unbranded bottle of organic olive oil in the Bionatura garden.', 'Etiketitön luomuoliiviöljypullo Bionaturan puutarhassa.', 'Flaske uden mærke med økologisk olivenolie i Bionaturas have.'), 'pantry', [], true, [bottle]),
  makeProduct('birdhouse', copy('casa-pajaros', 'birdhouse', 'linnunpontto', 'fuglehus'), copy('Casas para pájaros', 'Birdhouses', 'Linnunpöntöt', 'Fuglehuse'), copy('Casas de madera hechas a mano para dar refugio a las aves del jardín.', 'Handmade wooden houses that shelter garden birds.', 'Käsintehtyjä puumökkejä puutarhan linnuille.', 'Håndlavede træhuse, der giver havens fugle ly.'), copy('Casas de madera para pájaros hechas a mano.', 'Handmade wooden birdhouses.', 'Käsintehtyjä puisia linnunpönttöjä.', 'Håndlavede fuglehuse i træ.'), 'garden', [], false, [{ id: 'unit', value: 1, unit: 'unit' }], false, true),
  ...vegetableRows.map((row) => makeConsultProduct(row, 'vegetables')),
  ...fruitRows.map((row) => makeConsultProduct(row, 'fruit')),
];

export const seasonalProducts = (season: Season): Product[] => products.filter((product) => !product.alwaysAvailable && product.seasons.includes(season));
export const alwaysAvailableProducts = (): Product[] => products.filter((product) => product.alwaysAvailable);
export const recommendedProducts = (): Product[] => products.filter((product) => product.recommended);
export const consultProducts = (): Product[] => products.filter((product) => product.availability === 'consult');

assertValidCatalog(products);
