'use client';

import React from 'react';

/**
 * 🌺 Traditional Marigold & Mango Leaves Door Garland (Toran / Bandanwar)
 */
export const MarigoldToran: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`w-full overflow-hidden flex justify-center items-center select-none pointer-events-none ${className}`}>
    <svg viewBox="0 0 1200 48" className="w-full max-w-5xl h-8 sm:h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main String */}
      <path d="M0 8 Q 150 24 300 8 Q 450 24 600 8 Q 750 24 900 8 Q 1050 24 1200 8" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Repeating Mango Leaves & Marigold Flowers */}
      {[75, 225, 375, 525, 675, 825, 975, 1125].map((cx, i) => (
        <g key={`leaf-${i}`}>
          {/* Mango Leaf */}
          <path d={`M${cx - 15} 14 C${cx - 5} 38, ${cx + 5} 38, ${cx + 15} 14 Z`} fill="#16A34A" stroke="#14532D" strokeWidth="1" />
          <path d={`M${cx} 14 L${cx} 34`} stroke="#15803D" strokeWidth="1" />
        </g>
      ))}

      {[0, 150, 300, 450, 600, 750, 900, 1050, 1200].map((cx, i) => (
        <g key={`flower-${i}`} className="animate-float-gentle" style={{ animationDelay: `${(i % 3) * 0.4}s` }}>
          {/* Orange Marigold Outer */}
          <circle cx={cx} cy="10" r="9" fill="#EA580C" />
          {/* Yellow Marigold Middle */}
          <circle cx={cx} cy="10" r="6.5" fill="#F59E0B" />
          {/* Golden Center */}
          <circle cx={cx} cy="10" r="3.5" fill="#FDE047" />
        </g>
      ))}
    </svg>
  </div>
);

/**
 * 🪔 Cute Cartoon Golden Diya with Glowing Flame
 */
export const CartoonDiya: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Animated Flame */}
    <g className="animate-diya origin-bottom">
      {/* Outer glow */}
      <ellipse cx="32" cy="18" rx="8" ry="14" fill="#FDE047" opacity="0.6" />
      {/* Inner flame */}
      <path d="M32 4 C36 12 40 18 36 24 C33 28 29 28 28 24 C24 18 28 12 32 4 Z" fill="#F59E0B" />
      <path d="M32 9 C34 14 36 18 34 22 C32 24 30 24 30 22 C28 18 30 14 32 9 Z" fill="#FEF08A" />
    </g>
    {/* Wick */}
    <path d="M32 24 L32 29" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
    {/* Terracotta Clay Base */}
    <path d="M12 34 C14 48 50 48 52 34 C44 38 20 38 12 34 Z" fill="#C2410C" stroke="#7C2D12" strokeWidth="2.5" />
    {/* Rim Detail */}
    <ellipse cx="32" cy="34" rx="20" ry="4" fill="#EA580C" stroke="#7C2D12" strokeWidth="2" />
    {/* Diya Foot */}
    <path d="M26 46 L38 46 L40 50 L24 50 Z" fill="#9A3412" stroke="#7C2D12" strokeWidth="1.5" />
    {/* Decorative dots */}
    <circle cx="24" cy="40" r="1.5" fill="#FEF08A" />
    <circle cx="32" cy="42" r="1.5" fill="#FEF08A" />
    <circle cx="40" cy="40" r="1.5" fill="#FEF08A" />
  </svg>
);

/**
 * 👨🌾 Friendly Waving Village Farmer (Kisan Bhai)
 */
export const CuteFarmerAvatar: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Body / Kurta */}
    <path d="M28 85 L28 62 C28 56 36 52 50 52 C64 52 72 56 72 62 L72 85 Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
    {/* Red Gamcha / Scarf on Shoulder */}
    <path d="M32 54 C36 64 38 78 36 86 L28 86 L30 56 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
    <path d="M30 68 L36 68 M30 76 L36 76" stroke="#FEF2F2" strokeWidth="1" />

    {/* Neck */}
    <rect x="44" y="44" width="12" height="10" rx="3" fill="#FBBF24" />

    {/* Head / Face */}
    <circle cx="50" cy="34" r="16" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
    {/* Cute Ears */}
    <circle cx="33" cy="34" r="3.5" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
    <circle cx="67" cy="34" r="3.5" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />

    {/* Turban (Safa) */}
    <path d="M30 30 C30 18 42 12 50 12 C60 12 70 18 70 30 C66 22 56 20 50 20 C42 20 34 22 30 30 Z" fill="#F97316" stroke="#C2410C" strokeWidth="2" />
    <ellipse cx="50" cy="22" rx="16" ry="6" fill="#EA580C" />
    <circle cx="50" cy="15" r="4" fill="#F59E0B" />

    {/* Tilak */}
    <path d="M49 24 L51 24 L51 29 L49 29 Z" fill="#DC2626" />
    <circle cx="50" cy="30" r="1" fill="#FBBF24" />

    {/* Eyes & Smile */}
    <circle cx="44" cy="33" r="2.2" fill="#1E293B" />
    <circle cx="56" cy="33" r="2.2" fill="#1E293B" />
    <circle cx="45" cy="32" r="0.7" fill="#FFFFFF" />
    <circle cx="57" cy="32" r="0.7" fill="#FFFFFF" />
    
    {/* Cute Mustache */}
    <path d="M42 39 C46 39 48 42 50 40 C52 42 54 39 58 39 C56 42 52 43 50 41 C48 43 44 42 42 39 Z" fill="#78350F" />
    {/* Smile */}
    <path d="M46 43 Q 50 47 54 43" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
    {/* Rosy Cheeks */}
    <circle cx="39" cy="36" r="2" fill="#F87171" opacity="0.6" />
    <circle cx="61" cy="36" r="2" fill="#F87171" opacity="0.6" />

    {/* Waving Arm with Namaste */}
    <g className="animate-wave origin-bottom-right">
      <path d="M68 56 C74 50 82 42 84 34 C82 32 78 34 76 38 C74 44 68 52 66 56 Z" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
      <circle cx="83" cy="33" r="3" fill="#FDE68A" />
    </g>
  </svg>
);

/**
 * 🐄 Cute Village Cow with Garland (Gau Mata)
 */
export const CuteVillageCow: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Body */}
    <ellipse cx="50" cy="58" rx="28" ry="20" fill="#FFFFFF" stroke="#64748B" strokeWidth="2" />
    {/* Brown Patches */}
    <path d="M38 48 C44 42 54 46 50 56 C42 62 36 56 38 48 Z" fill="#B45309" opacity="0.85" />
    <path d="M62 58 C68 54 72 62 66 68 C60 70 58 64 62 58 Z" fill="#B45309" opacity="0.85" />
    
    {/* Legs */}
    <rect x="32" y="72" width="6" height="18" rx="3" fill="#F1F5F9" stroke="#64748B" strokeWidth="1.5" />
    <rect x="42" y="72" width="6" height="18" rx="3" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />
    <rect x="58" y="72" width="6" height="18" rx="3" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />
    <rect x="68" y="72" width="6" height="18" rx="3" fill="#F1F5F9" stroke="#64748B" strokeWidth="1.5" />
    {/* Hooves */}
    <rect x="32" y="86" width="6" height="4" rx="1" fill="#475569" />
    <rect x="42" y="86" width="6" height="4" rx="1" fill="#475569" />
    <rect x="58" y="86" width="6" height="4" rx="1" fill="#475569" />
    <rect x="68" y="86" width="6" height="4" rx="1" fill="#475569" />

    {/* Tail with Tuft */}
    <path d="M22 56 C16 62 14 74 16 80" stroke="#64748B" strokeWidth="2" fill="none" />
    <ellipse cx="16" cy="81" rx="3" ry="5" fill="#78350F" />

    {/* Neck Garland of Marigolds */}
    <path d="M68 44 Q 76 56 82 46" stroke="#D97706" strokeWidth="3" fill="none" />
    <circle cx="72" cy="50" r="3" fill="#F59E0B" />
    <circle cx="76" cy="52" r="3.5" fill="#EA580C" />
    <circle cx="80" cy="49" r="3" fill="#F59E0B" />
    {/* Bell */}
    <circle cx="76" cy="57" r="2.5" fill="#FDE047" stroke="#B45309" strokeWidth="1" />

    {/* Head */}
    <ellipse cx="78" cy="38" rx="12" ry="14" fill="#FFFFFF" stroke="#64748B" strokeWidth="2" />
    <ellipse cx="80" cy="42" rx="7" ry="5" fill="#FED7AA" />
    {/* Nostrils */}
    <circle cx="78" cy="42" r="1.2" fill="#78350F" />
    <circle cx="82" cy="42" r="1.2" fill="#78350F" />

    {/* Horns */}
    <path d="M72 28 C70 20 64 22 66 18 C70 18 75 24 76 26" fill="#94A3B8" stroke="#475569" strokeWidth="1.5" />
    <path d="M84 28 C86 20 92 22 90 18 C86 18 81 24 80 26" fill="#94A3B8" stroke="#475569" strokeWidth="1.5" />

    {/* Ears */}
    <ellipse cx="68" cy="34" rx="6" ry="3" fill="#FED7AA" stroke="#64748B" strokeWidth="1.5" transform="rotate(-20 68 34)" />
    <ellipse cx="88" cy="34" rx="6" ry="3" fill="#FED7AA" stroke="#64748B" strokeWidth="1.5" transform="rotate(20 88 34)" />

    {/* Big Cute Eyes */}
    <circle cx="74" cy="34" r="2.2" fill="#1E293B" />
    <circle cx="82" cy="34" r="2.2" fill="#1E293B" />
    <circle cx="74.8" cy="33.2" r="0.8" fill="#FFFFFF" />
    <circle cx="82.8" cy="33.2" r="0.8" fill="#FFFFFF" />
  </svg>
);

/**
 * 🚜 Cute Red Village Tractor
 */
export const CuteTractor: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} animate-tractor`}>
    {/* Exhaust Pipe with Smoke */}
    <rect x="74" y="16" width="3" height="16" fill="#475569" />
    <circle cx="75.5" cy="10" r="3" fill="#CBD5E1" opacity="0.6" className="animate-float-gentle" />
    <circle cx="78" cy="4" r="4.5" fill="#E2E8F0" opacity="0.4" className="animate-float-gentle" />

    {/* Hood / Engine Body */}
    <path d="M54 32 L84 32 C86 32 88 34 88 38 L88 52 L54 52 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
    {/* Grill */}
    <rect x="82" y="36" width="4" height="12" fill="#7F1D1D" rx="1" />
    <line x1="84" y1="38" x2="84" y2="46" stroke="#F87171" strokeWidth="1" />
    {/* Headlight */}
    <circle cx="86" cy="35" r="2.5" fill="#FDE047" stroke="#B45309" strokeWidth="1" />

    {/* Cabin & Steering */}
    <path d="M30 20 L52 20 L54 52 L26 52 Z" fill="#EF4444" stroke="#991B1B" strokeWidth="2" />
    {/* Window */}
    <path d="M34 24 L48 24 L50 36 L32 36 Z" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.5" />
    {/* Steering */}
    <line x1="48" y1="36" x2="44" y2="30" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
    <circle cx="43" cy="29" r="2.5" fill="none" stroke="#1E293B" strokeWidth="1.5" />

    {/* Seat */}
    <rect x="30" y="34" width="8" height="6" rx="2" fill="#78350F" />

    {/* Big Rear Wheel */}
    <g>
      <circle cx="34" cy="56" r="18" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
      <circle cx="34" cy="56" r="12" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
      <circle cx="34" cy="56" r="5" fill="#FDE047" />
      {/* Treads */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
        <line
          key={idx}
          x1={34 + 13 * Math.cos((angle * Math.PI) / 180)}
          y1={56 + 13 * Math.sin((angle * Math.PI) / 180)}
          x2={34 + 17 * Math.cos((angle * Math.PI) / 180)}
          y2={56 + 17 * Math.sin((angle * Math.PI) / 180)}
          stroke="#475569"
          strokeWidth="2"
        />
      ))}
    </g>

    {/* Small Front Wheel */}
    <g>
      <circle cx="78" cy="62" r="10" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
      <circle cx="78" cy="62" r="6" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
      <circle cx="78" cy="62" r="2.5" fill="#FDE047" />
    </g>
  </svg>
);

/**
 * 🏛️ Cute Illustrated Village Temple & Mandap with Fluttering Saffron Flag
 */
export const CuteTempleMandap: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Base Platform / Chabutara */}
    <rect x="15" y="112" width="110" height="16" rx="4" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
    <rect x="22" y="104" width="96" height="10" rx="3" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
    <path d="M30 114 L30 126 M60 114 L60 126 M90 114 L90 126" stroke="#94A3B8" strokeWidth="1.5" />

    {/* Main Mandap Pillars */}
    <rect x="28" y="68" width="10" height="38" rx="2" fill="#FED7AA" stroke="#EA580C" strokeWidth="1.5" />
    <rect x="52" y="68" width="8" height="38" rx="2" fill="#FED7AA" stroke="#EA580C" strokeWidth="1.5" />
    <rect x="80" y="68" width="8" height="38" rx="2" fill="#FED7AA" stroke="#EA580C" strokeWidth="1.5" />
    <rect x="102" y="68" width="10" height="38" rx="2" fill="#FED7AA" stroke="#EA580C" strokeWidth="1.5" />

    {/* Temple Sanctum Arch & Bell */}
    <path d="M46 104 C46 86 94 86 94 104 Z" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
    
    {/* Ringing Temple Bell */}
    <g className="animate-bell origin-top">
      <line x1="70" y1="72" x2="70" y2="82" stroke="#78350F" strokeWidth="1.5" />
      <path d="M65 82 C65 78 75 78 75 82 L77 88 L63 88 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
      <circle cx="70" cy="90" r="1.5" fill="#78350F" />
    </g>

    {/* Diya inside Mandap */}
    <ellipse cx="70" cy="100" rx="4" ry="1.5" fill="#EA580C" />
    <circle cx="70" cy="98" r="1.5" fill="#FDE047" className="animate-diya" />

    {/* Main Roof Arch & Terracotta Shikhara */}
    <path d="M22 68 L118 68 L108 52 L32 52 Z" fill="#F97316" stroke="#C2410C" strokeWidth="2" />
    <rect x="36" y="46" width="68" height="8" rx="2" fill="#EA580C" stroke="#C2410C" strokeWidth="1.5" />

    {/* Towering Shikhara / Spire */}
    <path d="M46 46 L70 14 L94 46 Z" fill="#F97316" stroke="#C2410C" strokeWidth="2" />
    <path d="M52 46 L70 22 L88 46" stroke="#FDE68A" strokeWidth="2" fill="none" />
    
    {/* Golden Kalash & Coconut */}
    <ellipse cx="70" cy="14" rx="4.5" ry="3" fill="#FDE047" stroke="#D97706" strokeWidth="1" />
    <circle cx="70" cy="10" r="2.5" fill="#78350F" />

    {/* Fluttering Saffron Dhwaja (Flag) */}
    <g className="animate-crop-wave origin-bottom">
      <line x1="70" y1="10" x2="70" y2="0" stroke="#B45309" strokeWidth="2" />
      <path d="M70 0 L86 5 L70 10 Z" fill="#F97316" stroke="#EA580C" strokeWidth="1.5" />
      <circle cx="76" cy="5" r="1.5" fill="#FDE047" />
    </g>
  </svg>
);

/**
 * 🌾 Animated Golden Paddy & Wheat Stalks
 */
export const SwayingCrops: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 50 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} animate-crop-wave`}>
    <path d="M30 58 Q 32 30 20 8" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
    {/* Grains */}
    <ellipse cx="20" cy="10" rx="3" ry="5" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" transform="rotate(-30 20 10)" />
    <ellipse cx="24" cy="16" rx="3" ry="5" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" transform="rotate(30 24 16)" />
    <ellipse cx="22" cy="24" rx="3" ry="5" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" transform="rotate(-30 22 24)" />
    <ellipse cx="27" cy="30" rx="3" ry="5" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" transform="rotate(30 27 30)" />
    
    {/* Second stalk */}
    <path d="M32 58 Q 36 34 44 14" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" />
    <ellipse cx="44" cy="15" rx="2.5" ry="4.5" fill="#EAB308" stroke="#CA8A04" strokeWidth="1" transform="rotate(25 44 15)" />
    <ellipse cx="38" cy="22" rx="2.5" ry="4.5" fill="#EAB308" stroke="#CA8A04" strokeWidth="1" transform="rotate(-25 38 22)" />
    <ellipse cx="42" cy="29" rx="2.5" ry="4.5" fill="#EAB308" stroke="#CA8A04" strokeWidth="1" transform="rotate(25 42 29)" />
  </svg>
);

/**
 * 🐦 Flying Birds Silhouette Flock
 */
export const FlyingBirds: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`overflow-hidden pointer-events-none select-none ${className}`}>
    <div className="animate-bird-fly inline-flex items-center gap-6 opacity-75">
      <svg width="24" height="14" viewBox="0 0 32 18" fill="none" stroke="#334155" strokeWidth="2.5" strokeLinecap="round">
        <path d="M2 12 Q 9 2 16 10 Q 23 2 30 12" />
      </svg>
      <svg width="18" height="11" viewBox="0 0 32 18" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" className="translate-y-2">
        <path d="M2 12 Q 9 2 16 10 Q 23 2 30 12" />
      </svg>
      <svg width="14" height="9" viewBox="0 0 32 18" fill="none" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round" className="-translate-y-2">
        <path d="M2 12 Q 9 2 16 10 Q 23 2 30 12" />
      </svg>
    </div>
  </div>
);

/**
 * 🌤️ Cute Soft Moving Cartoon Clouds
 */
export const CartoonClouds: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`absolute inset-0 pointer-events-none select-none overflow-hidden ${className}`}>
    {/* Cloud 1 */}
    <div className="absolute top-6 left-12 animate-cloud-slow opacity-85">
      <svg width="140" height="60" viewBox="0 0 140 60" fill="none">
        <path d="M20 45 C10 45 0 38 0 28 C0 18 10 12 22 12 C28 4 42 0 54 0 C68 0 80 8 84 18 C92 16 102 20 106 28 C114 28 120 34 120 42 C120 48 114 54 106 54 L20 54 Z" fill="#FFFFFF" fillOpacity="0.85" />
      </svg>
    </div>

    {/* Cloud 2 */}
    <div className="absolute top-16 right-20 animate-cloud-fast opacity-75">
      <svg width="180" height="75" viewBox="0 0 140 60" fill="none">
        <path d="M20 45 C10 45 0 38 0 28 C0 18 10 12 22 12 C28 4 42 0 54 0 C68 0 80 8 84 18 C92 16 102 20 106 28 C114 28 120 34 120 42 C120 48 114 54 106 54 L20 54 Z" fill="#FFFFFF" fillOpacity="0.9" />
      </svg>
    </div>
  </div>
);

/**
 * 🏺 Matka Gullak (Traditional Earthen Clay Pot for Treasury)
 */
export const CartoonMatkaGullak: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Coin falling into slot */}
    <g className="animate-float-gentle">
      <ellipse cx="32" cy="10" rx="6" ry="4" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
      <text x="30" y="12" fontSize="5" fontWeight="bold" fill="#A16207">₹</text>
    </g>

    {/* Pot Rim & Mouth */}
    <ellipse cx="32" cy="20" rx="14" ry="4" fill="#9A3412" stroke="#7C2D12" strokeWidth="2" />
    <ellipse cx="32" cy="19" rx="10" ry="2.5" fill="#7C2D12" />
    {/* Slot */}
    <rect x="26" y="18" width="12" height="2" rx="1" fill="#1E293B" />

    {/* Neck */}
    <path d="M22 20 L20 26 L44 26 L42 20 Z" fill="#C2410C" stroke="#7C2D12" strokeWidth="1.5" />

    {/* Round Clay Belly */}
    <circle cx="32" cy="40" r="18" fill="#EA580C" stroke="#7C2D12" strokeWidth="2.5" />
    <path d="M16 40 C16 48 24 56 32 56 C40 56 48 48 48 40" stroke="#C2410C" strokeWidth="2" fill="none" />

    {/* Decorative White Village Dots (Chuna Painting) */}
    <circle cx="22" cy="38" r="1.5" fill="#FFFFFF" />
    <circle cx="27" cy="42" r="1.5" fill="#FFFFFF" />
    <circle cx="32" cy="44" r="2" fill="#FFFFFF" />
    <circle cx="37" cy="42" r="1.5" fill="#FFFFFF" />
    <circle cx="42" cy="38" r="1.5" fill="#FFFFFF" />
    <path d="M20 34 Q 32 38 44 34" stroke="#FEF08A" strokeWidth="1.5" fill="none" />
  </svg>
);

/**
 * 🌺 Horizontal Toran Garland Wire Divider (Wavy/Snake Wire with Marigold & Mango Leaves)
 */
export const HorizontalToranWireDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`w-full overflow-hidden leading-none pointer-events-none select-none h-3.5 sm:h-4.5 ${className}`}>
    <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1200 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Snake / Wave Wire */}
      <path 
        d="M0 6 Q 50 18 100 6 Q 150 18 200 6 Q 250 18 300 6 Q 350 18 400 6 Q 450 18 500 6 Q 550 18 600 6 Q 650 18 700 6 Q 750 18 800 6 Q 850 18 900 6 Q 950 18 1000 6 Q 1050 18 1100 6 Q 1150 18 1200 6" 
        stroke="#92400E" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />
      
      {/* Hanging Mango Leaves at each trough */}
      {[50, 150, 250, 350, 450, 550, 650, 750, 850, 950, 1050, 1150].map((cx) => (
        <path key={`leaf-${cx}`} d={`M${cx - 7} 13 C${cx - 2} 23, ${cx + 2} 23, ${cx + 7} 13 Z`} fill="#16A34A" stroke="#14532D" strokeWidth="0.8" />
      ))}

      {/* Marigold Orbs at each node */}
      {[0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200].map((cx) => (
        <g key={`bead-${cx}`}>
          <circle cx={cx} cy="6" r="4.5" fill="#EA580C" />
          <circle cx={cx} cy="6" r="3" fill="#F59E0B" />
          <circle cx={cx} cy="6" r="1.5" fill="#FEF08A" />
        </g>
      ))}
    </svg>
  </div>
);

/**
 * 🌺 Vertical Toran Garland Wire Divider (Wavy/Snake Wire for Sidebar edge)
 */
export const VerticalToranWireDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`h-full w-3.5 sm:w-4 overflow-hidden leading-none pointer-events-none select-none ${className}`}>
    <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 24 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Vertical Snake / Wave Wire */}
      <path 
        d="M6 0 Q 18 50 6 100 Q 18 150 6 200 Q 18 250 6 300 Q 18 350 6 400 Q 18 450 6 500 Q 18 550 6 600 Q 18 650 6 700 Q 18 750 6 800 Q 18 850 6 900 Q 18 950 6 1000" 
        stroke="#92400E" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />
      
      {/* Mango Leaves on wave crests */}
      {[50, 150, 250, 350, 450, 550, 650, 750, 850, 950].map((cy) => (
        <path key={`vleaf-${cy}`} d={`M13 ${cy - 7} C23 ${cy - 2}, 23 ${cy + 2}, 13 ${cy + 7} Z`} fill="#16A34A" stroke="#14532D" strokeWidth="0.8" />
      ))}

      {/* Marigold Orbs */}
      {[0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map((cy) => (
        <g key={`vbead-${cy}`}>
          <circle cx="6" cy={cy} r="4.5" fill="#EA580C" />
          <circle cx="6" cy={cy} r="3" fill="#F59E0B" />
          <circle cx="6" cy={cy} r="1.5" fill="#FEF08A" />
        </g>
      ))}
    </svg>
  </div>
);


