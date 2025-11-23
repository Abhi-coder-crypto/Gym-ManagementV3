import { PackageCard } from "../package-card";

export default function PackageCardExample() {
  return (
    <div className="p-8 grid md:grid-cols-3 gap-8 max-w-7xl">
      <PackageCard
        name="Basic"
        price={29}
        period="month"
        features={[
          "Access to all recorded workout lectures",
          "Beginner to advanced level content",
          "New videos added weekly",
          "Mobile app access",
        ]}
        onSelect={() => console.log("Basic package selected")}
      />
      <PackageCard
        name="Premium"
        price={59}
        period="month"
        isPopular={true}
        features={[
          "Everything in Basic",
          "Custom diet management plan",
          "Weekly nutrition consultations",
          "Personalized meal recommendations",
          "Progress tracking & analytics",
        ]}
        onSelect={() => console.log("Premium package selected")}
      />
      <PackageCard
        name="Elite"
        price={99}
        period="month"
        features={[
          "Everything in Premium",
          "Live training sessions (4x per week)",
          "One-on-one coaching calls",
          "Priority support",
          "Exclusive community access",
        ]}
        onSelect={() => console.log("Elite package selected")}
      />
    </div>
  );
}
