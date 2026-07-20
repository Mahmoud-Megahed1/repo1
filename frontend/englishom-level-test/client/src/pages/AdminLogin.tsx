import React, { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const loginMutation = trpc.auth.adminLogin.useMutation({
    onSuccess: () => {
      toast.success("تم تسجيل الدخول بنجاح");
      window.location.href = "/test/admin"; // Force reload to apply cookie and clear TRPC cache
    },
    onError: (error) => {
      toast.error(error.message || "خطأ في تسجيل الدخول");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#120F0D] p-4 text-[#FCDFC2]" dir="rtl">
      <Card className="w-full max-w-md shadow-2xl border border-[#4A3B32] bg-[#1E1916] text-[#FCDFC2]">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-[#4A3B32]/30 p-3 rounded-full w-fit mb-2 border border-[#4A3B32]/50">
            <ShieldCheck className="w-8 h-8 text-[#FCDFC2]" />
          </div>
          <CardTitle className="text-2xl font-bold text-[#FCDFC2]">تسجيل دخول المشرفين</CardTitle>
          <CardDescription className="text-slate-400">
            قم بتسجيل الدخول للوصول إلى لوحة تحكم اختبار تحديد المستوى
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#FCDFC2]">البريد الإلكتروني</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@englishom.com" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-[#25201C] border-[#4A3B32] text-[#FCDFC2] focus:ring-[#FCDFC2]"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#FCDFC2]">كلمة المرور</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="bg-[#25201C] border-[#4A3B32] text-[#FCDFC2] focus:ring-[#FCDFC2]"
                dir="ltr"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full font-bold bg-[#4A3B32] hover:bg-[#5C4A3E] text-[#FCDFC2] border border-[#FCDFC2]/30 transition-all" 
              disabled={loginMutation.isLoading}
            >
              {loginMutation.isLoading ? "جاري تسجيل الدخول..." : "دخول"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
