"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  ClipboardList,
  Shield,
  Eye,
  Users,
  Calendar,
  Plus,
  Settings,
  Loader2,
  Search,
  Filter,
  MoreHorizontal,
} from "lucide-react"
import { getCurrentUser, isUserAdmin, getApplications, updateApplicationStatus, getFilePreview } from "@/lib/appwrite"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [applications, setApplications] = useState<any[]>([])
  const [filteredApplications, setFilteredApplications] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("dashboard")
  const [activeApplicationsTab, setActiveApplicationsTab] = useState("pending")
  const router = useRouter()

  useEffect(() => {
    async function checkAdmin() {
      try {
        const user = await getCurrentUser()
        if (!user) {
          router.push("/login")
          return
        }

        const adminStatus = await isUserAdmin()
        setIsAdmin(adminStatus)

        if (adminStatus) {
          await loadApplications("pending")
        }
      } catch (error) {
        console.error("Error checking admin status:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAdmin()
  }, [router])

  useEffect(() => {
    // Filter applications based on search query
    if (searchQuery.trim() === "") {
      setFilteredApplications(applications)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredApplications(
        applications.filter(
          app => 
            app.name.toLowerCase().includes(query) || 
            app.email.toLowerCase().includes(query) ||
            app.department?.toLowerCase().includes(query) ||
            getClubName(app.club).toLowerCase().includes(query)
        )
      )
    }
  }, [searchQuery, applications])

  async function loadApplications(status: string) {
    setLoading(true)
    try {
      const response = await getApplications(status === "all" ? "all" : status)
      setApplications(response.documents)
      setFilteredApplications(response.documents)
      setActiveApplicationsTab(status)
    } catch (error) {
      console.error("Error loading applications:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(applicationId: string, newStatus: string) {
    try {
      await updateApplicationStatus(applicationId, newStatus)
      // Reload the current tab
      await loadApplications(activeApplicationsTab)
    } catch (error) {
      console.error("Error updating application status:", error)
    }
  }

  if (loading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we load the admin panel.</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="container py-12">
        <Alert variant="destructive" className="mb-6">
          <Shield className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>You do not have permission to access the admin panel.</AlertDescription>
        </Alert>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-6 max-w-screen-2xl mx-auto">
      <div className="flex items-center justify-between mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage your club website content and members</p>
        </div>
        <div className="flex gap-3">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              View Site
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-12 md:col-span-3 lg:col-span-2">
          <Card className="sticky top-28">
            <CardContent className="p-3">
              <nav className="space-y-1">
                <Button
                  variant={activeTab === "dashboard" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("dashboard")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                <Button
                  variant={activeTab === "applications" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveTab("applications")
                    loadApplications(activeApplicationsTab)
                  }}
                >
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Applications
                </Button>
                <Button
                  variant={activeTab === "clubs" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("clubs")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Clubs
                </Button>
                <Button
                  variant={activeTab === "events" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("events")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Events
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="col-span-12 md:col-span-9 lg:col-span-10">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <StatsCard 
                  icon={<ClipboardList className="h-5 w-5 text-blue-500" />}
                  title="Applications"
                  value={applications.length}
                  description="Total applications received"
                  color="blue"
                />
                <StatsCard 
                  icon={<Clock className="h-5 w-5 text-yellow-500" />}
                  title="Pending"
                  value={applications.filter((app) => app.status === "pending").length}
                  description="Applications awaiting review"
                  color="yellow"
                />
                <StatsCard 
                  icon={<CheckCircle className="h-5 w-5 text-green-500" />}
                  title="Approved"
                  value={applications.filter((app) => app.status === "approved").length}
                  description="Approved applications"
                  color="green"
                />
                <StatsCard 
                  icon={<XCircle className="h-5 w-5 text-red-500" />}
                  title="Rejected"
                  value={applications.filter((app) => app.status === "rejected").length}
                  description="Rejected applications"
                  color="red"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-none shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Recent Applications</CardTitle>
                    <CardDescription>Latest club applications received</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    {applications.length > 0 ? (
                      <div className="space-y-3">
                        {applications.slice(0, 5).map((application) => (
                          <div 
                            key={application.$id} 
                            className="flex items-center justify-between border-b pb-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-primary/10">
                                {application.profileImageId ? (
                                  <Image
                                    src={getFilePreview(application.profileImageId) || "/placeholder.svg"}
                                    alt={application.name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="bg-primary/10 w-full h-full flex items-center justify-center text-primary">
                                    {application.name.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{application.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {getClubName(application.club)} • {new Date(application.submissionDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <StatusBadge status={application.status} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">No applications found</p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => {
                        setActiveTab("applications")
                        loadApplications("all")
                      }}
                    >
                      View All Applications
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="border-none shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                    <CardDescription>Common administrative tasks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <QuickActionButton 
                        icon={<Plus className="h-5 w-5" />}
                        label="Add Club"
                        onClick={() => setActiveTab("clubs")}
                      />
                      <QuickActionButton 
                        icon={<Calendar className="h-5 w-5" />}
                        label="Add Event"
                        onClick={() => setActiveTab("events")}
                      />
                      <QuickActionButton 
                        icon={<Users className="h-5 w-5" />}
                        label="Manage Users"
                        onClick={() => {}}
                      />
                      <QuickActionButton 
                        icon={<Settings className="h-5 w-5" />}
                        label="Settings"
                        onClick={() => {}}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === "applications" && (
            <div className="space-y-6">
              <Card className="border-none shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Club Applications</CardTitle>
                      <CardDescription>Review and manage student applications to join clubs</CardDescription>
                    </div>
                    <div className="w-full md:w-64">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search applications..."
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeApplicationsTab} onValueChange={(value) => loadApplications(value)}>
                    <TabsList className="mb-6 w-full justify-start">
                      <TabsTrigger value="pending">
                        <Clock className="mr-2 h-4 w-4" />
                        Pending
                      </TabsTrigger>
                      <TabsTrigger value="approved">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approved
                      </TabsTrigger>
                      <TabsTrigger value="rejected">
                        <XCircle className="mr-2 h-4 w-4" />
                        Rejected
                      </TabsTrigger>
                      <TabsTrigger value="all">
                        <ClipboardList className="mr-2 h-4 w-4" />
                        All
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="pending">
                      <ApplicationsList
                        applications={filteredApplications.filter((app) => app.status === "pending")}
                        onStatusChange={handleStatusChange}
                      />
                    </TabsContent>

                    <TabsContent value="approved">
                      <ApplicationsList
                        applications={filteredApplications.filter((app) => app.status === "approved")}
                        onStatusChange={handleStatusChange}
                      />
                    </TabsContent>

                    <TabsContent value="rejected">
                      <ApplicationsList
                        applications={filteredApplications.filter((app) => app.status === "rejected")}
                        onStatusChange={handleStatusChange}
                      />
                    </TabsContent>

                    <TabsContent value="all">
                      <ApplicationsList 
                        applications={filteredApplications} 
                        onStatusChange={handleStatusChange} 
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Clubs Tab */}
          {activeTab === "clubs" && (
            <div className="space-y-6">
              <Card className="border-none shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle>Manage Clubs</CardTitle>
                    <CardDescription>Add, edit, or remove clubs from your website</CardDescription>
                  </div>
                  <Link href="/admin/clubs/new">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Club
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-12 text-muted-foreground">
                    Club management functionality will be implemented here
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === "events" && (
            <div className="space-y-6">
              <Card className="border-none shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle>Manage Events</CardTitle>
                    <CardDescription>Add, edit, or remove events from your website</CardDescription>
                  </div>
                  <Link href="/admin/events/new">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Event
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-12 text-muted-foreground">
                    Event management functionality will be implemented here
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatsCard({ icon, title, value, description, color }) {
  const gradients = {
    blue: "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900",
    yellow: "from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900",
    green: "from-green-50 to-green-100 dark:from-green-950 dark:to-green-900",
    red: "from-red-50 to-red-100 dark:from-red-950 dark:to-red-900",
  }

  return (
    <Card className={`bg-gradient-to-br ${gradients[color]} shadow-md hover:shadow-lg transition-all border-none`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function QuickActionButton({ icon, label, onClick }) {
  return (
    <Button
      variant="outline"
      className="h-20 flex flex-col items-center justify-center space-y-1 hover:bg-primary/10 border-dashed"
      onClick={onClick}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </Button>
  )
}

function ApplicationsList({
  applications,
  onStatusChange,
}: {
  applications: any[]
  onStatusChange: (id: string, status: string) => void
}) {
  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ClipboardList className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground font-medium">No applications found.</p>
        <p className="text-sm text-muted-foreground mt-1">Try changing your filters or search terms.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <Card key={application.$id} className="overflow-hidden hover:shadow-lg transition-all border-none shadow-md">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/4 bg-gradient-to-r from-primary/5 to-transparent p-4 flex flex-col items-center md:items-start space-y-3 md:border-r dark:border-gray-700">
              <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-primary/10">
                {application.profileImageId ? (
                  <Image
                    src={getFilePreview(application.profileImageId) || "/placeholder.svg"}
                    alt={application.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="bg-primary/10 w-full h-full flex items-center justify-center text-xl font-bold text-primary">
                    {application.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="text-center md:text-left">
                <StatusBadge status={application.status} />
                <h3 className="font-bold mt-2">{application.name}</h3>
                <p className="text-sm text-muted-foreground">{application.email}</p>
                <p className="text-sm text-muted-foreground">{application.phone}</p>
              </div>
              <div className="text-sm mt-1">
                <p>Student ID: {application.studentId}</p>
                <p>Grade {application.year}</p>
                <p>{application.department}</p>
              </div>
            </div>

            <div className="w-full md:w-3/4 p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Applying for</h3>
                    <p className="font-medium">{getClubName(application.club)}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Reason for joining</h3>
                    <p className="text-sm">{application.reason}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {application.skills && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Skills</h3>
                      <p className="text-sm">{application.skills}</p>
                    </div>
                  )}

                  {application.experience && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Experience</h3>
                      <p className="text-sm">{application.experience}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Submitted on</h3>
                    <p className="text-sm">
                      {new Date(application.submissionDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-3 border-t dark:border-gray-700">
                <Link href={`/admin/applications/${application.$id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {application.status !== "approved" && (
                      <DropdownMenuItem onClick={() => onStatusChange(application.$id, "approved")}>
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        Approve
                      </DropdownMenuItem>
                    )}
                    
                    {application.status !== "rejected" && (
                      <DropdownMenuItem onClick={() => onStatusChange(application.$id, "rejected")}>
                        <XCircle className="mr-2 h-4 w-4 text-red-500" />
                        Reject
                      </DropdownMenuItem>
                    )}
                    
                    {application.status !== "pending" && (
                      <DropdownMenuItem onClick={() => onStatusChange(application.$id, "pending")}>
                        <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                        Mark as Pending
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === "approved") {
    return (
      <Badge className="bg-green-500 hover:bg-green-600 text-white">
        <CheckCircle className="mr-1 h-3 w-3" />
        Approved
      </Badge>
    )
  }

  if (status === "rejected") {
    return (
      <Badge variant="destructive">
        <XCircle className="mr-1 h-3 w-3" />
        Rejected
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20">
      <Clock className="mr-1 h-3 w-3" />
      Pending
    </Badge>
  )
}

function getClubName(clubId: string) {
  const clubs: Record<string, string> = {
    science: "Science Club",
    arts: "Arts & Culture",
    community: "Community Service",
    debate: "Debate & Public Speaking",
    tech: "Technology Club",
    sports: "Sports & Fitness",
  }

  return clubs[clubId] || clubId
}