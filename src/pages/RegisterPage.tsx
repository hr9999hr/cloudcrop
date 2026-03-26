import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (pw: string) => {
    const hasUpper = /[A-Z]/.test(pw);
    const hasNumber = /[0-9]/.test(pw);
    const hasSpecial = /[^A-Za-z0-9]/.test(pw);
    const noSpace = !/\s/.test(pw);
    const minLength = pw.length >= 8;
    return hasUpper && hasNumber && hasSpecial && noSpace && minLength;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      toast({
        title: "Weak password",
        description: "Password must have at least 8 characters, ONE uppercase, ONE number, ONE special character, and no spaces.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { username, full_name: fullName, date_of_birth: dateOfBirth },
      },
    });
    setLoading(false);

    if (error) {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Account created! 🌱", description: "Check your email to verify your account." });
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-farm items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 text-6xl">🌾</div>
          <div className="absolute top-32 right-20 text-5xl">🌽</div>
          <div className="absolute bottom-20 left-20 text-7xl">🥬</div>
          <div className="absolute bottom-40 right-10 text-4xl">🌶️</div>
          <div className="absolute top-1/2 left-1/3 text-5xl">🌻</div>
        </div>
        <div className="text-center z-10">
          <img src={logo} alt="CloudCrop" className="h-28 w-28 mx-auto mb-6 rounded-3xl shadow-2xl" />
          <h1 className="text-4xl font-extrabold text-white mb-4">Join CloudCrop!</h1>
          <p className="text-lg text-white/90 max-w-sm">
            Start your farming journey today. Grow crops, earn rewards, and help feed the world! 🌍
          </p>
        </div>
      </div>

      {/* Right side - register form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile logo */}
          <div className="flex flex-col items-center lg:hidden">
            <img src={logo} alt="CloudCrop" className="h-20 w-20 rounded-2xl shadow-lg mb-4" />
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">Sign Up for Free</h2>
            <p className="text-sm text-muted-foreground mt-1">Create your account and start farming 🌱</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Same as NRIC"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Create your personal username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="regEmail">Email</Label>
              <Input
                id="regEmail"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="regPassword">Password</Label>
              <Input
                id="regPassword"
                type="password"
                placeholder="*ONE uppercase, ONE numeric, ONE special character, no space"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? "Creating account..." : "Register"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
