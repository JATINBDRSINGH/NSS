import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, Calendar, Clock, MapPin, Share2, Users } from 'lucide-react'
import { databases, getEvents, getFilePreview } from "@/lib/appwrite"

// This function fetches a specific event from Appwrite
async function fetchEvent(id: string) {
  try {
    const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || "67e10b4c00081c88a930"
    const EVENTS_COLLECTION_ID = process.env.APPWRITE_EVENTS_COLLECTION_ID || "67e15ef4003675535874"
    
    const event = await databases.getDocument(DATABASE_ID, EVENTS_COLLECTION_ID, id);
    return event;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}

// This function fetches similar events (same category)
async function fetchSimilarEvents(category: string, currentEventId: string) {
  try {
    const allEvents = await getEvents("all");
    return allEvents.documents
      .filter(event => event.category === category && event.$id !== currentEventId)
      .slice(0, 3);
  } catch (error) {
    console.error("Error fetching similar events:", error);
    return [];
  }
}

export default async function EventPage({ params }: { params: { id: string } }) {
  const event = await fetchEvent(params.id);

  if (!event) {
    notFound();
  }

  const similarEvents = await fetchSimilarEvents(event.category, event.$id);
  const isPastEvent = event.status === "past";

  // Default gallery images if none are provided
  const gallery = event.gallery || [
    "/placeholder.svg?height=300&width=500",
    "/placeholder.svg?height=300&width=500",
    "/placeholder.svg?height=300&width=500",
  ];

  return (
    <div className="container py-12">
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-start">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Link href="/events" className="text-muted-foreground hover:text-primary">
              ← Back to Events
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={isPastEvent ? "bg-secondary" : "bg-primary"}>{event.category}</Badge>
            {isPastEvent && <Badge variant="outline">Past Event</Badge>}
          </div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{event.title}</h1>
          <p className="text-muted-foreground text-lg">{event.longDescription}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Date</p>
                <p className="text-sm text-muted-foreground">{event.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Time</p>
                <p className="text-sm text-muted-foreground">{event.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{event.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Organized by</p>
                <p className="text-sm text-muted-foreground">{event.club}</p>
              </div>
            </div>
          </div>

          {!isPastEvent && event.requirements && event.requirements.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-2">Requirements</h2>
              <ul className="space-y-1">
                {event.requirements.map((req: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary p-1 rounded-full mt-0.5">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-2">Contact Information</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Organizer:</span> {event.organizer}
              </p>
              <p>
                <span className="font-medium">Email:</span> {event.contactEmail}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {event.contactPhone}
              </p>
            </div>
          </div>

          {/* {!isPastEvent && (
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg">
                Register Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="mr-2 h-4 w-4" />
                Share Event
              </Button>
            </div>
          )}
        </div> */}
        </div>

        <div className="space-y-6">
          <div className="relative h-[300px] overflow-hidden rounded-xl">
            <Image 
              src={event.imageId ? getFilePreview(event.imageId) : "/placeholder.svg?height=300&width=500"} 
              alt={event.title} 
              fill 
              className="object-cover" 
            />
          </div>

          {isPastEvent && gallery && gallery.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Event Gallery</h2>
              <div className="grid grid-cols-2 gap-4">
                {gallery.map((image: string, index: number) => (
                  <div key={index} className="relative h-[150px] overflow-hidden rounded-md">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${event.title} image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* <Card>
            <CardHeader>
              <CardTitle>Similar Events</CardTitle>
              <CardDescription>You might also be interested in these events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {similarEvents.length > 0 ? (
                  similarEvents.map((similarEvent) => (
                    <div key={similarEvent.$id} className="flex items-start gap-4">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={similarEvent.imageId ? getFilePreview(similarEvent.imageId) : "/placeholder.svg?height=300&width=500"}
                          alt={similarEvent.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">{similarEvent.title}</h3>
                        <p className="text-xs text-muted-foreground">{similarEvent.date}</p>
                        <Link href={`/events/${similarEvent.id}`} className="text-xs text-primary hover:underline">
                          View details
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center">No similar events found.</p>
                )}
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>


      <Separator className="my-12" />

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Interested in More Events?</h2>
        <p className="text-muted-foreground mb-6 max-w-[600px] mx-auto">
          Check out all our upcoming events or join one of our clubs to stay updated and participate in our activities.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/events">
            <Button variant="outline" size="lg">
              View All Events
            </Button>
          </Link>
          <Link href="/apply">
            <Button size="lg">
              Join a Club
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
    
  )
}
