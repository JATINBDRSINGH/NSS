import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container py-8 px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground font-bold rounded-md p-1.5 text-sm">NSS</div>
              <h3 className="text-lg font-bold">NSS Club</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Helping students grow at National School of Sciences since 2010.
            </p>
            {/* Social Media Icons - Mobile Visible */}
            <div className="flex space-x-4 sm:hidden mt-2">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          {/* Links Section */}
          <div className="space-y-4">
            <h3 className="text-base font-bold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center">
                  <span className="mr-2">•</span> Home
                </Link>
              </li>
              <li>
                <Link href="/clubs" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center">
                  <span className="mr-2">•</span> Clubs
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center">
                  <span className="mr-2">•</span> Events
                </Link>
              </li>
              <li>
                <Link href="/apply" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center">
                  <span className="mr-2">•</span> Join Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-base font-bold">Contact Us</h3>
            <ul className="space-y-3">
              <li className="text-sm text-muted-foreground flex items-start">
                <span className="mr-2 mt-1">📧</span> 
                <span>nssclub@nationalschool.edu</span>
              </li>
              <li className="text-sm text-muted-foreground flex items-start">
                <span className="mr-2 mt-1">📞</span>
                <span>(123) 456-7890</span>
              </li>
              <li className="text-sm text-muted-foreground flex items-start">
                <span className="mr-2 mt-1">📍</span>
                <span>Lainchaur, Kathmandu</span>
              </li>
            </ul>
          </div>

          {/* Social Media Section - Desktop */}
          <div className="space-y-4 hidden sm:block">
            <h3 className="text-base font-bold">Follow Us</h3>
            <div className="flex flex-col space-y-3">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center">
                <Facebook className="h-5 w-5 mr-2" />
                <span className="text-sm">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center">
                <Instagram className="h-5 w-5 mr-2" />
                <span className="text-sm">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center">
                <Twitter className="h-5 w-5 mr-2" />
                <span className="text-sm">Twitter</span>
              </Link>
            </div>
          </div>
        </div>

        

        {/* Copyright Section */}
        <div className="mt-8 pt-4 border-t text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} National School of Sciences Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}