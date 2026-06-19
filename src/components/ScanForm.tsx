import React, { useState, useRef } from "react";
import { Upload, Code, BadgeInfo } from "lucide-react";

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
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const processFile = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) setImagePreview(event.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
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
    const tags = tagsInput.split(",").map((t) => t.trim()).filter((t) => t.length > 0);
    onSubmit({ imageUrl: imagePreview, title, description, tags, marketplace });
  };

  const inputClass = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-sans text-white placeholder-gray-600 focus:outline-none focus:border-[#2323ff] transition-colors";
  const labelClass = "text-xs font-space font-extrabold text-gray-400 uppercase tracking-wide";

  return (
    <form onSubmit={triggerSubmit} className="space-y-6 max-w-3xl mx-auto">
      {/* Form header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-space font-extrabold text-white">
            Build Pre-Publication Proof
          </h2>
          <p className="text-sm text-gray-500 font-sans mt-0.5">
            MUMY will scan your product across 5 parallel AI agents in 8 seconds.
          </p>
        </div>
        <button
          type="button"
          onClick={loadDemoListing}
          className="bg-[#2323ff]/10 border border-[#2323ff]/30 text-[#2323ff] px-4 py-2 rounded-xl text-xs font-space font-extrabold hover:bg-[#2323ff]/20 transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <Code className="w-3.5 h-3.5" />
          Load Demo Pikachu Shirt
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LEFT: IMAGE UPLOADER */}
        <div className="space-y-2">
          <label className={labelClass}>
            1. Image Upload <span className="text-red-400">*</span>
          </label>
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`aspect-square w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300 relative overflow-hidden ${
              dragActive
                ? "border-[#2323ff] bg-[#2323ff]/10"
                : "border-white/10 hover:border-white/20 bg-white/5"
            }`}
          >
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

            {imagePreview ? (
              <div className="absolute inset-0 bg-[#111111] flex flex-col items-center justify-center p-2">
                <img src={imagePreview} alt="Scan preview" className="w-full h-full object-contain rounded-xl" referrerPolicy="no-referrer" />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setImagePreview(null); }}
                  className="absolute top-3 right-3 bg-black/70 hover:bg-black text-white px-2.5 py-1 rounded-lg text-xs transition-colors"
                >
                  ✕ Remove
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-white/5 border border-white/10 rounded-full inline-flex mx-auto">
                  <Upload className="w-6 h-6 text-[#2323ff]" />
                </div>
                <div>
                  <p className="font-space font-bold text-gray-300 text-sm">
                    Drag and drop your image, or <span className="text-[#2323ff]">browse</span>
                  </p>
                  <p className="text-xs text-gray-600 font-sans mt-1">PNG, JPG, WEBP, or GIF up to 10MB</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: METADATA */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className={`${labelClass} flex justify-between`}>
              <span>2. Product Title <span className="text-gray-600 font-medium normal-case">(Recommended)</span></span>
              <span className="text-gray-600 font-mono font-medium">{title.length}/140</span>
            </label>
            <input
              type="text"
              maxLength={140}
              placeholder="e.g. Vintage Yellow Electric Monster Pocket Tee"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>
              3. Destination Marketplace <span className="text-red-400">*</span>
            </label>
            <select
              value={marketplace}
              onChange={(e) => setMarketplace(e.target.value)}
              className={`${inputClass} font-space font-bold`}
            >
              <option value="All Marketplaces" className="bg-[#111111]">All Marketplaces (Scan Everywhere)</option>
              <option value="Etsy" className="bg-[#111111]">Etsy Shop</option>
              <option value="Redbubble" className="bg-[#111111]">Redbubble Catalog</option>
              <option value="Amazon Merch" className="bg-[#111111]">Amazon Merch on Demand</option>
              <option value="Teepublic" className="bg-[#111111]">Teepublic Store</option>
              <option value="Society6" className="bg-[#111111]">Society6 Portfolio</option>
              <option value="Zazzle" className="bg-[#111111]">Zazzle Marketplace</option>
              <option value="Spring" className="bg-[#111111]">Spring (TeeSpring) Store</option>
              <option value="Spreadshirt" className="bg-[#111111]">Spreadshirt Marketplace</option>
              <option value="CafePress" className="bg-[#111111]">CafePress Store</option>
              <option value="Printify" className="bg-[#111111]">Printify Shop</option>
              <option value="Printful" className="bg-[#111111]">Printful Store</option>
              <option value="eBay" className="bg-[#111111]">eBay Store</option>
              <option value="Shopify" className="bg-[#111111]">Shopify Store</option>
              <option value="WooCommerce" className="bg-[#111111]">WooCommerce Store</option>
              <option value="Other" className="bg-[#111111]">Other Marketplace</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>
              4. Backend Search Tags <span className="text-gray-600 font-mono font-medium normal-case">(Comma separated)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. electric, yellow, pocket monster, anime, kawaii"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className={`${labelClass} flex justify-between`}>
          <span>5. Listing Description <span className="text-gray-600 font-medium normal-case">(Optional)</span></span>
          <span className="text-gray-600 font-mono font-medium">{description.length}/500</span>
        </label>
        <textarea
          rows={3}
          maxLength={500}
          placeholder="Detailed listing description that shoppers will see on the platform..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !imagePreview}
        className={`w-full py-4 px-6 rounded-2xl font-space font-extrabold text-base flex items-center justify-center gap-2 transition-all ${
          !imagePreview
            ? "bg-white/5 text-gray-600 cursor-not-allowed border border-white/5"
            : "bg-[#2323ff] hover:bg-blue-700 text-white cursor-pointer shadow-lg"
        }`}
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Analyzing with 5 Parallel Agents...
          </>
        ) : (
          <>Run 5-Agent IP Security Scan →</>
        )}
      </button>

      {/* Disclaimer */}
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-4 rounded-xl text-xs text-gray-500 font-sans leading-relaxed">
        <BadgeInfo className="w-5 h-5 text-gray-600 shrink-0" />
        <span>MUMY runs deep visual forensics, Web Entity matches, and NLP spelling classifiers. This report helps identify risks but does not constitute official legal advice. Always review copyright guidelines.</span>
      </div>
    </form>
  );
}
