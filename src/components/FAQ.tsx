import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    q: "What IP violations does MUMY IP Guard detect?",
    a: "MUMY evaluates listings across 5 visual & text layers, cross-matching trademark indicators, protected copyright images, character visual traits (e.g., Disney/Pokemon characters), DMCA terms, and known bypass synonyms. We match over 30+ top commercial brands and 25+ iconic characters."
  },
  {
    q: "How does MUMY detect blurred or hidden logos?",
    a: "Our third agent, the 'Blur Detective', analyzes pixel distribution and frequency spectrum variants to isolate suspicious regions where standard graphics have been post-processed or modified to conceal brand identifiers from automated web crawlers."
  },
  {
    q: "Will MUMY work for Etsy, Redbubble, AND Amazon Merch?",
    a: "Yes! MUMY is specifically optimized for automated pre-publication audits. We adapt our detection threshold based on each marketplace's dynamic suspension patterns and risk profiles."
  },
  {
    q: "Can I be suspended even if the image looks original?",
    a: "Absolutely. Many sellers are banned because of text synonyms, hidden tags, or visual similarities in background shapes (such as franchise patterns or color themes). E-commerce automated crawlers don't just inspect the direct pixels—they cross-reference tags, descriptions, and metadata relationships too."
  },
  {
    q: "How accurate is the detection?",
    a: "MUMY IP Guard maintains a 98.7% verified accuracy rate. By fusing results from advanced visual classifiers, deep web index correlation, pixel forensics, and fuzzy phonetic NLP algorithms, we eliminate false negatives and catch evasions prior to publishing."
  },
  {
    q: "What happens after a scan?",
    a: "You get a real-time risk score, visual confidence rating, subscores across all 5 agents, and a detailed clear Fix list (e.g., specific tags to remove, pixels to change). It maps out exactly how to clean up your listing to make it 100% compliant."
  },
  {
    q: "Is my uploaded image stored?",
    a: "No. Uploaded product images are temporarily cached on the server to execute parallel agent inspections and are immediately deleted within 24 hours of process completion."
  },
  {
    q: "Can MUMY detect Pokemon and Disney violations?",
    a: "Yes. Our engines are pre-trained with official vector shapes, character contours, phonetic sound codes (like 'Mickeyy' or 'Pikachuu'), and evasion terms (like 'electric mouse' or 'magic castle') to identify unauthorized Pokemon and Disney assets in under 8 seconds."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 border-t border-white/10 bg-brand-dark relative z-10 w-full shrink-0">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-blue/10 border border-brand-blue/30 px-3 py-1 rounded-full text-brand-green text-xs font-mono mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            COMMON QUESTIONS
          </div>
          <h2 className="text-3xl md:text-4xl font-space font-bold text-white mb-4">
            Factual Answers For Serious Sellers
          </h2>
          <p className="text-gray-400">
            Learn how MUMY protects store owners before crawlers flags accounts.
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#111111] border border-white/5 rounded-xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <span className="font-space font-medium text-white text-base md:text-lg">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-brand-green shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-96 border-t border-white/5" : "max-h-0"
                  }`}
                >
                  <p className="p-6 text-gray-400 leading-relaxed text-sm md:text-base">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
