import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationBell } from "@/components/notification-bell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadVideoModal } from "@/components/upload-video-modal";
import { Search, Plus, Edit, Trash2, Eye, CheckCircle2, FileText, Filter, UserPlus, Play } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { EditVideoModal } from "@/components/edit-video-modal";
import { AssignVideoDialog } from "@/components/assign-video-dialog";
import { VideoPlayerModal } from "@/components/video-player-modal";

interface Video {
  _id: string;
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
  category: string;
  duration?: number;
  intensity?: string;
  difficulty?: string;
  trainer?: string;
  equipment?: string[];
  views?: number;
  completions?: number;
  isDraft?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export default function AdminVideos() {
  const style = { "--sidebar-width": "16rem" };
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [deleteVideoId, setDeleteVideoId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [assignVideoId, setAssignVideoId] = useState<string>("");
  const [assignVideoTitle, setAssignVideoTitle] = useState<string>("");
  const [playingVideo, setPlayingVideo] = useState<{ url: string; title: string } | null>(null);
  const { toast } = useToast();

  // Fetch all videos
  const { data: videos = [], isLoading } = useQuery<Video[]>({
    queryKey: ['/api/videos'],
  });

  // Delete video mutation
  const deleteMutation = useMutation({
    mutationFn: async (videoId: string) => {
      const res = await apiRequest('DELETE', `/api/videos/${videoId}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/videos'] });
      toast({
        title: "Video deleted",
        description: "The video has been successfully deleted from the library.",
      });
      setDeleteVideoId(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete video. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (video: Video) => {
    setSelectedVideo(video);
    setShowEditModal(true);
  };

  const handleDelete = (videoId: string) => {
    setDeleteVideoId(videoId);
  };

  const handleAssign = (video: Video) => {
    setAssignVideoId(video._id);
    setAssignVideoTitle(video.title);
    setShowAssignDialog(true);
  };

  const confirmDelete = () => {
    if (deleteVideoId) {
      deleteMutation.mutate(deleteVideoId);
    }
  };

  // Filter videos
  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || video.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === "all" || video.difficulty === difficultyFilter;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const publishedVideos = filteredVideos.filter(v => !v.isDraft);
  const draftVideos = filteredVideos.filter(v => v.isDraft);

  const VideoGrid = ({ videos: videosToDisplay, isDraftTab }: { videos: Video[], isDraftTab?: boolean }) => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videosToDisplay.map((video) => (
        <Card key={video._id} className="overflow-hidden" data-testid={`card-video-${video._id}`}>
          <div className="relative aspect-video bg-muted">
            {video.thumbnail ? (
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <FileText className="h-12 w-12" />
              </div>
            )}
            {video.isDraft && (
              <Badge className="absolute top-2 right-2" variant="secondary" data-testid="badge-draft">
                Draft
              </Badge>
            )}
          </div>
          
          <CardHeader className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold line-clamp-2" data-testid={`text-video-title-${video._id}`}>
                {video.title}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" data-testid={`badge-category-${video._id}`}>
                {video.category}
              </Badge>
              {video.difficulty && (
                <Badge variant="outline" data-testid={`badge-difficulty-${video._id}`}>
                  {video.difficulty}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-2">
            {video.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {video.description}
              </p>
            )}
            <div className="grid grid-cols-2 gap-2 text-sm">
              {video.duration && (
                <div className="text-muted-foreground">
                  <span className="font-medium">{video.duration}</span> min
                </div>
              )}
              {video.trainer && (
                <div className="text-muted-foreground truncate">
                  By {video.trainer}
                </div>
              )}
            </div>
            
            {video.equipment && video.equipment.length > 0 && (
              <div className="text-sm text-muted-foreground">
                Equipment: {video.equipment.join(", ")}
              </div>
            )}

            <div className="flex items-center gap-4 pt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span data-testid={`text-views-${video._id}`}>{video.views || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" />
                <span data-testid={`text-completions-${video._id}`}>{video.completions || 0}</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPlayingVideo({ url: video.url, title: video.title })}
              data-testid={`button-preview-${video._id}`}
            >
              <Play className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAssign(video)}
              data-testid={`button-assign-${video._id}`}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Assign
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(video)}
              data-testid={`button-edit-${video._id}`}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(video._id)}
              data-testid={`button-delete-${video._id}`}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <h1 className="text-2xl font-display font-bold tracking-tight">Video Library</h1>
            </div>
            <ThemeToggle />
          </header>

          <VideoPlayerModal
            isOpen={!!playingVideo}
            onClose={() => setPlayingVideo(null)}
            videoUrl={playingVideo?.url || ""}
            videoTitle={playingVideo?.title || ""}
          />

          <main className="flex-1 overflow-auto p-8">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2 flex-1 max-w-2xl flex-wrap">
                  <div className="relative flex-1 min-w-[250px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search videos by title or description..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      data-testid="input-search-videos"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowFilters(!showFilters)}
                    data-testid="button-toggle-filters"
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
                <Button onClick={() => setShowUploadModal(true)} data-testid="button-upload-video">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Video
                </Button>
              </div>

              {showFilters && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                          <SelectTrigger data-testid="select-category-filter">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="Strength">Strength</SelectItem>
                            <SelectItem value="Cardio">Cardio</SelectItem>
                            <SelectItem value="Yoga">Yoga</SelectItem>
                            <SelectItem value="HIIT">HIIT</SelectItem>
                            <SelectItem value="Flexibility">Flexibility</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Difficulty</label>
                        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                          <SelectTrigger data-testid="select-difficulty-filter">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Levels</SelectItem>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setCategoryFilter("all");
                            setDifficultyFilter("all");
                          }}
                          className="w-full"
                          data-testid="button-clear-filters"
                        >
                          Clear Filters
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i}>
                      <Skeleton className="aspect-video" />
                      <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-16 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Tabs defaultValue="published" className="space-y-6">
                  <TabsList>
                    <TabsTrigger value="published" data-testid="tab-published">
                      Published ({publishedVideos.length})
                    </TabsTrigger>
                    <TabsTrigger value="drafts" data-testid="tab-drafts">
                      Drafts ({draftVideos.length})
                    </TabsTrigger>
                    <TabsTrigger value="all" data-testid="tab-all">
                      All ({filteredVideos.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="published" className="space-y-4">
                    {publishedVideos.length === 0 ? (
                      <Card>
                        <CardContent className="p-12 text-center text-muted-foreground">
                          No published videos found. Upload your first video to get started!
                        </CardContent>
                      </Card>
                    ) : (
                      <VideoGrid videos={publishedVideos} />
                    )}
                  </TabsContent>

                  <TabsContent value="drafts" className="space-y-4">
                    {draftVideos.length === 0 ? (
                      <Card>
                        <CardContent className="p-12 text-center text-muted-foreground">
                          No draft videos. Save videos as drafts to publish them later.
                        </CardContent>
                      </Card>
                    ) : (
                      <VideoGrid videos={draftVideos} isDraftTab />
                    )}
                  </TabsContent>

                  <TabsContent value="all" className="space-y-4">
                    {filteredVideos.length === 0 ? (
                      <Card>
                        <CardContent className="p-12 text-center text-muted-foreground">
                          No videos found matching your search criteria.
                        </CardContent>
                      </Card>
                    ) : (
                      <VideoGrid videos={filteredVideos} />
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </main>
        </div>
      </div>

      <UploadVideoModal
        open={showUploadModal}
        onOpenChange={setShowUploadModal}
      />

      {selectedVideo && (
        <EditVideoModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          video={selectedVideo}
        />
      )}

      <AssignVideoDialog
        open={showAssignDialog}
        onOpenChange={setShowAssignDialog}
        videoId={assignVideoId}
        videoTitle={assignVideoTitle}
      />

      <AlertDialog open={!!deleteVideoId} onOpenChange={() => setDeleteVideoId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Video</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this video? This action cannot be undone.
              All client assignments and progress data for this video will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              data-testid="button-confirm-delete"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}
