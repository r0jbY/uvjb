import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import en from './en.json';
import nl from './nl.json';

const i18n = new I18n({ en, nl });
i18n.enableFallback = true;
i18n.defaultLocale  = 'en';

// Choose the correct API depending on the Expo SDK
const deviceLocale =
  (Localization as any).getLocales?.()[0]?.languageTag   // SDK 49 +
  || (Localization as any).locale                         // older SDKs
  || 'en';

i18n.locale = deviceLocale;

export default i18n;
