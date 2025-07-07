import React, {createContext, useContext, useEffect, useState} from 'react';
import * as SecureStore from 'expo-secure-store';
import i18n from '@/locales/i18n';

type Lang = 'en' | 'nl';
interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: typeof i18n.t;          // so consumers can call ctx.t()
}

const LanguageCtx = createContext<Ctx>({
  lang: 'en',
  setLang: () => {},
  t: i18n.t.bind(i18n),
});

export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [lang, setLangState] = useState<Lang>('en');

  // first load: read SecureStore or keep device default
  useEffect(() => {
    (async () => {
      const stored = await SecureStore.getItemAsync('lang');
      if (stored === 'nl' || stored === 'en') apply(stored as Lang);
    })();
  }, []);

  const apply = (l: Lang) => {
    i18n.locale = l;               // tell i18n
    setLangState(l);               // update context → re-render tree
    SecureStore.setItemAsync('lang', l).catch(() => {});
  };

  return (
    <LanguageCtx.Provider value={{lang, setLang: apply, t: i18n.t.bind(i18n)}}>
      {children}
    </LanguageCtx.Provider>
  );
};

export const useLanguage = () => useContext(LanguageCtx);
