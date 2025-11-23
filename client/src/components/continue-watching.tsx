import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Play, ArrowRight } from "lucide-react";
import { useState } from "react";

interface Video {
  id: string;
  title: string;
  category: string;
  thumbnail?: string;
  duration?: number;
}

interface ContinueWatchingProps {
  videos: Video[];
  isLoading?: boolean;
  onWatchAll?: () => void;
}

function VideoCard({ video }: { video: Video }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card
      key={video.id}
      className="hover-elevate overflow-hidden cursor-pointer transition-all group border-0 h-full"
      data-testid={`video-card-${video.id}`}
    >
      <div className="relative bg-gradient-to-br from-slate-300 to-slate-400 overflow-hidden rounded-lg h-48 w-full">
        {video.thumbnail && (
          <img
            src={video.thumbnail}
            alt={video.title}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
        {!imageLoaded && (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-300 to-slate-400 absolute inset-0">
            <Play className="h-8 w-8 text-white/60" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-blue-600 hover:bg-blue-700 rounded-full p-3">
              <Play className="h-6 w-6 text-white fill-white" />
            </div>
          </div>
        </div>
        {video.duration && (
          <div className="absolute top-2 right-2 bg-black/80 rounded-lg px-2 py-1 flex items-center gap-1">
            <Clock className="h-3 w-3 text-white" />
            <span className="text-xs font-semibold text-white">
              {video.duration} min
            </span>
          </div>
        )}
      </div>
      <CardContent className="pt-4 pb-2 space-y-2 flex-1">
        <div className="text-xs font-medium text-muted-foreground capitalize">
          {video.category}
        </div>
        <p className="font-semibold text-base line-clamp-2">
          {video.title}
        </p>
      </CardContent>
    </Card>
  );
}

export function ContinueWatching({ videos, isLoading, onWatchAll }: ContinueWatchingProps) {
  const displayVideos = videos.slice(0, 9);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-black dark:text-white">Workout Library</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onWatchAll}
          data-testid="button-watch-all"
          className="flex items-center gap-1 text-black border-black hover:bg-black/5"
        >
          Watch all
          <ArrowRight className="h-3 w-3 text-black" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}
