import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-extrabold text-foreground mb-6">Settings ⚙️</h1>

      <div className="space-y-4">
        <div className="bg-card border rounded-2xl p-5">
          <h3 className="font-bold text-foreground mb-1">Account</h3>
          <p className="text-sm text-muted-foreground mb-3">Manage your CloudCrop account</p>
          <Button variant="outline" className="rounded-xl" size="sm">
            Sign in to sync progress
          </Button>
        </div>

        <div className="bg-card border rounded-2xl p-5">
          <h3 className="font-bold text-foreground mb-1">Notifications</h3>
          <p className="text-sm text-muted-foreground">Get reminders when crops are ready to harvest</p>
        </div>

        <div className="bg-card border rounded-2xl p-5">
          <h3 className="font-bold text-foreground mb-1">About CloudCrop</h3>
          <p className="text-sm text-muted-foreground">
            CloudCrop is a gamified farming platform that connects virtual farming with real-world food security. 
            Grow crops, earn coins, and support local farmers! 🌿
          </p>
        </div>
      </div>
    </div>
  );
}
