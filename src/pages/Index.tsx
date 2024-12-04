import { SearchForm, SearchFormData } from "@/components/flight-search/SearchForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plane, MapPin, Clock, Shield, ShieldCheck, BriefcaseIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleSearch = (data: SearchFormData) => {
    // Navigate to search results with the search data
    navigate('/search', { state: { searchData: data } });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur" />
        <div className="relative container mx-auto px-4 py-16 space-y-12">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Find Your Perfect Flight
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Book with confidence through our secure, reliable platform offering competitive prices and exceptional service
            </p>
          </div>

          <Card className="bg-card/80 backdrop-blur-lg border-border p-6 md:p-8 max-w-4xl mx-auto">
            <SearchForm onSearch={handleSearch} />
          </Card>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="p-6 bg-card/50 backdrop-blur border-border group hover:bg-card/60 transition-all duration-300">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-purple-500/20 rounded-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-blue-400/30 animate-glow-trace" />
                <Plane className="w-6 h-6 text-purple-400 relative z-10 animate-pulse" />
              </div>
              <h3 className="font-semibold">Global Coverage</h3>
              <p className="text-sm text-muted-foreground">Access flights to over 190 countries worldwide</p>
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur border-border group hover:bg-card/60 transition-all duration-300">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-blue-500/20 rounded-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 animate-glow-trace" />
                <BriefcaseIcon className="w-6 h-6 text-blue-400 relative z-10 animate-pulse" />
              </div>
              <h3 className="font-semibold">IATA Accredited</h3>
              <p className="text-sm text-muted-foreground">Official IATA member ensuring industry-standard service</p>
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur border-border group hover:bg-card/60 transition-all duration-300">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-purple-500/20 rounded-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-blue-400/30 animate-glow-trace" />
                <ShieldCheck className="w-6 h-6 text-purple-400 relative z-10 animate-pulse" />
              </div>
              <h3 className="font-semibold">ATOL Protected</h3>
              <p className="text-sm text-muted-foreground">Your booking is protected under ATOL certification</p>
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur border-border group hover:bg-card/60 transition-all duration-300">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-blue-500/20 rounded-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 animate-glow-trace" />
                <Clock className="w-6 h-6 text-blue-400 relative z-10 animate-pulse" />
              </div>
              <h3 className="font-semibold">24/7 Support</h3>
              <p className="text-sm text-muted-foreground">Round-the-clock customer service and assistance</p>
            </div>
          </Card>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 p-4 rounded-lg bg-card/50 backdrop-blur border-border">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-400" />
              <span className="text-sm font-medium">ATOL: 1234</span>
            </div>
            <div className="flex items-center gap-2">
              <BriefcaseIcon className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium">IATA: 12-3-4567</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;