import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock } from "lucide-react";

interface VideoCardProps {
  title: string;
  category: string;
  duration: string;
  thumbnail: string;
  onPlay: () => void;
}

export function VideoCard({ title, category, duration, thumbnail, onPlay }: VideoCardProps) {
  return (
    <Card
      className="overflow-hidden hover-elevate cursor-pointer"
      onClick={onPlay}
      data-testid={`card-video-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="relative aspect-video bg-muted">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <div className="bg-primary rounded-full p-4">
            <Play className="h-8 w-8 text-primary-foreground fill-current" />
          </div>
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm" data-testid="badge-duration">
            <Clock className="h-3 w-3 mr-1" />
            {duration}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <Badge className="mb-2" variant="outline" data-testid="badge-category">
          {category}
        </Badge>
        <h3 className="font-semibold line-clamp-2" data-testid="text-video-title">
          {title}
        </h3>
      </CardContent>
    </Card>
  );
}
