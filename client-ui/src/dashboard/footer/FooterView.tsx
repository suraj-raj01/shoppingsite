import BASE_URL from "@/Config"
import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { icons } from "lucide-react";

type Icon = {
  _id: string
  title: string
  url: string
}

type FooterType = {
  _id: string
  aboutTitle: string
  aboutDesc: string
  contactTitle: string
  contactDesc: string
  followus: string
  icons: Icon[]
  copyright: string
}

export default function FooterView() {

  const [footer, setFooter] = useState<FooterType | null>(null)
  const [loading, setLoading] = useState(true)

  const { id } = useParams()

  const fetchFooter = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/footer/${id}`)
      setFooter(res.data.data) // ✅ FIXED
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchFooter()
  }, [id])

  if (loading) return <div className="p-4">Loading Footer...</div>

  if (!footer) return <div className="p-4">Footer not found</div>

  return (
    <div className="p-4 space-y-4">

      <h1 className="text-2xl font-bold">Footer Preview</h1>

      <div>
        <h2 className="font-semibold">{footer.aboutTitle}</h2>
        <p>{footer.aboutDesc}</p>
      </div>

      <div>
        <h2 className="font-semibold">{footer.contactTitle}</h2>
        <p className="whitespace-pre-line">{footer.contactDesc}</p>
      </div>

      <div>
        <h2 className="font-semibold">{footer.followus}</h2>
        <div className="flex flex-wrap gap-3 mt-2">
          {footer?.icons.map((icon, i) => {
            const IconComponent = icons[icon.title as keyof typeof icons];
            return (
              <Link
                key={i}
                to={icon.url}
                className="border border-gray-500 p-2 h-10 w-10 flex items-center justify-center rounded-full hover:bg-background hover:text-[#6096ff] transition"
              >
                {IconComponent ? <IconComponent size={18} className="capitalize" /> : <span className="">{icon.title}</span>}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="text-sm text-muted-foreground border-t pt-2">
        {footer.copyright}
      </div>

      {/* Debug */}
      <pre className="text-xs bg-green-100 p-2 rounded-xs">
        {JSON.stringify(footer, null, 2)}
      </pre>
    </div>
  )
}