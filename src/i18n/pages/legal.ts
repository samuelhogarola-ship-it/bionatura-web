import type { LocalizedPageCopy } from './types';

const legalNotice: LocalizedPageCopy = {
  es: { title: 'Aviso legal | Bionatura', description: 'Información legal de Bionatura.', h1: 'Aviso legal', intro: 'La identidad jurídica y el domicilio social están confirmados.', sections: [{ title: 'Datos confirmados del titular', body: 'Los datos identificativos que se muestran han sido facilitados y confirmados por Bionatura.' }], cta: 'Inicio', ctaPage: 'home' },
  en: { title: 'Legal notice | Bionatura', description: 'Bionatura legal information.', h1: 'Legal notice', intro: 'The legal identity and registered office have been confirmed.', sections: [{ title: 'Confirmed owner details', body: 'The identifying details shown have been provided and confirmed by Bionatura.' }], cta: 'Home', ctaPage: 'home' },
  fi: { title: 'Oikeudellinen huomautus | Bionatura', description: 'Bionaturan oikeudelliset tiedot.', h1: 'Oikeudellinen huomautus', intro: 'Oikeudellinen identiteetti ja rekisteröity osoite on vahvistettu.', sections: [{ title: 'Vahvistetut haltijan tiedot', body: 'Bionatura on toimittanut ja vahvistanut näytetyt tunnistetiedot.' }], cta: 'Etusivu', ctaPage: 'home' },
  da: { title: 'Juridisk meddelelse | Bionatura', description: 'Bionaturas juridiske oplysninger.', h1: 'Juridisk meddelelse', intro: 'Den juridiske identitet og registrerede adresse er bekræftet.', sections: [{ title: 'Bekræftede ejeroplysninger', body: 'De viste identifikationsoplysninger er leveret og bekræftet af Bionatura.' }], cta: 'Forside', ctaPage: 'home' },
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
