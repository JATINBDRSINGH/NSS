"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface TermsDialogProps {
  children: React.ReactNode
}

export function TermsDialog({ children }: TermsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <p>By using this NSS Club website, you agree to the following terms:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You will provide accurate information in your applications</li>
            <li>You will respect club rules and regulations</li>
            <li>You will participate actively in club activities</li>
            <li>You will maintain appropriate conduct during events</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}
