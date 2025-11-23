import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, X } from "lucide-react";

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
}

interface EditVideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  video: Video;
}

export function EditVideoModal({ open, onOpenChange, video }: EditVideoModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: video.title,
    description: video.description || "",
    url: video.url,
    thumbnail: video.thumbnail || "",
    category: video.category,
    duration: video.duration?.toString() || "",
    intensity: video.intensity || "",
    difficulty: video.difficulty || "",
    trainer: video.trainer || "",
    isDraft: video.isDraft || false,
  });
  const [equipment, setEquipment] = useState<string[]>(video.equipment || []);
  const [newEquipment, setNewEquipment] = useState("");

  // Reset form when video changes
  useEffect(() => {
    setFormData({
      title: video.title,
      description: video.description || "",
      url: video.url,
      thumbnail: video.thumbnail || "",
      category: video.category,
      duration: video.duration?.toString() || "",
      intensity: video.intensity || "",
      difficulty: video.difficulty || "",
      trainer: video.trainer || "",
      isDraft: video.isDraft || false,
    });
    setEquipment(video.equipment || []);
  }, [video]);

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('PATCH', `/api/videos/${video._id}`, {
        ...data,
        duration: data.duration ? parseInt(data.duration) : undefined,
        equipment,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/videos'] });
      toast({
        title: "Video updated",
        description: "The video has been successfully updated.",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update video. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.url || !formData.category) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields (Title, URL, Category).",
        variant: "destructive",
      });
      return;
    }
    updateMutation.mutate(formData);
  };

  const addEquipment = () => {
    if (newEquipment.trim() && !equipment.includes(newEquipment.trim())) {
      setEquipment([...equipment, newEquipment.trim()]);
      setNewEquipment("");
    }
  };

  const removeEquipment = (item: string) => {
    setEquipment(equipment.filter(e => e !== item));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Edit Video</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Video Title *</Label>
              <Input
                id="edit-title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                data-testid="input-edit-title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger data-testid="select-edit-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Strength">Strength</SelectItem>
                  <SelectItem value="Cardio">Cardio</SelectItem>
                  <SelectItem value="Yoga">Yoga</SelectItem>
                  <SelectItem value="HIIT">HIIT</SelectItem>
                  <SelectItem value="Flexibility">Flexibility</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              data-testid="textarea-edit-description"
              placeholder="Provide detailed instructions and benefits of this workout..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-url">Video URL *</Label>
              <Input
                id="edit-url"
                type="url"
                required
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                data-testid="input-edit-url"
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-thumbnail">Thumbnail URL</Label>
              <Input
                id="edit-thumbnail"
                type="url"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                data-testid="input-edit-thumbnail"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-duration">Duration (minutes)</Label>
              <Input
                id="edit-duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                data-testid="input-edit-duration"
                placeholder="30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-difficulty">Difficulty Level</Label>
              <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
                <SelectTrigger data-testid="select-edit-difficulty">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-intensity">Intensity</Label>
              <Select value={formData.intensity} onValueChange={(value) => setFormData({ ...formData, intensity: value })}>
                <SelectTrigger data-testid="select-edit-intensity">
                  <SelectValue placeholder="Select intensity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-trainer">Trainer/Instructor</Label>
            <Input
              id="edit-trainer"
              value={formData.trainer}
              onChange={(e) => setFormData({ ...formData, trainer: e.target.value })}
              data-testid="input-edit-trainer"
              placeholder="Enter trainer name"
            />
          </div>

          <div className="space-y-2">
            <Label>Equipment Needed</Label>
            <div className="flex gap-2">
              <Input
                value={newEquipment}
                onChange={(e) => setNewEquipment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEquipment())}
                placeholder="Add equipment (press Enter)"
                data-testid="input-edit-equipment"
              />
              <Button type="button" variant="outline" onClick={addEquipment} data-testid="button-add-equipment">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {equipment.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {equipment.map((item) => (
                  <div key={item} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm">
                    {item}
                    <button
                      type="button"
                      onClick={() => removeEquipment(item)}
                      className="ml-1 hover:text-destructive"
                      data-testid={`button-remove-equipment-${item}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="edit-draft"
              checked={formData.isDraft}
              onCheckedChange={(checked) => setFormData({ ...formData, isDraft: checked })}
              data-testid="switch-edit-draft"
            />
            <Label htmlFor="edit-draft" className="cursor-pointer">
              Save as Draft (unpublished)
            </Label>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-muted-foreground">
              <div>Views: {video.views || 0}</div>
              <div>Completions: {video.completions || 0}</div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                data-testid="button-edit-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                data-testid="button-edit-submit"
              >
                {updateMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
