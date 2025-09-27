import { ethers } from "ethers";
import USDT_ABI from "../abi/USDT.json";
import RWA_ABI from "../abi/RWA.json";

// Core Testnet2 RPC URL
const CORE_TESTNET2_RPC_URL = "https://rpc.test2.btcs.network";

// Contract addresses
const USDT_CONTRACT_ADDRESS = "0x2A0452216398b7667e5eB12243Db68575ED3cF1B";
const RWA_CONTRACT_ADDRESS = "0xa892f8D31a30Da10400bb4CFf9302a2c32E49131";

// USDT has 6 decimals
const USDT_DECIMALS = 6;

export interface ContractError extends Error {
  code?: string;
  reason?: string;
  data?: any;
}

// Function to get the provider and signer
export const getProviderAndSigner = async () => {
  if (!window.ethereum) {
    throw new Error("Please install MetaMask or another Web3 wallet");
  }

  // Use Core Testnet2 RPC for provider
  const provider = new ethers.JsonRpcProvider(CORE_TESTNET2_RPC_URL);
  const walletProvider = new ethers.BrowserProvider(window.ethereum);
  const signer = await walletProvider.getSigner();
  
  return { provider, signer };
};

// Function to get USDT contract instance
export const getUSDTContract = async () => {
  const { signer } = await getProviderAndSigner();
  return new ethers.Contract(USDT_CONTRACT_ADDRESS, USDT_ABI, signer);
};

// Function to get RWA contract instance
export const getRWAContract = async () => {
  const { signer } = await getProviderAndSigner();
  return new ethers.Contract(RWA_CONTRACT_ADDRESS, RWA_ABI, signer);
};

// Function to check USDT allowance
export const checkUSDTAllowance = async (ownerAddress: string, spenderAddress: string): Promise<bigint> => {
  try {
    const { provider } = await getProviderAndSigner();
    const usdtContract = new ethers.Contract(USDT_CONTRACT_ADDRESS, USDT_ABI, provider);
    const allowance = await usdtContract.allowance(ownerAddress, spenderAddress);
    return allowance;
  } catch (error) {
    console.error("Error checking USDT allowance:", error);
    throw error;
  }
};

// Function to approve USDT spending
export const approveUSDT = async (spenderAddress: string, amount: bigint): Promise<string> => {
  try {
    const usdtContract = await getUSDTContract();
    
    console.log(`Approving ${ethers.formatUnits(amount, USDT_DECIMALS)} USDT for ${spenderAddress}`);
    
    const tx = await usdtContract.approve(spenderAddress, amount);
    console.log("USDT approval transaction sent:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("USDT approval confirmed:", receipt);
    
    return tx.hash;
  } catch (error) {
    console.error("Error approving USDT:", error);
    throw error;
  }
};

// Function to buy RWA tokens
export const buyRWATokens = async (amount: bigint): Promise<string> => {
  try {
    const rwaContract = await getRWAContract();
    
    console.log(`Buying ${ethers.formatUnits(amount, USDT_DECIMALS)} USDT worth of RWA tokens`);
    
    const tx = await rwaContract.buyTokens(0,amount);
    console.log("RWA token purchase transaction sent:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("RWA token purchase confirmed:", receipt);
    
    return tx.hash;
  } catch (error) {
    console.error("Error buying RWA tokens:", error);
    throw error;
  }
};

// Function to get user's USDT balance
export const getUSDTBalance = async (userAddress: string): Promise<bigint> => {
  try {
    const { provider } = await getProviderAndSigner();
    const usdtContract = new ethers.Contract(USDT_CONTRACT_ADDRESS, USDT_ABI, provider);
    const balance = await usdtContract.balanceOf(userAddress);
    console.log("USDT balance:", balance);
    return balance;
  } catch (error) {
    console.error("Error getting USDT balance:", error);
    throw error;
  }
};

// Function to convert USD amount to USDT (with decimals)
export const convertUSDToUSDT = (usdAmount: number): bigint => {
  return ethers.parseUnits(usdAmount.toString(), USDT_DECIMALS);
};

// Function to format USDT amount for display
export const formatUSDTAmount = (amount: bigint): string => {
  return ethers.formatUnits(amount, USDT_DECIMALS);
};

// Main function to handle the complete purchase flow
export const purchaseRWATokens = async (
  usdAmount: number,
  onProgress?: (step: string, message: string) => void
): Promise<{ approvalTxHash: string; purchaseTxHash: string }> => {
  try {
    const { signer } = await getProviderAndSigner();
    const userAddress = await signer.getAddress();
    
    // Convert USD to USDT amount
    const usdtAmount = convertUSDToUSDT(usdAmount);
    
    onProgress?.("checking", "Checking USDT balance and allowance...");
    
    // Check user's USDT balance
    const balance = await getUSDTBalance(userAddress);
    if (balance < usdtAmount) {
      throw new Error(`Insufficient USDT balance. Required: ${formatUSDTAmount(usdtAmount)}, Available: ${formatUSDTAmount(balance)}`);
    }
    
    // Check current allowance
    const currentAllowance = await checkUSDTAllowance(userAddress, RWA_CONTRACT_ADDRESS);
    
    if (currentAllowance < usdtAmount) {
      onProgress?.("approving", "Approving USDT spending...");
      
      // Approve USDT spending
      const approvalTxHash = await approveUSDT(RWA_CONTRACT_ADDRESS, usdtAmount);
      
      onProgress?.("purchasing", "Purchasing RWA tokens...");
      
      // Buy RWA tokens
      const purchaseTxHash = await buyRWATokens(usdtAmount);
      
      return { approvalTxHash, purchaseTxHash };
    } else {
      onProgress?.("purchasing", "Purchasing RWA tokens...");
      
      // Buy RWA tokens directly (sufficient allowance)
      const purchaseTxHash = await buyRWATokens(usdtAmount);
      
      return { approvalTxHash: "", purchaseTxHash };
    }
  } catch (error) {
    console.error("Error in purchase flow:", error);
    throw error;
  }
};

// Function to get transaction status
export const getTransactionStatus = async (txHash: string): Promise<{
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: number;
  gasUsed?: bigint;
}> => {
  try {
    const { provider } = await getProviderAndSigner();
    const receipt = await provider.getTransactionReceipt(txHash);
    
    if (!receipt) {
      return { status: 'pending' };
    }
    
    if (receipt.status === 1) {
      return {
        status: 'confirmed',
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed
      };
    } else {
      return { status: 'failed' };
    }
  } catch (error) {
    console.error("Error getting transaction status:", error);
    return { status: 'failed' };
  }
};
