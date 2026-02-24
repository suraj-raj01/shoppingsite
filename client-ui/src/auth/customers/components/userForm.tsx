
import { useEffect } from "react"
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
    contact: z.string().min(10),
    password: z.string().optional(),
    address: z.string().optional(),
})

type UserFormValues = z.infer<typeof userSchema>

type Props = {
    editData?: any // pass user data when editing
    onSuccess?: () => void
}

export default function UserForm({ editData, onSuccess }: Props) {
    const isEdit = !!editData

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: "",
            email: "",
            contact: "",
            password: "",
            address: "",
        },
    })

    // ✅ preload data in edit mode
    useEffect(() => {
        if (editData) {
            form.reset({
                name: editData.name || "",
                email: editData.email || "",
                contact: editData.contact || "",
                password: "",
                address: editData.address || "",
            })
        }
    }, [editData, form])

    // ✅ submit handler (create + update)
    const navigate = useNavigate();
    const onSubmit = async (values: UserFormValues) => {
        try {
            if (isEdit) {
                await axios.put(`${BASE_URL}/api/customers/${editData._id}`, values)
            } else {
                await axios.post(`${BASE_URL}/api/customers`, values)
            }
            toast.success(`User ${isEdit ? "updated" : "created"} successfully`)
            isEdit ? navigate(`/auth/login`) : navigate("/auth/login")
            form.reset()
            onSuccess?.()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 border p-2 md:p-5 md:max-w-2xl">

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
                {
                    !isEdit && (
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Password {isEdit && "(leave blank to keep old)"}
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Enter password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )
                }

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

                <Button type="submit" className="w-full">
                    {isEdit ? "Update User" : "Register User"}
                </Button>

            </form>
        </Form>
    )
}