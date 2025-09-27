import { ethers } from "ethers";

export interface AssetData {
  title: string;
  description: string;
  category: string;
  location: string;
  tokenName: string;
  tokenSymbol: string;
  totalValue: number;
  tokenSupply: number;
  minInvestment: number;
  imageHashes: string[];
  documentHashes: string[];
}

export interface ContractConfig {
  contractAddress: string;
  abi: any[];
}

// Mock contract configuration - replace with your actual contract details
const CONTRACT_CONFIG: ContractConfig = {
  contractAddress: "0x1234567890123456789012345678901234567890", // Replace with your contract address
  abi: [
    // Add your contract ABI here
    {
      "inputs": [
        {"name": "assetData", "type": "tuple", "components": [
          {"name": "title", "type": "string"},
          {"name": "description", "type": "string"},
          {"name": "category", "type": "string"},
          {"name": "location", "type": "string"},
          {"name": "tokenName", "type": "string"},
          {"name": "tokenSymbol", "type": "string"},
          {"name": "totalValue", "type": "uint256"},
          {"name": "tokenSupply", "type": "uint256"},
          {"name": "minInvestment", "type": "uint256"},
          {"name": "imageHashes", "type": "string[]"},
          {"name": "documentHashes", "type": "string[]"}
        ]}
      ],
      "name": "listAsset",
      "outputs": [{"name": "tokenId", "type": "uint256"}],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
};

// Function to get the contract instance
export const getContract = async () => {
  if (!window.ethereum) {
    throw new Error("Please install MetaMask or another Web3 wallet");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(
    CONTRACT_CONFIG.contractAddress,
    CONTRACT_CONFIG.abi,
    signer
  );

  return contract;
};

// Function to list an asset on the blockchain
export const listAssetOnContract = async (assetData: AssetData): Promise<string> => {
  try {
    const contract = await getContract();
    
    // Convert the asset data to the format expected by the contract
    const contractData = {
      title: assetData.title,
      description: assetData.description,
      category: assetData.category,
      location: assetData.location,
      tokenName: assetData.tokenName,
      tokenSymbol: assetData.tokenSymbol,
      totalValue: ethers.parseEther(assetData.totalValue.toString()),
      tokenSupply: BigInt(assetData.tokenSupply),
      minInvestment: ethers.parseEther(assetData.minInvestment.toString()),
      imageHashes: assetData.imageHashes,
      documentHashes: assetData.documentHashes
    };

    console.log("Calling contract with data:", contractData);

    // Call the contract function
    const tx = await contract.listAsset(contractData);
    console.log("Transaction sent:", tx.hash);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);

    // Extract the token ID from the transaction receipt
    // This assumes your contract emits an event with the token ID
    const tokenId = receipt.logs[0]?.args?.tokenId || "0";
    
    return tokenId;
  } catch (error) {
    console.error("Error listing asset on contract:", error);
    throw error;
  }
};

// Function to check if the user has approved the contract to spend their tokens
export const checkAllowance = async (tokenAddress: string, amount: string): Promise<boolean> => {
  try {
    const contract = await getContract();
    const userAddress = await contract.signer.getAddress();
    
    // This is a simplified check - adjust based on your token contract
    const allowance = await contract.allowance(userAddress, CONTRACT_CONFIG.contractAddress);
    return allowance >= ethers.parseEther(amount);
  } catch (error) {
    console.error("Error checking allowance:", error);
    return false;
  }
};

// Function to approve the contract to spend tokens
export const approveTokens = async (tokenAddress: string, amount: string): Promise<void> => {
  try {
    const contract = await getContract();
    const tx = await contract.approve(CONTRACT_CONFIG.contractAddress, ethers.parseEther(amount));
    await tx.wait();
    console.log("Tokens approved successfully");
  } catch (error) {
    console.error("Error approving tokens:", error);
    throw error;
  }
};

// Function to get the current network
export const getCurrentNetwork = async (): Promise<number> => {
  if (!window.ethereum) {
    throw new Error("Please install MetaMask or another Web3 wallet");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const network = await provider.getNetwork();
  return Number(network.chainId);
};

// Function to switch to the correct network (if needed)
export const switchToCorrectNetwork = async (targetChainId: number): Promise<void> => {
  if (!window.ethereum) {
    throw new Error("Please install MetaMask or another Web3 wallet");
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${targetChainId.toString(16)}` }],
    });
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      throw new Error(`Please add the network with chain ID ${targetChainId} to your wallet`);
    }
    throw switchError;
  }
};
