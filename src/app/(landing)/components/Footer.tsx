'use client';

import React from 'react';
import { Heart, ExternalLink, Code2 } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-gray-950 text-white pt-16 pb-10 border-t border-gray-800">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-black text-xl">L</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">Luhuren Bae Club</span>
            </div>
            <p className="text-gray-400 text-sm max-w-md leading-relaxed">
              Managing village festival contributions in a 100% transparent and digital way. Building community harmony and trust through technology.
            </p>

            {/* Developer Spotlight Pill */}
            <div className="pt-2">
              <a
                href="https://linktr.ee/Rajatroshan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 hover:border-amber-400/60 text-xs text-gray-300 hover:text-white transition-all group shadow-sm"
              >
                <Code2 className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                <span>Architected by <strong className="text-amber-300 font-bold">Rajat Kumar Sahu</strong> (Software Engineer @ Tech Mahindra)</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-amber-300" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-200 mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#home" className="text-gray-400 hover:text-primary-400 transition-colors">Home</a>
              </li>
              <li>
                <a href="#features" className="text-gray-400 hover:text-primary-400 transition-colors">Platform Features</a>
              </li>
              <li>
                <a href="#glimpses" className="text-gray-400 hover:text-primary-400 transition-colors">Module Glimpses</a>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-primary-400 transition-colors">About Community</a>
              </li>
              <li>
                <a href="#developer" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">Meet the Developer</a>
              </li>
            </ul>
          </div>

          {/* Community Info */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-200 mb-4">Community Center</h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>Luhuren Bae Club Community Mandap</li>
              <li>Village: Luhuren, India</li>
              <li className="text-xs text-gray-500 pt-2">Built with Next.js 14, TypeScript & Firebase</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800/80 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>© {currentYear} LBC - Luhuren Bae Club. All rights reserved.</p>
          
          <div className="flex items-center gap-2">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>by</span>
            <a
              href="https://linktr.ee/Rajatroshan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-300 hover:text-amber-200 font-bold hover:underline"
            >
              Rajat Kumar Sahu
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
