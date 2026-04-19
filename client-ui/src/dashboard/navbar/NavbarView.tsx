import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import BASE_URL from "@/Config"
import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

type Navbar = {
  _id: string
  loacation:string
  signin:string
  logo:string
}

export default function NavbarView() {

  const [navbar, setNavbar] = useState<Navbar | null>(null)
  const [loading, setLoading] = useState(true)

  const { id } = useParams()

  const fetchCategory = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/navbar/${id}`)
      setNavbar(res.data?.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchCategory()
  }, [id])

  if (loading) return <div className="p-3"><Skeleton className="h-15 w-full border"></Skeleton></div>

  if (!navbar) return <div className="p-4">Navbar not found</div>

  return (
    <section className="p-3">
      <div className="flex bg-card items-center justify-between px-3 shadow-sm">
        <img src={navbar.logo} alt="navbar" className="h-14 p-1"/>
        <Button>
          <Link to='/auth/adminlogin'>{navbar?.signin}</Link>
        </Button>
    </div>
    </section>
  )
}


