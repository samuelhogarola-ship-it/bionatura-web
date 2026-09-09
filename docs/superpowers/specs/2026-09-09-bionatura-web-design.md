# Bionatura.es — Especificación de diseño y arquitectura

**Fecha:** 9 de septiembre de 2026  
**Estado:** aprobado para planificación  
**Objetivo de demo:** viernes 11 de septiembre de 2026  

## 1. Objetivo

Crear una web estática, multipágina, rápida y visual para Bionatura, orientada a SEO local en Fuengirola y a convertir visitas en consultas por WhatsApp. La web presenta el negocio, explica su funcionamiento, muestra un catálogo orientativo organizado por temporada y permite preparar una lista de productos sin convertir el proceso en un e-commerce ni confirmar pedidos automáticamente.

La web debe requerir mantenimiento mínimo. No incluye pagos, checkout, inventario, autenticación, logística, base de datos ni CMS.

## 2. Principios de producto

1. Bionatura se presenta como un proyecto local vinculado al huerto, el producto natural, la temporada, la preparación previa y la recogida acordada.
2. No se describe como una tienda física convencional.
3. El catálogo informa de lo que suele haber, pero nunca promete stock.
4. Una lista enviada a WhatsApp es una consulta, no un pedido confirmado.
5. La persona responsable confirma disponibilidad, cantidades y recogida.
6. Las fotografías reales y la voz humana son el centro de la identidad.
7. La web prioriza móvil, rendimiento, accesibilidad, contenido rastreable y facilidad de mantenimiento.

## 3. Alcance y fases

### 3.1 MVP para la demo del viernes

- Identidad visual provisional derivada de la presencia pública de Bionatura, sin asumir datos comerciales no confirmados.
- Cabecera responsive, navegación multipágina, selector de idioma y CTA «Prepara tu pedido».
- Inicio completo con hero, propuesta de valor, productos/temporada, funcionamiento, historia, galería resumida y contacto.
- Catálogo con contenido de demo claramente identificado, temporada automática, selector accesible y productos de todo el año.
- Selección de cantidades, lista editable y generación del enlace de WhatsApp.
- Páginas Galería, Nosotros, Cómo funciona, Contacto y legales con contenido suficiente para enseñar la arquitectura y el estilo.
- Español, inglés, finés y danés en todas las páginas y textos de interfaz incluidos en la demo.
- Repositorio GitHub y preview de Vercel.
- SEO técnico base: metadatos, canonical, hreflang, sitemap, robots, Open Graph y HTML semántico.

### 3.2 Después de la demo

- Sustitución de recursos provisionales por logo, fotografías y vídeos originales entregados.
- Validación del listado final de productos, unidades, temporadas y productos habituales.
- Revisión profesional de traducciones, especialmente nombres de producto y matices locales.
- Incorporación de datos confirmados: teléfono/WhatsApp, email, recogida, horarios y datos jurídicos.
- Evaluación con datos reales de páginas SEO adicionales por categoría.
- Optimización final de imágenes, vídeo, accesibilidad, Core Web Vitals y datos estructurados.
- Conexión del dominio, Search Console, analítica consentida si se aprueba y publicación.

## 4. Arquitectura técnica

### 4.1 Stack

- Astro en modo estático.
- TypeScript en modo estricto.
- HTML y CSS nativos como salida principal.
- JavaScript/TypeScript de cliente únicamente para navegación móvil, temporadas, lista, persistencia local, selector de idioma y apertura de WhatsApp.
- Sin React, Vue, Svelte ni librería de componentes.
- Sin backend, API propia, Supabase, base de datos o CMS.
- GitHub como repositorio; Vercel como hosting de previews y producción futura.

Astro se utiliza como generador y sistema de plantillas. El navegador recibe páginas HTML estáticas y solo los recursos mínimos necesarios.

### 4.2 Unidades y ownership

- `src/data/business.ts`: identidad, canales, recogida, redes y estado de validación de cada dato.
- `src/data/products.ts`: catálogo común a los cuatro idiomas, temporadas, unidades, cantidades y precio opcional.
- `src/i18n/`: textos de páginas, navegación, interfaz, productos y mensajes de WhatsApp por idioma.
- `src/lib/season.ts`: cálculo puro de temporada y orden de las estaciones.
- `src/lib/order-list.ts`: validación, normalización y operaciones de la lista.
- `src/lib/whatsapp.ts`: composición determinista del mensaje localizado y de la URL.
- `src/components/`: unidades visuales pequeñas, estáticas por defecto.
- `src/pages/`: rutas estáticas por idioma.
- `public/media/`: recursos que deban conservarse sin transformación.
- `src/assets/`: imágenes procesadas por Astro.

Los datos de negocio y catálogo se modifican sin tocar componentes ni lógica.

## 5. Modelo multilingüe

### 5.1 Idiomas

- Español (`es`) como idioma fuente y mercado principal.
- Inglés (`en`).
- Finés (`fi`).
- Danés (`da`).

La estructura recomendada usa prefijo explícito en todos los idiomas:

- `/es/`
- `/en/`
- `/fi/`
- `/da/`

La raíz `/` ofrece una redirección estática y accesible a `/es/`. No se fuerza una redirección basada en geolocalización ni navegador. El selector permite cambiar de idioma conservando la página equivalente y, cuando sea posible, la lista local.

### 5.2 SEO internacional

- Cada URL tiene canonical hacia sí misma.
- Cada conjunto de páginas equivalentes declara `hreflang` para `es`, `en`, `fi`, `da` y `x-default` hacia español.
- El sitemap contiene todas las URLs indexables localizadas.
- Los slugs se traducen mediante un mapa estable por página; los identificadores internos no cambian.
- `lang` del documento coincide con el idioma visible.
- No se indexan páginas con traducciones parciales.

### 5.3 WhatsApp por idioma

Existe una plantilla maestra española y una traducción completa para cada idioma. La interfaz genera el mensaje en el idioma elegido por el visitante. Los productos usan su nombre localizado; cantidades y unidades se formatean según la configuración del idioma sin alterar el valor seleccionado.

## 6. Arquitectura de información

Cada idioma contiene:

1. Inicio.
2. Catálogo.
3. Galería.
4. Nosotros.
5. Cómo funciona / Recogida.
6. Contacto.
7. Aviso legal.
8. Privacidad.
9. Cookies, solo si finalmente se instalan tecnologías que las utilicen; mientras no existan cookies no esenciales, la página explica el estado real y no se muestra un banner innecesario.

No se crea una página independiente de temporada. La temporada vive dentro del catálogo y recibe enlaces contextuales desde Inicio.

No se crean inicialmente páginas de frutas, verduras, huevos u otras categorías. Solo se publicarán cuando el catálogo definitivo y el análisis de intención permitan escribir contenido único y útil. El umbral editorial es: varios productos reales, texto propio, imagen relevante y una necesidad de búsqueda diferenciada; si no se cumple, la categoría permanece como sección del catálogo.

## 7. Navegación

### Desktop

- Cabecera sticky compacta.
- Logo a la izquierda.
- Enlaces principales en el centro o derecha.
- Selector de idioma discreto y accesible.
- CTA destacado «Prepara tu pedido» dirigido al catálogo/lista.
- Botón flotante de WhatsApp sin tapar contenido ni controles.

### Móvil

- Cabecera de baja altura, logo, acceso a lista e idioma.
- Menú hamburguesa con foco gestionado, cierre mediante Escape y devolución del foco al disparador.
- CTA de lista visible en el catálogo.
- WhatsApp flotante colocado por encima de áreas seguras y controles del sistema.

## 8. Dirección visual

La estética es editorial, natural y local: fotografía amplia, tipografía con personalidad, textura sutil y espacio en blanco. La paleta final se deriva del logo y las fotografías reales. Hasta recibirlos, la demo usa variables de diseño provisionales fácilmente sustituibles.

Se evita:

- apariencia de plantilla de frutería;
- exceso de tarjetas, insignias o iconos;
- gradientes decorativos sin función;
- animaciones llamativas;
- patrones visuales de SaaS o checkout;
- imágenes de stock presentadas como si fueran Bionatura.

Los recursos provisionales se rotulan en la demo como material de muestra y nunca se publican como prueba documental del negocio.

## 9. Experiencia por página

### 9.1 Inicio

El primer viewport responde a qué es Bionatura, qué ofrece, dónde actúa y cómo funciona. Incluye fotografía protagonista, H1 descriptivo local, CTA primario «Prepara tu pedido» y CTA secundario «Ver catálogo».

El recorrido continúa con:

- temporada actual y productos destacados;
- explicación en tres pasos;
- producto habitual/todo el año;
- bloque humano sobre Miguel/proyecto únicamente cuando el dato y texto estén confirmados;
- selección breve de galería;
- recogida y contacto sin datos inventados;
- recordatorio de disponibilidad orientativa.

### 9.2 Catálogo

El HTML contiene las cuatro temporadas y los productos habituales para que el contenido esencial exista sin depender de JavaScript. Al hidratarse la interacción, se destaca automáticamente la temporada meteorológica correspondiente al mes en la zona `Europe/Madrid`:

- primavera: marzo-mayo;
- verano: junio-agosto;
- otoño: septiembre-noviembre;
- invierno: diciembre-febrero.

La interfaz se presenta como cuatro pestañas grandes integradas en una composición circular o arqueada solo a nivel visual. Funcionalmente usa el patrón ARIA de tabs, admite teclado, muestra foco visible y no depende de gestos.

Cada producto muestra nombre, imagen, descripción breve y selector de cantidad. El precio está ausente por defecto. Si se añade después, el modelo admite importe, moneda y texto aclaratorio sin hacer obligatorio el campo.

Tras la selección estacional aparece «Productos disponibles durante todo el año», visual y semánticamente separada.

### 9.3 Lista

La lista es una herramienta local en el navegador:

- añadir producto y cantidad válida;
- modificar cantidad;
- eliminar producto;
- vaciar lista mediante confirmación no destructiva accidental;
- contar artículos seleccionados;
- conservar selección en `localStorage` con versión de esquema;
- funcionar sin cuenta ni transmisión de datos a Bionatura.

En móvil se abre como panel inferior o página/diálogo de ancho completo; en desktop como panel lateral. La semántica y acciones son las mismas.

Antes del CTA se muestra de forma prominente: el catálogo es orientativo; enviar la lista no confirma disponibilidad ni recogida.

### 9.4 WhatsApp

El CTA «Consultar por WhatsApp» valida que la lista no esté vacía y que exista un número confirmado. Genera una URL `https://wa.me/<numero>?text=<mensaje-codificado>` y la abre por acción explícita del usuario. Nunca envía el mensaje automáticamente.

Estructura del mensaje localizado:

1. saludo e identificación de Bionatura.es;
2. lista con un producto y cantidad por línea;
3. pregunta por disponibilidad;
4. petición de confirmación de recogida.

Si el número sigue pendiente durante la demo, el control aparece en modo demostración y muestra el mensaje generado para copiar, sin abrir un destinatario inventado.

### 9.5 Cómo funciona

Explica:

1. Consulta lo que suele haber.
2. Prepara tu lista.
3. Escribe y acuerda la recogida.

Aclara que no existe entrega inmediata ni checkout y que la disponibilidad se confirma personalmente.

### 9.6 Galería

La galería organiza fotografías por historias: huerto, productos, preparación, Bionatura y día a día. Incluye introducciones breves y no es un grid masivo sin contexto. Las primeras imágenes prioritarias cargan de forma normal; el resto usa lazy loading.

El lightbox solo se incorpora si puede implementarse con diálogo nativo/accesible y poco JavaScript. Los vídeos usan póster, metadatos mínimos y carga tras interacción; no reproducen automáticamente.

### 9.7 Nosotros

Cuenta la historia, la persona, el huerto y la filosofía mediante contenido breve y 2-4 imágenes. Enlaza a Galería sin duplicarla. Cualquier afirmación sobre certificación, origen, trayectoria o prácticas productivas requiere confirmación.

### 9.8 Contacto

Prioriza WhatsApp y muestra únicamente datos validados. La información de recogida evita lenguaje de tienda abierta al público si no corresponde. Mientras falten datos, la demo usa rótulos visibles «Dato pendiente de confirmar» y no publica valores encontrados en directorios externos.

### 9.9 Legales

Se crean plantillas estructurales con campos marcados como pendientes de validación del cliente/asesoría: titular, NIF/CIF, domicilio, contacto, actividad, privacidad y condiciones aplicables. No se redactan afirmaciones jurídicas definitivas ni se inventan datos.

## 10. Modelo de datos del catálogo

Cada producto contiene:

```ts
type Locale = 'es' | 'en' | 'fi' | 'da';
type Season = 'spring' | 'summer' | 'autumn' | 'winter';
type Unit = 'g' | 'kg' | 'unit' | 'dozen' | 'custom';

interface QuantityOption {
  id: string;
  value: number | string;
  unit: Unit;
  labels?: Partial<Record<Locale, string>>;
}

interface Product {
  id: string;
  slug: Record<Locale, string>;
  name: Record<Locale, string>;
  shortDescription: Record<Locale, string>;
  categoryId: string;
  seasons: Season[];
  alwaysAvailable: boolean;
  quantityOptions: QuantityOption[];
  allowCustomQuantity: boolean;
  imageId: string;
  imageAlt: Record<Locale, string>;
  featured: boolean;
  price?: {
    amount: number;
    currency: 'EUR';
    unitLabel: Partial<Record<Locale, string>>;
  };
  demoOnly?: boolean;
}
```

Reglas:

- `alwaysAvailable` y `seasons` se validan para evitar clasificación contradictoria.
- Los productos de demo llevan `demoOnly: true` y una etiqueta visible.
- La cantidad personalizada exige valor no vacío, longitud limitada y caracteres seguros; se trata como texto humano, no se evalúa.
- Los identificadores internos permanecen estables aunque cambien traducciones o slugs.

## 11. SEO

### 11.1 Objetivos

La prioridad inicial es consolidar relevancia para combinaciones naturales relacionadas con Bionatura, Fuengirola, producto bio/natural, frutas y verduras, temporada, huerto local y recogida. No se repiten palabras clave de forma artificial.

### 11.2 SEO on-page y técnico

- Un `title`, meta description y H1 únicos por URL e idioma.
- Jerarquía H1/H2/H3 semántica.
- Canonical absoluto y conjunto hreflang completo.
- Open Graph y metadatos sociales localizados.
- URLs limpias, sitemap y robots.
- Breadcrumbs visibles y `BreadcrumbList` en páginas interiores cuando ayuden a orientación.
- Enlazado entre Inicio, Catálogo, Cómo funciona, Nosotros, Galería y Contacto.
- Contenido principal presente en HTML generado.
- Página 404 estática útil y localizada o neutral.

### 11.3 Datos estructurados

- `Organization` con nombre, URL y logo cuando estén confirmados.
- `LocalBusiness` solo cuando la naturaleza exacta de la actividad, teléfono, zona/dirección y demás propiedades públicas estén validadas; no se marca una tienda física inexistente.
- `BreadcrumbList` donde exista breadcrumb visible.
- No se usa `Product`/`Offer` mientras no haya páginas de producto, oferta o precio mantenido.
- No se inventan reseñas, calificaciones, horarios, dirección ni certificaciones.

### 11.4 Imágenes

- nombres descriptivos y estables;
- alt localizado que describe la imagen sin relleno de keywords;
- anchura y altura explícitas;
- `srcset`/`sizes` y formatos modernos;
- compresión adaptada al uso;
- eager/high priority solo para la imagen LCP;
- lazy loading para contenido fuera del primer viewport.

## 12. Rendimiento y accesibilidad

Objetivos de aceptación en móvil sobre la preview optimizada:

- Lighthouse Performance, Accessibility, Best Practices y SEO: 90 o superior como objetivo, investigando cualquier regresión.
- LCP inferior a 2,5 s, CLS inferior a 0,1 e INP inferior a 200 ms en condiciones de laboratorio representativas; la validación de campo llegará tras producción.
- JavaScript inicial reducido a las interacciones necesarias.
- Sin fuentes bloqueantes innecesarias ni dependencias pesadas.

Accesibilidad:

- navegación completa por teclado;
- enlace «Saltar al contenido»;
- landmarks y encabezados semánticos;
- foco visible y contraste WCAG AA;
- botones reales para acciones y enlaces para navegación;
- labels e instrucciones asociadas a cantidades;
- anuncios no intrusivos mediante región `aria-live` al añadir/eliminar;
- soporte `prefers-reduced-motion`;
- tabs de temporada, menú, panel de lista y lightbox accesibles.

## 13. Privacidad y seguridad

- La lista permanece en el dispositivo hasta que el usuario decide abrir WhatsApp.
- No se recopilan datos personales en la web del MVP.
- No hay formulario ni analítica por defecto.
- Los enlaces externos aplican atributos seguros cuando abren otra pestaña.
- Los valores introducidos en cantidad personalizada se normalizan antes de incorporarlos al mensaje.
- Si se añade analítica o contenido embebido, se revisan consentimiento y política antes de producción.

## 14. Estrategia de pruebas

- Pruebas unitarias del cálculo de temporadas, incluyendo límites de meses.
- Pruebas unitarias de operaciones de lista, migración/invalidación de almacenamiento y mensajes por idioma.
- Pruebas de build para las cuatro variantes lingüísticas, sitemap, canonical y hreflang.
- Pruebas end-to-end móviles y desktop del flujo: catálogo → cantidad → lista → editar → WhatsApp/copiar.
- Comprobaciones de teclado para navegación, tabs, menú y panel de lista.
- Auditoría automatizada de accesibilidad en rutas principales.
- Verificación visual responsive en tamaños móviles, tablet y desktop.
- Lighthouse y comprobación de enlaces rotos antes de la demo.

## 15. Despliegue

1. Crear repositorio GitHub con rama principal protegida en la medida apropiada para un proyecto pequeño.
2. Conectar el repositorio a Vercel.
3. Generar preview por rama/pull request.
4. Mantener `bionatura.es` sin cambios durante la demo.
5. Cuando existan autorización y acceso DNS, verificar dominio en Vercel, añadir registros requeridos, conservar rollback y comprobar HTTPS/canonical antes de producción.

No se cambia DNS ni se reemplaza la web existente sin autorización expresa.

## 16. Datos y recursos pendientes

Los siguientes elementos tienen estado explícito `pendingValidation` y bloquean su publicación como información real, pero no el desarrollo:

- archivo fuente del logo y reglas de uso;
- fotografías y vídeos originales;
- número definitivo de WhatsApp y teléfono;
- email;
- horario;
- instrucciones y ubicación exacta de recogida;
- nombre/razón jurídica, NIF/CIF y domicilio legal;
- listado definitivo de productos, categorías, temporadas y unidades;
- textos definitivos sobre historia, cultivo, procedencia y certificaciones;
- decisiones sobre analítica y cookies.

La información visible en la web pública actual o en directorios de terceros puede servir para localizar recursos visuales, pero no se considera verificada para copy, contacto, Schema.org ni textos legales.

## 17. Criterios de aceptación de la demo

- Todas las rutas principales existen en los cuatro idiomas y permiten cambiar a su equivalente.
- La navegación y CTA funcionan en móvil y desktop.
- El catálogo muestra automáticamente otoño el 11 de septiembre y permite abrir las otras estaciones.
- Todo el contenido de temporadas existe en el HTML generado.
- Un usuario puede seleccionar productos de demo, modificar la lista y generar/ver el mensaje localizado.
- La interfaz afirma claramente que la consulta no confirma pedido, stock ni recogida.
- Ningún dato comercial, jurídico o productivo no confirmado se presenta como real.
- El build estático finaliza sin errores, los tests críticos pasan y existe una preview accesible en Vercel.
- No se realizan cambios DNS.

## 18. Referencias técnicas

- Google Search Central, datos estructurados de negocios locales: <https://developers.google.com/search/docs/appearance/structured-data/local-business>
- Google Search Central, datos de organización: <https://developers.google.com/search/docs/appearance/structured-data/organization>
- Astro, colecciones y contenido estático: <https://docs.astro.build/en/guides/content-collections/>
