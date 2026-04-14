"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BASE_URL from "@/Config";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const enquirySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  contact: z.string().regex(/^[0-9]{10}$/, "Contact must be 10 digits"),
});

export default function EnquiryForm({ setEnquiry }: any) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
  });

  // ✅ store field errors
  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    // ✅ clear error on typing
    setErrors((prev: any) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = enquirySchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: any = {};

      result.error.issues.forEach((err) => {
        const field = err.path[0];
        fieldErrors[field] = err.message;
      });

      setErrors(fieldErrors);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${BASE_URL}/api/enquiry`, form);

      localStorage.setItem("enquiry", JSON.stringify(res.data.data[0]));
      setEnquiry(res.data.data[0]);

      setForm({ name: "", email: "", contact: "" });
      setErrors({}); // reset errors

      toast.success(res.data.message || "Enquiry submitted ✅");
    } catch (err) {
      toast.error("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="md:p-12 p-5">
      <form
        onSubmit={handleSubmit}
        className="border p-5 rounded-md space-y-4 py-10"
      >
        {/* Name */}
        <div>
          <label className="text-sm">Name</label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
            disabled={loading}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="text-sm">Email</label>
          <Input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            disabled={loading}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Contact */}
        <div>
          <label className="text-sm">Contact</label>
          <Input
            name="contact"
            value={form.contact}
            onChange={handleChange}
            placeholder="Enter 10-digit mobile number"
            disabled={loading}
            className={errors.contact ? "border-red-500" : ""}
          />
          {errors.contact && (
            <p className="text-xs text-red-500 mt-1">
              {errors.contact}
            </p>
          )}
        </div>

        <Button type="submit" disabled={loading} className="w-full mt-3">
          {loading ? "Submitting..." : "Start Chat"}
        </Button>
      </form>
    </section>
  );
}