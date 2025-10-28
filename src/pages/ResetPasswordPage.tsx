import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { authService } from "@/services/authService";

const ResetPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [token]);

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers
    };
  };

  const passwordValidation = validatePassword(newPassword);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }

    if (!passwordValidation.isValid) {
      setError("Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    
    try {
      await authService.resetPassword(token, newPassword);
      setIsSuccess(true);
      toast.success("Password reset successfully!", {
        description: "Your password has been updated. You can now sign in with your new password."
      });
      
      // Redirect to sign-in page after 3 seconds
      setTimeout(() => {
        navigate('/sign-in', { replace: true });
      }, 3000);
    } catch (error: any) {
      console.error("Password reset error:", error);
      setError(error.message || "Failed to reset password. The link may have expired or is invalid.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-beige-50 to-beige-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md shadow-lg border-border/40">
          <CardHeader className="text-center space-y-1">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="font-serif text-2xl font-medium text-primary">Password Reset Successfully!</CardTitle>
            <CardDescription>
              Your password has been updated successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                You can now sign in with your new password.
              </p>
              <p className="text-xs text-muted-foreground">
                Redirecting to sign-in page in a few seconds...
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/sign-in" className="w-full">
              <Button className="w-full">
                Go to Sign In
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
          <CardTitle className="font-serif text-2xl font-medium text-primary">Reset Your Password</CardTitle>
          <CardDescription>
            Enter your new password below.
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
              <Label htmlFor="newPassword" className="text-sm font-medium">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="newPassword" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter new password" 
                  className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20" 
                  required 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={togglePasswordVisibility} 
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {/* Password strength indicator */}
              {newPassword && (
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Password requirements:</div>
                  <div className="space-y-1">
                    <div className={`text-xs flex items-center ${passwordValidation.minLength ? 'text-green-600' : 'text-red-500'}`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.minLength ? 'bg-green-500' : 'bg-red-500'}`} />
                      At least 8 characters
                    </div>
                    <div className={`text-xs flex items-center ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-red-500'}`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.hasUpperCase ? 'bg-green-500' : 'bg-red-500'}`} />
                      One uppercase letter
                    </div>
                    <div className={`text-xs flex items-center ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-red-500'}`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.hasLowerCase ? 'bg-green-500' : 'bg-red-500'}`} />
                      One lowercase letter
                    </div>
                    <div className={`text-xs flex items-center ${passwordValidation.hasNumbers ? 'text-green-600' : 'text-red-500'}`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.hasNumbers ? 'bg-green-500' : 'bg-red-500'}`} />
                      One number
                    </div>
                    <div className={`text-xs flex items-center ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-red-500'}`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.hasSpecialChar ? 'bg-green-500' : 'bg-red-500'}`} />
                      One special character
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Confirm new password" 
                  className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20" 
                  required 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={toggleConfirmPasswordVisibility} 
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {/* Password match indicator */}
              {confirmPassword && (
                <div className={`text-xs flex items-center ${passwordsMatch ? 'text-green-600' : 'text-red-500'}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${passwordsMatch ? 'bg-green-500' : 'bg-red-500'}`} />
                  {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                </div>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-white transition-all duration-300 hover:shadow-md" 
              disabled={isLoading || !passwordValidation.isValid || !passwordsMatch}
            >
              {isLoading ? "Resetting Password..." : "Reset Password"}
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

export default ResetPasswordPage;
