import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import kvadredLogo from "@/assets/kvadred-logo.png";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) setValidSession(true);
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (password.length < 8) {
      toast({ title: "Password must be at least 8 characters", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated!", description: "You can now sign in with your new password." });
      navigate("/auth");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
          <div className="flex items-center justify-center gap-2 mb-8">
            <img src={kvadredLogo} alt="Kvadred" className="h-9 w-9 object-contain" />
            <span className="text-2xl font-bold text-foreground">Kvadred</span>
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">Set New Password</h1>
          <p className="text-muted-foreground text-center text-sm mb-6">Enter your new password below</p>
          {!validSession ? (
            <p className="text-center text-destructive">Invalid or expired reset link.</p>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <Label>New Password</Label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" required className="mt-1" />
              </div>
              <div>
                <Label>Confirm Password</Label>
                <Input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat password" required className="mt-1" />
              </div>
              <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
