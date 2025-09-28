import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Building, 
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download
} from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";

interface AssetAnalytics {
  id: string;
  title: string;
  category: string;
  totalValue: number;
  tokensSold: number;
  totalTokens: number;
  currentPrice: number;
  totalInvestors: number;
  monthlyYield: number;
  totalYield: number;
  revenue: number;
  expenses: number;
  netProfit: number;
  image: string;
  status: 'active' | 'sold_out' | 'paused';
  listedDate: string;
  lastUpdated: string;
}

// Mock data for analytics
const mockAnalytics: AssetAnalytics[] = [
  {
    id: "1",
    title: "Luxury Manhattan Penthouse",
    category: "Real Estate",
    totalValue: 10000000,
    tokensSold: 7500,
    totalTokens: 10000,
    currentPrice: 1000,
    totalInvestors: 45,
    monthlyYield: 2.5,
    totalYield: 15.2,
    revenue: 25000,
    expenses: 5000,
    netProfit: 20000,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    status: 'active',
    listedDate: "2024-01-15",
    lastUpdated: "2024-01-20"
  },
  {
    id: "2",
    title: "Commercial Office Building",
    category: "Real Estate",
    totalValue: 5000000,
    tokensSold: 5000,
    totalTokens: 5000,
    currentPrice: 1000,
    totalInvestors: 32,
    monthlyYield: 3.2,
    totalYield: 18.7,
    revenue: 16000,
    expenses: 3000,
    netProfit: 13000,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    status: 'sold_out',
    listedDate: "2023-11-10",
    lastUpdated: "2024-01-18"
  }
];

const Analytics = () => {
  const { address, isConnected } = useWallet();
  const [analytics, setAnalytics] = useState<AssetAnalytics[]>(mockAnalytics);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Calculate aggregate metrics
  const totalAssets = analytics.length;
  const totalValue = analytics.reduce((sum, asset) => sum + asset.totalValue, 0);
  const totalInvestors = analytics.reduce((sum, asset) => sum + asset.totalInvestors, 0);
  const totalRevenue = analytics.reduce((sum, asset) => sum + asset.revenue, 0);
  const totalExpenses = analytics.reduce((sum, asset) => sum + asset.expenses, 0);
  const totalNetProfit = analytics.reduce((sum, asset) => sum + asset.netProfit, 0);
  const averageYield = analytics.reduce((sum, asset) => sum + asset.monthlyYield, 0) / analytics.length;

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <Building className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Connect Your Wallet</h1>
            <p className="text-muted-foreground">
              Please connect your wallet to view your asset analytics
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
          <h1 className="text-3xl font-bold mb-2">Asset Analytics</h1>
          <p className="text-muted-foreground">
            Track performance, yields, and investor activity for your tokenized assets
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

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAssets}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.filter(a => a.status === 'active').length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Tokenized assets
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Investors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInvestors}</div>
              <p className="text-xs text-muted-foreground">
                Across all assets
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Monthly Yield</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageYield.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Per asset
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue & Profit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Last {selectedTimeframe}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <ArrowDownRight className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${totalExpenses.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Last {selectedTimeframe}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalNetProfit.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Last {selectedTimeframe}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Asset Performance Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Asset Performance</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.map((asset) => (
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
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Tokens Sold</p>
                      <p className="font-semibold">{asset.tokensSold}/{asset.totalTokens}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Investors</p>
                      <p className="font-semibold">{asset.totalInvestors}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Monthly Yield</p>
                      <p className="font-semibold text-green-600">{asset.monthlyYield}%</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Net Profit</p>
                      <p className="font-semibold">${asset.netProfit.toLocaleString()}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={asset.status === 'active' ? 'default' : asset.status === 'sold_out' ? 'secondary' : 'outline'}>
                        {asset.status === 'active' ? 'Active' : asset.status === 'sold_out' ? 'Sold Out' : 'Paused'}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
