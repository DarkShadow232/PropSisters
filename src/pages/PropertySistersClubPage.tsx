import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Crown, Gift, Calendar, Bookmark, Percent, Shield, Award, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import MembershipCard from "@/components/club/MembershipCard";
import MembershipBenefits from "@/components/club/MembershipBenefits";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const PropertySistersClubPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string>("monthly");
  const [isMember, setIsMember] = useState<boolean>(false);
  const [membershipDetails, setMembershipDetails] = useState<{
    level: "Silver" | "Gold" | "Platinum";
    joinDate: string;
    expiryDate: string;
    membershipId: string;
    pointsEarned: number;
    pointsToNextReward: number;
    upcomingEvents: { title: string; date: string; location: string }[];
  } | null>(null);
  
  // Check if user is already a member (simulated)
  useEffect(() => {
    if (currentUser) {
      // In a real app, this would be a call to your backend
      // Simulating a member for demo purposes
      const mockMembership = {
        level: "Gold" as "Silver" | "Gold" | "Platinum",
        joinDate: "May 1, 2025",
        expiryDate: "May 1, 2026",
        membershipId: "PSC" + Math.random().toString(36).substring(2, 10).toUpperCase(),
        pointsEarned: 750,
        pointsToNextReward: 250,
        upcomingEvents: [
          {
            title: "Summer Design Workshop",
            date: "June 15, 2025",
            location: "Virtual Event"
          },
          {
            title: "Exclusive Property Preview",
            date: "July 10, 2025",
            location: "New York, NY"
          }
        ]
      };
      
      // 50% chance of being a member for demo purposes
      if (Math.random() > 0.5) {
        setIsMember(true);
        setMembershipDetails(mockMembership);
      }
    }
  }, [currentUser]);

  // Mock function to handle joining the club
  const handleJoinClub = (planType: string, planName: string) => {
    if (!currentUser) {
      toast({
        title: "Sign in required",
        description: "Please sign in to join the Property Sisters Club",
        variant: "destructive",
      });
      navigate("/sign-in");
      return;
    }

    toast({
      title: "Welcome to the Property Sisters Club!",
      description: `You've successfully joined the ${planName} plan.`,
      variant: "default",
    });
    
    // In a real app, we would process the subscription here
    console.log(`User joined the ${planName} plan (${planType})`);
  };

  const membershipPlans = [
    {
      name: "Silver",
      monthlyPrice: 9.99,
      yearlyPrice: 99.99,
      features: [
        "Early access to new properties",
        "5% discount on bookings",
        "Free cancellation up to 48 hours",
        "Member-only newsletter",
      ],
      notIncluded: [
        "Priority booking",
        "Exclusive events access",
        "Dedicated concierge",
        "Free property styling consultation",
      ],
    },
    {
      name: "Gold",
      monthlyPrice: 19.99,
      yearlyPrice: 199.99,
      features: [
        "Early access to new properties",
        "10% discount on bookings",
        "Free cancellation up to 72 hours",
        "Member-only newsletter",
        "Priority booking",
        "Exclusive events access",
      ],
      notIncluded: [
        "Dedicated concierge",
        "Free property styling consultation",
      ],
      recommended: true,
    },
    {
      name: "Platinum",
      monthlyPrice: 29.99,
      yearlyPrice: 299.99,
      features: [
        "Early access to new properties",
        "15% discount on bookings",
        "Free cancellation anytime",
        "Member-only newsletter",
        "Priority booking",
        "Exclusive events access",
        "Dedicated concierge",
        "Free property styling consultation",
      ],
      notIncluded: [],
    },
  ];

  return (
    <div className="bg-beige-50 min-h-screen py-12">
      <div className="container-custom">
        {/* Member Section - Only visible if logged in and a member */}
        {currentUser && isMember && membershipDetails && (
          <div className="mb-16 animate-fadeIn">
            <div className="text-center mb-8">
              <h1 className="font-serif text-4xl md:text-5xl font-medium mb-4">
                Welcome to the Club, {currentUser.displayName || currentUser.email?.split('@')[0] || "Member"}!
              </h1>
              <p className="text-foreground/70 text-lg max-w-3xl mx-auto">
                Thank you for being a valued member of our Property Sisters Club. Enjoy your exclusive benefits and rewards.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div>
                <MembershipCard
                  memberName={currentUser.displayName || currentUser.email?.split('@')[0] || "Member"}
                  membershipLevel={membershipDetails.level}
                  membershipId={membershipDetails.membershipId}
                  joinDate={membershipDetails.joinDate}
                  expiryDate={membershipDetails.expiryDate}
                />
                
                <div className="mt-6 text-center">
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <span>How to use your membership</span>
                        <ChevronDown size={16} />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 text-left bg-white p-4 rounded-lg shadow-sm border border-border/40">
                      <h3 className="font-medium mb-2">Using Your Membership Card</h3>
                      <ul className="space-y-2 text-foreground/70">
                        <li className="flex items-start gap-2">
                          <Check size={16} className="text-[#b94a3b] mt-1 flex-shrink-0" />
                          <span>Present your digital membership card when booking a property to receive your discount</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check size={16} className="text-[#b94a3b] mt-1 flex-shrink-0" />
                          <span>Your membership ID can be used to verify your status for exclusive events</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check size={16} className="text-[#b94a3b] mt-1 flex-shrink-0" />
                          <span>Access the members-only section of our website using your membership credentials</span>
                        </li>
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
              
              <div>
                <MembershipBenefits
                  membershipLevel={membershipDetails.level}
                  pointsEarned={membershipDetails.pointsEarned}
                  pointsToNextReward={membershipDetails.pointsToNextReward}
                  upcomingEvents={membershipDetails.upcomingEvents}
                />
              </div>
            </div>
            
            <div className="bg-[#b94a3b]/10 rounded-lg p-6 text-center">
              <h3 className="text-xl font-medium mb-3">Want to upgrade your membership?</h3>
              <p className="text-foreground/70 mb-4">Enjoy even more benefits by upgrading to a higher membership tier.</p>
              <Button className="bg-[#b94a3b] hover:bg-[#a03e30] text-white">
                Upgrade Membership
              </Button>
            </div>
          </div>
        )}
        
        {/* If user is logged in but not a member, show a personalized CTA */}
        {currentUser && !isMember && (
          <div className="text-center mb-12 bg-[#b94a3b]/10 rounded-lg p-8 animate-fadeIn">
            <h1 className="font-serif text-3xl font-medium mb-4">
              Hello, {currentUser.displayName || currentUser.email?.split('@')[0] || "there"}!
            </h1>
            <p className="text-foreground/70 text-lg max-w-3xl mx-auto mb-6">
              You're just a step away from unlocking exclusive benefits and rewards with the Property Sisters Club.
            </p>
            <Button 
              className="bg-[#b94a3b] hover:bg-[#a03e30] text-white"
              onClick={() => document.getElementById("membership-plans")?.scrollIntoView({ behavior: "smooth" })}
            >
              Join Now
            </Button>
          </div>
        )}
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-medium mb-4">
            Property Sisters Club
          </h1>
          <p className="text-foreground/70 text-lg max-w-3xl mx-auto">
            Join our exclusive membership program and unlock premium benefits, special discounts, and unique experiences tailored for our most valued guests.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-[#b94a3b]/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Percent className="h-6 w-6 text-[#b94a3b]" />
              </div>
              <CardTitle className="text-xl">Exclusive Discounts</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-foreground/70">
              <p>Enjoy special rates and discounts on all our properties, available only to club members.</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-[#b94a3b]/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-[#b94a3b]" />
              </div>
              <CardTitle className="text-xl">Priority Booking</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-foreground/70">
              <p>Get early access to new properties and reserve your favorite spots before they're available to the public.</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-[#b94a3b]/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Gift className="h-6 w-6 text-[#b94a3b]" />
              </div>
              <CardTitle className="text-xl">Special Perks</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-foreground/70">
              <p>Enjoy complimentary upgrades, welcome gifts, and personalized services during your stay.</p>
            </CardContent>
          </Card>
        </div>

        {/* Membership Plans */}
        <div className="mb-16" id="membership-plans">
          <h2 className="font-serif text-3xl font-medium text-center mb-8">
            Choose Your Membership Plan
          </h2>

          <Tabs defaultValue="monthly" className="w-full" onValueChange={setSelectedPlan}>
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">
                  Yearly <span className="ml-2 text-xs bg-[#b94a3b] text-white px-2 py-0.5 rounded-full">Save 20%</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {["monthly", "yearly"].map((billingCycle) => (
              <TabsContent key={billingCycle} value={billingCycle} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {membershipPlans.map((plan) => (
                    <Card 
                      key={plan.name} 
                      className={`relative overflow-hidden ${
                        plan.recommended ? "border-2 border-[#b94a3b]" : "border border-border/40"
                      }`}
                    >
                      {plan.recommended && (
                        <div className="absolute top-0 right-0 bg-[#b94a3b] text-white text-xs font-medium py-1 px-3 rounded-bl-lg">
                          Most Popular
                        </div>
                      )}
                      <CardHeader className="text-center">
                        <div className="mx-auto bg-secondary/40 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                          <Crown className={`h-8 w-8 ${plan.name === "Platinum" ? "text-[#b94a3b]" : "text-foreground/70"}`} />
                        </div>
                        <CardTitle className="text-2xl font-serif">{plan.name}</CardTitle>
                        <CardDescription className="text-foreground/70">
                          {billingCycle === "monthly" ? "Monthly Membership" : "Annual Membership"}
                        </CardDescription>
                        <div className="mt-4">
                          <span className="text-3xl font-medium">
                            ${billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                          </span>
                          <span className="text-foreground/70">
                            {billingCycle === "monthly" ? "/month" : "/year"}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          {plan.features.map((feature) => (
                            <div key={feature} className="flex items-start">
                              <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </div>
                          ))}
                          {plan.notIncluded.map((feature) => (
                            <div key={feature} className="flex items-start text-foreground/50">
                              <X className="h-5 w-5 text-foreground/30 mr-2 flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className={`w-full ${
                            plan.recommended 
                              ? "bg-[#b94a3b] hover:bg-[#a03e30] text-white" 
                              : ""
                          }`}
                          onClick={() => handleJoinClub(billingCycle, plan.name)}
                        >
                          Join Now
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="font-serif text-3xl font-medium text-center mb-8">
            What Our Members Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <img 
                    src="https://randomuser.me/api/portraits/women/12.jpg" 
                    alt="Member" 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-medium">Emily Johnson</h3>
                    <p className="text-sm text-foreground/70">Gold Member</p>
                  </div>
                </div>
                <p className="text-foreground/80 italic">
                  "The Property Sisters Club has completely transformed how I travel. The discounts alone have saved me hundreds, and the early access to new properties means I always get my first choice."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <img 
                    src="https://randomuser.me/api/portraits/men/32.jpg" 
                    alt="Member" 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-medium">Michael Chen</h3>
                    <p className="text-sm text-foreground/70">Platinum Member</p>
                  </div>
                </div>
                <p className="text-foreground/80 italic">
                  "As a frequent traveler, the Platinum membership has been invaluable. The dedicated concierge service has saved me countless hours of planning, and the styling consultation made my rental feel like home."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <img 
                    src="https://randomuser.me/api/portraits/women/28.jpg" 
                    alt="Member" 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-medium">Sophia Martinez</h3>
                    <p className="text-sm text-foreground/70">Silver Member</p>
                  </div>
                </div>
                <p className="text-foreground/80 italic">
                  "Even at the Silver level, the benefits are amazing. I love getting the exclusive newsletter with insider tips on the best properties and local attractions. Definitely worth every penny!"
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="font-serif text-3xl font-medium text-center mb-8">
            Frequently Asked Questions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">How do I use my membership benefits?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70">
                  Once you join, your benefits are automatically applied to your account. Discounts will be applied at checkout, and you'll receive email notifications about early access to properties and exclusive events.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Can I upgrade my membership?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70">
                  Yes! You can upgrade your membership at any time. We'll prorate the difference and apply it to your new plan. Simply visit your account settings to make the change.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Is there a minimum commitment period?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70">
                  Monthly plans can be canceled anytime. Annual plans offer better value but require a one-year commitment. However, we offer a 30-day money-back guarantee if you're not satisfied.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">How do I book the styling consultation?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70">
                  Platinum members can schedule their complimentary styling consultation through their member dashboard or by contacting our concierge service. We recommend booking at least two weeks before your stay.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-[#b94a3b]/10 rounded-lg p-8 mb-8">
          <h2 className="font-serif text-2xl font-medium mb-4">
            Ready to Elevate Your Travel Experience?
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto mb-6">
            Join the Property Sisters Club today and start enjoying exclusive benefits on your next stay. Choose the plan that's right for you and transform the way you travel.
          </p>
          <Button 
            className="bg-[#b94a3b] hover:bg-[#a03e30] text-white"
            onClick={() => document.getElementById("membership-plans")?.scrollIntoView({ behavior: "smooth" })}
          >
            Become a Member
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertySistersClubPage;
