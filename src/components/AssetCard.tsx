import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin, Coins } from "lucide-react";

export interface Asset {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  image: string;
  tokenSupply: number;
  tokensSold: number;
}

interface AssetCardProps {
  asset: Asset;
  onBuy?: (assetId: string) => void;
}

export const AssetCard = ({ asset, onBuy }: AssetCardProps) => {
  const completionPercentage = (asset.tokensSold / asset.tokenSupply) * 100;
  
  return (
    <Card className="group hover:shadow-card transition-all duration-300 hover:scale-[1.02] bg-card/50 backdrop-blur border-border/50">
      <div className="aspect-video relative overflow-hidden rounded-t-lg">
        <img 
          src={asset.image} 
          alt={asset.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground">
          {asset.category}
        </Badge>
      </div>
      
      <CardContent className="p-4 space-y-3">
        <h3 className="font-semibold text-lg line-clamp-1">{asset.title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2">{asset.description}</p>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {asset.location}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-foreground">{asset.tokensSold}/{asset.tokenSupply} tokens</span>
          </div>
          <div className="w-full bg-secondary/50 rounded-full h-2">
            <div 
              className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Coins className="h-4 w-4 text-primary" />
          <span className="font-bold text-lg">${asset.price.toLocaleString()}</span>
          <span className="text-muted-foreground text-sm">per token</span>
        </div>
        
        <Button 
          onClick={() => onBuy?.(asset.id)}
          disabled={asset.tokensSold >= asset.tokenSupply}
          className="bg-gradient-primary hover:opacity-90 transition-opacity"
        >
          {asset.tokensSold >= asset.tokenSupply ? "Sold Out" : "Buy Tokens"}
        </Button>
      </CardFooter>
    </Card>
  );
};