import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, Calendar, MapPin, Clock, CheckCircle } from 'lucide-react'
import { databases, getFilePreview } from "@/lib/appwrite"

// This function fetches a specific club from Appwrite
async function fetchClub(id: string) {
  try {
    const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || "67e10b4c00081c88a930"
    const CLUBS_COLLECTION_ID = process.env.APPWRITE_CLUBS_COLLECTION_ID || "67e10b7b002a7cb6560c"
    
    const club = await databases.getDocument(DATABASE_ID, CLUBS_COLLECTION_ID, id);
    return club;
  } catch (error) {
    console.error("Error fetching club:", error);
    return null;
  }
}

export default async function ClubPage({ params }: { params: { id: string } }) {
  const club = await fetchClub(params.id);

  if (!club) {
    notFound();
  }

  // Default gallery images if none are provided
  const galleryImages = club.galleryImages || [
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
  ];

  // Default activities if none are provided
  const activities = club.activities || [
    "Regular club meetings",
    "Workshops and training sessions",
    "Competitions and events",
    "Community outreach",
  ];

  // Default achievements if none are provided
  const achievements = club.achievements || [
    "Established club at NSS",
    "Growing membership",
    "Successful events",
    "Positive community impact",
  ];

  return (
    <div className="container py-12">
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-start">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Link href="/clubs" className="text-muted-foreground hover:text-primary">
              ← Back to Clubs
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{club.name}</h1>
          <p className="text-muted-foreground text-lg">{club.longDescription}</p>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Members</p>
                <p className="text-sm text-muted-foreground">{club.members} active members</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Founded</p>
                <p className="text-sm text-muted-foreground">Started in {club.founded}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{club.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Meeting Time</p>
                <p className="text-sm text-muted-foreground">{club.meetingTime}</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Club Leaders</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Teacher Advisor</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{club.leadTeacher}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Student President</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{club.studentPresident}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/apply">
              <Button size="lg" className="transition-all hover:scale-105">
                Join This Club
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative h-[300px] overflow-hidden rounded-xl shadow-md">
            <Image 
              src={club.imageId ? getFilePreview(club.imageId) : "/placeholder.svg?height=300&width=400"} 
              alt={club.name} 
              fill 
              className="object-cover" 
            />
          </div>

          <Tabs defaultValue="activities">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
            </TabsList>
            <TabsContent value="activities" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Club Activities</CardTitle>
                  <CardDescription>What we do throughout the year</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {activities.map((activity, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="achievements" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Club Achievements</CardTitle>
                  <CardDescription>What we've accomplished</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Badge className="mt-0.5">{index + 1}</Badge>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="gallery" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Photo Gallery</CardTitle>
                  <CardDescription>Moments from our activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {galleryImages.map((image, index) => (
                      <div key={index} className="relative h-[150px] overflow-hidden rounded-md">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${club.name} activity ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Members only section */}
      {/* <div className="mt-16 p-6 border rounded-lg bg-muted/50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Members Only Section</h2>
          <p className="text-muted-foreground mb-4">This section has special content just for club members.</p>
          <Link href={`/secret/${club.id}`}>
            <Button variant="outline">Login to Access</Button>
          </Link>
        </div>
      </div> */}
    </div>
  )
}
