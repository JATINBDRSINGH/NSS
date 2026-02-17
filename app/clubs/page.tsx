import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Users, Calendar, MapPin } from 'lucide-react'
import { getClubs, getFilePreview } from "@/lib/appwrite"

// This function fetches clubs from Appwrite
async function fetchClubs() {
  try {
    const response = await getClubs();

    return response.documents || [];
  } catch (error) {
    console.error("Error fetching clubs:", error);
    return [];
  }
}

export default async function ClubsPage() {
  const clubs = await fetchClubs();

  return (
    <div className="container py-12">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Clubs</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Find a club that matches your interests and join today!
        </p>
      </div>

      <Tabs defaultValue="all" className="mt-8">
        <div className="flex justify-center">
          <TabsList className="mb-8">
            <TabsTrigger value="all" className="transition-all hover:bg-primary/10">
              All Clubs
            </TabsTrigger>
           
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.length > 0 ? (
              clubs.map((club) => (
                <Card
                  key={club.$id}
                  className="overflow-hidden flex flex-col hover:shadow-md transition-all hover:-translate-y-1"
                >
                  <div className="relative h-48 w-full">
                    <Image 
                      src={club.imageId ? getFilePreview(club.imageId) : "/placeholder.svg?height=300&width=400"} 
                      alt={club.name} 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{club.name}</CardTitle>
                    <CardDescription>{club.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{club.members} members</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Est. {club.founded}</span>
                      </div>
                      <div className="flex items-center gap-1 col-span-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{club.location}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/clubs/${club.$id}`} className="w-full">
                      <Button
                        variant="outline"
                        className="w-full transition-all hover:bg-primary hover:text-primary-foreground"
                      >
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-muted-foreground">No clubs found. Please check back later.</p>
              </div>
            )}
          </div>
        </TabsContent>

     </Tabs>
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Want to Join a Club?</h2>
        <p className="text-muted-foreground mb-6 max-w-[600px] mx-auto">
          Fill out our simple application form to join any of our clubs. We welcome all students!
        </p>
        <Link href="/apply">
          <Button size="lg" className="transition-all hover:scale-105">
            Apply Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
