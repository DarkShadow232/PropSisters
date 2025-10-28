import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { authService } from "@/services/authService";

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    console.log('🔍 Frontend: Password reset request initiated', {
      email,
      timestamp: new Date().toISOString()
    });
    
    try {
      console.log('🔍 Frontend: Calling authService.requestPasswordReset...');
      const response = await authService.requestPasswordReset(email);
      console.log('✅ Frontend: Password reset request successful', response);
      
      setIsSubmitted(true);
      toast.success("Password reset email sent!", {
        description: "Check your email for instructions to reset your password."
      });
    } catch (error: any) {
      console.error("❌ Frontend: Password reset request error:", error);
      console.error("❌ Frontend: Error details:", {
        message: error.message,
        stack: error.stack
      });
      setError(error.message || "Failed to send password reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-beige-50 to-beige-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md shadow-lg border-border/40">
          <CardHeader className="text-center space-y-1">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="font-serif text-2xl font-medium text-primary">Check Your Email</CardTitle>
            <CardDescription>
              We've sent password reset instructions to your email address.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                If an account with <strong>{email}</strong> exists, you'll receive an email with a link to reset your password.
              </p>
              <p className="text-xs text-muted-foreground">
                The link will expire in 1 hour for security reasons.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button 
              onClick={() => {
                setIsSubmitted(false);
                setEmail("");
              }}
              variant="outline" 
              className="w-full"
            >
              Send Another Email
            </Button>
            <Link to="/sign-in" className="w-full">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sign In
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-beige-50 to-beige-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg animate-fade-in-up border-border/40">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="font-serif text-2xl font-medium text-primary">Forgot Password?</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 mb-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
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
            
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-white transition-all duration-300 hover:shadow-md" 
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="w-full text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link to="/sign-in" className="font-medium text-primary hover:text-primary/80 transition-colors">
              Sign in instead
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
