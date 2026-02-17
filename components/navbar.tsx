"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { 
  Menu, 
  User, 
  LogOut, 
  LogIn,
  ChevronDown
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"
import Image from "next/image"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar"
import { account } from "@/lib/appwrite"
import { toast } from "@/components/ui/use-toast" // Import toast component
import { Skeleton } from "@/components/ui/skeleton"

const routes = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/clubs",
    label: "Clubs",
  },
  {
    href: "/events",
    label: "Events",
  },
  {
    href: "/apply",
    label: "Join Us",
  },
  {
    href: "/about",
    label: "About",
  },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      try {
        const currentUser = await account.get()
        setUser(currentUser)
      } catch (error) {
        // User is not logged in, which is fine
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      setUser(null)
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
        variant: "success",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Extract user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return "U"
    return user.name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md overflow-hidden">
            <Image src="/logo.png?height=32&width=32" alt="NSS Club Logo" width={32} height={32} />
          </div>
          <span className="font-poppins text-xl font-bold">NSS Club</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === route.href 
                  ? "text-foreground font-semibold" 
                  : "text-muted-foreground hover:text-foreground/80",
              )}
            >
              {route.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {loading ? (
            <Skeleton className="h-8 w-20 rounded" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative gap-1 p-1 pl-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user.prefs?.avatarUrl} alt={user.name || "User avatar"} />
                    <AvatarFallback className="text-xs">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <span className="ml-1 hidden md:inline-block text-sm font-medium">
                    {user.name ? user.name.split(' ')[0] : "Account"}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user.name && (
                      <p className="font-medium">{user.name}</p>
                    )}
                    {user.email && (
                      <p className="text-xs text-muted-foreground truncate w-40">
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="w-full flex cursor-pointer items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
               
              
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600 cursor-pointer" 
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="outline" size="sm" className="hidden md:flex gap-1">
                  <LogIn className="h-4 w-4 mr-1" />
                  Login
                </Button>
              </Link>
              <Link href="/login" className="hidden md:block">
                <Button size="sm" className="gap-1">Sign Up</Button>
              </Link>
            </div>
          )}
          
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      pathname === route.href ? "text-foreground font-semibold" : "text-muted-foreground",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {route.label}
                  </Link>
                ))}
                <div className="pt-4 border-t">
                  {user ? (
                    <>
                      <div className="flex items-center mb-4">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={user.prefs?.avatarUrl} alt={user.name || "User avatar"} />
                          <AvatarFallback>{getUserInitials()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user.name || "User"}</p>
                          <p className="text-xs text-muted-foreground truncate w-40">{user.email}</p>
                        </div>
                      </div>
                      <Link href="/profile" onClick={() => setOpen(false)}>
                        <Button variant="outline" size="sm" className="w-full mb-2 justify-start">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Button>
                      </Link>
                      
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="w-full mt-2 justify-start"
                        onClick={async () => {
                          await handleLogout()
                          setOpen(false)
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setOpen(false)}>
                        <Button variant="outline" size="sm" className="w-full mb-2">
                          <LogIn className="mr-2 h-4 w-4" />
                          Login
                        </Button>
                      </Link>
                      <Link href="/login" onClick={() => setOpen(false)}>
                        <Button size="sm" className="w-full">
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export async function logout() {
  try {
    return await account.deleteSession("current")
  } catch (error) {
    console.error("Error logging out:", error)
    throw error
  }
}