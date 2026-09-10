import type { Locale } from './config';

export const ui = {
  es: {
    navHome: 'Inicio', navCatalog: 'Catálogo', navGallery: 'Galería', navAbout: 'Nosotros', navHow: 'Cómo funciona', navContact: 'Contacto',
    menuLabel: 'Menú', closeMenu: 'Cerrar menú', prepareOrder: 'Prepara tu pedido', viewCatalog: 'Ver catálogo', addToList: 'Añadir a la lista', yourList: 'Tu lista', emptyList: 'Tu lista está vacía.',
    quantity: 'Cantidad', customQuantity: 'Otra cantidad', removeItem: 'Eliminar producto', clearList: 'Vaciar lista', cancel: 'Cancelar', confirmClear: 'Vaciar',
    spring: 'Primavera', summer: 'Verano', autumn: 'Otoño', winter: 'Invierno', consultWhatsapp: 'Consultar por WhatsApp', copyMessage: 'Copiar mensaje',
    availabilityNotice: 'El catálogo es orientativo. Te confirmaremos la disponibilidad y cuándo puedes recogerlo.', demoProduct: 'Producto de muestra', pendingContact: 'Contacto pendiente de confirmar',
    whatsappIntro: 'Hola, he preparado esta lista en Bionatura.es:', whatsappAvailability: '¿Tenéis disponibilidad?', whatsappPickup: '¿Cuándo podría recogerlo?',
  },
  en: {
    navHome: 'Home', navCatalog: 'Catalog', navGallery: 'Gallery', navAbout: 'About us', navHow: 'How it works', navContact: 'Contact',
    menuLabel: 'Menu', closeMenu: 'Close menu', prepareOrder: 'Prepare your order', viewCatalog: 'View catalog', addToList: 'Add to list', yourList: 'Your list', emptyList: 'Your list is empty.',
    quantity: 'Quantity', customQuantity: 'Other quantity', removeItem: 'Remove product', clearList: 'Clear list', cancel: 'Cancel', confirmClear: 'Clear',
    spring: 'Spring', summer: 'Summer', autumn: 'Autumn', winter: 'Winter', consultWhatsapp: 'Ask via WhatsApp', copyMessage: 'Copy message',
    availabilityNotice: 'The catalog is a guide. We will confirm availability and when you can collect your order.', demoProduct: 'Sample product', pendingContact: 'Contact details awaiting confirmation',
    whatsappIntro: 'Hello, I prepared this list on Bionatura.es:', whatsappAvailability: 'Are these products available?', whatsappPickup: 'When could I collect them?',
  },
  fi: {
    navHome: 'Etusivu', navCatalog: 'Tuotteet', navGallery: 'Galleria', navAbout: 'Meistä', navHow: 'Näin se toimii', navContact: 'Yhteystiedot',
    menuLabel: 'Valikko', closeMenu: 'Sulje valikko', prepareOrder: 'Kokoa tilauslistasi', viewCatalog: 'Katso tuotteet', addToList: 'Lisää listalle', yourList: 'Ostoslistasi', emptyList: 'Listasi on tyhjä.',
    quantity: 'Määrä', customQuantity: 'Muu määrä', removeItem: 'Poista tuote', clearList: 'Tyhjennä lista', cancel: 'Peruuta', confirmClear: 'Tyhjennä',
    spring: 'Kevät', summer: 'Kesä', autumn: 'Syksy', winter: 'Talvi', consultWhatsapp: 'Kysy WhatsAppissa', copyMessage: 'Kopioi viesti',
    availabilityNotice: 'Tuoteluettelo on suuntaa antava. Vahvistamme saatavuuden ja noutoajan.', demoProduct: 'Esimerkkituote', pendingContact: 'Yhteystieto odottaa vahvistusta',
    whatsappIntro: 'Hei, kokosin tämän listan Bionatura.es-sivustolla:', whatsappAvailability: 'Onko näitä tuotteita saatavilla?', whatsappPickup: 'Milloin voisin noutaa ne?',
  },
  da: {
    navHome: 'Forside', navCatalog: 'Katalog', navGallery: 'Galleri', navAbout: 'Om os', navHow: 'Sådan fungerer det', navContact: 'Kontakt',
    menuLabel: 'Menu', closeMenu: 'Luk menu', prepareOrder: 'Forbered din bestillingsliste', viewCatalog: 'Se katalog', addToList: 'Føj til listen', yourList: 'Din liste', emptyList: 'Din liste er tom.',
    quantity: 'Mængde', customQuantity: 'Anden mængde', removeItem: 'Fjern vare', clearList: 'Tøm listen', cancel: 'Annuller', confirmClear: 'Tøm',
    spring: 'Forår', summer: 'Sommer', autumn: 'Efterår', winter: 'Vinter', consultWhatsapp: 'Spørg via WhatsApp', copyMessage: 'Kopiér besked',
    availabilityNotice: 'Kataloget er vejledende. Vi bekræfter tilgængelighed og afhentningstidspunkt.', demoProduct: 'Eksempelprodukt', pendingContact: 'Kontaktoplysninger afventer bekræftelse',
    whatsappIntro: 'Hej, jeg har lavet denne liste på Bionatura.es:', whatsappAvailability: 'Er disse varer tilgængelige?', whatsappPickup: 'Hvornår kan jeg hente dem?',
  },
} as const satisfies Record<Locale, Record<string, string>>;
