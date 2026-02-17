"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, CheckCircle, Upload } from "lucide-react"
import { submitClubApplication } from "@/lib/appwrite"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  studentId: z.string().min(1, {
    message: "Student ID is required.",
  }),
  year: z.string({
    required_error: "Please select your year of study.",
  }),
  department: z.string({
    required_error: "Please select your Group.",
  }),
  club: z.string({
    required_error: "Please select a club you want to join.",
  }),
  reason: z.string().min(20, {
    message: "Please provide a reason with at least 50 characters.",
  }),
  skills: z.string().optional(),
  experience: z.string().optional(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
  }),
})

export default function ApplyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      studentId: "",
      department: "",
      reason: "",
      skills: "",
      experience: "",
      termsAccepted: false,
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, JPG, PNG, or WebP image.",
        variant: "destructive",
      })
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB.",
        variant: "destructive",
      })
      return
    }

    setProfileImage(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!profileImage) {
      toast({
        title: "Profile image required",
        description: "Please upload a profile image.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Submit application with profile image
      await submitClubApplication(values, profileImage)

      setIsSubmitted(true)
      toast({
        title: "Application Submitted",
        description: "Your club application has been submitted successfully!",
      })
    } catch (error) {
      console.error("Error submitting application:", error)
      toast({
        title: "Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="container py-12 max-w-md mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Application Submitted!</CardTitle>
            <CardDescription>Thank you for applying to join the NSS Club.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We have received your application and will review it shortly. You will be notified via email about the
              status of your application.
            </p>
            <p className="text-sm text-muted-foreground">
              Application Reference: {Math.random().toString(36).substring(2, 10).toUpperCase()}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/">
              <Button>
                Return to Home
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Join NSS Club</h1>
          <p className="text-muted-foreground mt-2">
            Fill out the form below to apply for membership in one of our clubs.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Club Application Form</CardTitle>
            <CardDescription>Please provide all the required information to process your application.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Profile Image Upload */}
                <div className="space-y-2">
                  <FormLabel>Profile Image</FormLabel>
                  <div className="flex flex-col items-center gap-4">
                    <div
                      className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-dashed border-muted-foreground/25 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {imagePreview ? (
                        <Image
                          src={imagePreview || "/placeholder.svg"}
                          alt="Profile preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="hidden"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                      {imagePreview ? "Change Image" : "Upload Image"}
                    </Button>
                    <FormDescription className="text-center">
                      Upload a profile image (JPEG, PNG, WebP, max 5MB)
                    </FormDescription>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Ram Sharma" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="sam.sharma@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+977 (9812345678)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="studentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Student ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Your roll no ex : 753 D16" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="transition-all focus:ring-primary">
                              <SelectValue placeholder="Select grade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="11">Grade 11</SelectItem>
                            <SelectItem value="12">Grade 12</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Group</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="transition-all focus:ring-primary">
                              <SelectValue placeholder="Select Group" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="computer-science">Computer Science</SelectItem>
                            <SelectItem value="bio">Biology</SelectItem>
                            
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

             <FormField
                  control={form.control}
                  name="club"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Club You Want to Join</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="transition-all focus:ring-primary">
                            <SelectValue placeholder="Select a club" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="science-technology">Science and Technology</SelectItem>
                          <SelectItem value="arts-crafts">Arts and Crafts</SelectItem>
                          <SelectItem value="sports">Sports</SelectItem>
                          <SelectItem value="entertainment">Entertainment</SelectItem>
                          <SelectItem value="social-service">Social Service</SelectItem>
                          <SelectItem value="literature">Literature</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>You can apply to join multiple clubs later.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Why do you want to join this club?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us why you're interested in joining this club and what you hope to contribute..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Minimum 20 characters required.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relevant Skills (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List any skills that might be relevant to the club..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Previous Experience (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe any previous experience you have related to the club's activities..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>I agree to the terms and conditions</FormLabel>
                        <FormDescription>
                          By submitting this form, you agree to abide by the club rules and regulations.
                        </FormDescription>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full transition-all hover:scale-[1.02]" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}