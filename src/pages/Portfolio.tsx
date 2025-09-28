import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  BarChart3,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download,
  Calendar,
  Target,
  Award
} from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";

interface PortfolioAsset {
  id: string;
  title: string;
  category: string;
  tokensOwned: number;
  totalTokens: number;
  purchasePrice: number;
  currentPrice: number;
  totalValue: number;
  purchaseDate: string;
  monthlyYield: number;
  totalYield: number;
  yieldEarned: number;
  image: string;
  status: 'active' | 'sold_out' | 'paused';
  lastYieldDate: string;
}

interface YieldHistory {
  date: string;
  amount: number;
  assetId: string;
  assetTitle: string;
}

// Mock data for portfolio
const mockPortfolio: PortfolioAsset[] = [
  {
    id: "1",
    title: "Luxury Manhattan Penthouse",
    category: "Real Estate",
    tokensOwned: 50,
    totalTokens: 10000,
    purchasePrice: 1000,
    currentPrice: 1050,
    totalValue: 52500,
    purchaseDate: "2024-01-15",
    monthlyYield: 2.5,
    totalYield: 15.2,
    yieldEarned: 1250,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    status: 'active',
    lastYieldDate: "2024-01-20"
  },
  {
    id: "2",
    title: "Commercial Office Building",
    category: "Real Estate",
    tokensOwned: 25,
    totalTokens: 5000,
    purchasePrice: 1000,
    currentPrice: 1020,
    totalValue: 25500,
    purchaseDate: "2023-11-10",
    monthlyYield: 3.2,
    totalYield: 18.7,
    yieldEarned: 850,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    status: 'sold_out',
    lastYieldDate: "2024-01-18"
  },
  {
    id: "3",
    title: "Vintage Ferrari 250 GT",
    category: "Vehicles",
    tokensOwned: 10,
    totalTokens: 5000,
    purchasePrice: 500,
    currentPrice: 520,
    totalValue: 5200,
    purchaseDate: "2024-01-05",
    monthlyYield: 1.8,
    totalYield: 8.5,
    yieldEarned: 200,
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    status: 'active',
    lastYieldDate: "2024-01-20"
  }
];

const mockYieldHistory: YieldHistory[] = [
  { date: "2024-01-20", amount: 125, assetId: "1", assetTitle: "Luxury Manhattan Penthouse" },
  { date: "2024-01-18", amount: 80, assetId: "2", assetTitle: "Commercial Office Building" },
  { date: "2024-01-20", amount: 18, assetId: "3", assetTitle: "Vintage Ferrari 250 GT" },
  { date: "2023-12-20", amount: 120, assetId: "1", assetTitle: "Luxury Manhattan Penthouse" },
  { date: "2023-12-18", amount: 75, assetId: "2", assetTitle: "Commercial Office Building" },
  { date: "2023-12-20", amount: 15, assetId: "3", assetTitle: "Vintage Ferrari 250 GT" }
];

const Portfolio = () => {
  const { address, isConnected } = useWallet();
  const [portfolio, setPortfolio] = useState<PortfolioAsset[]>(mockPortfolio);
  const [yieldHistory, setYieldHistory] = useState<YieldHistory[]>(mockYieldHistory);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Calculate portfolio metrics
  const totalInvested = portfolio.reduce((sum, asset) => sum + (asset.tokensOwned * asset.purchasePrice), 0);
  const totalCurrentValue = portfolio.reduce((sum, asset) => sum + asset.totalValue, 0);
  const totalYieldEarned = portfolio.reduce((sum, asset) => sum + asset.yieldEarned, 0);
  const totalGainLoss = totalCurrentValue - totalInvested;
  const totalReturn = totalInvested > 0 ? ((totalCurrentValue - totalInvested) / totalInvested) * 100 : 0;
  const totalAssets = portfolio.length;
  const averageYield = portfolio.reduce((sum, asset) => sum + asset.monthlyYield, 0) / portfolio.length;

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <Wallet className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Connect Your Wallet</h1>
            <p className="text-muted-foreground">
              Please connect your wallet to view your portfolio
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Portfolio</h1>
          <p className="text-muted-foreground">
            Track your tokenized asset investments, yields, and performance
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="mb-6">
          <Tabs value={selectedTimeframe} onValueChange={(value) => setSelectedTimeframe(value as any)}>
            <TabsList>
              <TabsTrigger value="7d">7 Days</TabsTrigger>
              <TabsTrigger value="30d">30 Days</TabsTrigger>
              <TabsTrigger value="90d">90 Days</TabsTrigger>
              <TabsTrigger value="1y">1 Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Portfolio Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalInvested.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Across {totalAssets} assets
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalCurrentValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Market value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Return</CardTitle>
              {totalGainLoss >= 0 ? (
                <ArrowUpRight className="h-4 w-4 text-green-600" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalReturn.toFixed(2)}% return
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Yield Earned</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${totalYieldEarned.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {averageYield.toFixed(1)}% avg yield
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Tabs */}
        <Tabs defaultValue="assets" className="space-y-6">
          <TabsList>
            <TabsTrigger value="assets">My Assets</TabsTrigger>
            <TabsTrigger value="yield">Yield History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="assets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolio.map((asset) => {
                    const ownershipPercentage = (asset.tokensOwned / asset.totalTokens) * 100;
                    const priceChange = asset.currentPrice - asset.purchasePrice;
                    const priceChangePercent = (priceChange / asset.purchasePrice) * 100;
                    
                    return (
                      <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <img 
                            src={asset.image} 
                            alt={asset.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="font-semibold">{asset.title}</h3>
                            <p className="text-sm text-muted-foreground">{asset.category}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={asset.status === 'active' ? 'default' : asset.status === 'sold_out' ? 'secondary' : 'outline'}>
                                {asset.status === 'active' ? 'Active' : asset.status === 'sold_out' ? 'Sold Out' : 'Paused'}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {ownershipPercentage.toFixed(2)}% ownership
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-8">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Tokens Owned</p>
                            <p className="font-semibold">{asset.tokensOwned}</p>
                          </div>
                          
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Current Price</p>
                            <p className="font-semibold">${asset.currentPrice}</p>
                            <p className={`text-xs ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {priceChange >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
                            </p>
                          </div>
                          
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Total Value</p>
                            <p className="font-semibold">${asset.totalValue.toLocaleString()}</p>
                          </div>
                          
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Monthly Yield</p>
                            <p className="font-semibold text-green-600">{asset.monthlyYield}%</p>
                          </div>
                          
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Yield Earned</p>
                            <p className="font-semibold text-green-600">${asset.yieldEarned.toLocaleString()}</p>
                          </div>
                          
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="yield" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Yield History</CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {yieldHistory.map((yieldItem, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{yieldItem.assetTitle}</h3>
                          <p className="text-sm text-muted-foreground">{yieldItem.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">+${yieldItem.amount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Yield payment</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {portfolio.map((asset) => {
                      const percentage = (asset.totalValue / totalCurrentValue) * 100;
                      return (
                        <div key={asset.id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{asset.title}</span>
                            <span>{percentage.toFixed(1)}%</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Return</span>
                      <span className={`font-semibold ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Average Yield</span>
                      <span className="font-semibold text-green-600">{averageYield.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Assets</span>
                      <span className="font-semibold">{totalAssets}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Yield Earned</span>
                      <span className="font-semibold text-green-600">${totalYieldEarned.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Portfolio;
