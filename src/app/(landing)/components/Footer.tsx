'use client';

import React from 'react';
import { Heart, ExternalLink, Code2 } from 'lucide-react';
import { MarigoldToran } from './VillageIllustrations';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-[#1C1917] text-white pt-12 pb-10 relative overflow-hidden border-t-4 border-amber-400/40">
      
      {/* 🌺 Top Auspicious Marigold Toran */}
      <MarigoldToran className="opacity-75 mb-8" />

      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Section */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 bg-gradient-to-br from-orange-500 via-amber-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-md border-2 border-amber-300">
                <span className="text-xl">🪔</span>
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white">Luhuren Bae Club</span>
                <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Digital Gram Mandap &amp; Chanda System</p>
              </div>
            </div>
            
            <p className="text-stone-300 text-xs sm:text-sm max-w-md leading-relaxed font-medium">
              Managing village festival contributions in a 100% transparent and digital way. Preserving cultural heritage while fostering community trust through technology.
            </p>

            {/* Developer Spotlight Pill */}
            <div className="pt-2">
              <a
                href="https://linktr.ee/Rajatroshan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-stone-900 border-2 border-amber-400/40 hover:border-amber-400 text-xs text-stone-200 hover:text-white transition-all group shadow-md"
              >
                <Code2 className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                <span>Architected by <strong className="text-amber-300 font-black">Rajat Kumar Sahu</strong> (Software Engineer @ Tech Mahindra)</span>
                <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-300" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
              <li>
                <a href="#home" className="text-stone-300 hover:text-amber-400 transition-colors">🌾 Gaon Home</a>
              </li>
              <li>
                <a href="#features" className="text-stone-300 hover:text-amber-400 transition-colors">✨ Village Features</a>
              </li>
              <li>
                <a href="#glimpses" className="text-stone-300 hover:text-amber-400 transition-colors">🪔 Utsav Gallery</a>
              </li>
              <li>
                <a href="#about" className="text-stone-300 hover:text-amber-400 transition-colors">📖 About Community</a>
              </li>
              <li>
                <a href="#developer" className="text-amber-300 hover:text-amber-200 transition-colors font-bold">💻 Meet Developer</a>
              </li>
            </ul>
          </div>

          {/* Community Info */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 mb-4">Gram Mandap</h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-300 font-medium">
              <li className="flex items-center gap-1.5">
                <span>📍</span> Luhuren Bae Club Community Mandap
              </li>
              <li className="flex items-center gap-1.5">
                <span>🌾</span> Village: Luhuren, Odisha, India
              </li>
              <li className="text-[11px] text-amber-300/80 pt-2 font-semibold flex items-center gap-1">
                <span>🛡️</span> 100% Tamper-Evident Safety Audit Trails
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-400 font-medium">
          <p>© {currentYear} Luhuren Bae Club (LBC). All rights reserved.</p>
          
          <div className="flex items-center gap-2">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>by</span>
            <a
              href="https://linktr.ee/Rajatroshan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-300 hover:text-amber-200 font-black hover:underline"
            >
              Rajat Kumar Sahu (Tech Mahindra)
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
