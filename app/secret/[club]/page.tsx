"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Download, FileText, Lock, Users } from "lucide-react"

export default function SecretClubPage({ params }: { params: { club: string } }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, this would check if the user is authenticated and has access to this club
        // const user = await getCurrentUser()
        // if (!user) {
        //   router.push('/login')
        //   return
        // }

        // Simulate authentication check
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // For demo purposes, we'll just set authenticated to true
        setIsAuthenticated(true)
        setIsLoading(false)
      } catch (error) {
        console.error("Authentication error:", error)
        router.push("/login")
      }
    }

    checkAuth()
  }, [router, params.club])

  if (isLoading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we verify your access.</p>
        </div>
      </div>
    )
  }

  // Club data based on the club ID
  const clubData = {
    science: {
      name: "Science Club",
      description: "Secret resources and information for Science Club members.",
      announcements: [
        {
          title: "Next Science Fair Meeting",
          date: "June 10, 2023",
          content:
            "The next meeting to prepare for the Science Fair will be held on June 10 at 3:30 PM in the Science Lab. All members are requested to attend.",
        },
        {
          title: "Lab Equipment Arrived",
          date: "May 28, 2023",
          content:
            "The new lab equipment for our experiments has arrived. Club officers can start planning the demonstration sessions.",
        },
      ],
      resources: [
        {
          title: "Science Fair Project Guide",
          description: "A comprehensive guide on creating winning science fair projects.",
          type: "PDF",
          size: "2.5 MB",
        },
        {
          title: "Experiment Safety Guidelines",
          description: "Important safety guidelines for all lab experiments.",
          type: "PDF",
          size: "1.8 MB",
        },
        {
          title: "Club Member Directory",
          description: "Contact information and roles of all club members.",
          type: "Excel",
          size: "1.2 MB",
        },
      ],
      members: [
        { name: "Alex Chen", role: "President", image: "/placeholder.svg?height=100&width=100" },
        { name: "Priya Sharma", role: "Vice President", image: "/placeholder.svg?height=100&width=100" },
        { name: "David Wilson", role: "Secretary", image: "/placeholder.svg?height=100&width=100" },
        { name: "Sarah Johnson", role: "Treasurer", image: "/placeholder.svg?height=100&width=100" },
        { name: "Rahul Gupta", role: "Event Coordinator", image: "/placeholder.svg?height=100&width=100" },
      ],
    },
    arts: {
      name: "Arts & Culture Club",
      description: "Secret resources and information for Arts & Culture Club members.",
      announcements: [
        {
          title: "Art Exhibition Preparations",
          date: "June 5, 2023",
          content:
            "We need volunteers for setting up the upcoming Art Exhibition. Please register your name with the secretary by June 10.",
        },
        {
          title: "Dance Workshop",
          date: "May 20, 2023",
          content: "A Dance Workshop will be conducted on June 15. All members are encouraged to participate.",
        },
      ],
      resources: [
        {
          title: "Art Techniques Guide",
          description: "A comprehensive guide on various art techniques and styles.",
          type: "PDF",
          size: "3.2 MB",
        },
        {
          title: "Exhibition Planning Checklist",
          description: "Checklist for organizing art exhibitions.",
          type: "Word",
          size: "1.5 MB",
        },
        {
          title: "Cultural Performance Guide",
          description: "Guide on preparing for cultural performances.",
          type: "PDF",
          size: "2.8 MB",
        },
      ],
      members: [
        { name: "Maya Roberts", role: "President", image: "/placeholder.svg?height=100&width=100" },
        { name: "Anita Desai", role: "Vice President", image: "/placeholder.svg?height=100&width=100" },
        { name: "John Smith", role: "Secretary", image: "/placeholder.svg?height=100&width=100" },
        { name: "Lisa Chen", role: "Treasurer", image: "/placeholder.svg?height=100&width=100" },
        { name: "Raj Patel", role: "Event Coordinator", image: "/placeholder.svg?height=100&width=100" },
      ],
    },
    community: {
      name: "Community Service Club",
      description: "Secret resources and information for Community Service Club members.",
      announcements: [
        {
          title: "Volunteer Sign-up",
          date: "June 8, 2023",
          content: "We are collecting names for the upcoming Community Clean-up Day. Please sign up by June 15.",
        },
        {
          title: "Donation Drive",
          date: "May 25, 2023",
          content:
            "A donation drive for school supplies will begin next week. Please bring your contributions to the club office.",
        },
      ],
      resources: [
        {
          title: "Volunteer Guidelines",
          description: "Guide on effective volunteering and community service.",
          type: "PDF",
          size: "4.1 MB",
        },
        {
          title: "Community Projects Ideas",
          description: "Collection of ideas for community service projects.",
          type: "Word",
          size: "2.3 MB",
        },
        {
          title: "Fundraising Strategies",
          description: "Strategies for effective fundraising for causes.",
          type: "PDF",
          size: "2.2 MB",
        },
      ],
      members: [
        { name: "Emily Wilson", role: "President", image: "/placeholder.svg?height=100&width=100" },
        { name: "Vikram Singh", role: "Vice President", image: "/placeholder.svg?height=100&width=100" },
        { name: "Sophie Brown", role: "Secretary", image: "/placeholder.svg?height=100&width=100" },
        { name: "Ahmed Khan", role: "Treasurer", image: "/placeholder.svg?height=100&width=100" },
        { name: "Maya Patel", role: "Event Coordinator", image: "/placeholder.svg?height=100&width=100" },
      ],
    },
    debate: {
      name: "Debate & Public Speaking Club",
      description: "Secret resources and information for Debate & Public Speaking Club members.",
      announcements: [
        {
          title: "Debate Tournament Preparation",
          date: "June 12, 2023",
          content:
            "A preparation meeting for the Interschool Debate Tournament will be held on June 20. All team members are requested to attend.",
        },
        {
          title: "Public Speaking Workshop",
          date: "May 30, 2023",
          content:
            "A public speaking workshop will be conducted on June 25. Interested members can register with the secretary.",
        },
      ],
      resources: [
        {
          title: "Debate Techniques Guide",
          description: "Guide on effective debating techniques and strategies.",
          type: "PDF",
          size: "3.8 MB",
        },
        {
          title: "Speech Writing Templates",
          description: "Templates for writing effective speeches.",
          type: "Word",
          size: "1.6 MB",
        },
        {
          title: "Research Methods Guide",
          description: "Guide on researching topics for debates and speeches.",
          type: "PDF",
          size: "2.2 MB",
        },
      ],
      members: [
        { name: "Anita Desai", role: "President", image: "/placeholder.svg?height=100&width=100" },
        { name: "Raj Malhotra", role: "Vice President", image: "/placeholder.svg?height=100&width=100" },
        { name: "Neha Kapoor", role: "Secretary", image: "/placeholder.svg?height=100&width=100" },
        { name: "Arjun Mehta", role: "Treasurer", image: "/placeholder.svg?height=100&width=100" },
        { name: "Priya Sharma", role: "Event Coordinator", image: "/placeholder.svg?height=100&width=100" },
      ],
    },
    tech: {
      name: "Technology Club",
      description: "Secret resources and information for Technology Club members.",
      announcements: [
        {
          title: "Robotics Competition Registration",
          date: "June 15, 2023",
          content:
            "Registration for the upcoming Robotics Competition is now open. Please register your team by June 25.",
        },
        {
          title: "Workshop on AI",
          date: "June 2, 2023",
          content: "A workshop on Artificial Intelligence will be conducted on June 30. Limited seats available.",
        },
      ],
      resources: [
        {
          title: "Coding Best Practices",
          description: "Guide on coding best practices and standards.",
          type: "PDF",
          size: "2.9 MB",
        },
        {
          title: "Project Templates",
          description: "Templates for various technical projects.",
          type: "ZIP",
          size: "18.7 MB",
        },
        {
          title: "Technical Documentation Guide",
          description: "Guide on writing effective technical documentation.",
          type: "PDF",
          size: "3.5 MB",
        },
      ],
      members: [
        { name: "Robert Chen", role: "President", image: "/placeholder.svg?height=100&width=100" },
        { name: "Aisha Khan", role: "Vice President", image: "/placeholder.svg?height=100&width=100" },
        { name: "Jason Lee", role: "Secretary", image: "/placeholder.svg?height=100&width=100" },
        { name: "Sneha Patel", role: "Treasurer", image: "/placeholder.svg?height=100&width=100" },
        { name: "Mark Wilson", role: "Event Coordinator", image: "/placeholder.svg?height=100&width=100" },
      ],
    },
    sports: {
      name: "Sports & Fitness Club",
      description: "Secret resources and information for Sports & Fitness Club members.",
      announcements: [
        {
          title: "Sports Day Registration",
          date: "June 18, 2023",
          content: "Registration for the Annual Sports Day is now open. Please register for your events by July 1.",
        },
        {
          title: "Fitness Challenge",
          date: "June 5, 2023",
          content:
            "A 30-day Fitness Challenge will begin on July 5. Interested members can register with the secretary.",
        },
      ],
      resources: [
        {
          title: "Sports Training Guide",
          description: "Comprehensive guide on training techniques for various sports.",
          type: "PDF",
          size: "5.6 MB",
        },
        {
          title: "Fitness Workout Plans",
          description: "Collection of workout plans for different fitness levels.",
          type: "PDF",
          size: "3.2 MB",
        },
        {
          title: "Sports Day Planning Guide",
          description: "Guide on organizing sports day events and competitions.",
          type: "PDF",
          size: "4.1 MB",
        },
      ],
      members: [
        { name: "David Williams", role: "President", image: "/placeholder.svg?height=100&width=100" },
        { name: "Neha Kapoor", role: "Vice President", image: "/placeholder.svg?height=100&width=100" },
        { name: "Carlos Rodriguez", role: "Secretary", image: "/placeholder.svg?height=100&width=100" },
        { name: "Li Wei", role: "Treasurer", image: "/placeholder.svg?height=100&width=100" },
        { name: "Sanjay Patel", role: "Event Coordinator", image: "/placeholder.svg?height=100&width=100" },
      ],
    },
  }

  const club = clubData[params.club as keyof typeof clubData]

  if (!club) {
    return (
      <div className="container py-12">
        <Alert variant="destructive">
          <Lock className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>The requested club page does not exist or you do not have access to it.</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Link href="/clubs">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Clubs
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/clubs" className="text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4 inline mr-1" />
          Back to Clubs
        </Link>
        <Badge variant="outline" className="ml-auto">
          Members Only
        </Badge>
      </div>

      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">{club.name} - Members Area</h1>
        <p className="text-muted-foreground">{club.description} This page is only accessible to club members.</p>
      </div>

      <Tabs defaultValue="announcements">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="announcements" className="transition-all hover:bg-primary/10">
            Announcements
          </TabsTrigger>
          <TabsTrigger value="resources" className="transition-all hover:bg-primary/10">
            Resources
          </TabsTrigger>
          <TabsTrigger value="members" className="transition-all hover:bg-primary/10">
            Members
          </TabsTrigger>
        </TabsList>

        <TabsContent value="announcements">
          <div className="grid gap-6">
            {club.announcements.map((announcement, index) => (
              <Card key={index} className="transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{announcement.title}</CardTitle>
                    <Badge variant="outline">{announcement.date}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{announcement.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {club.resources.map((resource, index) => (
              <Card key={index} className="transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                  </div>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <Badge variant="outline">{resource.type}</Badge>
                    <span className="text-muted-foreground">{resource.size}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="members">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {club.members.map((member, index) => (
              <Card key={index} className="transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                <CardHeader className="text-center pb-2">
                  <div className="relative h-24 w-24 mx-auto mb-4 overflow-hidden rounded-full">
                    <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                  </div>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-center">
                  <Button variant="outline" size="sm">
                    <Users className="mr-2 h-4 w-4" />
                    Contact
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Separator className="my-12" />

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
        <p className="text-muted-foreground mb-6 max-w-[600px] mx-auto">
          If you have any questions or need assistance, please contact the club president or any committee member.
        </p>
        <Button variant="outline">Contact Club Admin</Button>
      </div>
    </div>
  )
}

