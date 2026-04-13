import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BASE_URL from "@/Config";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

export default function EnquiryForm({ setEnquiry }: any) {
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        contact: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            const res = await axios.post(`${BASE_URL}/api/enquiry`, form);

            // ✅ Save globally
            localStorage.setItem("enquiry", JSON.stringify(form));

            // ✅ Update parent (IMPORTANT)
            setEnquiry(form);

            setForm({
                name: "",
                email: "",
                contact: "",
            });

            toast.success(res.data.message || "Enquiry submitted ✅");
        } catch (err:any) {
            console.log(err)
            toast.error("Something went wrong ❌");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="md:p-12 p-5">
            <form
                onSubmit={handleSubmit}
                className="border p-5 rounded-md space-y-2 py-10"
            >
                <div>
                    <label className="text-sm">Name</label>
                    <Input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="text-sm">Email</label>
                    <Input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="text-sm">Contact</label>
                    <Input
                        name="contact"
                        value={form.contact}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>

                <Button type="submit" disabled={loading} className="w-full mt-3">
                    {loading ? "Submitting..." : "Start Chat"}
                </Button>
            </form>
        </section>
    );
}