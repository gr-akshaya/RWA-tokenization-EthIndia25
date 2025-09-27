import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { ConnectWallet } from "@/components/ConnectWallet";
import { useWallet } from "@/contexts/WalletContext";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Zap, Users, TrendingUp, Wallet, Globe, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-tokenization.jpg";

const Home = () => {
  const { isConnected } = useWallet();
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-mesh animate-pulse" />
          <div className="absolute inset-0 bg-gradient-hero opacity-10" />
          
          {/* Mesh gradient overlay */}
          <div className="absolute inset-0 opacity-70">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-primary/30 to-transparent rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-radial from-accent/20 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
            <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-radial from-primary/20 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
          </div>
        </div>
        
        {/* Floating Elements with glow */}
        <div className="absolute top-20 left-10 w-24 h-24 bg-primary/30 rounded-full blur-xl animate-bounce shadow-glow" style={{animationDelay: '0.5s'}} />
        <div className="absolute top-40 right-20 w-32 h-32 bg-accent/20 rounded-full blur-xl animate-bounce shadow-glow" style={{animationDelay: '1.5s'}} />
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-primary/40 rounded-full blur-xl animate-bounce shadow-glow" style={{animationDelay: '2.5s'}} />
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-accent/30 rounded-full blur-xl animate-bounce shadow-glow" style={{animationDelay: '3s'}} />
        
        <div className="relative container mx-auto px-4 z-10">
          <div className="text-center space-y-12 max-w-6xl mx-auto">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-8 py-3 text-sm text-primary animate-fade-in backdrop-blur-sm shadow-inner">
                <Sparkles className="h-4 w-4" />
                Real World Asset Tokenization
              </div>
              
              <h1 className="text-7xl md:text-9xl font-black bg-gradient-hero bg-clip-text text-transparent leading-tight tracking-tight">
                Tokenize Reality
                <span className="block text-5xl md:text-7xl bg-gradient-primary bg-clip-text">Unlock Liquidity</span>
              </h1>
              
              <p className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light">
                Fractional property ownership made simple. Access premium properties worldwide through blockchain tokenization. 
                <span className="text-primary font-medium">Unlock liquidity for your asset.</span>
              </p>
            </div>
            
            {!isConnected ? (
              <div className="flex flex-col items-center justify-center gap-8 pt-12">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-semibold text-muted-foreground">
                    Connect Your Wallet to Get Started
                  </h3>
                  <p className="text-lg text-muted-foreground max-w-2xl">
                    Connect your MetaMask wallet to start tokenizing assets and investing in real-world properties
                  </p>
                </div>
                
                <ConnectWallet 
                  variant="default"
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90 transition-all duration-500 shadow-premium text-lg px-16 py-8 rounded-2xl group hover:shadow-glow hover:scale-105"
                />
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Button variant="outline" size="lg" asChild className="text-lg px-8 py-4 rounded-2xl border-2 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 backdrop-blur-sm">
                    <Link to="/marketplace" className="flex items-center gap-3">
                      <Globe className="h-5 w-5" />
                      Browse Assets
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-12">
                <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 transition-all duration-500 shadow-premium text-lg px-16 py-8 rounded-2xl group hover:shadow-glow hover:scale-105">
                  <Link to="/create" className="flex items-center gap-3">
                    <Wallet className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                    Tokenize Asset
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </Link>
                </Button>
                
                <Button variant="outline" size="lg" asChild className="text-lg px-16 py-8 rounded-2xl border-2 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 backdrop-blur-sm">
                  <Link to="/marketplace" className="flex items-center gap-3">
                    <Globe className="h-6 w-6" />
                    Browse Assets
                  </Link>
                </Button>
              </div>
            )}
            
            <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6 rounded-2xl bg-gradient-glow backdrop-blur-sm border border-primary/20">
                <div className="text-4xl font-black text-primary mb-2">$50M+</div>
                <div className="text-sm text-muted-foreground">Assets Tokenized</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-gradient-glow backdrop-blur-sm border border-primary/20">
                <div className="text-4xl font-black text-primary mb-2">2.5K+</div>
                <div className="text-sm text-muted-foreground">Active Investors</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-gradient-glow backdrop-blur-sm border border-primary/20">
                <div className="text-4xl font-black text-primary mb-2">15+</div>
                <div className="text-sm text-muted-foreground">Asset Categories</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">Why Choose Property Tokenization?</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-xl leading-relaxed">
              Transform illiquid properties into tradeable digital tokens. Access premium real estate investments, enhance liquidity, and unlock fractional ownership of high-value buildings.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-6 p-8 rounded-2xl bg-gradient-glow backdrop-blur border border-primary/20 hover:shadow-glow hover:border-primary/40 transition-all duration-500 group">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-premium group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-xl">Asset Security</h3>
              <p className="text-muted-foreground">
                Every tokenized asset is secured by immutable blockchain records and smart contract verification.
              </p>
            </div>
            
            <div className="text-center space-y-6 p-8 rounded-2xl bg-gradient-glow backdrop-blur border border-primary/20 hover:shadow-glow hover:border-primary/40 transition-all duration-500 group">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-premium group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-xl">Instant Liquidity</h3>
              <p className="text-muted-foreground">
                Convert illiquid assets into tradeable tokens with 24/7 market access and instant settlements.
              </p>
            </div>
            
            <div className="text-center space-y-6 p-8 rounded-2xl bg-gradient-glow backdrop-blur border border-primary/20 hover:shadow-glow hover:border-primary/40 transition-all duration-500 group">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-premium group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-xl">Automated Returns</h3>
              <p className="text-muted-foreground">
                Automated rent distribution, property expenses, and profit sharing through tamper-proof smart contract.
              </p>
            </div>
            
            <div className="text-center space-y-6 p-8 rounded-2xl bg-gradient-glow backdrop-blur border border-primary/20 hover:shadow-glow hover:border-primary/40 transition-all duration-500 group">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-premium group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-xl">Fractional Ownership</h3>
              <p className="text-muted-foreground">
                Enable partial ownership of high-value buildings and homes, making premium real estate accessible starting from just $100.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 border-t border-border/40">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">Start Tokenizing Today</h2>
            <p className="text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Join the revolution of asset tokenization. Transform your physical assets into digital opportunities 
              and access the future of investment.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8">
              <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 transition-all duration-500 shadow-premium text-xl px-16 py-8 rounded-2xl group hover:shadow-glow hover:scale-105">
                <Link to="/create" className="flex items-center gap-4">
                  <Sparkles className="h-6 w-6 group-hover:rotate-180 transition-transform duration-500" />
                  Tokenize Your Asset
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" asChild className="text-xl px-16 py-8 rounded-2xl border-2 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 backdrop-blur-sm">
                <Link to="/marketplace" className="flex items-center gap-4">
                  <Globe className="h-6 w-6" />
                  Explore Tokenized Assets
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;