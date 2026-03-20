import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, Store, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import kvadredLogo from "@/assets/kvadred-logo.png";

type Mode = "signin" | "signup" | "forgot";
type Role = "company" | "designer";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<Mode>(searchParams.get("mode") === "signup" ? "signup" : "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [shopName, setShopName] = useState("");
  const [role, setRole] = useState<Role>("designer");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Ошибка входа", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Добро пожаловать!" });
      navigate("/app");
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Пароли не совпадают", variant: "destructive" });
      return;
    }
    if (password.length < 8) {
      toast({ title: "Пароль должен содержать минимум 8 символов", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role, ...(role === "company" ? { shop_name: shopName } : {}) },
        emailRedirectTo: window.location.origin + "/app",
      },
    });
    if (error) {
      toast({ title: "Ошибка регистрации", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Аккаунт создан!", description: "Проверьте почту для подтверждения." });
      setMode("signin");
    }
    setLoading(false);
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Ссылка отправлена!", description: "Проверьте вашу почту." });
      setMode("signin");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-secondary-alpha hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> На главную
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border p-8">
          <div className="flex items-center justify-center gap-2 mb-8">
            <img src={kvadredLogo} alt="Kvadred" className="h-9 w-9 object-contain" />
            <span className="text-2xl font-bold text-foreground">Kvadred</span>
          </div>

          {mode === "forgot" ? (
            <>
              <h1 className="text-2xl font-bold text-foreground text-center mb-2 uppercase tracking-wide">Сброс пароля</h1>
              <p className="text-secondary-alpha text-center text-sm mb-6">Введите email для получения ссылки сброса</p>
              <form onSubmit={handleForgot} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="mt-1" />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Отправка..." : "Отправить ссылку"}
                </Button>
              </form>
              <button onClick={() => setMode("signin")} className="mt-4 w-full text-center text-sm text-primary hover:underline">
                Назад ко входу
              </button>
            </>
          ) : (
            <>
              <div className="flex border-b border-border mb-6">
                <button
                  onClick={() => setMode("signin")}
                  className={`flex-1 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${mode === "signin" ? "border-primary text-foreground" : "border-transparent text-secondary-alpha hover:text-foreground"}`}
                >
                  Вход
                </button>
                <button
                  onClick={() => setMode("signup")}
                  className={`flex-1 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${mode === "signup" ? "border-primary text-foreground" : "border-transparent text-secondary-alpha hover:text-foreground"}`}
                >
                  Регистрация
                </button>
              </div>

              {mode === "signup" ? (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Я регистрируюсь как</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => setRole("company")}
                        className={`flex flex-col items-center gap-2 border-2 p-4 transition-all ${role === "company" ? "border-primary bg-primary/5" : "border-border hover:border-foreground/20"}`}>
                        <Store className={`h-6 w-6 ${role === "company" ? "text-primary" : "text-stone"}`} strokeWidth={1.5} />
                        <span className="text-sm font-medium">Магазин</span>
                      </button>
                      <button type="button" onClick={() => setRole("designer")}
                        className={`flex flex-col items-center gap-2 border-2 p-4 transition-all ${role === "designer" ? "border-primary bg-primary/5" : "border-border hover:border-foreground/20"}`}>
                        <Palette className={`h-6 w-6 ${role === "designer" ? "text-primary" : "text-stone"}`} strokeWidth={1.5} />
                        <span className="text-sm font-medium">Дизайнер</span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="name">Имя</Label>
                    <Input id="name" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Ваше имя" required className="mt-1" />
                  </div>
                  {role === "company" && (
                    <div>
                      <Label htmlFor="shopName">Название магазина</Label>
                      <Input id="shopName" value={shopName} onChange={e => setShopName(e.target.value)} placeholder="Мой магазин" required className="mt-1" />
                    </div>
                  )}
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="password">Пароль</Label>
                    <div className="relative mt-1">
                      <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Минимум 8 символов" required className="pr-10" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone hover:text-foreground">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="confirm">Подтвердите пароль</Label>
                    <Input id="confirm" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Повторите пароль" required className="mt-1" />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Создание..." : "Зарегистрироваться"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="password">Пароль</Label>
                    <div className="relative mt-1">
                      <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Ваш пароль" required className="pr-10" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone hover:text-foreground">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <button type="button" onClick={() => setMode("forgot")} className="text-sm text-primary hover:underline">
                      Забыли пароль?
                    </button>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Вход..." : "Войти"}
                  </Button>
                </form>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
