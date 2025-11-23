import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Video, Zap } from "lucide-react";

interface LiveSessionCardProps {
  title: string;
  trainer: string;
  date: string;
  time: string;
  duration: string;
  participants: number;
  maxParticipants: number;
  status: "upcoming" | "live" | "completed";
  onJoin?: () => void;
}

export function LiveSessionCard({
  title,
  trainer,
  date,
  time,
  duration,
  participants,
  maxParticipants,
  status,
  onJoin,
}: LiveSessionCardProps) {
  const isLive = status === "live";
  const isUpcoming = status === "upcoming";
  const spotsFilled = Math.round((participants / maxParticipants) * 100);

  return (
    <Card 
      className={`overflow-hidden hover-elevate transition-all ${
        isLive 
          ? "border-green-300 dark:border-green-700 bg-gradient-to-br from-green-50 to-transparent dark:from-green-950/30 dark:to-transparent" 
          : "bg-gradient-to-br from-slate-50 dark:from-slate-900/50 to-transparent"
      }`}
      data-testid={`card-session-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {/* Top Bar with Status */}
      <div className={`h-1 ${isLive ? "bg-gradient-to-r from-green-500 to-green-400" : "bg-gradient-to-r from-blue-500 to-blue-400"}`} />
      
      <CardContent className="p-6 space-y-4">
        {/* Header Section */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 
                className="text-lg font-bold text-foreground leading-tight" 
                data-testid="text-session-title"
              >
                {title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1" data-testid="text-trainer">
                with <span className="font-semibold text-foreground">{trainer}</span>
              </p>
            </div>
            {isLive && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 flex items-center gap-1 whitespace-nowrap" data-testid="badge-status">
                <Zap className="h-3 w-3" />
                Live Now
              </Badge>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-3 gap-3">
          {/* Date */}
          <div className="flex flex-col gap-1 p-2 rounded-md bg-white/40 dark:bg-slate-800/40">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span className="text-xs text-muted-foreground font-medium">Date</span>
            </div>
            <p className="text-sm font-semibold text-foreground" data-testid="text-date">{date}</p>
          </div>

          {/* Time */}
          <div className="flex flex-col gap-1 p-2 rounded-md bg-white/40 dark:bg-slate-800/40">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
              <span className="text-xs text-muted-foreground font-medium">Time</span>
            </div>
            <p className="text-sm font-semibold text-foreground" data-testid="text-time">{time}</p>
          </div>

          {/* Duration */}
          <div className="flex flex-col gap-1 p-2 rounded-md bg-white/40 dark:bg-slate-800/40">
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              <span className="text-xs text-muted-foreground font-medium">Duration</span>
            </div>
            <p className="text-sm font-semibold text-foreground">{duration}</p>
          </div>
        </div>

        {/* Participants Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground" data-testid="text-participants">
                {participants}/{maxParticipants} participants
              </span>
            </div>
            <span className="text-xs font-semibold text-muted-foreground">{spotsFilled}%</span>
          </div>
          {/* Progress bar */}
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all ${
                spotsFilled > 80 
                  ? "bg-gradient-to-r from-orange-500 to-red-500" 
                  : spotsFilled > 50 
                  ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                  : "bg-gradient-to-r from-blue-500 to-cyan-500"
              }`}
              style={{ width: `${spotsFilled}%` }}
            />
          </div>
        </div>

        {/* Join Button */}
        {status !== "completed" && (
          <Button
            onClick={onJoin}
            className={`w-full font-semibold transition-all ${
              isLive
                ? "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
                : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
            }`}
            data-testid="button-join-session"
          >
            <Video className="h-4 w-4 mr-2" />
            {isLive ? "Join Live Now" : "Reserve Spot"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
