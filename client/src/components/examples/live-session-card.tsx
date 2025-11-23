import { LiveSessionCard } from "../live-session-card";

export default function LiveSessionCardExample() {
  return (
    <div className="p-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl">
      <LiveSessionCard
        title="Power Yoga Session"
        trainer="Sarah Johnson"
        date="Nov 12, 2025"
        time="6:00 PM"
        duration="60 min"
        participants={8}
        maxParticipants={15}
        status="upcoming"
        onJoin={() => console.log("Joining upcoming session")}
      />
      <LiveSessionCard
        title="HIIT Training"
        trainer="Mike Chen"
        date="Nov 11, 2025"
        time="7:00 PM"
        duration="45 min"
        participants={12}
        maxParticipants={15}
        status="live"
        onJoin={() => console.log("Joining live session")}
      />
      <LiveSessionCard
        title="Strength Building"
        trainer="Alex Rivera"
        date="Nov 10, 2025"
        time="5:30 PM"
        duration="50 min"
        participants={14}
        maxParticipants={15}
        status="completed"
      />
    </div>
  );
}
