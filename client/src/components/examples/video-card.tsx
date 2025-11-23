import { VideoCard } from "../video-card";
import strengthImage from "@assets/generated_images/Strength_training_video_thumbnail_e7f2ebd6.png";
import yogaImage from "@assets/generated_images/Yoga_class_video_thumbnail_a8a89f8b.png";
import cardioImage from "@assets/generated_images/Cardio_workout_video_thumbnail_2c386154.png";

export default function VideoCardExample() {
  return (
    <div className="p-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl">
      <VideoCard
        title="Full Body Strength Training"
        category="Strength"
        duration="45 min"
        thumbnail={strengthImage}
        onPlay={() => console.log("Playing strength video")}
      />
      <VideoCard
        title="Morning Yoga Flow"
        category="Yoga"
        duration="30 min"
        thumbnail={yogaImage}
        onPlay={() => console.log("Playing yoga video")}
      />
      <VideoCard
        title="HIIT Cardio Blast"
        category="Cardio"
        duration="25 min"
        thumbnail={cardioImage}
        onPlay={() => console.log("Playing cardio video")}
      />
    </div>
  );
}
