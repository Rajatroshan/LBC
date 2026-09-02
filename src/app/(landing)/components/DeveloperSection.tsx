'use client';

import React from 'react';
import { 
  Code2, 
  ExternalLink, 
  Sparkles, 
  Terminal, 
  Rocket, 
  Globe2,
  Cpu
} from 'lucide-react';

export default function DeveloperSection() {
  return (
    <section id="developer" className="py-24 bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-primary-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary-500/20 text-primary-300 text-xs font-bold mb-3 border border-primary-500/30">
            <Code2 className="w-3.5 h-3.5" />
            <span>Meet the Mind Behind the Code</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            Crafted with Vision & Passion
          </h2>
          <p className="text-base sm:text-lg text-gray-300">
            Bridging grassroots community traditions with cutting-edge, scalable software engineering.
          </p>
        </div>

        {/* Developer Feature Card */}
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-gray-800/90 via-gray-900/95 to-gray-950 rounded-3xl p-8 sm:p-12 border border-gray-700/80 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl"></div>

          <div className="grid md:grid-cols-12 gap-10 items-center">
            {/* Left: Portrait Frame & Status (5 Cols) */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="relative group">
                {/* Outer Glow Ring */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-400 via-primary-500 to-emerald-400 rounded-3xl blur-md opacity-70 group-hover:opacity-100 transition duration-500"></div>
                
                {/* Photo Container */}
                <div className="relative w-64 sm:w-72 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white/20 bg-gray-800 shadow-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/rajat-sahu.jpg"
                    alt="Rajat Kumar Sahu - Software Developer"
                    className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent"></div>
                  
                  {/* Bottom Portrait Tag */}
                  <div className="absolute bottom-3 left-3 right-3 text-center">
                    <p className="text-xs font-bold text-white tracking-wide">Rajat Kumar Sahu</p>
                    <p className="text-[10px] text-amber-300 font-semibold">Software Engineer @ Tech Mahindra</p>
                  </div>
                </div>

                {/* Floating Status Pill */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gray-900/95 border border-gray-700 text-emerald-400 px-3.5 py-1 rounded-full text-[11px] font-bold shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Active & Building</span>
                </div>
              </div>
            </div>

            {/* Right: Bio, Stack & Links (7 Cols) */}
            <div className="md:col-span-7 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    Lead Architect & Engineer
                  </span>
                  <span className="px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                    Software Engineer @ Tech Mahindra
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                  Rajat Kumar Sahu
                </h3>
                <p className="text-sm font-semibold text-emerald-400 mt-1 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4" />
                  Software Engineer @ Tech Mahindra • Full-Stack Web Architect
                </p>
              </div>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Driven by a deep commitment to modernizing community finance, Rajat architected the <strong className="text-white font-bold">LBC Platform</strong> to replace cumbersome paper registers with an automated, 100% transparent digital ecosystem.
              </p>

              {/* Developer Skill Badges */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-primary-400" />
                  Core Engineering Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Next.js 14 (App Router)', 'TypeScript', 'Tailwind CSS', 'Google Firebase & Firestore', 'Cloud Architecture', 'PDF Generation Engines'].map((tech, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-gray-800/90 text-gray-300 text-xs font-medium border border-gray-700 hover:border-primary-400 hover:text-white transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Personal Philosophy Box */}
              <div className="p-4 rounded-2xl bg-gray-800/50 border border-gray-700/60 text-xs text-gray-300 space-y-1">
                <p className="font-semibold text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Craftsmanship & Philosophy
                </p>
                <p className="italic text-gray-400">
                  &ldquo;Building software isn&apos;t just about writing code — it&apos;s about creating transparent digital trust for communities and empowering people through intuitive design.&rdquo;
                </p>
              </div>

              {/* Action Buttons: Direct Linktree Integration */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="https://linktr.ee/Rajatroshan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-gray-950 font-bold rounded-xl text-sm shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <Globe2 className="w-4 h-4" />
                  <span>Connect with Rajat (Linktree)</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <a
                  href="https://linktr.ee/Rajatroshan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white font-semibold rounded-xl text-sm border border-gray-700 transition-all flex items-center gap-2"
                >
                  <Rocket className="w-4 h-4 text-emerald-400" />
                  <span>Portfolio & Projects</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
