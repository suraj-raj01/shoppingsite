import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import axios from "axios"
import BASE_URL from "@/Config"
import { useNavigate } from "react-router-dom"
import { useTheme } from "@/components/theme-provider"

export default function Settings() {
    const { setTheme } = useTheme();
    const [user, setUser] = useState<any>(null)

    const [form, setForm] = useState({
        notification: false,
        theme: false // ✅ boolean (false = light, true = dark)
    })

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    // ✅ LOAD USER

    const loadUser = async () => {
        try {
            const userData = localStorage.getItem("user");

            if (userData) {
                const parsed = JSON.parse(userData);
                const user = parsed.user;

                setUser(user);

                setForm({
                    notification: user.notification ?? false,
                    theme: user.theme ?? false,
                });

                // ✅ apply theme
                setTheme(user.theme ? "dark" : "light");
            }
        } catch (err) {
            console.error("Invalid user in localStorage");
        }
    }; 

    useEffect(() => {
        loadUser()
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
                form, 
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )

            // ✅ update localStorage AFTER success
            const updatedUser = {
                ...user,
                notification: form.notification,
                theme: form.theme,
            };

            localStorage.setItem("user", JSON.stringify({ user: updatedUser }));
            setUser(updatedUser);

            // ✅ apply theme
            setTheme(form.theme ? "dark" : "light");
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
            <section className="max-w-xl p-5 rounded-sm shadow-sm border space-y-4">

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
                            onCheckedChange={(val) => {
                                setForm(prev => ({ ...prev, theme: val }));
                                setTheme(val ? "dark" : "light"); // instant apply
                            }}
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