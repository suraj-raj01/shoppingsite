import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import axios from "axios"
import BASE_URL from "@/Config"
import { useNavigate } from "react-router-dom"

export default function Settings() {

    const [user, setUser] = useState<any>(null)

    const [form, setForm] = useState({
        notification: false,
        theme: false
    })

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    // ✅ LOAD USER
    useEffect(() => {
        try {
            const userData = localStorage.getItem("user")
            if (userData) {
                const parsed = JSON.parse(userData)
                setUser(parsed.user)

                // initialize form here
                setForm({
                    notification: parsed.user.notification,
                    theme: parsed.user.theme
                })
            }
        } catch (err) {
            console.error("Invalid user in localStorage")
        }
    }, [])

    // ✅ TOGGLE
    const handleToggle = (field: "notification" | "theme", value: boolean) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    // ✅ SAVE
    const handleSave = async () => {
        if (!user?._id) return

        setLoading(true)

        try {
            await axios.patch(
                `${BASE_URL}/api/customers/profile-setting/${user._id}`,
                form
            )

            // ✅ update localStorage AFTER success
            const updatedUser = {
                ...user,
                notification: form.notification,
                theme: form.theme
            }

            localStorage.setItem("user", JSON.stringify({ user: updatedUser }))
            setUser(updatedUser)

            toast.success("Settings saved successfully ✅")
            navigate("/dashboard")

        } catch (err: any) {
            console.error(err)
            toast.error(err?.response?.data?.message || "Something went wrong ❌")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-3">
            <section className="max-w-xl p-5 rounded-xs shadow-sm border space-y-4">

                <h2 className="text-xl font-semibold">Account Settings</h2>

                <Separator />

                {/* PREFERENCES */}
                <div className="space-y-2">
                    <h3 className="text-md font-medium">Preferences</h3>

                    <div className="flex items-center justify-between">
                        <Label>Enable Notifications</Label>
                        <Switch
                            checked={form.notification}
                            onCheckedChange={(val) => handleToggle("notification", val)}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label>Dark Mode</Label>
                        <Switch
                            checked={form.theme}
                            onCheckedChange={(val) => handleToggle("theme", val)}
                        />
                    </div>
                </div>

                {/* SAVE BUTTON */}
                <Button onClick={handleSave} disabled={loading} className="w-full">
                    {loading ? "Saving..." : "Save Changes"}
                </Button>

            </section>
        </div>
    )
}