import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Upload, Building, Brush, Sofa, Home, CheckCircle2, Sparkles, Camera, DollarSign, Palette, FileText, Send, Play, LogIn, UserPlus } from "lucide-react";
import { toast } from "sonner";

const FinishRequestPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [showSignInDialog, setShowSignInDialog] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is signed in
    if (!currentUser) {
      setShowSignInDialog(true);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Your finish request has been submitted successfully!", {
        description: "Our team will review your request and get back to you soon.",
      });
      setIsSubmitting(false);
      setFiles([]);
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  const handleSignInRedirect = () => {
    // Save current location to redirect back after sign in
    navigate('/sign-in', { state: { from: location } });
  };

  const handleSignUpRedirect = () => {
    // Save current location to redirect back after sign up
    navigate('/sign-up', { state: { from: location } });
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-beige-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#b94a3b] via-[#d4574a] to-[#b94a3b] text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-30" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
              <Home className="h-6 w-6" />
              <span className="font-medium">Professional Interior Design</span>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Transform Your Space Into
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                A Dream Home
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Let our expert designers create a stunning, personalized space that reflects your style and enhances your lifestyle.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Free Consultation</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>100% Satisfaction Guarantee</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Professional Team</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container-custom py-16">
        <div className="max-w-6xl mx-auto">

          {/* Previous Work Gallery */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#b94a3b]/10 to-[#d4574a]/10 text-[#b94a3b] rounded-full px-6 py-2 mb-4">
                <Brush className="h-5 w-5" />
                <span className="font-semibold">Portfolio Showcase</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                Our <span className="bg-gradient-to-r from-[#b94a3b] to-[#d4574a] bg-clip-text text-transparent">Previous Work</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Discover the stunning transformations we've created for our clients. Each project tells a unique story of style, comfort, and exceptional craftsmanship.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                "/image/Finishing/IMG-20250626-WA0001.jpg",
                "/image/Finishing/IMG-20250626-WA0002.jpg",
                "/image/Finishing/IMG-20250626-WA0003.jpg",
                "/image/Finishing/IMG-20250626-WA0004.jpg",
                "/image/Finishing/IMG-20250626-WA0005.jpg",
                "/image/Finishing/IMG-20250626-WA0006.jpg",
                "/image/Finishing/IMG-20250626-WA0007.jpg",
                "/image/Finishing/IMG-20250626-WA0008.jpg",
                "/image/Finishing/IMG-20250626-WA0009.jpg"
              ].map((image, index) => (
                <div key={index} className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <div className="relative overflow-hidden rounded-2xl">
                    <img 
                      src={image} 
                      alt={`Previous finishing work ${index + 1}`}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <div className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20">
                        <h3 className="font-semibold text-lg mb-1">Project #{index + 1}</h3>
                        <p className="text-sm opacity-90">Professional Interior Design</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
           </div>

          {/* Before & After Gallery */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-blue-500/10 text-green-600 rounded-full px-6 py-2 mb-4">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-semibold">Amazing Transformations</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Before & After</span> Magic
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Witness the incredible transformations that showcase our expertise in turning ordinary spaces into extraordinary homes.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Video Showcase */}
              <div className="group relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 md:col-span-2 lg:col-span-1">
                <div className="relative overflow-hidden rounded-2xl">
                  <video 
                    className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                    poster="/image/Finishing before & after/IMG-20250626-WA0010.jpg"
                    controls
                    preload="metadata"
                  >
                    <source src="/image/Finishing before & after/WhatsApp Video 2025-06-24 at 23.26.21_99f3fab2.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Play className="h-3 w-3" />
                      Video Tour
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 pointer-events-none">
                    <div className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-3 border border-white/30">
                      <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                        <Play className="h-4 w-4" />
                        Transformation Video
                      </h3>
                      <p className="text-sm opacity-90 flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                        Before
                        <span className="mx-2">→</span>
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        After
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Image Gallery */}
              {[
                "/image/Finishing before & after/IMG-20250626-WA0010.jpg",
                "/image/Finishing before & after/IMG-20250626-WA0011.jpg",
                "/image/Finishing before & after/IMG-20250626-WA0012.jpg",
                "/image/Finishing before & after/IMG-20250626-WA0013.jpg",
                "/image/Finishing before & after/IMG-20250626-WA0014.jpg"
              ].map((image, index) => (
                <div key={index} className="group relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3">
                  <div className="relative overflow-hidden rounded-2xl">
                    <img 
                      src={image} 
                      alt={`Before and after transformation ${index + 1}`}
                      className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        ✨ Transformation
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <div className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-3 border border-white/30">
                        <h3 className="font-bold text-lg mb-1">Amazing Transformation #{index + 1}</h3>
                        <p className="text-sm opacity-90 flex items-center gap-2">
                          <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                          Before
                          <span className="mx-2">→</span>
                          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                          After
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Form */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#b94a3b]/10 to-[#d4574a]/10 text-[#b94a3b] rounded-full px-6 py-2 mb-4">
                    <Home className="h-5 w-5" />
                    <span className="font-semibold">Start Your Journey</span>
                  </div>
                  <h2 className="font-serif text-3xl font-bold mb-3 text-gray-800">
                    <span className="bg-gradient-to-r from-[#b94a3b] to-[#d4574a] bg-clip-text text-transparent">Request Your</span> Dream Finishing
                  </h2>
                  <p className="text-gray-600">Let's bring your vision to life with our expert finishing services</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Apartment Address */}
                  <div className="space-y-3">
                    <Label htmlFor="address" className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Building className="h-4 w-4 text-[#b94a3b]" />
                      Apartment Address
                    </Label>
                    <Input 
                      id="address" 
                      placeholder="Enter your complete address" 
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#b94a3b] focus:border-[#b94a3b] transition-all duration-300 bg-gray-50 hover:bg-white" 
                      required 
                    />
                  </div>

                  {/* Service Type */}
                  <div className="space-y-3">
                    <Label htmlFor="service-type" className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Brush className="h-4 w-4 text-[#d4574a]" />
                      Service Type
                    </Label>
                    <Select required>
                      <SelectTrigger className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#b94a3b] focus:border-[#b94a3b] transition-all duration-300 bg-gray-50 hover:bg-white">
                        <SelectValue placeholder="Select a service type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-design">Full Interior Design</SelectItem>
                        <SelectItem value="furniture">Furniture Only</SelectItem>
                        <SelectItem value="painting">Painting & Fixes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Style Preference */}
                  <div className="space-y-3">
                    <Label htmlFor="style" className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Sofa className="h-4 w-4 text-orange-500" />
                      Preferred Style
                    </Label>
                    <Select>
                      <SelectTrigger className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#b94a3b] focus:border-[#b94a3b] transition-all duration-300 bg-gray-50 hover:bg-white">
                        <SelectValue placeholder="Select a style (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern & Minimalist</SelectItem>
                        <SelectItem value="traditional">Traditional</SelectItem>
                        <SelectItem value="scandinavian">Scandinavian</SelectItem>
                        <SelectItem value="industrial">Industrial</SelectItem>
                        <SelectItem value="bohemian">Bohemian</SelectItem>
                        <SelectItem value="farmhouse">Farmhouse</SelectItem>
                        <SelectItem value="coastal">Coastal</SelectItem>
                        <SelectItem value="eclectic">Eclectic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <Label htmlFor="description" className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Describe Your Vision
                    </Label>
                    <Textarea 
                      id="description" 
                      placeholder="Tell us about your design preferences, specific requirements, or any inspirations you have..." 
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#b94a3b] focus:border-[#b94a3b] transition-all duration-300 bg-gray-50 hover:bg-white resize-none min-h-[150px]" 
                      required 
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-3">
                    <Label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Upload className="h-4 w-4 text-blue-500" />
                      Upload Images
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 hover:border-[#b94a3b] rounded-xl p-8 text-center transition-all duration-300 bg-gradient-to-br from-gray-50 to-[#b94a3b]/5 hover:from-[#b94a3b]/5 hover:to-[#d4574a]/5">
                      <div className="bg-gradient-to-r from-[#b94a3b] to-[#d4574a] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload className="h-8 w-8 text-white" />
                      </div>
                      <p className="text-gray-600 mb-2 font-medium">Drag and drop images here or click to browse</p>
                      <p className="text-sm text-gray-500 mb-4">Upload photos of your space or inspiration images (max 10 files)</p>
                      <Button 
                        type="button" 
                        className="bg-gradient-to-r from-[#b94a3b] to-[#d4574a] text-white px-6 py-3 rounded-xl hover:from-[#a03d30] hover:to-[#c24a3d] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        Choose Files
                      </Button>
                      <input 
                        id="file-upload" 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileChange}
                      />
                    </div>

                    {/* File preview */}
                    {files.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                        {files.map((file, index) => (
                          <div key={index} className="relative group bg-white p-3 rounded-xl border-2 border-gray-200 hover:border-[#b94a3b] transition-all duration-300 shadow-sm hover:shadow-lg">
                            <img 
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="h-24 w-full object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 shadow-lg"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6 6 18"></path>
                                <path d="m6 6 12 12"></path>
                              </svg>
                            </button>
                            <p className="text-xs truncate mt-2 text-gray-600 font-medium">{file.name}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sign In Notice for Guests */}
                  {!currentUser && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                      <LogIn className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-amber-800 font-medium">Sign in required to submit request</p>
                        <p className="text-xs text-amber-700 mt-1">
                          You'll need to sign in or create an account to submit your design request. Don't worry, it only takes a moment!
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-[#b94a3b] to-[#d4574a] text-white py-4 px-8 rounded-xl hover:from-[#a03d30] hover:to-[#c24a3d] transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-3" 
                    disabled={isSubmitting}
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    {isSubmitting ? "Submitting Your Request..." : currentUser ? "Submit Your Dream Request" : "Sign In & Submit Request"}
                  </Button>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Our Services */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 rounded-full px-4 py-2 mb-3">
                    <Building className="h-4 w-4" />
                    <span className="font-semibold text-sm">Our Expertise</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-gray-800">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Premium</span> Services
                  </h3>
                </div>
                <div className="space-y-6">
                  <div className="group flex items-start space-x-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <Building className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">Full Interior Design</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">Complete design service including space planning, furniture selection, and decor.</p>
                    </div>
                  </div>
                  <div className="group flex items-start space-x-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 transition-all duration-300">
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <Sofa className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-1 group-hover:text-green-600 transition-colors">Furniture Only</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">Selection and sourcing of furniture pieces to match your space and style.</p>
                    </div>
                  </div>
                  <div className="group flex items-start space-x-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-300">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <Brush className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-1 group-hover:text-orange-600 transition-colors">Painting & Fixes</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">Wall painting, minor repairs, and cosmetic improvements.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* How It Works */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 rounded-full px-4 py-2 mb-3">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="font-semibold text-sm">Simple Process</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-gray-800">
                    <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">How It</span> Works
                  </h3>
                </div>
                <div className="space-y-6">
                  <div className="group flex items-start space-x-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-300">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-xl transition-all duration-300">
                      1
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-1 group-hover:text-emerald-600 transition-colors">Submit a request</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">with your apartment details and design preferences.</p>
                    </div>
                  </div>
                  <div className="group flex items-start space-x-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-xl transition-all duration-300">
                      2
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">Get a consultation</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">with one of our experienced designers.</p>
                    </div>
                  </div>
                  <div className="group flex items-start space-x-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-xl transition-all duration-300">
                      3
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-1 group-hover:text-purple-600 transition-colors">Review and approve</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">the design proposal and pricing.</p>
                    </div>
                  </div>
                  <div className="group flex items-start space-x-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 transition-all duration-300">
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-xl transition-all duration-300">
                      4
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-1 group-hover:text-yellow-600 transition-colors">Watch your space transform</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">as our team implements the design.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guarantee */}
              <div className="bg-gradient-to-r from-[#b94a3b]/10 to-[#d4574a]/10 p-6 rounded-2xl border border-[#b94a3b]/20">
                <div className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-[#b94a3b] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-[#b94a3b] mb-2">100% Satisfaction Guarantee</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      All design services come with a complete satisfaction guarantee. We'll work with you until you absolutely love your space.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sign In Dialog */}
      <Dialog open={showSignInDialog} onOpenChange={setShowSignInDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-center">Sign In Required</DialogTitle>
            <DialogDescription className="text-center pt-4">
              To submit a design request and access our premium interior design services, please sign in to your account or create a new one.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 py-6">
            <div className="bg-beige-50 rounded-lg p-4">
              <h4 className="font-medium text-sm mb-2 text-gray-700">Why sign in?</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Track your design requests and progress</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Save your preferences and style choices</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Communicate directly with our designers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Access exclusive member benefits</span>
                </li>
              </ul>
            </div>
          </div>

          <DialogFooter className="flex flex-col gap-3 sm:flex-col">
            <Button 
              onClick={handleSignInRedirect}
              className="w-full bg-[#b94a3b] hover:bg-[#9a3f33] text-white"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In to Continue
            </Button>
            <Button 
              onClick={handleSignUpRedirect}
              variant="outline"
              className="w-full"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Create New Account
            </Button>
            <Button 
              onClick={() => setShowSignInDialog(false)}
              variant="ghost"
              className="w-full text-gray-500"
            >
              Continue Browsing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinishRequestPage;
