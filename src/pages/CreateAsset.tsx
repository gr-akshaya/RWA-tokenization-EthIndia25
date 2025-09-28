import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Navigation } from "@/components/Navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Upload, ArrowLeft, FileText, X, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { uploadEncryptedFile, uploadMultipleEncryptedFiles, isWalletConnected, UploadResult } from "@/lib/lighthouse";
import { listAsset } from "@/lib/contracts";

const CreateAsset = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [uploadedDocuments, setUploadedDocuments] = useState<File[]>([]);
  const [uploadedImageResults, setUploadedImageResults] = useState<UploadResult[]>([]);
  const [uploadedDocumentResults, setUploadedDocumentResults] = useState<UploadResult[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [isUploading, setIsUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 10MB`,
          variant: "destructive"
        });
        return false;
      }
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image file`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    });
    
    if (validFiles.length === 0) return;
    
    setUploadedImages(prev => [...prev, ...validFiles]);
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (file.size > 25 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 25MB`,
          variant: "destructive"
        });
        return false;
      }
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a valid document type (PDF, DOC, DOCX)`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    });
    
    if (validFiles.length === 0) return;
    
    setUploadedDocuments(prev => [...prev, ...validFiles]);
  };

  const uploadFilesToLighthouse = async (files: File[], type: 'images' | 'documents') => {
    setIsUploading(true);
    
    try {
      const results = await uploadMultipleEncryptedFiles(files, (fileIndex, progress) => {
        const fileKey = `${type}-${fileIndex}`;
        setUploadProgress(prev => ({ ...prev, [fileKey]: progress }));
      });
      
      if (type === 'images') {
        setUploadedImageResults(prev => [...prev, ...results]);
      } else {
        setUploadedDocumentResults(prev => [...prev, ...results]);
      }
      
      toast({
        title: "Files Uploaded Successfully!",
        description: `${results.length} ${type} uploaded and encrypted to IPFS`,
      });
      
      // Clear progress for these files
      const progressKeys = files.map((_, index) => `${type}-${index}`);
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        progressKeys.forEach(key => delete newProgress[key]);
        return newProgress;
      });
      
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      toast({
        title: "Upload Failed",
        description: `Failed to upload ${type}. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setUploadedImageResults(prev => prev.filter((_, i) => i !== index));
  };

  const removeDocument = (index: number) => {
    setUploadedDocuments(prev => prev.filter((_, i) => i !== index));
    setUploadedDocumentResults(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const event = { target: { files } } as unknown as React.ChangeEvent<HTMLInputElement>;
    handleImageUpload(event);
  };

  const handleDocumentDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const event = { target: { files } } as unknown as React.ChangeEvent<HTMLInputElement>;
    handleDocumentUpload(event);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Check if wallet is connected
      if (!isWalletConnected()) {
        toast({
          title: "Wallet Required",
          description: "Please connect your wallet to list your asset",
          variant: "destructive"
        });
        return;
      }

      // Get form data
      const formData = new FormData(e.target as HTMLFormElement);
      //const assetId = Math.floor(Math.random() * 1000000); // Generate a random asset ID
      const assetId = 1;
      const pricePerToken = parseFloat(formData.get('total-value') as string) / parseInt(formData.get('token-supply') as string);
      const totalSupply = parseInt(formData.get('token-supply') as string);

      // Step 1: Upload images to Lighthouse
      if (uploadedImages.length > 0) {
        toast({
          title: "Uploading Images...",
          description: "Encrypting and uploading asset images to IPFS",
        });

        const imageResults = await uploadMultipleEncryptedFiles(
          uploadedImages, 
          (fileIndex, progress) => {
            const fileKey = `images-${fileIndex}`;
            setUploadProgress(prev => ({ ...prev, [fileKey]: progress }));
          }
        );

        toast({
          title: "Images Uploaded!",
          description: `${imageResults.length} images uploaded and encrypted`,
        });
      }

      // Step 2: Upload documents to Lighthouse
      if (uploadedDocuments.length > 0) {
        toast({
          title: "Uploading Documents...",
          description: "Encrypting and uploading property documents to IPFS",
        });

        const documentResults = await uploadMultipleEncryptedFiles(
          uploadedDocuments,
          (fileIndex, progress) => {
            const fileKey = `documents-${fileIndex}`;
            setUploadProgress(prev => ({ ...prev, [fileKey]: progress }));
          }
        );
        
        toast({
          title: "Documents Uploaded!",
          description: `${documentResults.length} documents uploaded and encrypted`,
        });
      }

      // Step 3: List asset on smart contract
      toast({
        title: "Listing Asset...",
        description: "Creating RWA token on the blockchain",
      });

      const txHash = await listAsset(assetId, pricePerToken, totalSupply);
      
      // Clear progress
      setUploadProgress({});
      
      toast({
        title: "Asset Listed Successfully!",
        description: `Your RWA token (ID: ${assetId}) has been created and is now available on the marketplace. Transaction: ${txHash.slice(0, 10)}...`,
      });

      // Reset form
      (e.target as HTMLFormElement).reset();
      setUploadedImages([]);
      setUploadedDocuments([]);
      setUploadedImageResults([]);
      setUploadedDocumentResults([]);

    } catch (error) {
      console.error("Error listing asset:", error);
      toast({
        title: "Listing Failed",
        description: error instanceof Error ? error.message : "Failed to list asset. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/marketplace" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Marketplace
              </Link>
            </Button>
            
            <h1 className="text-3xl font-bold mb-2">List Your Asset</h1>
            <p className="text-muted-foreground">
              Transform your real-world asset into tradeable tokens and unlock new investment opportunities.
            </p>
          </div>
          
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">Asset Details</CardTitle>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Asset Title *</Label>
                    <Input 
                      id="title" 
                      name="title"
                      placeholder="e.g., Luxury Downtown Apartment"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea 
                      id="description"
                      name="description"
                      placeholder="Describe your asset in detail..."
                      className="min-h-[100px]"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select name="category" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="real-estate">Real Estate</SelectItem>
                          <SelectItem value="art">Art & Collectibles</SelectItem>
                          <SelectItem value="commodities">Commodities</SelectItem>
                          <SelectItem value="vehicles">Vehicles</SelectItem>
                          <SelectItem value="equipment">Equipment</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input 
                        id="location" 
                        name="location"
                        placeholder="City, Country"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                {/* Tokenization Details */}
                <div className="space-y-4 pt-6 border-t border-border/50">
                  <h3 className="text-lg font-semibold">Tokenization Details</h3>
                  <div className="space-y-2">
                      <Label htmlFor="token-name">Token Name *</Label>
                      <Input 
                        id="token-name" 
                        name="token-name"
                        placeholder="Bitcoin"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="token-symbol">Token Symbol *</Label>
                      <Input 
                        id="token-symbol" 
                        name="token-symbol"
                        placeholder="BTC"
                        required
                      />
                    </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="total-value">Total Asset Value ($) *</Label>
                      <Input 
                        id="total-value" 
                        name="total-value"
                        type="number" 
                        placeholder="1000000"
                        min="1"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="token-supply">Total Token Supply *</Label>
                      <Input 
                        id="token-supply" 
                        name="token-supply"
                        type="number" 
                        placeholder="10000"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="min-investment">Minimum Investment ($) *</Label>
                    <Input 
                      id="min-investment" 
                      name="min-investment"
                      type="number" 
                      placeholder="100"
                      min="1"
                      required
                    />
                  </div>
                </div>
                
                {/* Upload Section - Images */}
                <div className="space-y-4 pt-6 border-t border-border/50">
                  <h3 className="text-lg font-semibold">Asset Images</h3>
                  <p className="text-sm text-muted-foreground">
                    Select images to upload. Files will be encrypted and uploaded to IPFS when you submit the form.
                  </p>
                  
                  <input
                    type="file"
                    ref={imageInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  
                  <div 
                    className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => imageInputRef.current?.click()}
                    onDrop={handleImageDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={(e) => e.preventDefault()}
                  >
                    <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drop your images here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG up to 10MB each
                    </p>
                  </div>
                  
                  {/* Display selected images */}
                  {uploadedImages.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Selected Images ({uploadedImages.length}):</h4>
                      <div className="space-y-2">
                        {uploadedImages.map((file, index) => {
                          const progressKey = `images-${index}`;
                          const progress = uploadProgress[progressKey];
                          const uploadResult = uploadedImageResults[index];
                          
                          return (
                            <div key={index} className="flex items-center justify-between bg-secondary/50 p-2 rounded">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className="text-sm truncate">{file.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                                {progress !== undefined && progress < 100 && (
                                  <div className="flex items-center gap-1">
                                    <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-primary transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                      />
                                    </div>
                                    <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
                                  </div>
                                )}
                                {uploadResult && (
                                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                )}
                                {progress === 100 && !uploadResult && (
                                  <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeImage(index)}
                                disabled={isLoading}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Upload Section - Documents */}
                <div className="space-y-4 pt-6 border-t border-border/50">
                  <h3 className="text-lg font-semibold">Property Documents</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload legal documents, property deeds, valuation reports, and other supporting files. 
                    Files will be encrypted and uploaded to IPFS when you submit the form.
                  </p>
                  
                  <input
                    type="file"
                    ref={documentInputRef}
                    onChange={handleDocumentUpload}
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    multiple
                    className="hidden"
                  />
                  
                  <div 
                    className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => documentInputRef.current?.click()}
                    onDrop={handleDocumentDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={(e) => e.preventDefault()}
                  >
                    <FileText className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drop your documents here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, DOC, DOCX up to 25MB each
                    </p>
                  </div>
                  
                  {/* Display selected documents */}
                  {uploadedDocuments.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Selected Documents ({uploadedDocuments.length}):</h4>
                      <div className="space-y-2">
                        {uploadedDocuments.map((file, index) => {
                          const progressKey = `documents-${index}`;
                          const progress = uploadProgress[progressKey];
                          const uploadResult = uploadedDocumentResults[index];
                          
                          return (
                            <div key={index} className="flex items-center justify-between bg-secondary/50 p-2 rounded">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className="text-sm truncate">{file.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                                {progress !== undefined && progress < 100 && (
                                  <div className="flex items-center gap-1">
                                    <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-primary transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                      />
                                    </div>
                                    <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
                                  </div>
                                )}
                                {uploadResult && (
                                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                )}
                                {progress === 100 && !uploadResult && (
                                  <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeDocument(index)}
                                disabled={isLoading}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Submit Button */}
                <div className="pt-6">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-primary hover:opacity-90 transition-opacity shadow-premium"
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "List Asset for Tokenization"}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    By listing your asset, you agree to our terms and conditions. 
                    Files will be encrypted and uploaded to IPFS, then your RWA token will be created on the blockchain.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateAsset;