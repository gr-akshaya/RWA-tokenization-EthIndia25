import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, Store, Plus, BarChart3, Wallet } from "lucide-react";
import { ConnectWallet } from "./ConnectWallet";

export const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            <Package className="h-6 w-6 text-primary" />
            Fragmenta
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Button
                variant={isActive("/") ? "secondary" : "ghost"}
                asChild
              >
                <Link to="/">Home</Link>
              </Button>
              
              <Button
                variant={isActive("/marketplace") ? "secondary" : "ghost"}
                asChild
              >
                <Link to="/marketplace" className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  Marketplace
                </Link>
              </Button>
              
              <Button
                variant={isActive("/portfolio") ? "secondary" : "ghost"}
                asChild
              >
                <Link to="/portfolio" className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Portfolio
                </Link>
              </Button>
              
              <Button
                variant={isActive("/analytics") ? "secondary" : "ghost"}
                asChild
              >
                <Link to="/analytics" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </Link>
              </Button>
              
              <Button
                variant={isActive("/create") ? "default" : "outline"}
                asChild
              >
                <Link to="/create" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Tokenize Asset
                </Link>
              </Button>
            </div>
            
            <ConnectWallet 
              variant="outline" 
              size="sm" 
              showAddress={true}
              className="ml-2"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};