import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calendar, Users, Award, BookOpen, ChevronRight } from "lucide-react"
import { getClubs, getEvents, getFilePreview } from "@/lib/appwrite"

async function getData() {
  try {
    // Fetch clubs and events
    const clubsResponse = await getClubs()
    const eventsResponse = await getEvents("upcoming")

    // Get the first 3 clubs for the homepage
    const clubs = clubsResponse.documents.slice(0, 3).map((club) => ({
      id: club.$id,
      title: club.name,
      description: club.description,
      icon: <BookOpen className="h-10 w-10" />,
      imageUrl: club.imageId ? getFilePreview(club.imageId) : "/placeholder.svg?height=300&width=400",
    }))

    // Get the first 3 events for the highlights section
    const highlights = eventsResponse.documents.slice(0, 3).map((event) => {
      // Determine the icon and badge based on event type or category
      let icon = <Calendar className="h-5 w-5" />
      let badge = "Event"

      if (event.category === "achievement") {
        icon = <Award className="h-5 w-5" />
        badge = "Achievement"
      } else if (event.category === "announcement") {
        icon = <Users className="h-5 w-5" />
        badge = "Announcement"
      }

      return {
        id: event.$id,
        title: event.title,
        description: event.description,
        date: new Date(event.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        icon,
        badge,
        imageUrl: event.imageId ? getFilePreview(event.imageId) : "/placeholder.svg?height=300&width=500",
      }
    })

    return { clubs, highlights }
  } catch (error) {
    console.error("Error fetching data:", error)
    // Return fallback data if there's an error
    return {
      clubs: [
        {
          id: "fallback-1",
          title: "Unable to load clubs",
          description: "Please try again later or contact support if the issue persists.",
          icon: <BookOpen className="h-10 w-10" />,
          imageUrl: "/placeholder.svg?height=300&width=400",
        },
      ],
      highlights: [
        {
          id: "fallback-1",
          title: "Unable to load events",
          description: "Please try again later or contact support if the issue persists.",
          date: new Date().toLocaleDateString(),
          icon: <Calendar className="h-5 w-5" />,
          badge: "Notice",
          imageUrl: "/placeholder.svg?height=300&width=500",
        },
      ],
    }
  }
}

export default async function Home() {
  const { clubs, highlights } = await getData()

  return (
    <div className="flex flex-col gap-12 pb-8">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted/60 to-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-5">
              <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-md text-sm font-medium mb-2 animate-fade-in">
                National School of Sciences
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-poppins bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                Welcome to NSS Club
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl leading-relaxed">
                Join our vibrant high school community of passionate students making a difference through leadership,
                creativity, and service.
              </p>
              <div className="flex flex-col gap-3 min-[400px]:flex-row pt-2">
                <Link href="/apply">
                  <Button size="lg" className="transition-all hover:scale-105 shadow-md">
                    Join Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/clubs">
                  <Button variant="outline" size="lg" className="transition-all hover:bg-secondary/20">
                    Explore Clubs
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[300px] lg:h-[450px] overflow-hidden rounded-xl shadow-lg transition-transform hover:scale-[1.02] duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Image
                src="/logo.png"
                alt="NSS Club members in action"
                fill
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="container px-4 md:px-6 py-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <div className="space-y-2">
            <Badge variant="outline" className="px-3 py-1 text-sm font-medium">
              Latest News & Highlights
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              What's Happening
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
              Stay updated with the latest events, achievements, and announcements from our clubs.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {highlights.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-muted/80"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                <Badge variant="secondary" className="absolute top-3 left-3 z-10">
                  {item.badge}
                </Badge>
              </div>
              <CardHeader className="pb-2 relative">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-xs flex items-center">
                    {item.icon}
                    <span className="ml-1">{item.date}</span>
                  </CardDescription>
                </div>
                <CardTitle className="text-xl mt-2 line-clamp-1">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
              </CardContent>
              <CardFooter>
                <Link
                  href={`/events/${item.id}`}
                  className="text-sm font-medium text-primary inline-flex items-center group-hover:underline"
                >
                  Read more <ChevronRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/events">
            <Button
              variant="outline"
              className="w-full sm:w-auto hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              View All Events
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Clubs Overview */}
      <section className="bg-gradient-to-b from-muted/50 to-muted py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-poppins bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                Our Clubs
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                 Explore our clubs and opportunities to get involved in various activities, from academics to sports and arts.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {clubs.map((club) => (
              <Card
                key={club.id}
                className="text-center group hover:shadow-lg transition-all duration-300 overflow-hidden border-muted/80"
              >
                <div className="relative h-48 overflow-hidden bg-muted/30">
                  <Image
                    src={club.imageUrl || "/placeholder.svg"}
                    alt={club.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-center mb-4 text-primary group-hover:scale-110 transition-transform duration-300">
                    {club.icon}
                  </div>
                  <CardTitle className="font-poppins">{club.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-3">{club.description}</p>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Link href={`/clubs/${club.id}`}>
                    <Button
                      variant="outline"
                      className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
                    >
                      Learn More
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <Link href="/clubs">
              <Button
                variant="outline"
                size="lg"
                className="transition-all hover:bg-primary hover:text-primary-foreground shadow-sm"
              >
                View All Clubs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container px-4 md:px-6 py-16">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 p-8 md:p-12">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]"></div>
          <div className="flex flex-col items-center justify-center space-y-4 text-center relative z-10">
            <Badge variant="outline" className="px-3 py-1 text-sm font-medium border-primary/20">
              Join Us Today
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Become a part of the Nss Community</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join NSS Club today and be part of the Nss Community . 
            </p>
            <Link href="/apply">
              <Button size="lg" className="mt-4 shadow-md hover:shadow-lg transition-all hover:scale-105">
                Apply Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

