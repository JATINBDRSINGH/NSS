import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin } from 'lucide-react'
import { getFilePreview } from "@/lib/appwrite"

interface EventCardProps {
  event: {
    $id: string
    title: string
    description: string
    date: string
    time: string
    location: string
    status: string
    imageId?: string
    clubName?: string
  }
}

export default function EventCard({ event }: EventCardProps) {
  const imageUrl = event.imageId ? getFilePreview(event.imageId) : null

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {imageUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl}
            alt={event.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant={event.status === "upcoming" ? "default" : "secondary"}>
            {event.status}
          </Badge>
          {event.clubName && (
            <Badge variant="outline">{event.clubName}</Badge>
          )}
        </div>
        <CardTitle className="line-clamp-2">{event.title}</CardTitle>
        <CardDescription className="line-clamp-3">
          {event.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4" />
          {new Date(event.date).toLocaleDateString()}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-2 h-4 w-4" />
          {event.time}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-2 h-4 w-4" />
          {event.location}
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/events/${event.$id}`} className="w-full">
          <Button className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
