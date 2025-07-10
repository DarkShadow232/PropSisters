import { useState } from "react";
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
import { Upload, Building, Brush, Sofa, Home, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const FinishRequestPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

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

  return (
    <div className="bg-beige-50 min-h-screen">
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl font-medium mb-2">Submit a Finish Request</h1>
          <p className="text-foreground/70 mb-8">
            Let our design experts transform your apartment into a stylish and comfortable home.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Form */}
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Apartment Address */}
                    <div className="space-y-2">
                      <Label htmlFor="address" className="form-label">Apartment Address</Label>
                      <Input 
                        id="address" 
                        placeholder="Enter your complete address" 
                        className="form-input" 
                        required 
                      />
                    </div>

                    {/* Service Type */}
                    <div className="space-y-2">
                      <Label htmlFor="service-type" className="form-label">Service Type</Label>
                      <Select required>
                        <SelectTrigger className="form-input">
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
                    <div className="space-y-2">
                      <Label htmlFor="style" className="form-label">Preferred Style</Label>
                      <Select>
                        <SelectTrigger className="form-input">
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
                    <div className="space-y-2">
                      <Label htmlFor="description" className="form-label">Describe Your Vision</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Tell us about your design preferences, specific requirements, or any inspirations you have..." 
                        className="form-input min-h-[150px]" 
                        required 
                      />
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-3">
                      <Label className="form-label">Upload Images</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                        <Upload className="h-10 w-10 text-muted-foreground/50 mx-auto mb-4" />
                        <p className="text-foreground/80 mb-2">Drag and drop images here or click to browse</p>
                        <p className="text-foreground/60 text-sm mb-4">Upload photos of your space or inspiration images (max 10 files)</p>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          Select Files
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
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                          {files.map((file, index) => (
                            <div key={index} className="relative group bg-white p-2 rounded-md border border-border">
                              <img 
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index + 1}`}
                                className="h-24 w-full object-cover rounded"
                              />
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="absolute top-1 right-1 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                                  <path d="M18 6 6 18"></path>
                                  <path d="m6 6 12 12"></path>
                                </svg>
                              </button>
                              <p className="text-xs truncate mt-1">{file.name}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      className="btn-primary w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Request"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-serif text-lg font-medium mb-4">Our Services</h3>
                  
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Building className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium">Full Interior Design</h4>
                        <p className="text-sm text-foreground/70">
                          Complete design service including space planning, furniture selection, and decor.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Sofa className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium">Furniture Only</h4>
                        <p className="text-sm text-foreground/70">
                          Selection and sourcing of furniture pieces to match your space and style.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Brush className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium">Painting & Fixes</h4>
                        <p className="text-sm text-foreground/70">
                          Wall painting, minor repairs, and cosmetic improvements.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border mt-6 pt-6">
                    <h3 className="font-serif text-lg font-medium mb-4">How It Works</h3>
                    
                    <ol className="space-y-4">
                      <li className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-medium text-sm">1</div>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">Submit a request</span> with your apartment details and design preferences.
                          </p>
                        </div>
                      </li>
                      
                      <li className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-medium text-sm">2</div>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">Get a consultation</span> with one of our experienced designers.
                          </p>
                        </div>
                      </li>
                      
                      <li className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-medium text-sm">3</div>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">Review and approve</span> the design proposal and pricing.
                          </p>
                        </div>
                      </li>
                      
                      <li className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-medium text-sm">4</div>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">Watch your space transform</span> as our team implements the design.
                          </p>
                        </div>
                      </li>
                    </ol>
                  </div>

                  <div className="bg-beige-100 p-4 rounded-lg mt-6">
                    <div className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <p className="text-sm">
                        All design services come with a 100% satisfaction guarantee. We'll work with you until you love your space.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinishRequestPage;
