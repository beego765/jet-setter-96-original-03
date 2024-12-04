import { SearchForm } from "@/components/flight-search/SearchForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plane, MapPin, Clock, Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background z-0" />
        
        <div className="container max-w-7xl mx-auto px-4 py-12 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 gradient-text">
              Find Your Perfect Flight
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Search and compare flights from hundreds of airlines and travel providers
            </p>
          </div>

          <Card className="bg-card/80 backdrop-blur-lg border-border p-6 md:p-8 max-w-4xl mx-auto">
            <SearchForm />
          </Card>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-muted py-16">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 bg-card border-border">
              <Plane className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                Wide Selection
              </h3>
              <p className="text-muted-foreground">
                Access hundreds of airlines worldwide
              </p>
            </Card>

            <Card className="p-6 bg-card border-border">
              <MapPin className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                Global Coverage
              </h3>
              <p className="text-muted-foreground">
                Fly to destinations across the globe
              </p>
            </Card>

            <Card className="p-6 bg-card border-border">
              <Clock className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                Real-time Updates
              </h3>
              <p className="text-muted-foreground">
                Get instant flight status updates
              </p>
            </Card>

            <Card className="p-6 bg-card border-border">
              <Shield className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                Secure Booking
              </h3>
              <p className="text-muted-foreground">
                Book with confidence and security
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-card py-16">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-card-foreground mb-4">
            Ready to Take Off?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied travelers who book their flights with us
          </p>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Start Booking Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;