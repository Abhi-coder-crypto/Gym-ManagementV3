import { ClientDetailModal } from "../client-detail-modal";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ClientDetailModalExample() {
  const [open, setOpen] = useState(false);

  const sampleClient = {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234-567-8901",
    package: "Elite",
    status: "active",
    joinDate: "Nov 10, 2025",
  };

  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>View Client Details</Button>
      <ClientDetailModal
        open={open}
        onOpenChange={setOpen}
        client={sampleClient}
      />
    </div>
  );
}
