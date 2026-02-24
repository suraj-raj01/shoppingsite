import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTranslation } from "react-i18next"

export default function Translation() {
  const { i18n, t } = useTranslation()

  const changeLang = (lang: string) => {
    i18n.changeLanguage(lang)
    localStorage.setItem("lang", lang)
  }

  return (
    <Select
      value={i18n.resolvedLanguage}
      onValueChange={changeLang}
    >
      <SelectTrigger className="w-fit shadow-none border">
        <SelectValue placeholder={t("language")} />
      </SelectTrigger>

      <SelectContent className="w-auto">
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="hi">हिंदी</SelectItem>
        <SelectItem value="bn">বাংলা</SelectItem>
      </SelectContent>
    </Select>
  )
}