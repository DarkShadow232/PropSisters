import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserProfileData } from "@/services/userService";
import { getBookingsByUserId } from "@/services/bookingService";
import { toast } from "sonner";
import type { FirestoreBooking } from "@/lib/firestore-collections";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  LogOut, 
  Home, 
  Book, 
  Brush, 
  Crown, 
  Settings, 
  User, 
  Loader2,
  Shield
} from "lucide-react";
import UserRoleManager from "@/components/admin/UserRoleManager";
import RoleGuard from "@/components/auth/RoleGuard";

const sections = [
  { key: "profile", label: "My Profile", icon: User, color: "text-blue-600" },
  { key: "bookings", label: "My Bookings", icon: Book, color: "text-green-600" },
  { key: "properties", label: "My Properties", icon: Home, color: "text-orange-600" },
  { key: "design", label: "Design Requests", icon: Brush, color: "text-purple-600" },
  { key: "membership", label: "Membership", icon: Crown, color: "text-yellow-600" },
  { key: "settings", label: "Settings", icon: Settings, color: "text-gray-600" },
  { key: "admin", label: "Admin Panel", icon: Shield, color: "text-red-600", adminOnly: true },
];

const UserDashboardPage = () => {
  const { currentUser, userRole, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [bookings, setBookings] = useState<FirestoreBooking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    displayName: currentUser?.displayName || "",
    phoneNumber: currentUser?.phoneNumber || "",
  });

  // Update form data when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setEditFormData({
        displayName: currentUser.displayName || "",
        phoneNumber: currentUser.phoneNumber || "",
      });
    }
  }, [currentUser]);

  // Load user bookings when user changes or when viewing profile/bookings sections
  useEffect(() => {
    const loadBookings = async () => {
      if (currentUser && (activeSection === "bookings" || activeSection === "profile")) {
        setBookingsLoading(true);
        try {
          const userBookings = await getBookingsByUserId(currentUser.uid);
          setBookings(userBookings);
        } catch (error) {
          console.error('Error loading bookings:', error);
          toast.error('Failed to load bookings');
        } finally {
          setBookingsLoading(false);
        }
      }
    };

    loadBookings();
  }, [currentUser, activeSection]);

  // Debug log
  console.log("Dashboard render - currentUser:", currentUser, "loading:", loading);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleEditProfile = () => {
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = async () => {
    try {
      if (!currentUser) {
        toast.error("No user logged in");
        return;
      }

      setLoading(true);
      
      // Update user profile
      await updateUserProfileData(currentUser.uid, {
        displayName: editFormData.displayName,
        phoneNumber: editFormData.phoneNumber,
      });

      toast.success("Profile updated successfully!");
      setIsEditProfileOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center max-w-md">
          <CardContent>
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
            <p className="text-gray-600 mb-4">Please sign in to access your dashboard</p>
            <Button className="bg-primary text-white">Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 bg-white border-r border-gray-200 shadow-sm">
          {/* User Header */}
          <div className="p-6 bg-blue-600 text-white">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-4 border-white/20">
                <AvatarImage src={currentUser.photoURL || ""} />
                <AvatarFallback className="bg-white text-blue-600 text-lg font-semibold">
                  {getInitials(currentUser.displayName || currentUser.email || "U")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="font-semibold text-lg">
                  {currentUser.displayName || "User"}
                </h2>
                <p className="text-white/80 text-sm truncate">
                  {currentUser.email}
                </p>
                <Badge className="mt-1 bg-white/20 text-white border-0">
                  Premium Member
                </Badge>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {sections.map((section) => {
              // Hide admin section for non-admin users
              if (section.adminOnly && userRole !== 'admin') {
                return null;
              }
              
              return (
                <button
                  key={section.key}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeSection === section.key
                      ? "bg-blue-50 text-blue-600 shadow-sm border border-blue-200"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                  onClick={() => setActiveSection(section.key)}
                >
                  <section.icon className={`h-5 w-5 ${activeSection === section.key ? 'text-blue-600' : section.color}`} />
                  <span className="font-medium">{section.label}</span>
                </button>
              );
            })}
            
            <Separator className="my-4" />
            
            <Button
              variant="ghost"
              className="w-full flex items-center gap-3 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={signOut}
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {currentUser?.displayName?.split(' ')[0] || "User"}!
            </h1>
            <p className="text-gray-600">
              Manage your properties, bookings, and account settings
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading your data...</span>
            </div>
          )}

          {/* Content Sections */}
          {!loading && activeSection === "profile" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Full Name</label>
                      <p className="mt-1 text-gray-900">{currentUser.displayName || "Not set"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email Address</label>
                      <p className="mt-1 text-gray-900">{currentUser.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone Number</label>
                      <p className="mt-1 text-gray-900">{currentUser.phoneNumber || "Not set"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Member Since</label>
                      <p className="mt-1 text-gray-900">January 2024</p>
                    </div>
                  </div>
                  <Separator />
                  <Button className="bg-blue-600 text-white" onClick={handleEditProfile}>
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                        <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                      </div>
                      <Book className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Properties Listed</p>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                      </div>
                      <Home className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Design Requests</p>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                      </div>
                      <Brush className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {!loading && activeSection === "bookings" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  My Bookings ({bookings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bookingsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading bookings...</p>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No bookings found</p>
                    <Button className="bg-blue-600 text-white mt-4" onClick={() => window.location.href = '/rentals'}>Browse Properties</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">Booking #{booking.id?.slice(-8)}</h3>
                            <p className="text-sm text-gray-600">Property ID: {booking.propertyId}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Check-in:</p>
                            <p className="font-medium">{new Date(booking.checkIn.seconds * 1000).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Check-out:</p>
                            <p className="font-medium">{new Date(booking.checkOut.seconds * 1000).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Guests:</p>
                            <p className="font-medium">{booking.guests}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Total Price:</p>
                            <p className="font-medium text-blue-600">${booking.totalPrice}</p>
                          </div>
                        </div>
                        {booking.specialRequests && (
                          <div className="mt-3">
                            <p className="text-gray-600 text-sm">Special Requests:</p>
                            <p className="text-sm">{booking.specialRequests}</p>
                          </div>
                        )}
                        <div className="mt-3 flex gap-2 text-xs">
                          {booking.cleaningService && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Cleaning Service</span>}
                          {booking.airportPickup && <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Airport Pickup</span>}
                          {booking.earlyCheckIn && <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">Early Check-in</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {!loading && activeSection === "properties" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    My Properties (0)
                  </div>
                  <Button className="bg-blue-600 text-white">
                    Add Property
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No properties listed yet</p>
                  <Button className="bg-blue-600 text-white mt-4">
                    Add Your First Property
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {!loading && activeSection === "design" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brush className="h-5 w-5" />
                  Design Requests (0)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Brush className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No design requests yet</p>
                  <Button className="bg-blue-600 text-white mt-4">Request Design Service</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {!loading && activeSection === "membership" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Membership Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
                  <Crown className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-yellow-800">Gold Member</h3>
                  <p className="text-yellow-700 mt-2">Enjoy exclusive benefits and priority booking</p>
                </div>
              </CardContent>
            </Card>
          )}

          {!loading && activeSection === "settings" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Update Profile Information
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Admin Panel Section - Only visible to admins */}
          {!loading && activeSection === "admin" && userRole === "admin" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="h-6 w-6 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
                <Badge className="bg-red-100 text-red-800 border-red-200">
                  Administrator
                </Badge>
              </div>
              
              <UserRoleManager />
            </div>
          )}
        </main>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile information here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="displayName" className="text-right">
                Name
              </Label>
              <Input
                id="displayName"
                name="displayName"
                value={editFormData.displayName}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Enter your full name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                value={currentUser?.email || ""}
                className="col-span-3"
                disabled
                placeholder="Email cannot be changed"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-right">
                Phone
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={editFormData.phoneNumber}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Enter your phone number"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsEditProfileOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleSaveProfile}
              disabled={loading}
              className="bg-blue-600 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDashboardPage;