import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Home, MapPin, Bed, Bath, SquareIcon, Upload, Building, DollarSign, Calendar, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Property types
const propertyTypes = [
  "Apartment",
  "House",
  "Villa",
  "Townhouse",
  "Condo",
  "Studio",
  "Loft"
];

// Amenities
const amenities = [
  { id: "wifi", label: "WiFi" },
  { id: "ac", label: "Air Conditioning" },
  { id: "heating", label: "Heating" },
  { id: "kitchen", label: "Kitchen" },
  { id: "tv", label: "TV" },
  { id: "parking", label: "Parking" },
  { id: "elevator", label: "Elevator" },
  { id: "pool", label: "Swimming Pool" },
  { id: "gym", label: "Gym" },
  { id: "balcony", label: "Balcony" },
  { id: "washer", label: "Washer" },
  { id: "dryer", label: "Dryer" },
  { id: "workspace", label: "Workspace" },
  { id: "pets", label: "Pets Allowed" }
];

const AddPropertyPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    propertyType: "",
    location: "",
    address: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    price: "",
    availableFrom: "",
    availableTo: "",
    selectedAmenities: {} as Record<string, boolean>,
    ownerName: currentUser?.displayName || "",
    ownerEmail: currentUser?.email || "",
    ownerPhone: "",
    termsAgreed: false
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    if (name.startsWith("amenity-")) {
      const amenityId = name.replace("amenity-", "");
      setFormData({
        ...formData,
        selectedAmenities: {
          ...formData.selectedAmenities,
          [amenityId]: checked
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: checked
      });
    }
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      
      // Limit to 5 images
      if (images.length + selectedFiles.length > 5) {
        toast.error("You can only upload up to 5 images");
        return;
      }
      
      setImages(prevImages => [...prevImages, ...selectedFiles]);
      
      // Create preview URLs
      const newPreviewUrls = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prevUrls => [...prevUrls, ...newPreviewUrls]);
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
    
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.description || !formData.propertyType || 
        !formData.location || !formData.bedrooms || !formData.bathrooms || 
        !formData.price || !formData.ownerName || !formData.ownerEmail) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (images.length === 0) {
      toast.error("Please upload at least one image of your property");
      return;
    }
    
    if (!formData.termsAgreed) {
      toast.error("Please agree to the terms and conditions");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real application, you would upload the images and submit the form data to your backend
      // For this demo, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Property submitted successfully!", {
        description: "Our team will review your listing and contact you soon."
      });
      
      // Redirect to home page after successful submission
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error submitting property:", error);
      toast.error("Failed to submit property. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-beige-50 min-h-screen py-12">
      <div className="container-custom">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-medium mb-2">List Your Property</h1>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Join our community of property owners and start earning by renting out your property. 
            Fill out the form below to submit your property for review.
          </p>
        </div>
        
        <Card className="max-w-3xl mx-auto shadow-md animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-[#b94a3b]" />
              Property Details
            </CardTitle>
            <CardDescription>
              Provide detailed information about your property to attract potential renters.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Property Title <span className="text-red-500">*</span></Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Cozy Apartment in Downtown"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your property, its unique features, and the surrounding area..."
                    className="min-h-[120px]"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="propertyType">Property Type <span className="text-red-500">*</span></Label>
                    <Select
                      value={formData.propertyType}
                      onValueChange={(value) => handleSelectChange("propertyType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g., Downtown Cairo"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Street address, apartment number, etc."
                  />
                  <p className="text-xs text-muted-foreground">
                    This will not be publicly displayed. We'll only share it with confirmed guests.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              {/* Property Details */}
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Building className="mr-2 h-5 w-5 text-[#b94a3b]" />
                  Property Specifications
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Bed className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="bedrooms"
                        name="bedrooms"
                        type="number"
                        min="0"
                        value={formData.bedrooms}
                        onChange={handleInputChange}
                        placeholder="e.g., 2"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Bath className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="bathrooms"
                        name="bathrooms"
                        type="number"
                        min="0"
                        step="0.5"
                        value={formData.bathrooms}
                        onChange={handleInputChange}
                        placeholder="e.g., 1.5"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="area">Area (sq m)</Label>
                    <div className="relative">
                      <SquareIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="area"
                        name="area"
                        type="number"
                        min="0"
                        value={formData.area}
                        onChange={handleInputChange}
                        placeholder="e.g., 85"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <Label htmlFor="price">Price per Night (USD) <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="e.g., 100"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="availableFrom">Available From</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="availableFrom"
                        name="availableFrom"
                        type="date"
                        value={formData.availableFrom}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="availableTo">Available To</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="availableTo"
                        name="availableTo"
                        type="date"
                        value={formData.availableTo}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Amenities */}
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Check className="mr-2 h-5 w-5 text-[#b94a3b]" />
                  Amenities
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {amenities.map((amenity) => (
                    <div key={amenity.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`amenity-${amenity.id}`}
                        checked={formData.selectedAmenities[amenity.id] || false}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange(`amenity-${amenity.id}`, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`amenity-${amenity.id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {amenity.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              {/* Property Images */}
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Upload className="mr-2 h-5 w-5 text-[#b94a3b]" />
                  Property Images <span className="text-red-500">*</span>
                </h3>
                
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Label
                      htmlFor="images"
                      className="cursor-pointer flex flex-col items-center justify-center"
                    >
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <span className="text-sm font-medium">Click to upload images</span>
                      <span className="text-xs text-muted-foreground mt-1">
                        Upload up to 5 high-quality images (PNG, JPG)
                      </span>
                    </Label>
                  </div>
                  
                  {previewUrls.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Property preview ${index + 1}`}
                            className="h-24 w-full object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <Separator />
              
              {/* Owner Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Your Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="ownerName"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ownerEmail">Email <span className="text-red-500">*</span></Label>
                    <Input
                      id="ownerEmail"
                      name="ownerEmail"
                      type="email"
                      value={formData.ownerEmail}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="ownerPhone">Phone Number</Label>
                    <Input
                      id="ownerPhone"
                      name="ownerPhone"
                      value={formData.ownerPhone}
                      onChange={handleInputChange}
                      placeholder="+1 (123) 456-7890"
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="termsAgreed"
                  checked={formData.termsAgreed}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("termsAgreed", checked as boolean)
                  }
                  className="mt-1"
                />
                <Label htmlFor="termsAgreed" className="text-sm">
                  I agree to the <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>. I confirm that I am the owner or have permission to list this property.
                </Label>
              </div>
              
              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-[#b94a3b] hover:bg-[#a03e30] text-white"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Property"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 text-center text-sm text-muted-foreground">
            <p>
              All properties are subject to review by our team before being listed on the platform.
            </p>
            <p>
              Need help? <a href="/contact" className="text-primary hover:underline">Contact our support team</a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AddPropertyPage;
