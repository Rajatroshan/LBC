'use client';

import React, { useState } from 'react';
import { 
  Code2, 
  ExternalLink, 
  Terminal, 
  Globe2, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  Heart, 
  Share2, 
  Building2
} from 'lucide-react';

export default function DeveloperSection() {
  const [activeTab, setActiveTab] = useState<'architecture' | 'stack' | 'impact'>('architecture');
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('https://linktr.ee/Rajatroshan');
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section id="developer" className="py-16 sm:py-24 bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 -left-20 w-72 sm:w-96 h-72 sm:h-96 bg-primary-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 -right-20 w-72 sm:w-96 h-72 sm:h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary-500/20 text-primary-300 text-xs font-bold mb-2.5 border border-primary-500/30">
            <Code2 className="w-3.5 h-3.5" />
            <span>Architect & Engineer</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-2">
            Meet the Developer
          </h2>
          <p className="text-xs sm:text-sm text-gray-300">
            Crafting community-first digital solutions with modern cloud architecture.
          </p>
        </div>

        {/* Developer Feature Card */}
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-gray-800/95 via-gray-900/95 to-gray-950 rounded-3xl p-5 sm:p-8 lg:p-10 border border-gray-700/80 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Subtle Corner Glow */}
          <div className="absolute -top-20 -right-20 w-52 h-52 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="grid lg:grid-cols-12 gap-6 sm:gap-10 items-center">
            {/* Left Column: Portrait & Quick Connect (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative group w-full max-w-[240px] sm:max-w-[280px]">
                {/* Outer Glow Ring */}
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-primary-500 to-emerald-400 rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition duration-500"></div>
                
                {/* Photo Container with Focused Face Crop */}
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/20 bg-gray-800 shadow-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/rajat-sahu.jpg"
                    alt="Rajat Kumar Sahu - Software Engineer @ Tech Mahindra"
                    className="w-full h-full object-cover object-[center_18%] transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent"></div>
                  
                  {/* Bottom Portrait Badge */}
                  <div className="absolute bottom-2.5 left-2 right-2 text-center">
                    <p className="text-xs font-bold text-white tracking-wide truncate">Rajat Kumar Sahu</p>
                    <p className="text-[10px] text-amber-300 font-semibold truncate flex items-center justify-center gap-1">
                      <Building2 className="w-2.5 h-2.5 text-amber-300" />
                      Software Engineer @ Tech Mahindra
                    </p>
                  </div>
                </div>

                {/* Floating Live Status */}
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-gray-900/95 border border-gray-700 text-emerald-400 px-3 py-0.5 rounded-full text-[10px] font-bold shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Active & Building</span>
                </div>
              </div>

              {/* Action Buttons: Linktree & Share */}
              <div className="mt-5 flex items-center gap-2 w-full max-w-[240px] sm:max-w-[280px]">
                <a
                  href="https://linktr.ee/Rajatroshan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-950 font-black rounded-xl text-xs text-center shadow-md flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                >
                  <Globe2 className="w-3.5 h-3.5" />
                  <span>Linktree Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={handleShare}
                  aria-label="Copy Profile Link"
                  className="p-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl border border-gray-700 transition-colors active:scale-95 shrink-0"
                  title="Copy Linktree URL"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
              {copied && (
                <p className="text-[10px] text-emerald-400 mt-1.5 font-semibold animate-fade-in text-center">
                  ✓ Link copied to clipboard!
                </p>
              )}
            </div>

            {/* Right Column: Bio, Tabs & Interactive Mockup (7 Cols) */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              {/* Role Badges & Title */}
              <div>
                <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-widest bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    Lead Architect & Engineer
                  </span>
                </div>
                <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                  Rajat Kumar Sahu
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-emerald-400 mt-0.5 flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5" />
                  Software Engineer @ Tech Mahindra • Full-Stack Web Architect
                </p>
              </div>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Driven by a mission to modernize community finance, Rajat designed the <strong className="text-white font-bold">LBC Platform</strong> to replace paper registers with an automated, 100% transparent digital ecosystem.
              </p>

              {/* Responsive Segmented Control Tabs */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-gray-950/80 rounded-xl border border-gray-800 text-xs">
                <button
                  onClick={() => setActiveTab('architecture')}
                  className={`py-1.5 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1 text-[11px] ${
                    activeTab === 'architecture'
                      ? 'bg-gradient-to-r from-primary-600 to-emerald-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3 h-3 shrink-0" />
                  <span>Architecture</span>
                </button>

                <button
                  onClick={() => setActiveTab('stack')}
                  className={`py-1.5 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1 text-[11px] ${
                    activeTab === 'stack'
                      ? 'bg-gradient-to-r from-primary-600 to-emerald-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Cpu className="w-3 h-3 shrink-0" />
                  <span>Tech Stack</span>
                </button>

                <button
                  onClick={() => setActiveTab('impact')}
                  className={`py-1.5 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1 text-[11px] ${
                    activeTab === 'impact'
                      ? 'bg-gradient-to-r from-primary-600 to-emerald-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Heart className="w-3 h-3 shrink-0" />
                  <span>Impact</span>
                </button>
              </div>

              {/* Tab 1: Architecture Highlights */}
              {activeTab === 'architecture' && (
                <div className="space-y-2 p-3.5 rounded-xl bg-gray-950/50 border border-gray-800/80 text-[11px] sm:text-xs animate-fade-in">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white font-semibold">Atomic Master Ledger:</strong> Real-time balance calculations with automated Firestore merges.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white font-semibold">Dual Verification Queue:</strong> Provisional receipts verified by admin before crediting treasury.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white font-semibold">Instant PDF Engines:</strong> Client-side signed receipts, invoices & payout vouchers.
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Tech Stack Badges */}
              {activeTab === 'stack' && (
                <div className="space-y-2 p-3.5 rounded-xl bg-gray-950/50 border border-gray-800/80 text-[11px] sm:text-xs animate-fade-in">
                  <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider">Production Tech Stack:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Next.js 14',
                      'React 18',
                      'TypeScript',
                      'Tailwind CSS',
                      'Google Firestore',
                      'Firebase Auth',
                      'jsPDF autoTable',
                      'Mobile-First UI'
                    ].map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-gray-800 text-gray-200 text-[10px] font-semibold border border-gray-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Village Impact Story */}
              {activeTab === 'impact' && (
                <div className="p-3.5 rounded-xl bg-gray-950/50 border border-gray-800/80 text-[11px] sm:text-xs text-gray-300 space-y-1.5 animate-fade-in">
                  <p className="leading-relaxed">
                    Designed for <strong className="text-amber-300">Luhuren Bae Club</strong> to replace handwritten notebooks with 100% digital audit trails for 650+ village households.
                  </p>
                  <p className="text-gray-400 italic text-[10px]">
                    &ldquo;Digital transparency eliminates accounting disputes and fosters village trust.&rdquo;
                  </p>
                </div>
              )}

              {/* Interactive Live Terminal Console */}
              <div className="p-3 bg-black/90 rounded-xl border border-gray-800 font-mono text-[10px] sm:text-[11px] space-y-0.5 text-gray-300">
                <div className="flex items-center gap-1 text-gray-500 mb-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-[9px] ml-1 text-gray-400">rajat@techm:~$</span>
                </div>
                <p className="text-emerald-400">$ npx lbc-core status</p>
                <p className="text-gray-400">&gt; Rajat Kumar Sahu (Software Engineer @ Tech Mahindra)</p>
                <p className="text-amber-300">&gt; Status: 100% Active (Luhuren Bae Club)</p>
              </div>

              {/* Mobile Full-Width Connect Button */}
              <div className="pt-1">
                <a
                  href="https://linktr.ee/Rajatroshan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-gray-950 font-black rounded-xl text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <Globe2 className="w-4 h-4" />
                  <span>Connect with Rajat (Linktree)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
