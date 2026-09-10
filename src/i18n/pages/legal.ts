import type { LocalizedPageCopy } from './types';

const legalNotice: LocalizedPageCopy = {
  es: { title: 'Aviso legal | Bionatura', description: 'Información legal de Bionatura.', h1: 'Aviso legal', intro: 'La información legal se publicará cuando haya sido validada.', sections: [{ title: 'Información pendiente', body: 'No se muestran datos jurídicos sin confirmación.' }], cta: 'Inicio' },
  en: { title: 'Legal notice | Bionatura', description: 'Bionatura legal information.', h1: 'Legal notice', intro: 'Legal information will be published once it has been verified.', sections: [{ title: 'Information pending', body: 'No legal details are shown without confirmation.' }], cta: 'Home' },
  fi: { title: 'Oikeudellinen huomautus | Bionatura', description: 'Bionaturan oikeudelliset tiedot.', h1: 'Oikeudellinen huomautus', intro: 'Oikeudelliset tiedot julkaistaan, kun ne on vahvistettu.', sections: [{ title: 'Tietoja odotetaan', body: 'Emme näytä oikeudellisia tietoja ilman vahvistusta.' }], cta: 'Etusivu' },
  da: { title: 'Juridisk meddelelse | Bionatura', description: 'Bionaturas juridiske oplysninger.', h1: 'Juridisk meddelelse', intro: 'Juridiske oplysninger offentliggøres, når de er bekræftet.', sections: [{ title: 'Oplysninger afventer', body: 'Vi viser ikke juridiske oplysninger uden bekræftelse.' }], cta: 'Forside' },
};

const privacy: LocalizedPageCopy = {
  es: { title: 'Privacidad | Bionatura', description: 'Información de privacidad de Bionatura.', h1: 'Privacidad', intro: 'La información de privacidad se publicará tras su validación.', sections: [{ title: 'Información pendiente', body: 'No se publican condiciones sin confirmar.' }], cta: 'Inicio' },
  en: { title: 'Privacy | Bionatura', description: 'Bionatura privacy information.', h1: 'Privacy', intro: 'Privacy information will be published after verification.', sections: [{ title: 'Information pending', body: 'No terms are published without confirmation.' }], cta: 'Home' },
  fi: { title: 'Tietosuoja | Bionatura', description: 'Bionaturan tietosuojatiedot.', h1: 'Tietosuoja', intro: 'Tietosuojatiedot julkaistaan vahvistuksen jälkeen.', sections: [{ title: 'Tietoja odotetaan', body: 'Emme julkaise ehtoja ilman vahvistusta.' }], cta: 'Etusivu' },
  da: { title: 'Privatliv | Bionatura', description: 'Bionaturas oplysninger om privatliv.', h1: 'Privatliv', intro: 'Oplysninger om privatliv offentliggøres efter bekræftelse.', sections: [{ title: 'Oplysninger afventer', body: 'Vi offentliggør ikke vilkår uden bekræftelse.' }], cta: 'Forside' },
};

const cookies: LocalizedPageCopy = {
  es: { title: 'Cookies | Bionatura', description: 'Información sobre cookies de Bionatura.', h1: 'Cookies', intro: 'La información sobre cookies se publicará tras su validación.', sections: [{ title: 'Información pendiente', body: 'No se publican condiciones sin confirmar.' }], cta: 'Inicio' },
  en: { title: 'Cookies | Bionatura', description: 'Bionatura cookie information.', h1: 'Cookies', intro: 'Cookie information will be published after verification.', sections: [{ title: 'Information pending', body: 'No terms are published without confirmation.' }], cta: 'Home' },
  fi: { title: 'Evästeet | Bionatura', description: 'Bionaturan evästetiedot.', h1: 'Evästeet', intro: 'Evästetiedot julkaistaan vahvistuksen jälkeen.', sections: [{ title: 'Tietoja odotetaan', body: 'Emme julkaise ehtoja ilman vahvistusta.' }], cta: 'Etusivu' },
  da: { title: 'Cookies | Bionatura', description: 'Bionaturas cookieoplysninger.', h1: 'Cookies', intro: 'Cookieoplysninger offentliggøres efter bekræftelse.', sections: [{ title: 'Oplysninger afventer', body: 'Vi offentliggør ikke vilkår uden bekræftelse.' }], cta: 'Forside' },
};

export { cookies, legalNotice, privacy };
