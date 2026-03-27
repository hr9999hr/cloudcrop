import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sun, Moon, User, Save } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains("dark"));
  const [profile, setProfile] = useState({
    username: "",
    full_name: "",
    date_of_birth: "",
    avatar_url: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("username, full_name, date_of_birth, avatar_url")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setProfile({
            username: data.username || "",
            full_name: data.full_name || "",
            date_of_birth: data.date_of_birth || "",
            avatar_url: data.avatar_url || "",
          });
        }
      });
  }, [user]);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        username: profile.username,
        full_name: profile.full_name,
        date_of_birth: profile.date_of_birth || null,
      })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast.error("Failed to save profile");
    } else {
      toast.success("Profile updated! 🌿");
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-extrabold text-foreground mb-6">Settings ⚙️</h1>

      <div className="space-y-4">
        {/* Profile Settings */}
        <div className="bg-card border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-foreground">Profile</h3>
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Username</Label>
              <Input
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                className="rounded-xl mt-1"
                placeholder="Your username"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Full Name</Label>
              <Input
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="rounded-xl mt-1"
                placeholder="Your full name"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Date of Birth</Label>
              <Input
                type="date"
                value={profile.date_of_birth}
                onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                className="rounded-xl mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Email</Label>
              <Input
                value={user?.email || ""}
                disabled
                className="rounded-xl mt-1 opacity-60"
              />
            </div>
            <Button
              onClick={handleSaveProfile}
              disabled={saving}
              className="gradient-farm text-primary-foreground rounded-xl font-bold w-full"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </div>

        {/* Theme */}
        <div className="bg-card border rounded-2xl p-5">
          <h3 className="font-bold text-foreground mb-3">Appearance</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="w-5 h-5 text-accent" /> : <Sun className="w-5 h-5 text-accent" />}
              <div>
                <p className="text-sm font-semibold text-foreground">{darkMode ? "Dark Mode" : "Light Mode"}</p>
                <p className="text-xs text-muted-foreground">Toggle between light and dark themes</p>
              </div>
            </div>
            <Switch checked={darkMode} onCheckedChange={toggleTheme} />
          </div>
        </div>

        {/* About */}
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
