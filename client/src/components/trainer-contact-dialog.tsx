import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

interface TrainerContactDropdownProps {
  isProOrElite: boolean;
}

export function TrainerContactDropdown({ isProOrElite }: TrainerContactDropdownProps) {
  const [trainerPhone, setTrainerPhone] = useState<string | null>(null);
  const [trainerName, setTrainerName] = useState<string>("");
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("clientId");
    setClientId(id);
  }, []);

  const { data: clientData } = useQuery<any>({
    queryKey: ["/api/client-profile", clientId],
    enabled: !!clientId && isProOrElite,
  });

  const { data: trainerData } = useQuery<any>({
    queryKey: ["/api/trainer", clientData?.trainerId],
    enabled: !!clientData?.trainerId && isProOrElite,
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
    }
  };

  const handleMessage = () => {
    if (trainerPhone) {
      // Open WhatsApp with trainer's number
      const whatsappUrl = `https://wa.me/${trainerPhone}?text=Hi%20${encodeURIComponent(trainerName)}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  if (!isProOrElite) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          data-testid="button-call-trainer"
          title="Contact Trainer"
        >
          <Phone className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={handleCall}
          disabled={!trainerPhone}
          className="cursor-pointer gap-2"
          data-testid="dropdown-call"
        >
          <Phone className="h-4 w-4" />
          <span>Call</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleMessage}
          disabled={!trainerPhone}
          className="cursor-pointer gap-2"
          data-testid="dropdown-message"
        >
          <MessageCircle className="h-4 w-4" />
          <span>Message</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
