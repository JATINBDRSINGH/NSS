import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="space-y-4 text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-poppins">About NSS Club</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Learn about our mission, history, and the impact we're making at National School of Sciences.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center mb-16">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold font-poppins">Our Mission</h2>
          <p className="text-muted-foreground">
            At the National School of Sciences Club, we are committed to enhancing the high school journey for NSS students through a variety of extracurricular activities. We strive to nurture well-rounded individuals by offering opportunities to pursue passions beyond the traditional classroom setting.
          </p>
          <p className="text-muted-foreground">
            Our mission is to foster leadership, creativity, and community engagement among students at NSS, preparing
            them for future success while making their high school years memorable and meaningful.
          </p>
          <div className="pt-4">
            <Link href="/apply">
              <Button className="transition-all hover:scale-105">
                Join Our Mission
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

            </Link>
          </div>
        </div>
        <div className="relative h-[300px] lg:h-[400px] overflow-hidden rounded-xl shadow-lg transition-transform hover:scale-[1.02] duration-300">
          <Image
            src="/placeholder.svg?height=400&width=600"
            alt="NSS Club members in action"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <Tabs defaultValue="history" className="mb-16">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          {/* <TabsTrigger value="history">History</TabsTrigger> */}
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="team">Our Team</TabsTrigger>
        </TabsList>
        {/* <TabsContent value="history">
          <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle className="font-poppins">Our History</CardTitle>
              <CardDescription>The journey of NSS Club from its beginnings to today. </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-primary">2010</div>
                  <h3 className="font-medium">Establishment</h3>
                  <p className="text-sm text-muted-foreground">
                    The NSS Club was founded with just three initial clubs to provide students with extracurricular
                    opportunities.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-primary">2015</div>
                  <h3 className="font-medium">Expansion</h3>
                  <p className="text-sm text-muted-foreground">
                    Our club expanded to include six specialized clubs covering a wide range of interests and
                    activities.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-primary">2020</div>
                  <h3 className="font-medium">Digital Transformation</h3>
                  <p className="text-sm text-muted-foreground">
                    The club embraced technology with online events and digital resources, reaching more students than
                    ever.
                  </p>
                </div>
              </div>
              <p className="mt-6">
                Over the years, the NSS Club has grown from a small group of dedicated students to a vibrant
                organization with multiple specialized clubs. We have consistently worked to provide meaningful
                extracurricular experiences for all students at National School of Sciences.
              </p>
              <p>
                Today, with over 200 active members across different clubs, we continue to uphold our founding
                principles and strive to make high school a more enriching experience for everyone.
              </p>
            </CardContent>
          </Card>
        </TabsContent> */}
        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle>Our Achievements</CardTitle>
              <CardDescription>Recognitions and milestones that mark our journey of service.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Awards & Recognition</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/10 text-primary p-1 rounded-full mt-0.5">•</span>
                      <span>Best NSS Unit Award by the Ministry of Youth Affairs (2022)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/10 text-primary p-1 rounded-full mt-0.5">•</span>
                      <span>State-level Best Volunteer Award for 5 consecutive years</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/10 text-primary p-1 rounded-full mt-0.5">•</span>
                      <span>Recognition from the United Nations Volunteers program</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/10 text-primary p-1 rounded-full mt-0.5">•</span>
                      <span>Excellence in Community Service Award by the State Government</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Impact Metrics</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/10 text-primary p-1 rounded-full mt-0.5">•</span>
                      <span>Over 100,000 volunteer hours contributed annually</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/10 text-primary p-1 rounded-full mt-0.5">•</span>
                      <span>Planted more than 50,000 trees in the last decade</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/10 text-primary p-1 rounded-full mt-0.5">•</span>
                      <span>Educated over 5,000 underprivileged children</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/10 text-primary p-1 rounded-full mt-0.5">•</span>
                      <span>Organized 200+ blood donation camps collecting 25,000+ units</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Leadership Team</CardTitle>
              <CardDescription>Meet the dedicated individuals who lead our organization.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    name: "Dr. Kumar",
                    role: "Faculty Coordinator",
                    bio: "Dr. Kumar has been leading the NSS Club for over 10 years and has been instrumental in its growth.",
                    image: "/placeholder.svg?height=200&width=200",
                  },
                  {
                    name: "Priya Sharma",
                    role: "Student President",
                    bio: "A final year student who has been actively involved in NSS activities since her first year.",
                    image: "/placeholder.svg?height=200&width=200",
                  },
                  {
                    name: "Amit Patel",
                    role: "General Secretary",
                    bio: "Responsible for coordinating between different clubs and managing administrative tasks.",
                    image: "/placeholder.svg?height=200&width=200",
                  },
                ].map((member, index) => (
                  <div key={index} className="text-center">
                    <div className="relative h-40 w-40 mx-auto mb-4 overflow-hidden rounded-full">
                      <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                    </div>
                    <h3 className="font-bold">{member.name}</h3>
                    <p className="text-sm text-primary">{member.role}</p>
                    <p className="text-sm text-muted-foreground mt-2">{member.bio}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="bg-muted p-8 rounded-lg">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Get Involved</h2>
          <p className="text-muted-foreground mt-2">There are many ways you can contribute to our mission.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Join a Club",
              description:
                "Become a member of one of our specialized clubs and contribute directly to our initiatives.",
              icon: <Users className="h-10 w-10 text-primary" />,
              link: "/apply",
            },
            {
              title: "Attend Events",
              description:
                "Participate in our events and activities to support our cause and learn more about our work.",
              icon: <Calendar className="h-10 w-10 text-primary" />,
              link: "/events",
            },
            {
              title: "Visit Us",
              description: "Come to our office on campus to learn more about our work and how you can get involved.",
              icon: <MapPin className="h-10 w-10 text-primary" />,
              link: "/contact",
            },
          ].map((item, index) => (
            <Card key={index}>
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4">{item.icon}</div>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
              <div className="flex justify-center pb-6">
                <Link href={item.link}>
                  <Button variant="outline">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

