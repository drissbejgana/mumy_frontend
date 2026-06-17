import React, { useState, useRef } from "react";
import { Upload, HelpCircle, Code, ShieldAlert, BadgeInfo } from "lucide-react";

interface ScanFormProps {
  onSubmit: (data: {
    imageUrl: string;
    title: string;
    description: string;
    tags: string[];
    marketplace: string;
  }) => void;
  loading: boolean;
}

export default function ScanForm({ onSubmit, loading }: ScanFormProps) {
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [marketplace, setMarketplace] = useState("Etsy");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImagePreview(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const loadDemoListing = () => {
    setTitle("Cute Electric Mouse Yellow Funny Tee Shirt");
    setDescription("Retro design cute pocket lightning monster cartoon graphic yellow gamer shirt perfect for gaming fans.");
    setTagsInput("cute, electric mouse, yellow, anime, pocket monster, kawaii, nostalgic gaming");
    setMarketplace("Etsy");
    setImagePreview("https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400");
  };

  const triggerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) return;
    
    // Parse tags split by comma
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onSubmit({
      imageUrl: imagePreview,
      title,
      description,
      tags,
      marketplace
    });
  };

  return (
    <form onSubmit={triggerSubmit} className="space-y-6 max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-space font-extrabold text-gray-900">
            Build Pre-Publication Proof
          </h2>
          <p className="text-sm text-gray-500 font-sans mt-0.5">
            MUMY will scan your product across 5 parallel AI agents in 8 seconds.
          </p>
        </div>
        <button
          type="button"
          onClick={loadDemoListing}
          className="bg-brand-blue/10 border border-brand-blue/30 text-[#2323ff] px-4 py-2 rounded-xl text-xs font-space font-extrabold hover:bg-brand-blue/20 transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <Code className="w-3.5 h-3.5" />
          Load Demo Pikachu Shirt
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: IMAGE UPLOADER */}
        <div className="space-y-2">
          <label className="text-xs font-space font-extrabold text-gray-700 uppercase tracking-wide">
            1. Image Upload <span className="text-red-500">*</span>
          </label>
          
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`aspect-square w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300 relative overflow-hidden ${
              dragActive 
                ? "border-[#2323ff] bg-brand-blue/5" 
                : "border-gray-200 hover:border-gray-300 bg-gray-50/50 hover:bg-gray-50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {imagePreview ? (
              <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-2">
                <img
                  src={imagePreview}
                  alt="Scan preview"
                  className="w-full h-full object-contain rounded-xl"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImagePreview(null);
                  }}
                  className="absolute top-3 right-3 bg-gray-900/80 hover:bg-gray-900 text-white p-1.5 rounded-full text-xs transition-colors"
                >
                  ✕ Remove
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-white shadow-sm border border-gray-100 rounded-full inline-flex text-gray-400 mx-auto">
                  <Upload className="w-6 h-6 text-[#2323ff]" />
                </div>
                <div>
                  <p className="font-space font-bold text-gray-800 text-sm">
                    Drag and drop your image here, or <span className="text-[#2323ff]">browse</span>
                  </p>
                  <p className="text-xs text-gray-400 font-sans mt-1">
                    PNG, JPG, WEBP, or GIF up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: METADATA DETAILS */}
        <div className="space-y-4">
          
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-space font-extrabold text-gray-700 uppercase tracking-wide flex justify-between">
              <span>2. Product Title <span className="text-gray-400 font-medium">(Optional but recommended)</span></span>
              <span className="text-gray-400 font-mono font-medium">{title.length}/140</span>
            </label>
            <input
              type="text"
              maxLength={140}
              placeholder="e.g. Vintage Yellow Electric Monster Pocket Tee"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-sans focus:outline-none focus:border-[#2323ff]"
            />
          </div>

          {/* Marketplace selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-space font-extrabold text-gray-700 uppercase tracking-wide">
              3. Destination Marketplace <span className="text-red-500">*</span>
            </label>
            <select
              value={marketplace}
              onChange={(e) => setMarketplace(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-space font-bold focus:outline-none focus:border-[#2323ff]"
            >
              <option value="All Marketplaces">All Marketplaces (Scan Everywhere)</option>
              <option value="Etsy">Etsy Shop</option>
              <option value="Redbubble">Redbubble Catalog</option>
              <option value="Amazon Merch">Amazon Merch on Demand</option>
              <option value="Teepublic">Teepublic Store</option>
              <option value="Society6">Society6 Portfolio</option>
              <option value="Zazzle">Zazzle Marketplace</option>
              <option value="Spring">Spring (TeeSpring) Store</option>
              <option value="Spreadshirt">Spreadshirt Marketplace</option>
              <option value="CafePress">CafePress Store</option>
              <option value="Printify">Printify Shop</option>
              <option value="Printful">Printful Store</option>
              <option value="eBay">eBay Store</option>
              <option value="Shopify">Shopify Store</option>
              <option value="WooCommerce">WooCommerce Store</option>
              <option value="Other">Other Marketplace</option>
            </select>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-space font-extrabold text-gray-700 uppercase tracking-wide flex justify-between">
              <span>4. Backend Search Tags <span className="text-gray-400 font-mono font-medium">(Comma separated)</span></span>
            </label>
            <input
              type="text"
              placeholder="e.g. electric, yellow, pocket monster, anime, kawaii"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-sans focus:outline-none focus:border-[#2323ff]"
            />
          </div>
        </div>

      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-xs font-space font-extrabold text-gray-700 uppercase tracking-wide flex justify-between">
          <span>5. Listing Description <span className="text-gray-400 font-medium">(Optional for text infringement decoder)</span></span>
          <span className="text-gray-400 font-mono font-medium">{description.length}/500</span>
        </label>
        <textarea
          rows={3}
          maxLength={500}
          placeholder="Detailed listing description that shoppers will see on the platform..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-sans focus:outline-none focus:border-[#2323ff]"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !imagePreview}
        className={`w-full py-4 px-6 rounded-2xl font-space font-extrabold text-base flex items-center justify-center gap-2 shadow-md transition-all ${
          !imagePreview
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-[#2323ff] hover:bg-blue-700 text-white hover:shadow-lg cursor-pointer"
        }`}
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Analyzing with 5 Parallel Agents...
          </>
        ) : (
          <>
            Run 5-Agent IP Security Scan →
          </>
        )}
      </button>

      {/* Safe Disclaimer */}
      <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 p-4 rounded-xl text-xs text-gray-500 font-sans leading-relaxed">
        <BadgeInfo className="w-5 h-5 text-gray-400 shrink-0" />
        <span>MUMY runs deep visual forensics, Web Entity matches, and NLP spelling classifiers. This report helps identify risks but does not constitute official legal advice. Always review copyright guidelines.</span>
      </div>
    </form>
  );
}
