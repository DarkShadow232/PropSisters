import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Crown, Gift, Calendar, Bookmark, Percent, Shield } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface MembershipBenefitsProps {
  membershipLevel: "Silver" | "Gold" | "Platinum";
  pointsEarned: number;
  pointsToNextReward: number;
  upcomingEvents?: {
    title: string;
    date: string;
    location: string;
  }[];
}

const MembershipBenefits: React.FC<MembershipBenefitsProps> = ({
  membershipLevel,
  pointsEarned,
  pointsToNextReward,
  upcomingEvents = [],
}) => {
  const benefitsByLevel = {
    Silver: [
      { icon: <Percent className="h-5 w-5 text-[#b94a3b]" />, title: "5% discount on all bookings" },
      { icon: <Calendar className="h-5 w-5 text-[#b94a3b]" />, title: "Free cancellation up to 48 hours" },
      { icon: <Gift className="h-5 w-5 text-[#b94a3b]" />, title: "Member-only newsletter" },
    ],
    Gold: [
      { icon: <Percent className="h-5 w-5 text-[#b94a3b]" />, title: "10% discount on all bookings" },
      { icon: <Calendar className="h-5 w-5 text-[#b94a3b]" />, title: "Free cancellation up to 72 hours" },
      { icon: <Gift className="h-5 w-5 text-[#b94a3b]" />, title: "Member-only newsletter" },
      { icon: <Bookmark className="h-5 w-5 text-[#b94a3b]" />, title: "Priority booking on new properties" },
      { icon: <Crown className="h-5 w-5 text-[#b94a3b]" />, title: "Access to exclusive events" },
    ],
    Platinum: [
      { icon: <Percent className="h-5 w-5 text-[#b94a3b]" />, title: "15% discount on all bookings" },
      { icon: <Calendar className="h-5 w-5 text-[#b94a3b]" />, title: "Free cancellation anytime" },
      { icon: <Gift className="h-5 w-5 text-[#b94a3b]" />, title: "Member-only newsletter" },
      { icon: <Bookmark className="h-5 w-5 text-[#b94a3b]" />, title: "Priority booking on new properties" },
      { icon: <Crown className="h-5 w-5 text-[#b94a3b]" />, title: "Access to exclusive events" },
      { icon: <Shield className="h-5 w-5 text-[#b94a3b]" />, title: "Dedicated concierge service" },
      { icon: <Gift className="h-5 w-5 text-[#b94a3b]" />, title: "Free property styling consultation" },
    ],
  };

  const benefits = benefitsByLevel[membershipLevel];
  const progressPercentage = (pointsEarned / (pointsEarned + pointsToNextReward)) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Crown className="h-6 w-6 text-[#b94a3b]" />
        <h2 className="text-xl font-medium">Your Membership Benefits</h2>
      </div>

      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-4">Your {membershipLevel} Benefits</h3>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-2">
                    {benefit.icon}
                    <span>{benefit.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Rewards Progress</h3>
              <div className="bg-secondary/30 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-foreground/70">Points earned</span>
                  <span className="font-medium">{pointsEarned} pts</span>
                </div>
                <Progress value={progressPercentage} className="h-2 mb-2" />
                <div className="text-sm text-foreground/70 text-right">
                  {pointsToNextReward} points to next reward
                </div>
              </div>

              {upcomingEvents.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-3">Upcoming Member Events</h3>
                  <div className="space-y-3">
                    {upcomingEvents.map((event, index) => (
                      <div key={index} className="bg-secondary/20 rounded-lg p-3">
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-foreground/70">{event.date}</div>
                        <div className="text-sm text-foreground/70">{event.location}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MembershipBenefits;
