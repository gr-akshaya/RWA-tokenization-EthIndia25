import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { AssetCard, Asset } from "@/components/AssetCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Search, Filter, Plus, QrCode, Check, ArrowLeft, ArrowRight, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useWallet } from "@/contexts/WalletContext";
import { countries, SelfQRcodeWrapper } from '@selfxyz/qrcode';
import { SelfAppBuilder } from '@selfxyz/qrcode';
import { purchaseRWATokens, formatUSDTAmount, convertUSDToUSDT } from "@/lib/contracts";

// Mock data
const mockAssets: Asset[] = [
  {
    id: "1",
    title: "Luxury Manhattan Penthouse",
    description: "Premium penthouse with panoramic city views, featuring 4 bedrooms, 3 bathrooms, and a private rooftop terrace.",
    price: 10,
    category: "Real Estate",
    location: "New York, USA",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tokenSupply: 10000,
    tokensSold: 7500,
  },
  {
    id: "2", 
    title: "Vintage Ferrari 250 GT",
    description: "Rare 1962 Ferrari 250 GT in pristine condition. Fully restored with original engine and documented provenance.",
    price: 500,
    category: "Vehicles",
    location: "Monaco",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tokenSupply: 5000,
    tokensSold: 3200,
  },
  {
    id: "3",
    title: "Contemporary Art Collection",
    description: "Curated collection of contemporary paintings by emerging artists. Includes works by 5 different artists.",
    price: 250,
    category: "Art & Collectibles",
    location: "London, UK",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tokenSupply: 8000,
    tokensSold: 1200,
  },
  {
    id: "4",
    title: "Gold Mining Operation",
    description: "Operational gold mine in Nevada with proven reserves. Includes all equipment and 10-year extraction rights.",
    price: 2000,
    category: "Commodities",
    location: "Nevada, USA",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tokenSupply: 15000,
    tokensSold: 12000,
  },
  {
    id: "5",
    title: "Commercial Office Building",
    description: "Modern 15-story office building in downtown district. Fully leased with long-term tenants and stable income.",
    price: 750,
    category: "Real Estate",
    location: "Toronto, Canada",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tokenSupply: 12000,
    tokensSold: 8500,
  },
  {
    id: "6",
    title: "Rare Wine Collection",
    description: "Exclusive collection of vintage wines from Bordeaux region. Includes bottles from 1982, 1990, and 2005.",
    price: 150,
    category: "Art & Collectibles", 
    location: "Bordeaux, France",
    image: "https://images.unsplash.com/photo-1506377872008-6645d6e08c81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tokenSupply: 3000,
    tokensSold: 800,
  },
];

const Marketplace = () => {
  const { toast } = useToast();
  const { address, isConnected } = useWallet();
  const [assets, setAssets] = useState(mockAssets);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selfApp, setSelfApp] = useState<any | null>(null);
  const [currentStep, setCurrentStep] = useState<'amount' | 'verification'>('amount');
  const [tokenAmount, setTokenAmount] = useState<number>(1);
  const [usdtPrice, setUsdtPrice] = useState<number>(0);
  const [isPurchasing, setIsPurchasing] = useState<boolean>(false);
  const [purchaseProgress, setPurchaseProgress] = useState<string>('');
  
  const categories = ["all", "Real Estate", "Vehicles", "Art & Collectibles", "Commodities"];
  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "0-500", label: "$0 - $500" },
    { value: "500-1000", label: "$500 - $1,000" },
    { value: "1000-2000", label: "$1,000 - $2,000" },
    { value: "2000+", label: "$2,000+" }
  ];

  // Calculate USDT price when token amount or selected asset changes
  useEffect(() => {
    if (selectedAsset) {
      const price = tokenAmount * selectedAsset.price;
      setUsdtPrice(price);
    }
  }, [tokenAmount, selectedAsset]);

  // Initialize Self Protocol app
  useEffect(() => {
    if (!isConnected || !address) return;

    const app = new SelfAppBuilder({
      version: 2,
      appName: import.meta.env.VITE_SELF_APP_NAME || 'Self Workshop',
      scope: import.meta.env.VITE_SELF_SCOPE || 'self-workshop',
      endpoint: import.meta.env.VITE_SELF_ENDPOINT || '0x033ddb957070eb278f02497610bc852661f2b135',
      logoBase64: 'https://i.postimg.cc/mrmVf9hm/self.png',
      userId: address, // Use the connected wallet address
      endpointType: 'staging_celo',
      userIdType: 'hex', // Use 'hex' for Ethereum address
      userDefinedData: 'RWA Token Purchase Verification',
      disclosures: {
        // What you want to verify from the user's identity
        minimumAge: 18,
        excludedCountries: [countries.UNITED_STATES],

        // What you want users to disclose
        //nationality: true,
        //gender: true,
      },
    }).build();

    setSelfApp(app);
  }, [isConnected, address]);
  
  const handleBuy = (assetId: string) => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to purchase tokens.",
        variant: "destructive",
      });
      return;
    }

    const asset = assets.find(a => a.id === assetId);
    setSelectedAsset(asset || null);
    setTokenAmount(1); // Reset to minimum amount
    setCurrentStep('amount'); // Start with amount selection
    setIsVerified(false);
    setShowVerificationModal(true);
  };

  const handleSuccessfulVerification = () => {
    setIsVerified(true);
    toast({
      title: "Identity Verified!",
      description: "You can now proceed with the token purchase.",
    });
  };

  const handleVerificationError = () => {
    toast({
      title: "Verification Failed",
      description: "Please try again or contact support if the issue persists.",
      variant: "destructive",
    });
  };

  const handleProceedToVerification = () => {
    setCurrentStep('verification');
  };

  const handleBackToAmount = () => {
    setCurrentStep('amount');
  };

  const handlePurchase = async () => {
    if (!selectedAsset) return;
    
    setIsPurchasing(true);
    setPurchaseProgress('Starting purchase...');
    
    try {
      // Call the contract purchase function
      const result = await purchaseRWATokens(usdtPrice, (step, message) => {
        setPurchaseProgress(message);
      });
      
      toast({
        title: "Purchase Successful!",
        description: `You have successfully purchased ${tokenAmount} tokens for ${selectedAsset.title} (${usdtPrice} USDT). Transaction: ${result.purchaseTxHash.slice(0, 10)}...`,
      });
      
      // Reset modal state
      setShowVerificationModal(false);
      setSelectedAsset(null);
      setIsVerified(false);
      setCurrentStep('amount');
      setTokenAmount(1);
      setIsPurchasing(false);
      setPurchaseProgress('');
      
    } catch (error) {
      console.error("Purchase failed:", error);
      
      let errorMessage = "Purchase failed. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes("Insufficient USDT balance")) {
          errorMessage = "Insufficient USDT balance. Please add more USDT to your wallet.";
        } else if (error.message.includes("User rejected")) {
          errorMessage = "Transaction was cancelled by user.";
        } else if (error.message.includes("gas")) {
          errorMessage = "Transaction failed due to gas issues. Please try again.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Purchase Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      setIsPurchasing(false);
      setPurchaseProgress('');
    }
  };
  
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || asset.category === selectedCategory;
    
    let matchesPrice = true;
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(p => p.replace("+", ""));
      if (max) {
        matchesPrice = asset.price >= parseInt(min) && asset.price <= parseInt(max);
      } else {
        matchesPrice = asset.price >= parseInt(min);
      }
    }
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Asset Marketplace</h1>
            <p className="text-muted-foreground">
              Discover and invest in tokenized real-world assets
            </p>
          </div>
          
          <Button asChild className="bg-gradient-primary hover:opacity-90 transition-opacity">
            <Link to="/create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              List Asset
            </Link>
          </Button>
        </div>
        
        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger>
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              {priceRanges.map(range => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            More Filters
          </Button>
        </div>
        
        {/* Stats */}
        <div className="mb-8 flex flex-wrap gap-4">
          <Badge variant="secondary" className="px-3 py-1">
            {filteredAssets.length} Assets Available
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            ${filteredAssets.reduce((sum, asset) => sum + (asset.price * asset.tokenSupply), 0).toLocaleString()} Total Value
          </Badge>
        </div>
        
        {/* Assets Grid */}
        {filteredAssets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map(asset => (
              <AssetCard 
                key={asset.id} 
                asset={asset} 
                onBuy={handleBuy}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No assets found matching your criteria.</p>
            <Button asChild className="mt-4 bg-gradient-primary hover:opacity-90 transition-opacity">
              <Link to="/create">List the First Asset</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      <Dialog open={showVerificationModal} onOpenChange={setShowVerificationModal}>
        <DialogContent className="max-w-md mx-auto bg-white">
          {currentStep === 'amount' ? (
            <>
              {/* Step 1: Amount Selection */}
              <DialogHeader className="text-center">
                <DialogTitle className="text-xl text-gray-600 font-semibold mb-2">
                  Select Token Amount
                </DialogTitle>
                <p className="text-gray-600 mb-6">
                  Choose how many tokens you want to purchase for {selectedAsset?.title}
                </p>
              </DialogHeader>
              
              <div className="flex flex-col items-center space-y-6">
                {/* Asset Info */}
                <div className="w-full p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <img 
                      src={selectedAsset?.image} 
                      alt={selectedAsset?.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">{selectedAsset?.title}</h3>
                      <p className="text-sm text-gray-600">{selectedAsset?.category}</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Price per token:</span>
                    <span className="font-semibold">${selectedAsset?.price} USDT</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Available tokens:</span>
                    <span className="font-semibold">{(selectedAsset?.tokenSupply || 0) - (selectedAsset?.tokensSold || 0)}</span>
                  </div>
                </div>

                {/* Token Amount Slider */}
                <div className="w-full space-y-4">
                  <Label htmlFor="token-amount" className="text-sm font-medium text-gray-700">
                    Number of Tokens: {tokenAmount}
                  </Label>
                  <Slider
                    id="token-amount"
                    min={1}
                    max={Math.min(100, (selectedAsset?.tokenSupply || 0) - (selectedAsset?.tokensSold || 0))}
                    step={1}
                    value={[tokenAmount]}
                    onValueChange={(value) => setTokenAmount(value[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1 token</span>
                    <span>{Math.min(100, (selectedAsset?.tokenSupply || 0) - (selectedAsset?.tokensSold || 0))} tokens</span>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="w-full p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Total Amount:</span>
                    <span className="text-lg font-bold text-blue-600">{tokenAmount} tokens</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Price:</span>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-lg font-bold text-green-600">{usdtPrice.toFixed(2)} USDT</span>
                    </div>
                  </div>
                </div>

                {/* User Address */}
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    USER ADDRESS
                  </p>
                  <p className="text-xs text-gray-600 font-mono bg-gray-50 p-2 rounded border">
                    {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not Connected'}
                  </p>
                </div>
                
                {/* Proceed Button */}
                <Button
                  onClick={handleProceedToVerification}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  Proceed to Verification
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Step 2: Identity Verification */}
              <DialogHeader className="text-center">
                <DialogTitle className="text-xl text-gray-600 font-semibold mb-2">
                  Identity Verification Required
                </DialogTitle>
                <p className="text-gray-600 mb-6">
                  Scan the QR code with your Self app to verify your identity and complete the purchase.
                </p>
              </DialogHeader>
              
              <div className="flex flex-col items-center space-y-6">
                {/* Purchase Summary */}
                <div className="w-full p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <img 
                      src={selectedAsset?.image} 
                      alt={selectedAsset?.title}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm">{selectedAsset?.title}</h3>
                      <p className="text-xs text-gray-600">{tokenAmount} tokens</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Price:</span>
                    <span className="font-bold text-green-600">{usdtPrice.toFixed(2)} USDT</span>
                  </div>
                </div>

                {/* Self Protocol QR Code */}
                <div className="w-64 h-64 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
                  {isVerified ? (
                    <div className="text-center">
                      <Check className="w-16 h-16 text-green-500 mx-auto mb-2" />
                      <p className="text-green-600 font-medium">Verified!</p>
                    </div>
                  ) : selfApp ? (
                    <SelfQRcodeWrapper
                      selfApp={selfApp}
                      onSuccess={handleSuccessfulVerification}
                      onError={handleVerificationError}
                    />
                  ) : (
                    <div className="text-center mb-4">
                      <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Loading QR Code...</p>
                    </div>
                  )}
                </div>
                
                {/* Instructions */}
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    {!isVerified ? (
                      <>
                        1. Open the Self app on your phone<br/>
                        2. Scan the QR code above<br/>
                        3. Complete the verification process
                      </>
                    ) : isPurchasing ? (
                      <div className="space-y-2">
                        <div className="text-green-600 font-medium">Identity verified successfully!</div>
                        <div className="text-sm text-blue-600">{purchaseProgress}</div>
                      </div>
                    ) : (
                      "Identity verified successfully! You can now complete your purchase."
                    )}
                  </p>
                </div>
                
                {/* User Address */}
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    USER ADDRESS
                  </p>
                  <p className="text-xs text-gray-600 font-mono bg-gray-50 p-2 rounded border">
                    {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not Connected'}
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3 w-full">
                  <Button
                    variant="outline"
                    onClick={handleBackToAmount}
                    className="flex-1 flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                  <Button
                    className={`flex-1 ${
                      isVerified && !isPurchasing
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!isVerified || isPurchasing}
                    onClick={handlePurchase}
                  >
                    {isPurchasing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {purchaseProgress}
                      </div>
                    ) : isVerified ? (
                      `Buy ${tokenAmount} Tokens`
                    ) : (
                      'Verification Required'
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Marketplace;