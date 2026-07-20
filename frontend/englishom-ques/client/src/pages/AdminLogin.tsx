import React, { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { language, t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isAr = language === "ar";

  const loginMutation = trpc.auth.adminLogin.useMutation({
    onSuccess: () => {
      toast.success(isAr ? "تم تسجيل الدخول بنجاح" : "Logged in successfully");
      window.location.href = "/ques/admin"; // Force reload to apply cookie and clear TRPC cache
    },
    onError: (error) => {
      toast.error(error.message || (isAr ? "خطأ في تسجيل الدخول" : "Login failed"));
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between bg-background ${isAr ? "rtl" : "ltr"}`}>
      <Header />

      <div className="flex flex-1 items-center justify-center p-4 my-8">
        <Card className="w-full max-w-md shadow-xl border border-border">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto bg-[#4A3B32]/10 dark:bg-[#FCDFC2]/15 p-4 rounded-2xl w-fit mb-2 text-[#4A3B32] dark:text-[#FCDFC2]">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <CardTitle className="text-2xl font-extrabold text-foreground">
              {t("admin.login")}
            </CardTitle>
            <CardDescription className="text-sm">
              {t("admin.loginDesc")}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-bold">{t("admin.email")}</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@englishom.com" 
                  required 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  dir="ltr"
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-bold">{t("admin.password")}</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  dir="ltr"
                  className="bg-background"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#4A3B32] text-[#FCDFC2] hover:bg-[#3B2E26] dark:bg-[#FCDFC2] dark:text-[#120F0D] dark:hover:bg-[#f3cfad] font-bold py-6 text-base shadow-md rounded-xl" 
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? t("admin.loggingIn") : t("admin.submitLogin")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
