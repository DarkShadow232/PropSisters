import React from 'react';
import { Clock, Globe, DollarSign, Zap, Wifi, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const VisitorTips = () => {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-title mb-6">Visitor Tips</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Essential information to help you plan your stay in Cairo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Best Time to Visit */}
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
                    Best Time to Visit:
                  </h3>
                  <p className="text-foreground/70">
                    October to April offers the most pleasant weather.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Language */}
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <Globe size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Language:</h3>
                  <p className="text-foreground/70">
                    Arabic is the official language, but English is widely spoken in tourist areas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Currency */}
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <DollarSign size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Currency:</h3>
                  <p className="text-foreground/70">
                    Egyptian Pound (EGP). ATMs are widely available.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Hours */}
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Business Hours:</h3>
                  <p className="text-foreground/70">
                    Most shops open 10am-10pm, with many businesses closed on Friday mornings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Electricity */}
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Electricity:</h3>
                  <p className="text-foreground/70">
                    220V, European-style two-pin plugs.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Internet */}
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <Wifi size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Internet:</h3>
                  <p className="text-foreground/70">
                    All our properties offer high-speed WiFi. SIM cards are available at the airport.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-foreground/60 max-w-2xl mx-auto">
            Our concierge service is available 24/7 to assist you with any additional information or special requests during your stay.
          </p>
        </div>
      </div>
    </section>
  );
};

export default VisitorTips;
