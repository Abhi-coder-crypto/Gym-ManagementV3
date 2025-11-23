import { ClientHeader } from "@/components/client-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Play } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { MobileNavigation } from "@/components/mobile-navigation";

interface Video {
  id: string;
  category: string;
  title: string;
  duration: number;
  thumbnail?: string;
}

const DUMMY_VIDEOS: Video[] = [
  {
    id: "1",
    category: "Strength",
    title: "Full Body Strength Training",
    duration: 45,
    thumbnail: "https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=400&h=300&fit=crop",
  },
  {
    id: "2",
    category: "Yoga",
    title: "Morning Yoga Flow",
    duration: 30,
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop",
  },
  {
    id: "3",
    category: "Cardio",
    title: "HIIT Cardio Blast",
    duration: 25,
    thumbnail: "https://images.unsplash.com/photo-1554284311-beee415c201f?w=400&h=300&fit=crop",
  },
  {
    id: "4",
    category: "Strength",
    title: "Upper Body Power",
    duration: 40,
    thumbnail: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=300&fit=crop",
  },
  {
    id: "5",
    category: "Yoga",
    title: "Evening Relaxation",
    duration: 35,
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop",
  },
  {
    id: "6",
    category: "Cardio",
    title: "Running Endurance",
    duration: 50,
    thumbnail: "https://images.unsplash.com/photo-1538895917929-37aeb60d54c9?w=400&h=300&fit=crop",
  },
];

export default function ClientVideoLibrary() {
  const [, setLocation] = useLocation();
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("clientId");
    if (!id) {
      setLocation("/client-access");
    } else {
      setClientId(id);
    }
  }, [setLocation]);

  return (
    <div className="w-full bg-background min-h-screen mb-20 md:mb-0">
      <ClientHeader currentPage="videos" />

      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-black text-black dark:text-white">
              Video Library
            </h1>
            <p className="text-muted-foreground">
              Browse and watch all available workout videos
            </p>
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DUMMY_VIDEOS.map((video) => (
              <Card
                key={video.id}
                className="hover-elevate overflow-hidden cursor-pointer transition-all group border-0"
                data-testid={`video-card-${video.id}`}
              >
                <div className="relative aspect-video bg-muted overflow-hidden rounded-lg">
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-300 to-slate-400">
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
                  <div className="absolute top-2 right-2 bg-black/80 rounded-lg px-2 py-1 flex items-center gap-1">
                    <Clock className="h-3 w-3 text-white" />
                    <span className="text-xs font-semibold text-white">
                      {video.duration} min
                    </span>
                  </div>
                </div>
                <CardContent className="pt-3 pb-2 space-y-1.5">
                  <div className="text-xs font-medium text-muted-foreground capitalize">
                    {video.category}
                  </div>
                  <p className="font-semibold text-sm line-clamp-2">
                    {video.title}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <MobileNavigation />
    </div>
  );
}
