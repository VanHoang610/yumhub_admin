// src/component/layouts/defaultLayout/header/Setting/Context/LanguageContext.js
import React, { createContext, useState, useContext } from 'react';
import  i18next  from "../../../../../../i18n";

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // Default language

  const switchLanguage = (lang) => {
    setLanguage(lang);
    i18next.changeLanguage(lang); // Cập nhật ngôn ngữ trong i18next
  };

  return (
    <LanguageContext.Provider value={{ language, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
