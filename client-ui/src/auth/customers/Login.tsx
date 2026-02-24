"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import axios from "axios"
import BASE_URL from "@/Config"
import { Label } from "@/components/ui/label"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"

// ✅ Zod schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter valid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState("")

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    setApiError("")
    setLoading(true)

    try {
      const response = await axios.post(
        `${BASE_URL}/api/customers/login`,
        values
      )

      const user = response.data

      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("token", user.token)

      toast.success(response.data.message)
      navigate("/")
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Invalid email or password"

      setApiError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md p-2 md:p-0 mx-auto mt-10">
      <Card className="overflow-hidden p-0 rounded-xs">
        <CardContent className="grid p-0 md:grid-cols-1">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-3 md:p-5"
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome Back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your account
                </p>
              </div>

              {/* EMAIL */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div className="-mt-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/auth/forgetpassword"
                    className="ml-auto font-semibold text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>

                <Input
                  id="password"
                  type="password"
                  placeholder="password"
                  {...form.register("password")}
                />

                {form.formState.errors.password && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.password.message}
                  </p>
                )}

                {apiError && (
                  <p className="text-sm text-red-600 mt-1">
                    {apiError}
                  </p>
                )}
              </div>

              <Field>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Don&apos;t have an account?{" "}
                <Link to="/auth/signup" className="font-semibold">
                  Sign up
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}