"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, Upload, Loader2 } from "lucide-react"
import { createClub, isUserAdmin } from "@/lib/appwrite"
import { useEffect } from "react"

const clubSchema = z.object({
  id: z.string().min(2, {
    message: "ID must be at least 2 characters.",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  longDescription: z.string().min(50, {
    message: "Long description must be at least 50 characters.",
  }),
  members: z.coerce.number().min(0, {
    message: "Members must be a positive number.",
  }),
  founded: z.string().min(4, {
    message: "Founded year is required.",
  }),
  location: z.string().min(2, {
    message: "Location is required.",
  }),
  meetingTime: z.string().min(2, {
    message: "Meeting time is required.",
  }),
  leadTeacher: z.string().min(2, {
    message: "Lead teacher name is required.",
  }),
  studentPresident: z.string().min(2, {
    message: "Student president name is required.",
  }),
})

export default function NewClubPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [clubImage, setClubImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    async function checkAdmin() {
      try {
        const adminStatus = await isUserAdmin()
        setIsAdmin(adminStatus)
        if (!adminStatus) {
          router.push("/")
        }
      } catch (error) {
        console.error("Error checking admin status:", error)
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    checkAdmin()
  }, [router])

  const form = useForm<z.infer<typeof clubSchema>>({
    resolver: zodResolver(clubSchema),
    defaultValues: {
      id: "",
      name: "",
      description: "",
      longDescription: "",
      members: 0,
      founded: new Date().getFullYear().toString(),
      location: "",
      meetingTime: "",
      leadTeacher: "",
      studentPresident: "",
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setClubImage(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  async function onSubmit(values: z.infer<typeof clubSchema>) {
    if (!clubImage) {
      toast({
        title: "Club image required",
        description: "Please upload a club image.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await createClub(values, clubImage)

      toast({
        title: "Club Created",
        description: "The club has been created successfully!",
      })

      router.push("/admin?tab=clubs")
    } catch (error) {
      console.error("Error creating club:", error)
      toast({
        title: "Error",
        description: "There was an error creating the club. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we check your permissions.</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null // This will never render because we redirect in useEffect
  }

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/admin?tab=clubs" className="text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4 inline mr-1" />
            Back to Clubs
          </Link>
        </div>

        <Card>
          <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
            <CardTitle>Add New Club</CardTitle>
            <CardDescription>Create a new club to display on your website</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Club Image Upload */}
                <div className="space-y-2">
                  <FormLabel>Club Image</FormLabel>
                  <div className="flex flex-col items-center gap-4">
                    <div
                      className="relative h-40 w-full rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/25 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {imagePreview ? (
                        <Image
                          src={imagePreview || "/placeholder.svg"}
                          alt="Club preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Click to upload club image</p>
                        </div>
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
                    <FormDescription className="text-center">Upload a club image (JPEG, PNG, WebP)</FormDescription>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Club ID</FormLabel>
                        <FormControl>
                          <Input placeholder="science" {...field} />
                        </FormControl>
                        <FormDescription>A unique identifier for the club (e.g., "science", "arts")</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Club Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Science Club" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="A brief description of the club" className="resize-none" {...field} />
                      </FormControl>
                      <FormDescription>This will appear in club listings and cards</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="longDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Long Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A detailed description of the club, its activities, and goals"
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>This will appear on the club's detail page</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="members"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Members</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="founded"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Founded Year</FormLabel>
                        <FormControl>
                          <Input placeholder="2020" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meeting Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Science Lab" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="meetingTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meeting Time</FormLabel>
                        <FormControl>
                          <Input placeholder="Tuesdays, 3:30 PM" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="leadTeacher"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lead Teacher</FormLabel>
                        <FormControl>
                          <Input placeholder="Ms. Sarah Johnson" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="studentPresident"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Student President</FormLabel>
                        <FormControl>
                          <Input placeholder="Alex Chen" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Link href="/admin?tab=clubs">
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                      </>
                    ) : (
                      "Create Club"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

