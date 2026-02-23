import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTranslation } from "react-i18next"

export default function Translation() {
  const { i18n } = useTranslation()

  const changeLang = (lang: string) => {
    if (i18n?.changeLanguage) {
      i18n.changeLanguage(lang)
      localStorage.setItem("lang", lang)
    }
  }

  return (
    <Select
      value={i18n.resolvedLanguage || "en"}
      onValueChange={changeLang}
    >
      <SelectTrigger className="w-fit shadow-none">
        <SelectValue placeholder="Language" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="hi">हिंदी</SelectItem>
        <SelectItem value="bn">বাংলা</SelectItem>
      </SelectContent>
    </Select>
  )
}