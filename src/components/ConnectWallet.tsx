import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { Wallet, LogOut, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface ConnectWalletProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showAddress?: boolean;
}

export const ConnectWallet: React.FC<ConnectWalletProps> = ({
  variant = "default",
  size = "default",
  className = "",
  showAddress = false,
}) => {
  const { address, isConnected, connectWallet, disconnectWallet, isLoading, error } = useWallet();
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        toast({
          title: "Address Copied",
          description: "Wallet address copied to clipboard",
        });
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast({
          title: "Copy Failed",
          description: "Failed to copy address to clipboard",
          variant: "destructive",
        });
      }
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        {showAddress && (
          <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
            <span className="text-sm font-mono">{formatAddress(address)}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyAddress}
              className="h-6 w-6 p-0"
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        )}
        <Button
          variant={variant}
          size={size}
          onClick={disconnectWallet}
          className={`flex items-center gap-2 ${className}`}
        >
          <LogOut className="h-4 w-4" />
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant={variant}
        size={size}
        onClick={connectWallet}
        disabled={isLoading}
        className={`flex items-center gap-2 ${className}`}
      >
        <Wallet className="h-4 w-4" />
        {isLoading ? "Connecting..." : "Connect Wallet"}
      </Button>
      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}
    </div>
  );
};
