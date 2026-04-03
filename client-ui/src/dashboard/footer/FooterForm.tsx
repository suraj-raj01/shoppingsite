import axios from "axios"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import BASE_URL from "@/Config"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function FooterForm() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [form, setForm] = useState({
        aboutTitle: "",
        aboutDesc: "",
        contactTitle: "",
        contactDesc: "",
        followus: "",
        icons: [{ title: "", url: "" }],
        copyright: ""
    })

    const [loading, setLoading] = useState(false)

    // ================= FETCH FOR EDIT =================
    useEffect(() => {
        if (!id) return

        const fetchFooter = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/admin/footer/${id}`)
                const data = res.data?.data
                setForm({
                    aboutTitle: data.aboutTitle || "",
                    aboutDesc: data.aboutDesc || "",
                    contactTitle: data.contactTitle || "",
                    contactDesc: data.contactDesc || "",
                    followus: data.followus || "",
                    icons: data.icons?.length ? data.icons : [{ title: "", url: "" }],
                    copyright: data.copyright || ""
                })
            } catch (err) {
                console.error(err)
            }
        }

        fetchFooter()
    }, [id])

    // ================= HANDLE CHANGE =================
    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    // ================= ICON CHANGE =================
    const handleIconChange = (index: number, field: "title" | "url", value: string) => {
        const updatedIcons = [...form.icons]
        updatedIcons[index][field] = value
        setForm({ ...form, icons: updatedIcons })
    }

    const addIcon = () => {
        setForm({
            ...form,
            icons: [...form.icons, { title: "", url: "" }]
        })
    }

    const removeIcon = (index: number) => {
        const updatedIcons = form.icons.filter((_, i) => i !== index)
        setForm({ ...form, icons: updatedIcons })
    }

    // ================= SUBMIT =================
    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (id) {
                await axios.patch(`${BASE_URL}/api/admin/footer/${id}`, form)
                toast.success("Footer updated successfully")
            } else {
                await axios.post(`${BASE_URL}/api/admin/footer`, form)
                toast.success("Footer created successfully")
            }
            navigate("/dashboard/footertable")
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-3 w-full">
            <div className="flex justify-between items-center mb-4">
                <div>
                    {loading ? (
                        <>
                            <Skeleton className="h-9 w-32 mb-2" />
                            <Skeleton className="h-5 w-48" />
                        </>
                    ) : (
                        <>
                            <h1 className="text-3xl font-bold">Footer</h1>
                            <p className="text-muted-foreground">
                                Manage footer section
                            </p>
                        </>
                    )}
                </div>

                <Button onClick={() => navigate("/dashboard/footertable")}>
                    Footer Table
                </Button>
            </div>

            <div className="p-4 mt-6 max-w-full border mx-auto">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className='md:col-span-1 col-span-2'>
                        <Label>About Title</Label>
                        <Input name="aboutTitle" value={form.aboutTitle} onChange={handleChange} />
                    </div>

                    <div className='md:col-span-1 col-span-2'>
                        <Label>Contact Title</Label>
                        <Input name="contactTitle" value={form.contactTitle} onChange={handleChange} />
                    </div>
                    <div className='md:col-span-1 col-span-2'>
                        <Label>About Description</Label>
                        <Textarea name="aboutDesc" value={form.aboutDesc} onChange={handleChange} />
                    </div>

                    <div className='md:col-span-1 col-span-2'>
                        <Label>Contact Description</Label>
                        <Textarea name="contactDesc" value={form.contactDesc} onChange={handleChange} />
                    </div>

                    <div className='md:col-span-1 col-span-2'>
                        <Label>Follow Us Text</Label>
                        <Input name="followus" value={form.followus} onChange={handleChange} />
                    </div>
                    <div className='md:col-span-1 col-span-2'>
                        <Label>Copyright</Label>
                        <Textarea name="copyright" value={form.copyright} onChange={handleChange} />
                    </div>

                    {/* ICONS */}
                    <div className="col-span-2">
                        <Label>Social Icons</Label>

                        {form.icons.map((icon, index) => (
                            <div
                                key={index}
                                className="space-y-2 grid grid-cols-1 md:grid-cols-2 md:gap-4 border p-3 rounded-xs mb-3"
                            >
                                <Input
                                    placeholder="Title (e.g. Facebook)"
                                    value={icon.title}
                                    onChange={(e) =>
                                        handleIconChange(index, "title", e.target.value)
                                    }
                                />

                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Input
                                        placeholder="https://facebook.com"
                                        value={icon.url}
                                        onChange={(e) =>
                                            handleIconChange(index, "url", e.target.value)
                                        }
                                        className="flex-1"
                                    />

                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => removeIcon(index)}
                                        className="w-full sm:w-auto"
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))}

                        <Button
                            type="button"
                            onClick={addIcon}
                            className="w-full sm:w-auto"
                        >
                            + Add Icon
                        </Button>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full col-span-2">
                        {loading ? "Saving..." : id ? "Update Footer" : "Create Footer"}
                    </Button>

                </form>
            </div>
        </div>
    )
}