import i18n from "i18next"
import { initReactI18next } from "react-i18next"

const resources = {
  en: {
    translation: {
      welcome: "Welcome",
    },
  },
  hi: {
    translation: {
      welcome: "स्वागत है",
    },
  },
  bn: {
    translation: {
      welcome: "স্বাগতম",
    },
  },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem("lang") || "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n