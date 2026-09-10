import type { LocalizedPageCopy } from './types';

const legalNotice: LocalizedPageCopy = {
  es: { title: 'Aviso legal | Bionatura', description: 'Información legal de Bionatura.', h1: 'Aviso legal', intro: 'Información identificativa del titular de este sitio web.', sections: [], cta: 'Volver al inicio', ctaPage: 'home' },
  en: { title: 'Legal notice | Bionatura', description: 'Bionatura legal information.', h1: 'Legal notice', intro: 'Identification details of the owner of this website.', sections: [], cta: 'Back to home', ctaPage: 'home' },
  fi: { title: 'Oikeudellinen huomautus | Bionatura', description: 'Bionaturan oikeudelliset tiedot.', h1: 'Oikeudellinen huomautus', intro: 'Tämän verkkosivuston omistajan tunnistetiedot.', sections: [], cta: 'Takaisin etusivulle', ctaPage: 'home' },
  da: { title: 'Juridisk meddelelse | Bionatura', description: 'Bionaturas juridiske oplysninger.', h1: 'Juridisk meddelelse', intro: 'Identifikationsoplysninger om ejeren af dette websted.', sections: [], cta: 'Tilbage til forsiden', ctaPage: 'home' },
};

const privacy: LocalizedPageCopy = {
  es: { title: 'Privacidad | Bionatura', description: 'Información de privacidad de Bionatura.', h1: 'Privacidad', intro: 'La información de privacidad se publicará tras su validación.', sections: [{ title: 'Información pendiente', body: 'No se publican condiciones sin confirmar.' }], cta: 'Inicio', ctaPage: 'home' },
  en: { title: 'Privacy | Bionatura', description: 'Bionatura privacy information.', h1: 'Privacy', intro: 'Privacy information will be published after verification.', sections: [{ title: 'Information pending', body: 'No terms are published without confirmation.' }], cta: 'Home', ctaPage: 'home' },
  fi: { title: 'Tietosuoja | Bionatura', description: 'Bionaturan tietosuojatiedot.', h1: 'Tietosuoja', intro: 'Tietosuojatiedot julkaistaan vahvistuksen jälkeen.', sections: [{ title: 'Tietoja odotetaan', body: 'Emme julkaise ehtoja ilman vahvistusta.' }], cta: 'Etusivu', ctaPage: 'home' },
  da: { title: 'Privatliv | Bionatura', description: 'Bionaturas oplysninger om privatliv.', h1: 'Privatliv', intro: 'Oplysninger om privatliv offentliggøres efter bekræftelse.', sections: [{ title: 'Oplysninger afventer', body: 'Vi offentliggør ikke vilkår uden bekræftelse.' }], cta: 'Forside', ctaPage: 'home' },
};

const cookies: LocalizedPageCopy = {
  es: { title: 'Cookies | Bionatura', description: 'Información sobre cookies de Bionatura.', h1: 'Cookies', intro: 'La información sobre cookies se publicará tras su validación.', sections: [{ title: 'Información pendiente', body: 'No se publican condiciones sin confirmar.' }], cta: 'Inicio', ctaPage: 'home' },
  en: { title: 'Cookies | Bionatura', description: 'Bionatura cookie information.', h1: 'Cookies', intro: 'Cookie information will be published after verification.', sections: [{ title: 'Information pending', body: 'No terms are published without confirmation.' }], cta: 'Home', ctaPage: 'home' },
  fi: { title: 'Evästeet | Bionatura', description: 'Bionaturan evästetiedot.', h1: 'Evästeet', intro: 'Evästetiedot julkaistaan vahvistuksen jälkeen.', sections: [{ title: 'Tietoja odotetaan', body: 'Emme julkaise ehtoja ilman vahvistusta.' }], cta: 'Etusivu', ctaPage: 'home' },
  da: { title: 'Cookies | Bionatura', description: 'Bionaturas cookieoplysninger.', h1: 'Cookies', intro: 'Cookieoplysninger offentliggøres efter bekræftelse.', sections: [{ title: 'Oplysninger afventer', body: 'Vi offentliggør ikke vilkår uden bekræftelse.' }], cta: 'Forside', ctaPage: 'home' },
};

export { cookies, legalNotice, privacy };
