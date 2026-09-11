import mixedLeafRows from '@/assets/media/garden-mixed-leaf-rows.jpeg';
import tomatoHarvest from '@/assets/media/preparation-tomato-harvest-enhanced.png';
import marketStallDisplay from '@/assets/media/bionatura-market-stall-display.jpeg';
import growerGreenhouse from '@/assets/media/bionatura-grower-greenhouse.jpeg';
import tomatoImage from '@/assets/products/product-tomatoes.png';
import courgetteImage from '@/assets/products/product-courgettes.png';
import { assertValidEditorial, type EditorialItem, type Localized } from '../domain/editorial';
import { DEFAULT_LOCALE, type Locale } from '../i18n/config';
import { products } from './products';

const copy = (es: string, en: string, fi: string, da: string): Localized<string> => ({ es, en, fi, da });
const list = (es: string[], en: string[], fi: string[], da: string[]): Localized<string[]> => ({ es, en, fi, da });

const editorialRouteSegments: Localized<string> = {
  es: 'huerto-recetas',
  en: 'garden-recipes',
  fi: 'puutarha-reseptit',
  da: 'have-opskrifter',
};

export const editorialIds = [
  'seasonal-produce-fuengirola',
  'choose-garden-tomatoes',
  'tomato-red-onion-salad',
  'simple-mediterranean-courgettes',
  'organic-and-local-produce',
  'los-pacos-garden-to-basket',
] as const;

export const editorialItems: EditorialItem[] = [
  {
    id: 'seasonal-produce-fuengirola', type: 'article', publishedAt: '2026-09-11', image: mixedLeafRows,
    locales: {
      es: {
        slug: 'productos-temporada-fuengirola', title: 'Qué productos están de temporada en Fuengirola',
        description: 'Una guía práctica para descubrir productos de temporada en Fuengirola y confirmar la disponibilidad antes de la recogida.',
        intro: 'La temporada cambia con el clima y el ritmo del huerto. En Bionatura confirmamos qué hay disponible antes de preparar tu lista.',
        imageAlt: 'Surcos de hojas verdes y acelgas junto a un pequeño invernadero en el huerto de Bionatura.', ctaLabel: 'Ver productos de temporada',
        sections: [
          { heading: 'La temporada se consulta antes de recoger', paragraphs: ['Tomates, calabacines, cítricos y hojas verdes siguen ritmos distintos. Por eso la lista del catálogo es una buena orientación, pero la disponibilidad real se confirma antes de la recogida.', 'Si buscas productos de temporada en Fuengirola, prepara una lista breve y consulta qué productos pueden estar listos en ese momento.'] },
          { heading: 'Ideas para una compra flexible', paragraphs: ['Elige una base de verduras, añade fruta cuando esté disponible y deja espacio para cambiar un ingrediente si la cosecha varía.', 'Una consulta por WhatsApp ayuda a ajustar la lista sin dar por hecho existencias, precios o fechas que no estén confirmados.'] },
        ],
      },
      en: {
        slug: 'what-produce-is-in-season-fuengirola', title: 'What produce is in season in Fuengirola',
        description: 'A practical guide to seasonal produce in Fuengirola and confirming availability before collection.',
        intro: 'The season changes with the weather and the pace of the garden. At Bionatura, we confirm what is available before you prepare your list.',
        imageAlt: 'Rows of leafy greens and chard beside a small polytunnel in the Bionatura garden.', ctaLabel: 'See seasonal produce',
        sections: [
          { heading: 'Check the season before collection', paragraphs: ['Tomatoes, courgettes, citrus fruit and leafy greens each follow a different rhythm. The catalogue is a useful guide, while actual availability is confirmed before collection.', 'If you are looking for seasonal produce in Fuengirola, make a short list and ask which products may be ready at that time.'] },
          { heading: 'Keep your shopping list flexible', paragraphs: ['Choose a base of vegetables, add fruit when it is available, and leave room to swap an ingredient if the harvest changes.', 'A WhatsApp consultation helps adjust the list without assuming stock, prices or dates that have not been confirmed.'] },
        ],
      },
      fi: {
        slug: 'mitka-on-sesongissa-fuengirolassa', title: 'Mitä tuotteita on sesongissa Fuengirolassa',
        description: 'Käytännöllinen opas Fuengirolan sesonkituotteisiin ja saatavuuden varmistamiseen ennen noutoa.',
        intro: 'Sesonki muuttuu sään ja puutarhan rytmin mukana. Bionaturassa varmistamme saatavuuden ennen kuin kokoat listasi.',
        imageAlt: 'Lehtivihannes- ja lehtimangoldirivejä pienen kasvihuoneen vieressä Bionaturan puutarhassa.', ctaLabel: 'Katso sesonkituotteet',
        sections: [
          { heading: 'Tarkista sesonki ennen noutoa', paragraphs: ['Tomaatit, kesäkurpitsat, sitrushedelmät ja lehtivihannekset kasvavat eri rytmissä. Luettelo auttaa suunnittelussa, mutta todellinen saatavuus varmistetaan ennen noutoa.', 'Jos etsit sesonkituotteita Fuengirolassa, tee lyhyt lista ja kysy, mitä tuotteita voi olla valmiina juuri silloin.'] },
          { heading: 'Pidä ostoslista joustavana', paragraphs: ['Valitse vihanneksista perusta, lisää hedelmiä silloin kun niitä on saatavilla ja jätä tilaa raaka-aineen vaihtamiselle sadon muuttuessa.', 'WhatsApp-kysely auttaa tarkentamaan listaa ilman oletuksia varastosta, hinnoista tai päivistä, joita ei ole vahvistettu.'] },
        ],
      },
      da: {
        slug: 'hvilke-produkter-er-i-saeson-i-fuengirola', title: 'Hvilke produkter er i sæson i Fuengirola',
        description: 'En praktisk guide til sæsonvarer i Fuengirola og til at bekræfte tilgængelighed før afhentning.',
        intro: 'Sæsonen ændrer sig med vejret og havens rytme. Hos Bionatura bekræfter vi, hvad der er tilgængeligt, før du laver din liste.',
        imageAlt: 'Rækker med bladgrønt og bladbede ved siden af et lille drivhus i Bionaturas have.', ctaLabel: 'Se sæsonvarer',
        sections: [
          { heading: 'Tjek sæsonen før afhentning', paragraphs: ['Tomater, squash, citrusfrugter og bladgrønt følger hver sin rytme. Kataloget er en god vejledning, mens den faktiske tilgængelighed bekræftes før afhentning.', 'Hvis du leder efter sæsonvarer i Fuengirola, så lav en kort liste og spørg, hvilke produkter der kan være klar på det tidspunkt.'] },
          { heading: 'Hold indkøbslisten fleksibel', paragraphs: ['Vælg en base af grøntsager, tilføj frugt når den er tilgængelig, og lad der være plads til at bytte en ingrediens, hvis høsten ændrer sig.', 'En WhatsApp-forespørgsel hjælper med at tilpasse listen uden at antage lager, priser eller datoer, som ikke er bekræftet.'] },
        ],
      },
    },
    relatedProductIds: ['tomato', 'courgette', 'orange'], relatedArticleIds: ['choose-garden-tomatoes', 'los-pacos-garden-to-basket'],
  },
  {
    id: 'choose-garden-tomatoes', type: 'article', publishedAt: '2026-09-11', image: tomatoHarvest,
    locales: {
      es: { slug: 'como-elegir-tomates-huerto', title: 'Cómo elegir tomates de huerto', description: 'Señales sencillas de frescura, conservación y uso para elegir tomates de huerto.', intro: 'Un buen tomate se elige con los sentidos y se guarda con calma. Estas pautas ayudan a aprovecharlo en casa.', imageAlt: 'Una persona muestra tomates junto a una carretilla llena de la cosecha.', ctaLabel: 'Ver tomates en el catálogo', sections: [{ heading: 'Qué mirar al elegirlos', paragraphs: ['Busca piel íntegra, color propio de la variedad y un aroma suave cerca del tallo.', 'Evita presionar demasiado: un tomate puede estar maduro y seguir siendo delicado.'] }, { heading: 'Cómo conservar su sabor', paragraphs: ['Guárdalos a temperatura ambiente si aún van a madurar y protégelos del sol directo.', 'Cuando estén en su punto, úsalos pronto en ensalada, tostadas o una salsa sencilla.'] }] },
      en: { slug: 'how-to-choose-garden-tomatoes', title: 'How to choose garden tomatoes', description: 'Simple signs of freshness, storage and use for choosing garden tomatoes.', intro: 'A good tomato is chosen with the senses and stored with care. These pointers help you make the most of it at home.', imageAlt: 'A person holds tomatoes beside a wheelbarrow full of the harvest.', ctaLabel: 'See tomatoes in the catalogue', sections: [{ heading: 'What to look for', paragraphs: ['Look for unbroken skin, colour that suits the variety, and a gentle scent near the stem.', 'Avoid pressing too firmly: a tomato can be ripe and still be delicate.'] }, { heading: 'How to keep the flavour', paragraphs: ['Keep them at room temperature if they still need to ripen, away from direct sun.', 'Once they are at their best, use them soon in a salad, on toast or in a simple sauce.'] }] },
      fi: { slug: 'kuinka-valita-puutarhatomaatteja', title: 'Kuinka valita puutarhatomaatteja', description: 'Yksinkertaisia vinkkejä puutarhatomaattien tuoreuden arviointiin, säilytykseen ja käyttöön.', intro: 'Hyvä tomaatti valitaan aisteilla ja säilytetään huolella. Näillä ohjeilla saat siitä eniten irti kotona.', imageAlt: 'Henkilö esittelee tomaatteja sadolla täytetyn kottikärryn vieressä.', ctaLabel: 'Katso tomaatit luettelosta', sections: [{ heading: 'Mitä kannattaa katsoa', paragraphs: ['Etsi ehjäkuorisia tomaatteja, lajikkeelle sopivaa väriä ja mietoa tuoksua kannan läheltä.', 'Älä paina liian voimakkaasti: tomaatti voi olla kypsä ja silti herkkä.'] }, { heading: 'Näin säilytät maun', paragraphs: ['Säilytä tomaatit huoneenlämmössä, jos niiden pitää vielä kypsyä, ja suojaa ne suoralta auringolta.', 'Kun ne ovat parhaimmillaan, käytä ne pian salaatissa, leivän päällä tai yksinkertaisessa kastikkeessa.'] }] },
      da: { slug: 'saadan-vaelger-du-tomater-fra-haven', title: 'Sådan vælger du tomater fra haven', description: 'Enkle tegn på friskhed, opbevaring og brug, når du vælger tomater fra haven.', intro: 'En god tomat vælges med sanserne og opbevares med omtanke. Disse råd hjælper dig med at få mest muligt ud af den hjemme.', imageAlt: 'En person viser tomater ved siden af en trillebør fyldt med høsten.', ctaLabel: 'Se tomater i kataloget', sections: [{ heading: 'Hvad du skal kigge efter', paragraphs: ['Se efter hel skal, farve der passer til sorten og en mild duft tæt ved stilken.', 'Undgå at trykke for hårdt: en tomat kan være moden og stadig sart.'] }, { heading: 'Sådan bevarer du smagen', paragraphs: ['Opbevar dem ved stuetemperatur, hvis de stadig skal modne, og væk fra direkte sol.', 'Når de er bedst, så brug dem snart i en salat, på brød eller i en enkel sauce.'] }] },
    },
    relatedProductIds: ['tomato'], relatedArticleIds: ['tomato-red-onion-salad', 'seasonal-produce-fuengirola'],
  },
  {
    id: 'tomato-red-onion-salad', type: 'recipe', publishedAt: '2026-09-11', image: tomatoImage,
    locales: {
      es: { slug: 'ensalada-tomate-cebolla-roja-aceite-oliva-bio', title: 'Ensalada de tomate, cebolla roja y aceite de oliva bio', description: 'Una ensalada rápida de tomate, cebolla roja y aceite de oliva bio para dos personas.', intro: 'Esta ensalada deja que unos pocos ingredientes bien preparados hablen por sí mismos.', imageAlt: 'Tomates frescos del catálogo de Bionatura.', ctaLabel: 'Añadir ingredientes a mi lista', sections: [{ heading: 'Una ensalada para el día a día', paragraphs: ['Corta el tomate justo antes de servir para conservar su jugo y textura.', 'La cebolla roja aporta un contraste suave; ajusta la cantidad a tu gusto.'] }, { heading: 'Sírvela sin prisas', paragraphs: ['Deja reposar la ensalada unos minutos para que se integren los sabores.', 'Acompáñala con pan, huevo o una preparación sencilla de verduras.'] }] },
      en: { slug: 'tomato-red-onion-organic-olive-oil-salad', title: 'Tomato, red onion and organic olive oil salad', description: 'A quick tomato, red onion and organic olive oil salad for two people.', intro: 'This salad lets a few well-prepared ingredients speak for themselves.', imageAlt: 'Fresh tomatoes from the Bionatura catalogue.', ctaLabel: 'Add ingredients to my list', sections: [{ heading: 'An everyday salad', paragraphs: ['Cut the tomato just before serving to keep its juices and texture.', 'Red onion brings a gentle contrast; adjust the amount to your taste.'] }, { heading: 'Serve it at an easy pace', paragraphs: ['Let the salad rest for a few minutes so the flavours come together.', 'Serve it with bread, egg or a simple vegetable dish.'] }] },
      fi: { slug: 'tomaatti-punasipuli-luomuoliivioljy-salaatti', title: 'Tomaatti-, punasipuli- ja luomuoliiviöljysalaatti', description: 'Nopea tomaatti-, punasipuli- ja luomuoliiviöljysalaatti kahdelle.', intro: 'Tässä salaatissa muutama hyvin valmisteltu raaka-aine pääsee oikeuksiinsa.', imageAlt: 'Tuoreita tomaatteja Bionaturan luettelosta.', ctaLabel: 'Lisää ainekset listalleni', sections: [{ heading: 'Arjen salaatti', paragraphs: ['Leikkaa tomaatti juuri ennen tarjoilua, jotta mehevyys ja rakenne säilyvät.', 'Punasipuli tuo mietoa vastapainoa; säädä määrä omaan makuusi.'] }, { heading: 'Tarjoile rauhassa', paragraphs: ['Anna salaatin levätä muutama minuutti, jotta maut yhdistyvät.', 'Tarjoa leivän, kananmunan tai yksinkertaisen kasvisruoan kanssa.'] }] },
      da: { slug: 'tomat-roedloeg-oekologisk-olivenolie-salat', title: 'Tomat-, rødløgs- og økologisk olivenoliesalat', description: 'En hurtig salat med tomat, rødløg og økologisk olivenolie til to personer.', intro: 'Denne salat lader få, veltilberedte ingredienser tale for sig selv.', imageAlt: 'Friske tomater fra Bionaturas katalog.', ctaLabel: 'Føj ingredienser til min liste', sections: [{ heading: 'En salat til hverdagen', paragraphs: ['Skær tomaten lige før servering, så saft og tekstur bevares.', 'Rødløg giver en mild kontrast; tilpas mængden efter din smag.'] }, { heading: 'Servér i roligt tempo', paragraphs: ['Lad salaten trække et par minutter, så smagene samler sig.', 'Servér den med brød, æg eller en enkel grøntsagsret.'] }] },
    },
    recipe: { yield: copy('2 raciones', '2 servings', '2 annosta', '2 portioner'), prepTime: 'PT10M', ingredients: list(['3 tomates maduros', '1/4 de cebolla roja', '2 cucharadas de aceite de oliva bio', 'Una pizca de sal'], ['3 ripe tomatoes', '1/4 red onion', '2 tablespoons organic olive oil', 'A pinch of salt'], ['3 kypsää tomaattia', '1/4 punasipuli', '2 ruokalusikallista luomuoliiviöljyä', 'Ripaus suolaa'], ['3 modne tomater', '1/4 rødløg', '2 spiseskefulde økologisk olivenolie', 'Et nip salt']), instructions: list(['Lava los tomates y córtalos en gajos.', 'Corta la cebolla roja en láminas finas.', 'Mezcla, aliña con aceite y sal, y sirve.'], ['Wash the tomatoes and cut them into wedges.', 'Slice the red onion thinly.', 'Combine, dress with oil and salt, then serve.'], ['Pese tomaatit ja leikkaa ne lohkoiksi.', 'Viipaloi punasipuli ohuesti.', 'Yhdistä ainekset, mausta öljyllä ja suolalla ja tarjoile.'], ['Vask tomaterne og skær dem i både.', 'Skær rødløget i tynde skiver.', 'Bland, smag til med olie og salt, og servér.']) },
    relatedProductIds: ['tomato', 'red-onion', 'olive-oil'], relatedArticleIds: ['choose-garden-tomatoes', 'simple-mediterranean-courgettes'],
  },
  {
    id: 'simple-mediterranean-courgettes', type: 'recipe', publishedAt: '2026-09-11', image: courgetteImage,
    locales: {
      es: { slug: 'calabacines-mediterraneos-sencillos', title: 'Calabacines mediterráneos sencillos', description: 'Una receta de calabacines mediterráneos sencillos con aceite de oliva bio para dos personas.', intro: 'Una sartén, pocos ingredientes y un fuego moderado bastan para una comida sencilla.', imageAlt: 'Calabacines frescos del catálogo de Bionatura.', ctaLabel: 'Añadir ingredientes a mi lista', sections: [{ heading: 'Cocina suave y directa', paragraphs: ['Corta el calabacín en medias lunas de tamaño parecido para que se cocine de forma uniforme.', 'El aceite de oliva bio se añade al principio para acompañar el sabor, sin ocultarlo.'] }, { heading: 'Una base fácil de combinar', paragraphs: ['Sírvelo como plato ligero o como guarnición de huevos, patatas o pan.', 'Si preparas más cantidad, cocina en tandas para no llenar demasiado la sartén.'] }] },
      en: { slug: 'simple-mediterranean-courgettes', title: 'Simple Mediterranean courgettes', description: 'A simple Mediterranean courgette recipe with organic olive oil for two people.', intro: 'One frying pan, a few ingredients and moderate heat are enough for a simple meal.', imageAlt: 'Fresh courgettes from the Bionatura catalogue.', ctaLabel: 'Add ingredients to my list', sections: [{ heading: 'Gentle, direct cooking', paragraphs: ['Cut the courgette into similar half-moons so it cooks evenly.', 'Organic olive oil goes in at the start to support the flavour without hiding it.'] }, { heading: 'An easy base to combine', paragraphs: ['Serve it as a light dish or alongside eggs, potatoes or bread.', 'If you make a larger amount, cook in batches so the pan is not overcrowded.'] }] },
      fi: { slug: 'helpot-valimerelliset-kesakurpitsat', title: 'Helpot välimerelliset kesäkurpitsat', description: 'Helppo välimerellinen kesäkurpitsaresepti luomuoliiviöljyllä kahdelle.', intro: 'Yksi paistinpannu, muutama raaka-aine ja kohtuullinen lämpö riittävät helppoon ateriaan.', imageAlt: 'Tuoreita kesäkurpitsoja Bionaturan luettelosta.', ctaLabel: 'Lisää ainekset listalleni', sections: [{ heading: 'Hellä ja suoraviivainen kypsennys', paragraphs: ['Leikkaa kesäkurpitsa samankokoisiksi puolikuiksi, jotta se kypsyy tasaisesti.', 'Luomuoliiviöljy lisätään alussa tukemaan makua peittämättä sitä.'] }, { heading: 'Helppo yhdisteltävä perusta', paragraphs: ['Tarjoa kevyenä ruokana tai kananmunien, perunoiden tai leivän kanssa.', 'Jos valmistat suuremman määrän, paista erissä, jotta pannu ei täyty liikaa.'] }] },
      da: { slug: 'enkle-middelhavs-squash', title: 'Enkle middelhavs-squash', description: 'En enkel opskrift på middelhavs-squash med økologisk olivenolie til to personer.', intro: 'En pande, få ingredienser og moderat varme er nok til et enkelt måltid.', imageAlt: 'Friske squash fra Bionaturas katalog.', ctaLabel: 'Føj ingredienser til min liste', sections: [{ heading: 'Blid og enkel tilberedning', paragraphs: ['Skær squashen i ens halve skiver, så den tilberedes jævnt.', 'Økologisk olivenolie tilsættes i begyndelsen for at understøtte smagen uden at skjule den.'] }, { heading: 'En nem base at kombinere', paragraphs: ['Servér som en let ret eller sammen med æg, kartofler eller brød.', 'Hvis du laver en større portion, så steg i hold, så panden ikke bliver for fyldt.'] }] },
    },
    recipe: { yield: copy('2 raciones', '2 servings', '2 annosta', '2 portioner'), prepTime: 'PT10M', cookTime: 'PT15M', ingredients: list(['2 calabacines medianos', '2 cucharadas de aceite de oliva bio', '1 diente de ajo', 'Una pizca de sal'], ['2 medium courgettes', '2 tablespoons organic olive oil', '1 garlic clove', 'A pinch of salt'], ['2 keskikokoista kesäkurpitsaa', '2 ruokalusikallista luomuoliiviöljyä', '1 valkosipulinkynsi', 'Ripaus suolaa'], ['2 mellemstore squash', '2 spiseskefulde økologisk olivenolie', '1 fed hvidløg', 'Et nip salt']), instructions: list(['Lava y corta los calabacines en medias lunas.', 'Calienta el aceite y cocina el ajo brevemente.', 'Añade el calabacín, sala y cocina hasta que esté tierno.'], ['Wash and cut the courgettes into half-moons.', 'Heat the oil and cook the garlic briefly.', 'Add the courgettes, season with salt and cook until tender.'], ['Pese ja leikkaa kesäkurpitsat puolikuiksi.', 'Kuumenna öljy ja kypsennä valkosipulia hetki.', 'Lisää kesäkurpitsa, suolaa ja kypsennä pehmeäksi.'], ['Vask og skær squashene i halve skiver.', 'Varm olien, og steg hvidløget kort.', 'Tilsæt squash, salt og steg, til den er mør.']) },
    relatedProductIds: ['courgette', 'olive-oil'], relatedArticleIds: ['seasonal-produce-fuengirola', 'tomato-red-onion-salad'],
  },
  {
    id: 'organic-and-local-produce', type: 'article', publishedAt: '2026-09-11', image: marketStallDisplay,
    locales: {
      es: { slug: 'que-significa-comprar-producto-biologico-local', title: 'Qué significa comprar producto biológico y local', description: 'Una guía clara para entender qué preguntas hacer al comprar producto biológico y local.', intro: 'Comprar cerca puede ser una forma práctica de conocer mejor el origen y la disponibilidad de lo que eliges.', imageAlt: 'Mesa de exposición con fruta, verdura, tarros y botellas de Bionatura.', ctaLabel: 'Consultar el catálogo', sections: [{ heading: 'Haz preguntas concretas', paragraphs: ['Producto biológico y local no sustituye la necesidad de saber qué se ofrece, cuándo está disponible y cómo se prepara la recogida.', 'Consulta el catálogo y pregunta por el producto que te interesa antes de incluirlo en tu lista.'] }, { heading: 'Decide con información útil', paragraphs: ['La cercanía puede facilitar una conversación directa sobre la selección del momento.', 'Evita dar por hechas certificaciones, stock o beneficios: una compra informada parte de datos confirmados.'] }] },
      en: { slug: 'what-buying-organic-local-produce-means', title: 'What buying organic and local produce means', description: 'A clear guide to the questions to ask when buying organic and local produce.', intro: 'Buying nearby can be a practical way to understand the origin and availability of what you choose.', imageAlt: 'Display table with fruit, vegetables, jars and bottles from Bionatura.', ctaLabel: 'Browse the catalogue', sections: [{ heading: 'Ask specific questions', paragraphs: ['Organic and local produce does not replace the need to know what is offered, when it is available and how collection is arranged.', 'Check the catalogue and ask about the product you want before adding it to your list.'] }, { heading: 'Decide with useful information', paragraphs: ['Proximity can make a direct conversation about the current selection easier.', 'Do not assume certifications, stock or benefits: an informed purchase starts with confirmed details.'] }] },
      fi: { slug: 'mita-luomu-ja-lahituotteiden-ostaminen-tarkoittaa', title: 'Mitä luomu- ja lähituotteiden ostaminen tarkoittaa', description: 'Selkeä opas kysymyksiin, joita kannattaa esittää luomu- ja lähituotteita ostaessa.', intro: 'Läheltä ostaminen voi olla käytännöllinen tapa ymmärtää paremmin valittujen tuotteiden alkuperää ja saatavuutta.', imageAlt: 'Bionaturan esittelypöytä, jolla on hedelmiä, vihanneksia, purkkeja ja pulloja.', ctaLabel: 'Tutustu luetteloon', sections: [{ heading: 'Kysy täsmällisiä kysymyksiä', paragraphs: ['Luomu- ja lähituotteet eivät poista tarvetta tietää, mitä on tarjolla, milloin sitä on saatavilla ja miten nouto järjestetään.', 'Tarkista luettelo ja kysy haluamastasi tuotteesta ennen kuin lisäät sen listallesi.'] }, { heading: 'Tee päätös hyödyllisten tietojen pohjalta', paragraphs: ['Läheisyys voi helpottaa suoraa keskustelua sen hetken valikoimasta.', 'Älä oleta sertifikaatteja, saatavuutta tai hyötyjä: tietoon perustuva osto alkaa vahvistetuista tiedoista.'] }] },
      da: { slug: 'hvad-betyder-det-at-koebe-oekologiske-lokale-produkter', title: 'Hvad betyder det at købe økologiske og lokale produkter', description: 'En klar guide til de spørgsmål, du kan stille, når du køber økologiske og lokale produkter.', intro: 'At købe tæt på kan være en praktisk måde at forstå oprindelsen og tilgængeligheden af det, du vælger.', imageAlt: 'Bionaturas udstillingsbord med frugt, grønt, glas og flasker.', ctaLabel: 'Se kataloget', sections: [{ heading: 'Stil konkrete spørgsmål', paragraphs: ['Økologiske og lokale produkter erstatter ikke behovet for at vide, hvad der tilbydes, hvornår det er tilgængeligt, og hvordan afhentning arrangeres.', 'Se kataloget og spørg til det produkt, du er interesseret i, før du føjer det til din liste.'] }, { heading: 'Vælg på et nyttigt grundlag', paragraphs: ['Nærhed kan gøre en direkte samtale om det aktuelle udvalg lettere.', 'Antag ikke certificeringer, lager eller fordele: et oplyst køb starter med bekræftede oplysninger.'] }] },
    },
    relatedProductIds: ['tomato', 'olive-oil', 'kombucha'], relatedArticleIds: ['seasonal-produce-fuengirola', 'los-pacos-garden-to-basket'],
  },
  {
    id: 'los-pacos-garden-to-basket', type: 'article', publishedAt: '2026-09-11', image: growerGreenhouse,
    locales: {
      es: { slug: 'del-huerto-los-pacos-a-tu-cesta', title: 'Del huerto de Los Pacos a tu cesta', description: 'Cómo consultar el catálogo de Bionatura, preparar una lista, resolver dudas y organizar una recogida previamente acordada.', intro: 'Bionatura conecta el huerto de Los Pacos con una forma sencilla de preparar tu compra.', imageAlt: 'Una persona entre hileras jóvenes delante de un invernadero en Los Pacos.', ctaLabel: 'Preparar mi lista de pedido', sections: [{ heading: 'Empieza por el catálogo', paragraphs: ['Revisa los productos y cantidades que te interesan. La información sirve para preparar una lista, no para prometer disponibilidad inmediata.', 'Si necesitas cambiar una cantidad o tienes una duda, anótala para consultarla.'] }, { heading: 'Confirma antes de recoger', paragraphs: ['Envía la lista por WhatsApp para confirmar los productos y resolver las preguntas necesarias.', 'La recogida se organiza previamente en Los Pacos; no se presenta como tienda abierta ni como dirección pública de venta.'] }] },
      en: { slug: 'from-los-pacos-garden-to-your-basket', title: 'From the Los Pacos garden to your basket', description: 'How to check the Bionatura catalogue, prepare a list, ask questions and arrange collection in advance.', intro: 'Bionatura connects the Los Pacos garden with a straightforward way to prepare your shopping list.', imageAlt: 'A person among young rows in front of a polytunnel in Los Pacos.', ctaLabel: 'Prepare my order list', sections: [{ heading: 'Start with the catalogue', paragraphs: ['Review the products and quantities that interest you. The information helps prepare a list; it does not promise immediate availability.', 'If you need to change a quantity or have a question, note it down to ask about it.'] }, { heading: 'Confirm before collection', paragraphs: ['Send the list by WhatsApp to confirm products and resolve any necessary questions.', 'Collection is arranged in advance in Los Pacos; it is not presented as an open shop or public sales address.'] }] },
      fi: { slug: 'los-pacosin-puutarhasta-koriisi', title: 'Los Pacosin puutarhasta koriisi', description: 'Näin tarkistat Bionaturan luettelon, kokoat listan, kysyt neuvoa ja sovit noudosta etukäteen.', intro: 'Bionatura yhdistää Los Pacosin puutarhan suoraviivaiseen tapaan valmistella ostoslista.', imageAlt: 'Henkilö nuorten taimien rivien keskellä kasvihuoneen edessä Los Pacosissa.', ctaLabel: 'Valmistele tilaustani', sections: [{ heading: 'Aloita luettelosta', paragraphs: ['Katso sinua kiinnostavat tuotteet ja määrät. Tiedot auttavat kokoamaan listan, eivät lupaa välitöntä saatavuutta.', 'Jos haluat muuttaa määrää tai sinulla on kysyttävää, kirjoita se ylös kysyäksesi siitä.'] }, { heading: 'Varmista ennen noutoa', paragraphs: ['Lähetä lista WhatsAppilla tuotteiden vahvistamiseksi ja tarvittavien kysymysten selvittämiseksi.', 'Nouto sovitaan etukäteen Los Pacosissa; sitä ei esitetä avoimena myymälänä tai julkisena myyntiosoitteena.'] }] },
      da: { slug: 'fra-haven-i-los-pacos-til-din-kurv', title: 'Fra haven i Los Pacos til din kurv', description: 'Sådan ser du Bionaturas katalog, laver en liste, stiller spørgsmål og aftaler afhentning på forhånd.', intro: 'Bionatura forbinder haven i Los Pacos med en enkel måde at forberede din indkøbsliste på.', imageAlt: 'En person mellem unge planterækker foran et drivhus i Los Pacos.', ctaLabel: 'Forbered min bestillingsliste', sections: [{ heading: 'Start med kataloget', paragraphs: ['Se på de produkter og mængder, der interesserer dig. Oplysningerne hjælper med at forberede en liste, men lover ikke øjeblikkelig tilgængelighed.', 'Hvis du vil ændre en mængde eller har et spørgsmål, så skriv det ned, så du kan spørge om det.'] }, { heading: 'Bekræft før afhentning', paragraphs: ['Send listen på WhatsApp for at bekræfte produkterne og afklare nødvendige spørgsmål.', 'Afhentning aftales på forhånd i Los Pacos; det præsenteres ikke som en åben butik eller offentlig salgsadresse.'] }] },
    },
    relatedProductIds: ['tomato', 'egg', 'olive-oil'], relatedArticleIds: ['seasonal-produce-fuengirola', 'organic-and-local-produce'],
  },
];

export function editorialItemBySlug(locale: Locale, slug: string): EditorialItem | undefined {
  return editorialItems.find((item) => item.locales[locale].slug === slug);
}

export function editorialPath(locale: Locale, item: EditorialItem): string {
  return `/${locale}/${editorialRouteSegments[locale]}/${item.locales[locale].slug}/`;
}

export function editorialAlternates(item: EditorialItem) {
  return [
    ...(['es', 'en', 'fi', 'da'] as const).map((locale) => ({ locale, href: editorialPath(locale, item) })),
    { locale: 'x-default' as const, href: editorialPath(DEFAULT_LOCALE, item) },
  ];
}

assertValidEditorial(editorialItems, products.map((product) => product.id));
