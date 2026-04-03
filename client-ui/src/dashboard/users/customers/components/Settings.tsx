import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function Settings() {

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        newPassword: "",
    })

    const [preferences, setPreferences] = useState({
        notifications: true,
        darkMode: false,
    })

    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSave = async () => {
        setLoading(true)

        try {
            // 🔥 Replace with API call
            await new Promise((res) => setTimeout(res, 1000))
            alert("Settings saved successfully ✅")
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-3">
            <section className="max-w-2xl bg-white p-5 rounded-xs shadow-sm border space-y-4">

                <h2 className="text-xl font-semibold">Account Settings</h2>

                {/* PROFILE */}
                <div className="space-y-2">
                    <h3 className="text-md font-medium">Profile Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            name="name"
                            placeholder="Full Name"
                            value={form.name}
                            onChange={handleChange}
                        />
                        <Input
                            name="email"
                            placeholder="Email Address"
                            value={form.email}
                            onChange={handleChange}
                        />
                        <Input
                            name="phone"
                            placeholder="Phone Number"
                            value={form.phone}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <Separator />

                {/* PASSWORD */}
                <div className="space-y-2">
                    <h3 className="text-md font-medium">Change Password</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            type="password"
                            name="password"
                            placeholder="Current Password"
                            value={form.password}
                            onChange={handleChange}
                        />
                        <Input
                            type="password"
                            name="newPassword"
                            placeholder="New Password"
                            value={form.newPassword}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <Separator />

                {/* PREFERENCES */}
                <div className="space-y-2">
                    <h3 className="text-md font-medium">Preferences</h3>

                    <div className="flex items-center justify-between">
                        <Label>Enable Notifications</Label>
                        <Switch
                            checked={preferences.notifications}
                            onCheckedChange={(val) =>
                                setPreferences({ ...preferences, notifications: val })
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label>Dark Mode</Label>
                        <Switch
                            checked={preferences.darkMode}
                            onCheckedChange={(val) =>
                                setPreferences({ ...preferences, darkMode: val })
                            }
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