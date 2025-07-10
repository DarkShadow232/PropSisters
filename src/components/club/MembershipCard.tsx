import React from "react";
import { Card } from "@/components/ui/card";
import { Crown, QrCode, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface MembershipCardProps {
  memberName: string;
  membershipLevel: "Silver" | "Gold" | "Platinum";
  membershipId: string;
  joinDate: string;
  expiryDate: string;
}

const MembershipCard: React.FC<MembershipCardProps> = ({
  memberName,
  membershipLevel,
  membershipId,
  joinDate,
  expiryDate,
}) => {
  const { toast } = useToast();

  const getLevelColor = () => {
    switch (membershipLevel) {
      case "Silver":
        return "bg-gradient-to-r from-gray-300 to-gray-400";
      case "Gold":
        return "bg-gradient-to-r from-yellow-300 to-amber-500";
      case "Platinum":
        return "bg-gradient-to-r from-slate-400 to-slate-600";
      default:
        return "bg-gradient-to-r from-gray-300 to-gray-400";
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(membershipId);
    toast({
      title: "Membership ID copied",
      description: "Your membership ID has been copied to clipboard.",
      variant: "default",
    });
  };

  // Generate a fake QR code pattern (in a real app, this would be a real QR code)
  const generateQRPattern = () => {
    const size = 10;
    const rows = [];
    
    for (let i = 0; i < size; i++) {
      const cells = [];
      for (let j = 0; j < size; j++) {
        // Create a deterministic but seemingly random pattern based on the membership ID
        const isFilled = (membershipId.charCodeAt(i % membershipId.length) + 
                          membershipId.charCodeAt(j % membershipId.length)) % 3 === 0;
        cells.push(
          <div 
            key={`${i}-${j}`} 
            className={`w-2 h-2 ${isFilled ? 'bg-black' : 'bg-transparent'}`}
          />
        );
      }
      rows.push(
        <div key={i} className="flex">
          {cells}
        </div>
      );
    }
    
    return (
      <div className="p-2 bg-white rounded-lg">
        {rows}
      </div>
    );
  };

  return (
    <Card className={`relative overflow-hidden w-full max-w-md mx-auto ${getLevelColor()} text-white shadow-xl rounded-xl`}>
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <Crown size={128} />
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-medium">Property Sisters Club</h3>
            <p className="text-sm opacity-80">Member since {joinDate}</p>
          </div>
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
            <Crown size={14} />
            <span className="font-medium">{membershipLevel}</span>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-sm opacity-80">Member Name</p>
          <h2 className="text-xl font-medium">{memberName}</h2>
        </div>
        
        <div className="flex justify-between items-end">
          <div>
            <p className="text-sm opacity-80">Member ID</p>
            <div className="flex items-center gap-2">
              <p className="font-mono">{membershipId}</p>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 rounded-full bg-white/20 hover:bg-white/30"
                onClick={copyToClipboard}
              >
                <Copy size={12} />
              </Button>
            </div>
            <p className="text-sm opacity-80 mt-2">Valid until: {expiryDate}</p>
          </div>
          
          <div className="flex items-center justify-center p-1 bg-white rounded-lg">
            {generateQRPattern()}
          </div>
        </div>
      </div>
      
      <div className="h-2 bg-[#b94a3b]"></div>
    </Card>
  );
};

export default MembershipCard;
