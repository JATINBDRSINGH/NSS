"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { createAccount, login, getCurrentUser } from "@/lib/appwrite"
import { Loader2, Github, Mail } from "lucide-react"
import { TermsDialog } from "@/components/terms-dialog"
import { PrivacyDialog } from "@/components/privacy-dialog"

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

const registerSchema = z
  .object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [activeTab, setActiveTab] = useState("login")
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser()
        if (user) {
          router.push("/")
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
      } finally {
        setCheckingAuth(false)
      }
    }

    checkAuth()
  }, [router])

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true)

    try {
      await login(values.email, values.password)

      toast({
        title: "Login Successful",
        description: "You have been logged in successfully.",
      })

      router.push("/")
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function onRegisterSubmit(values: z.infer<typeof registerSchema>) {
    setIsLoading(true)

    try {
      await createAccount(values.email, values.password, values.name)

      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully.",
      })

      router.push("/")
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Registration Failed",
        description: "There was an error creating your account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground animate-pulse">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-background/80">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary">NSS Club</h1>
          <p className="mt-2 text-sm text-muted-foreground">Join our community of service and leadership</p>
        </div>

        <Card className="w-full shadow-lg border-primary/10 overflow-hidden transition-all duration-300 hover:shadow-primary/5">
          <CardHeader className="space-y-1 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent pb-6">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              {activeTab === "login" ? "Sign in to your account" : "Create a new account"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-medium transition-all duration-200"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-medium transition-all duration-200"
                >
                  Register
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="space-y-4">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80">Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ram123@gmail.com"
                              {...field}
                              className="transition-all focus-visible:ring-primary/50 focus-visible:border-primary"
                              autoComplete="email"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-foreground/80">Password</FormLabel>
                            <Link
                              href="/forgot-password"
                              className="text-xs text-primary hover:text-primary/80 hover:underline transition-colors"
                            >
                              Forgot password?
                            </Link>
                          </div>
                          <FormControl>
                            <Input
                              type="password"
                              {...field}
                              className="transition-all focus-visible:ring-primary/50 focus-visible:border-primary"
                              autoComplete="current-password"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 mt-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
                        </>
                      ) : (
                        "Sign in"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value="register" className="space-y-4">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80">Full Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ram Sharma"
                              {...field}
                              className="transition-all focus-visible:ring-primary/50 focus-visible:border-primary"
                              autoComplete="name"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80">Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ram@gmail.com"
                              {...field}
                              className="transition-all focus-visible:ring-primary/50 focus-visible:border-primary"
                              autoComplete="email"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80">Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              {...field}
                              className="transition-all focus-visible:ring-primary/50 focus-visible:border-primary"
                              autoComplete="new-password"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80">Confirm Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              {...field}
                              className="transition-all focus-visible:ring-primary/50 focus-visible:border-primary"
                              autoComplete="new-password"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 mt-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 bg-gradient-to-r from-transparent via-primary/5 to-primary/10 pt-6">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              <Button
                variant="outline"
                className="bg-transparent border-primary/20 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 flex items-center gap-2"
                onClick={() =>
                  toast({
                    title: "Google Sign In",
                    description: "Google authentication is not implemented yet.",
                  })
                }
              >
                <Mail className="h-4 w-4" />
                <span>Google</span>
              </Button>
              <Button
                variant="outline"
                className="bg-transparent border-primary/20 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 flex items-center gap-2"
                onClick={() =>
                  toast({
                    title: "GitHub Sign In",
                    description: "GitHub authentication is not implemented yet.",
                  })
                }
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-4">
              By signing in, you agree to our{" "}
              <TermsDialog>
                <span className="text-primary hover:underline cursor-pointer">
                  Terms of Service
                </span>
              </TermsDialog>{" "}
              and{" "}
              <PrivacyDialog>
                <span className="text-primary hover:underline cursor-pointer">
                  Privacy Policy
                </span>
              </PrivacyDialog>
              .
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

