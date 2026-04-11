import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Edit2Icon } from "lucide-react"
import AccessDenied from "@/components/access-denied"
import { Badge } from "@/components/ui/badge"

type Role = {
  _id: string
  role: string
}

type User = {
  _id: string
  name: string
  email: string
  profile: string
  roleId?: Role[]
  contact: string
  address: string
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user")
      if (userData) {
        const parsedData = JSON.parse(userData)
        setUser(parsedData.user)
      }
    } catch (err) {
      console.error("Invalid user in localStorage")
    }
  }, [])

  // ✅ loading state
  if (!user) {
    return <AccessDenied user={"Guest"} />
  }

  return (
    <div className="flex items-center md:flex-row flex-col justify-start gap-2 p-3">
      {
        user.roleId?.length ? (
          <div className="md:w-1/2 w-full flex justify-start">
            <div className="w-full max-w-auto h-85 border shadow-xs rounded-xs p-5 bg-background">

              {/* Header with button */}
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{user.roleId[0]?.role || "GUEST"} Profile</h3>

                <Button size="sm" className="px-3 py-2 border border-[#6096ff] bg-transparent text-[#6096ff] hover:bg-[#6096ff] hover:text-white rounded-xs transition">
                  <Link to={`/dashboard/users/${user._id}`}>
                    <Edit2Icon />
                  </Link>
                </Button>
              </div>

              {/* Profile */}
              <div className="flex items-center gap-6">
                <img
                  src={user.profile}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover border-3 border-[#6096ff]"
                />

                <div>
                  <h2 className="text-2xl font-bold text-gray-400">
                    {user.name}
                  </h2>
                  <p className="text-gray-500">{user.email}</p>
                </div>
              </div>

              {/* Divider */}
              <div className="my-3 border-t" />

              {/* Details */}
              <div className="flex flex-col gap-2">
                <div>
                  <p className="text-sm text-gray-400">ID</p>
                  <p className="font-medium text-[#6096ff] break-all">{user._id}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Roles</p>
                  <div className="flex flex-wrap gap-2">
                    {user.roleId?.length ? (
                      user.roleId.map((role) => (
                        <Button
                          key={role._id}
                          className="text-sm font-semibold bg-[#6096ff] text-white border px-2 py-1 rounded-xs"
                          variant='ghost'
                        >
                          {role.role}
                        </Button>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">
                        No roles assigned
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="md:w-1/2 w-full border shadow-xs rounded-xs p-5">
            {/* Header */}
            <div className="flex mb-1 items-center justify-between">
              <h3 className="text-lg font-semibold">User Profile</h3>
              <Button className="px-3 py-2 bg-transparent text-[#6096ff] border border-[#6096ff] hover:bg-[#6096ff] hover:text-white rounded-xs transition">
                <Link to={`/dashboard/profile/${user._id}`}><Edit2Icon /></Link>
              </Button>
            </div>
            <div className="flex items-center gap-6">
              <div>
                {user.profile ? (
                  <img
                    src={user.profile}
                    alt={user.name}
                    className="md:w-24 md:h-24 h-16 w-16 rounded-full object-cover border-3 border-[#6096ff]"
                  />
                ) : (
                  ""
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-400">
                  {user.name}
                </h2>
                <p className="text-gray-500">{user.email}</p>
                <p className="text-gray-500">+91 {user.contact}</p>
              </div>
            </div>

            {/* Divider */}
            <div className=" my-2 border-t" />

            {/* Details */}
            <div className="flex flex-col items-start justify-center gap-2">
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{user.address}</p>
                <p className="text-sm text-gray-500">User ID</p>
                <p className="font-medium">{user._id}</p>
              </div>
              <Badge variant='outline' className="bg-[#6096ff] p-2 px-5 cursor-pointer">
                <Link to={`/dashboard/orders`} className="text-sm text-white">Your Orders</Link>
              </Badge>
            </div>
          </div>
        )
      }
    </div>
  )
}