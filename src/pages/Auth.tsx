import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Mail, Lock, User, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Welcome back!", {
        description: "You have successfully logged in.",
      });
      navigate("/dashboard");
    }, 1500);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Account created!", {
        description: "Please sign in with your new account.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left Side - Hero/Branding */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center p-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10" />

        {/* Gradient mesh overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 via-transparent to-cyan-500/20" />
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-slate-900/50 to-slate-900/80" />

        <div className="relative z-10 max-w-lg text-left space-y-8">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-500/30 mb-8 ring-1 ring-white/10">
            <Building2 className="h-8 w-8 text-white" />
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-white">
            Manage your PG <br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">Like a Pro.</span>
          </h1>

          <p className="text-xl text-slate-300 leading-relaxed">
            Streamline your property management with our all-in-one solution.
            Track payments, manage tenants, and optimize occupancy effortlessly.
          </p>

          <div className="space-y-4 pt-8">
            {[
              "Automated Rent Collection",
              "Smart Tenant Onboarding",
              "Real-time Occupancy Tracking",
              "Expense Management"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-200">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative circles with better colors */}
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-violet-600/30 rounded-full blur-3xl" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      {/* Right Side - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background relative">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Welcome to PG Manager</h2>
            <p className="text-muted-foreground mt-2">Enter your credentials to access your account</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="email" placeholder="name@example.com" type="email" className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="password" type="password" className="pl-10" required />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                  {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" placeholder="John" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" placeholder="Doe" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="signup-email" placeholder="name@example.com" type="email" className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="signup-password" type="password" className="pl-10" required />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                  {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-center text-sm text-muted-foreground mt-8">
            By clicking continue, you agree to our{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
