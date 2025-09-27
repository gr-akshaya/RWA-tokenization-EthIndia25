import lighthouse from "@lighthouse-web3/sdk";

export interface UploadResult {
  hash: string;
  name: string;
  size: string;
  decryptUrl: string;
}

export interface UploadProgress {
  progress: number;
  status: string;
}

// Define your API Key (should be replaced with secure environment variables in production)
const apiKey = import.meta.env.VITE_LIGHTHOUSE_API_KEY;

if (!apiKey) {
  console.warn("VITE_LIGHTHOUSE_API_KEY is not set. Please add it to your .env file.");
}

// Function to sign the authentication message using Wallet
export const signAuthMessage = async (): Promise<{ signature: string; signerAddress: string } | null> => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length === 0) {
        throw new Error("No accounts returned from Wallet.");
      }
      const signerAddress = accounts[0];
      const { message } = (await lighthouse.getAuthMessage(signerAddress)).data;
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, signerAddress],
      });
      return { signature, signerAddress };
    } catch (error) {
      console.error("Error signing message with Wallet", error);
      return null;
    }
  } else {
    console.log("Please install Wallet!");
    return null;
  }
};

// Progress callback function
export const progressCallback = (progressData: UploadProgress) => {
  let percentageDone = 100 - (progressData.progress / 1) * 100;
  console.log(percentageDone);
};

// Function to upload a single encrypted file
export const uploadEncryptedFile = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResult | null> => {
  if (!apiKey) {
    throw new Error("Lighthouse API key is not configured. Please add VITE_LIGHTHOUSE_API_KEY to your .env file.");
  }

  try {
    // This signature is used for authentication with encryption nodes
    // If you want to avoid signatures on every upload refer to JWT part of encryption authentication section
    const encryptionAuth = await signAuthMessage();
    if (!encryptionAuth) {
      throw new Error("Failed to sign the message.");
    }

    const { signature, signerAddress } = encryptionAuth;

    // Create progress callback that calls the provided onProgress function
    const progressCallback = (progressData: UploadProgress) => {
      let percentageDone = 100 - (progressData.progress / 1) * 100;
      if (onProgress) {
        onProgress(percentageDone);
      }
    };

    // Upload file with encryption
    const output = await lighthouse.uploadEncrypted(
      file,
      apiKey,
      signerAddress,
      signature,
      progressCallback
    );

    console.log("Encrypted File Status:", output);
    
    if (output.data && output.data.length > 0) {
      const fileData = output.data[0];
      const decryptUrl = `https://decrypt.mesh3.network/evm/${fileData.Hash}`;
      
      return {
        hash: fileData.Hash,
        name: fileData.Name,
        size: fileData.Size,
        decryptUrl
      };
    }

    return null;
  } catch (error) {
    console.error("Error uploading encrypted file:", error);
    throw error;
  }
};

// Function to upload multiple files
export const uploadMultipleEncryptedFiles = async (
  files: File[],
  onProgress?: (fileIndex: number, progress: number) => void
): Promise<UploadResult[]> => {
  const results: UploadResult[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      const result = await uploadEncryptedFile(file, (progress) => {
        if (onProgress) {
          onProgress(i, progress);
        }
      });
      
      if (result) {
        results.push(result);
      }
    } catch (error) {
      console.error(`Error uploading file ${file.name}:`, error);
      // Continue with other files even if one fails
    }
  }
  
  return results;
};

// Function to check if wallet is connected
export const isWalletConnected = (): boolean => {
  return !!window.ethereum;
};

// Function to get current wallet address
export const getCurrentWalletAddress = async (): Promise<string | null> => {
  if (!window.ethereum) {
    return null;
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });
    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error("Error getting wallet address:", error);
    return null;
  }
};
