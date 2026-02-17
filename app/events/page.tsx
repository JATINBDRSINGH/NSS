import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'
import { getEvents } from "@/lib/appwrite"
import EventsTabs from "@/components/events-tabs"

export default async function EventsPage() {
  // Fetch all events
  let allEvents: any[] = [];
  
  try {
    const response = await getEvents("all");
    allEvents = response.documents || [];
  } catch (error) {
    console.error("Error fetching events:", error);
  }
  
  // Filter upcoming and past events
  const upcomingEvents = allEvents.filter(event => event.status === "upcoming");
  const pastEvents = allEvents.filter(event => event.status === "past");

  return (
    <div className="container py-12">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Events & Activities</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Discover upcoming and past events organized by our clubs.
        </p>
      </div>

      <EventsTabs 
        upcomingEvents={upcomingEvents}
        pastEvents={pastEvents}
        allEvents={allEvents}
      />

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Want to Organize an Event?</h2>
        <p className="text-muted-foreground mb-6 max-w-[600px] mx-auto">
          If you have an idea for an event or activity, we'd love to hear from you. Join one of our clubs and propose
          your event!
        </p>
        <Link href="/apply">
          <Button size="lg">
            Join a Club
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}