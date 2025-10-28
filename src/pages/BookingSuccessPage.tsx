import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowLeft, Home } from "lucide-react";

const BookingSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-beige-50 min-h-screen py-12">
      <div className="container-custom">
        <div className="max-w-md mx-auto">
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Payment Successful!
                </h1>
                <p className="text-gray-600">
                  Your booking has been confirmed. You will receive a confirmation email shortly.
                </p>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate("/rentals")}
                  className="w-full bg-[#b94a3b] hover:bg-[#a03e30] text-white"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Rentals
                </Button>
                
                <Button 
                  onClick={() => navigate("/")}
                  variant="outline"
                  className="w-full"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
