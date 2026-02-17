"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EventCard from "@/components/event-card"

interface EventsTabsProps {
  upcomingEvents: any[]
  pastEvents: any[]
  allEvents: any[]
}

export default function EventsTabs({ upcomingEvents, pastEvents, allEvents }: EventsTabsProps) {
  return (
    <Tabs defaultValue="upcoming" className="mt-8">
      <div className="flex justify-center">
        <TabsList className="mb-8">
          <TabsTrigger value="upcoming" className="transition-all hover:bg-primary/10">
            Upcoming Events
          </TabsTrigger>
          <TabsTrigger value="past" className="transition-all hover:bg-primary/10">
            Past Events
          </TabsTrigger>
          <TabsTrigger value="all" className="transition-all hover:bg-primary/10">
            All Events
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="upcoming" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <EventCard key={event.$id} event={event} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No upcoming events found. Please check back later.</p>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="past" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastEvents.length > 0 ? (
            pastEvents.map((event) => (
              <EventCard key={event.$id} event={event} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No past events found.</p>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="all" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allEvents.length > 0 ? (
            allEvents.map((event) => (
              <EventCard key={event.$id} event={event} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No events found.</p>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}
