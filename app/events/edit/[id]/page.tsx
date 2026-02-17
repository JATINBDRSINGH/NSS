import { EventEditForm } from "@/components/event-edit-form"

export default function EditEventPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-poppins mb-8">
        Edit Event
      </h1>
      <EventEditForm eventId={params.id} />
    </div>
  )
}
