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
  const [hasTrainer, setHasTrainer] = useState(false);

  const { data: authData } = useQuery<any>({
    queryKey: ["/api/auth/me"],
    enabled: isProOrElite,
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
    enabled: !!clientData?.trainerId && isProOrElite,
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
    }
  };

  const handleMessage = () => {
    if (trainerPhone) {
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
          title={hasTrainer ? "Contact Trainer" : "No trainer assigned"}
        >
          <Phone className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={handleCall}
          disabled={!hasTrainer || !trainerPhone}
          className={hasTrainer && trainerPhone ? "cursor-pointer gap-2" : "gap-2"}
          data-testid="dropdown-call"
        >
          <Phone className="h-4 w-4" />
          <span>{hasTrainer ? "Call" : "No trainer assigned"}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleMessage}
          disabled={!hasTrainer || !trainerPhone}
          className={hasTrainer && trainerPhone ? "cursor-pointer gap-2" : "gap-2"}
          data-testid="dropdown-message"
        >
          <MessageCircle className="h-4 w-4" />
          <span>{hasTrainer ? "Message" : "No trainer assigned"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
