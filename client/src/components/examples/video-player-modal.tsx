import { VideoPlayerModal } from "../video-player-modal";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import strengthImage from "@assets/generated_images/Strength_training_video_thumbnail_e7f2ebd6.png";

export default function VideoPlayerModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>Open Video Player</Button>
      <VideoPlayerModal
        open={open}
        onOpenChange={setOpen}
        videoTitle="Full Body Strength Training"
        videoCategory="Strength"
        videoDuration="45 min"
        videoThumbnail={strengthImage}
      />
    </div>
  );
}
