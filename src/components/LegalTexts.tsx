import React from "react";
import { ShieldCheck, Scale, Mail, ShieldAlert } from "lucide-react";

// 1. PRIVACY POLICY
export function PrivacyPolicyView() {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white border border-gray-150 rounded-2xl shadow-xs space-y-6 font-sans text-gray-700 leading-relaxed">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
        <ShieldCheck className="w-8 h-8 text-[#2323ff]" />
        <div>
          <h1 className="text-2xl md:text-3xl font-space font-extrabold text-gray-900">MUMY Privacy Policy</h1>
          <p className="text-xs text-gray-400 font-mono mt-0.5">LAST UPDATED: JUNE 9, 2026</p>
        </div>
      </div>

      <p className="text-sm">
        Welcome to MUMY ("we", "our", or "us"). We are committed to protecting your privacy and security. This Privacy Policy outlines how your personal data is collected, processed, and safeguarded when using our e-commerce pre-publication compliance platform.
      </p>

      <section className="space-y-2.5">
        <h3 className="text-lg font-space font-bold text-gray-900">1. Data Collected</h3>
        <p className="text-sm">
          We collect minimal personal metadata to provision subscriber features securely:
        </p>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li><strong>Account Information:</strong> Emails, display names, profile credentials, and user IDs.</li>
          <li><strong>Uploaded Content:</strong> Product images, listing titles, description tags, and visual assets submitted for compliance reviews.</li>
          <li><strong>Billing Information:</strong> Payment handling is completed securely via our secure enterprise payment gateway. We do not store or capture raw credit card numbers or banking passwords.</li>
          <li><strong>Scan Historical Data:</strong> Processed risk logs, agent verdict scores, and optimization fix advices.</li>
        </ul>
      </section>

      <section className="space-y-2.5">
        <h3 className="text-lg font-space font-bold text-gray-900">2. Technical Processing & Retention</h3>
        <p className="text-sm">
          Uploaded product images are processed in memory to execute parallel visual fusions (including neural visual analysis, global catalog matching, and advanced blur forensics). <span className="font-bold text-gray-950">To maximize user privacy, raw visual upload files are cached securely and automatically deleted from our servers within 24 hours of scan completion.</span> Scan numerical logs, audit scores, and textual optimization advice are maintained for 90 days to provision historical dashboard trackers, and can be deleted by users manually at any stage.
        </p>
      </section>

      <section className="space-y-2.5">
        <h3 className="text-lg font-space font-bold text-gray-900">3. Underpinning Infrastructure</h3>
        <p className="text-sm">
          Our platform operates in a secure cloud container sandbox using secure token-based authorization, enterprise database structures, and advanced large language models for text decomposition. All connections utilize encrypted SSL channels.
        </p>
      </section>

      <section className="space-y-2.5">
        <h3 className="text-lg font-space font-bold text-gray-900">4. User Rights (GDPR & CCPA Compliant)</h3>
        <p className="text-sm font-sans text-gray-600">
          Under GDPR and CCPA regulations, you maintain the absolute right to retrieve, purge, or limit processing of your personal data. You can delete individual scans inside your History portal or request complete account erasure by writing to <span className="text-[#2323ff] font-bold font-mono">privacy@mumy.io</span>.
        </p>
      </section>
    </div>
  );
}

// 2. TERMS OF SERVICE
export function TermsOfServiceView() {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white border border-gray-150 rounded-2xl shadow-xs space-y-6 font-sans text-gray-700 leading-relaxed">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
        <Scale className="w-8 h-8 text-[#2323ff]" />
        <div>
          <h1 className="text-2xl md:text-3xl font-space font-extrabold text-gray-900">MUMY Terms of Service</h1>
          <p className="text-xs text-gray-400 font-mono mt-0.5">EFFECTIVE: JUNE 9, 2026</p>
        </div>
      </div>

      <p className="text-sm">
        By registering, accessing, or subscribing to MUMY (comprising server scanners, dashboard tracking logs, and analytical reports), you assent completely to these Terms of Service.
      </p>

      <section className="space-y-2.5">
        <h3 className="text-lg font-space font-bold text-gray-900">1. Nature of the Services</h3>
        <p className="text-sm">
          MUMY provides a pre-publication scanning utility designed to flag copyright risk overlaps, trademark keywords, phonetic synonym evasion patterns, and blurred pixels before listings are published to third-party marketplaces.
        </p>
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-start gap-2.5">
          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
          <p className="font-sans leading-relaxed">
            <strong>CRITICAL LIMITATION OF WARRANTY:</strong> MUMY is an automated forecasting tool designed to significantly minimize intellectual property risk. We do not provide canonical legal statements, and we do not guarantee that third-party marketplaces (e.g., Etsy, Amazon) won't flag listings. Under no circumstance shall MUMY be liable for store suspensions, DMCA notices, or lost revenues.
          </p>
        </div>
      </section>

      <section className="space-y-2.5">
        <h3 className="text-lg font-space font-bold text-gray-900">2. Fair Use & Subscription Billings</h3>
        <p className="text-sm">
          Subscribers are billed on automated monthly schedules through our secure subscription provider. You are granted specific scan quotas based on your selected plan:
        </p>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li><strong>Free Plan:</strong> 3 scans/month limit. For evaluation purposes only.</li>
          <li><strong>Pro Plan:</strong> 100 scans/month. Single member license.</li>
          <li><strong>Agency Plan:</strong> 2,500 scans/month. Multi-seat store workflow management.</li>
        </ul>
        <p className="text-sm mt-1">
          Refund requests can be submitted within 7 days of initial subscription, provided you have used less than 10 scan credits during that cycle.
        </p>
      </section>

      <section className="space-y-2.5">
        <h3 className="text-lg font-space font-bold text-gray-900">3. Termination Policy</h3>
        <p className="text-sm">
          We reserve the right to suspend or block users attempting denial-of-wallet scripts, reverse engineering visual frameworks, or utilizing robot scripts to overload scan engines.
        </p>
      </section>

      <section className="space-y-2.5">
        <h3 className="text-lg font-space font-bold text-gray-900">4. Legal Inquiries</h3>
        <p className="text-sm font-sans text-gray-600">
          For payment inquiries, corporate enterprise agreements, or physical support, contact our legal desk at <span className="text-[#2323ff] font-bold font-mono">legal@mumy.io</span>.
        </p>
      </section>
    </div>
  );
}
