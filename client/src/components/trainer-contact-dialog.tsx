import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

interface TrainerContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TrainerContactDialog({ open, onOpenChange }: TrainerContactDialogProps) {
  const [trainerPhone, setTrainerPhone] = useState<string | null>(null);
  const [trainerName, setTrainerName] = useState<string>("");
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("clientId");
    setClientId(id);
  }, []);

  const { data: clientData } = useQuery<any>({
    queryKey: ["/api/client-profile", clientId],
    enabled: !!clientId && open,
  });

  const { data: trainerData } = useQuery<any>({
    queryKey: ["/api/trainer", clientData?.trainerId],
    enabled: !!clientData?.trainerId && open,
  });

  useEffect(() => {
    if (trainerData?.phone) {
      // Format phone number for international format (remove spaces/hyphens if present)
      const formattedPhone = trainerData.phone.replace(/\D/g, "");
      setTrainerPhone(formattedPhone);
      setTrainerName(trainerData.name || "Your Trainer");
    }
  }, [trainerData]);

  const handleCall = () => {
    if (trainerPhone) {
      // Open phone dialer with trainer's number
      window.location.href = `tel:+${trainerPhone}`;
      onOpenChange(false);
    }
  };

  const handleWhatsApp = () => {
    if (trainerPhone) {
      // Open WhatsApp with trainer's number
      const whatsappUrl = `https://wa.me/${trainerPhone}?text=Hi%20${encodeURIComponent(trainerName)}`;
      window.open(whatsappUrl, "_blank");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact {trainerName}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          {trainerPhone ? (
            <>
              <p className="text-sm text-muted-foreground">
                Trainer Phone: <span className="font-semibold text-foreground">+{trainerPhone}</span>
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={handleCall}
                  className="flex-1 gap-2"
                  size="lg"
                  data-testid="button-call-trainer"
                >
                  <Phone className="h-4 w-4" />
                  Call
                </Button>
                <Button
                  onClick={handleWhatsApp}
                  variant="outline"
                  className="flex-1 gap-2"
                  size="lg"
                  data-testid="button-whatsapp-trainer"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Button>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Trainer contact information not available
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
