"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface PrivacyDialogProps {
  children: React.ReactNode
}

export function PrivacyDialog({ children }: PrivacyDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Privacy Policy</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <p>We collect and use your information to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Process your club applications</li>
            <li>Communicate about events and activities</li>
            <li>Maintain membership records</li>
            <li>Send relevant notifications</li>
          </ul>
          <p>Your data is stored securely and not shared with third parties.</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
