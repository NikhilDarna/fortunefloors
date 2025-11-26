// src/context/LanguageContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en"); // default English
  const [translatedHTML, setTranslatedHTML] = useState("");

  // Function to translate the entire HTML body
  const translatePage = async (lang) => {
    if (lang === "en") {
      window.location.reload(); // reset to original English
      return;
    }

    try {
      const text = document.body.innerText;
      const response = await axios.post("https://libretranslate.com/translate", {
        q: text,
        source: "en",
        target: lang,
        format: "text",
      });

      const translatedText = response.data.translatedText;
      // Replace the visible text with translated text
      document.body.innerText = translatedText;
      setTranslatedHTML(translatedText);
    } catch (error) {
      console.error("Translation failed:", error);
    }
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    translatePage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
