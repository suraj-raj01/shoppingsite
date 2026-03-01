import { createContext, useContext, useEffect, useState } from "react"

type User = {
  _id?: string
  name?: string
  email?: string
  contact?: string
  address?: string
  profile?: string
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  login: (userData: User) => void
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

// ✅ Provider
export function LoginProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // ✅ restore user on refresh
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user")
      if (stored) {
        const parsed = JSON.parse(stored)
        setUser(parsed.user || parsed)
      }
    } catch (err) {
      console.error("Invalid user in localStorage")
    } finally {
      setLoading(false)
    }
  }, [])

  // ✅ login
  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify({ user: userData }))
  }

  // ✅ logout
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// ✅ custom hook (VERY IMPORTANT)
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used inside LoginProvider")
  }
  return context
}