import { useEffect, useState } from "react"
import axios from "axios"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import BASE_URL from "@/Config"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

// ✅ validation schema
const userSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email(),
  contact: z
    .string()
    .regex(/^[0-9]{10,15}$/, "Enter valid contact number"),
  password: z.string().optional(),
  address: z.string().optional(),
  profile: z.string().optional(),
})

type UserFormValues = z.infer<typeof userSchema>

type Props = {
  editData?: any
  onSuccess?: () => void
}

export default function UpdateUserForm({ editData, onSuccess }: Props) {
  const isEdit = !!editData
  const navigate = useNavigate()

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState("")
  const [imageLoading, setImageLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      contact: "",
      address: "",
      profile: "",
    },
  })

  // ✅ preload edit data
  useEffect(() => {
    if (editData) {
      form.reset({
        name: editData.name || "",
        email: editData.email || "",
        contact: editData.contact || "",
        address: editData.address || "",
        profile: editData.profile || "",
      })

      // show existing image
      if (editData.profile) {
        setPreview(editData.profile)
      }
    }
  }, [editData, form])

  // ✅ cleanup object URL
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  // ✅ image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  // ✅ upload to cloudinary
  const uploadImageToCloudinary = async () => {
    if (!imageFile) return ""

    setImageLoading(true)
    try {
      const fd = new FormData()
      fd.append("image", imageFile)

      const res = await axios.post(
        `${BASE_URL}/api/admin/upload/single`,
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      return res.data.url
    } catch (err) {
      console.error("Image upload failed", err)
      toast.error("Image upload failed")
      return ""
    } finally {
      setImageLoading(false)
    }
  }

  // ✅ submit
  const onSubmit = async (values: UserFormValues) => {
    try {
      setSubmitting(true)

      let imageUrl = editData?.profile || ""

      // upload new image if selected
      if (imageFile) {
        const uploaded = await uploadImageToCloudinary()
        if (uploaded) imageUrl = uploaded
      }

      const payload = {
        ...values,
        profile: imageUrl, // ✅ FIXED
      }

      if (isEdit) {
        await axios.put(
          `${BASE_URL}/api/customers/${editData._id}`,
          payload
        )
      } else {
        await axios.post(`${BASE_URL}/api/customers`, payload)
      }

      toast.success(`User ${isEdit ? "updated" : "created"} successfully`)
      navigate("/auth/login")
      form.reset()
      onSuccess?.()
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-3">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 grid md:grid-cols-2 gap-2 border p-2 md:p-5 md:max-w-3xl mx-auto rounded-xs bg-white"
        >
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contact */}
          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact</FormLabel>
                <FormControl>
                  <Input placeholder="Enter contact" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          {!isEdit && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Image Upload */}
          <div className="md:col-span-2">
            <FormLabel className="pb-3">Profile Image</FormLabel>
            <Input
              type="file"
              disabled={imageLoading}
              accept="image/*"
              onChange={handleImageChange}
            />

            {preview && (
              <div className="mt-2">
                <img
                  src={preview}
                  alt="preview"
                  className="h-20 w-20 p-2 rounded-xs border object-cover"
                />
              </div>
            )}
          </div>

          {/* Address */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={submitting}
            className="w-full md:col-span-2"
          >
            {submitting
              ? "Please wait..."
              : isEdit
              ? "Update User"
              : "Register User"}
          </Button>
        </form>
      </Form>
    </div>
  )
}