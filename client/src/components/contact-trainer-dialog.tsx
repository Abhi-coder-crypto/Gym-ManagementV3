import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

interface ContactTrainerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactTrainerDialog({ open, onOpenChange }: ContactTrainerDialogProps) {
  const [trainerPhone, setTrainerPhone] = useState<string | null>(null);
  const [trainerName, setTrainerName] = useState<string>("");
  const [hasTrainer, setHasTrainer] = useState(false);

  const { data: authData } = useQuery<any>({
    queryKey: ["/api/auth/me"],
    enabled: open,
  });

  const clientData = authData?.client || authData?.user;

  useEffect(() => {
    if (clientData?.trainerId) {
      setHasTrainer(true);
    } else {
      setHasTrainer(false);
    }
  }, [clientData?.trainerId]);

  const { data: trainerData } = useQuery<any>({
    queryKey: ["/api/trainer", clientData?.trainerId],
    enabled: !!clientData?.trainerId && open,
  });

  useEffect(() => {
    if (trainerData?.phone) {
      const formattedPhone = trainerData.phone.replace(/\D/g, "");
      setTrainerPhone(formattedPhone);
      setTrainerName(trainerData.name || "Your Trainer");
    }
  }, [trainerData]);

  const handleCall = () => {
    if (trainerPhone) {
      window.location.href = `tel:+${trainerPhone}`;
      onOpenChange(false);
    }
  };

  const handleMessage = () => {
    if (trainerPhone) {
      const whatsappUrl = `https://wa.me/${trainerPhone}?text=Hi%20${encodeURIComponent(trainerName)}`;
      window.open(whatsappUrl, "_blank");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {hasTrainer ? `Contact ${trainerName}` : "Trainer Not Assigned"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          {hasTrainer && trainerPhone ? (
            <>
              <p className="text-sm text-muted-foreground">
                Trainer Phone: <span className="font-semibold text-foreground">+{trainerPhone}</span>
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={handleCall}
                  className="flex-1 gap-2"
                  size="lg"
                  data-testid="button-call-trainer-dialog"
                >
                  <Phone className="h-4 w-4" />
                  Call
                </Button>
                <Button
                  onClick={handleMessage}
                  variant="outline"
                  className="flex-1 gap-2"
                  size="lg"
                  data-testid="button-message-trainer-dialog"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Button>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              {hasTrainer
                ? "Trainer contact information not available"
                : "You haven't been assigned a trainer yet. Please contact support to get assigned a trainer."}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
