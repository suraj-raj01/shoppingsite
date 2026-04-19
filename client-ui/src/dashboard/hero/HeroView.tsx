import { Button } from "@/components/ui/button"
import BASE_URL from "@/Config"
import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

type Hero = {
  _id: string
  image: string
  title: string
  description: string
  link: string
}

export default function HeroView() {

  const [hero, setHero] = useState<Hero | null>(null)
  const [loading, setLoading] = useState(true)

  const { id } = useParams()

  const fetchCategory = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/heroes/${id}`)
      setHero(res.data?.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchCategory()
  }, [id])

  if (loading) return <div className="p-4">Loading hero...</div>

  if (!hero) return <div className="p-4">Category not found</div>

  return (
    <div className="p-3">
      <img src={hero.image} alt="hero" />
      <div className="flex items-start mt-2 flex-col justify-center">
        <p className="text-2xl font-bold">{hero.title}</p>
        <p className="text-sm mb-2">{hero.description}</p>
        <Button><Link to={hero.link}>Shop Now</Link></Button>
      </div>
    </div>
  )
}


