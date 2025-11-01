
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

const SignUpPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp, currentUser, loading } = useAuth();

  // Get the redirect path from location state, or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  // Check for Google OAuth callback success
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const googleAuth = params.get('google_auth');
    const errorParam = params.get('error');

    if (googleAuth === 'success') {
      toast.success("Successfully signed in with Google!", {
        description: "Welcome to Sisterhood Style Rentals!"
      });
      // Clean up URL
      window.history.replaceState({}, '', location.pathname);
    } else if (errorParam) {
      const errorMessages: Record<string, string> = {
        google_auth_failed: "Google sign-in failed. Please try again.",
        session_error: "Session error occurred. Please try again.",
        auth_error: "Authentication error occurred. Please try again."
      };
      toast.error(errorMessages[errorParam] || "An error occurred during sign-in");
      // Clean up URL
      window.history.replaceState({}, '', location.pathname);
    }
  }, [location]);

  // Redirect if user is already signed in
  useEffect(() => {
    if (!loading && currentUser) {
      // Redirect to the page they came from or dashboard
      navigate(from, { replace: true });
    }
  }, [currentUser, loading, navigate, from]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const displayName = `${firstName} ${lastName}`.trim();
      await signUp(email, password, displayName);
      toast.success("Account created successfully!", {
        description: "Welcome to Sisterhood Style Rentals!"
      });
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Sign up error:", error);
      setError(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-beige-50 to-beige-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md shadow-lg border-border/40">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Don't render the sign-up form if user is already authenticated
  if (currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-beige-50 to-beige-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md shadow-lg border-border/40">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Redirecting to dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-beige-50 to-beige-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg animate-fade-in-up border-border/40">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="font-serif text-2xl font-medium text-primary">Create Account</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 mb-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name" className="text-sm font-medium">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="first-name" 
                      placeholder="John" 
                      className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20" 
                      required 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="last-name" className="text-sm font-medium">Last Name</Label>
                  <Input 
                    id="last-name" 
                    placeholder="Doe" 
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20" 
                    required 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your.email@example.com" 
                    className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    onClick={togglePasswordVisibility} 
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters long and include a mix of letters, numbers, and symbols.
                </p>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox id="terms" className="mt-1" required />
                <Label htmlFor="terms" className="text-sm text-muted-foreground">
                  I agree to the{" "}
                  <Link to="/terms" className="text-primary hover:text-primary/80 transition-colors">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-primary hover:text-primary/80 transition-colors">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-white transition-all duration-300 hover:shadow-md" 
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <div className="mt-6">
                <GoogleSignInButton disabled={isLoading} />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="w-full text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/sign-in" className="font-medium text-primary hover:text-primary/80 transition-colors">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
    </div>
  );
};

export default SignUpPage;
