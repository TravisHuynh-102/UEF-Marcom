'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Hls from 'hls.js';
import { useRole } from '@/context/role-context';

export default function LoginPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const { setCurrentRole } = useRole();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // HLS Setup
    if (videoRef.current) {
      const videoSrc = 'https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8';
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
          videoRef.current?.play().catch(e => console.log('Autoplay prevented:', e));
        });
        
        return () => hls.destroy();
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = videoSrc;
        videoRef.current.addEventListener('loadedmetadata', function() {
          videoRef.current?.play().catch(e => console.log('Autoplay prevented:', e));
        });
      }
    }
  }, []);

  useEffect(() => {
    // Parallax
    const handleMouseMove = (e: MouseEvent) => {
      if (cardRef.current) {
        const x = (window.innerWidth / 2 - e.pageX) / 50;
        const y = (window.innerHeight / 2 - e.pageY) / 50;
        cardRef.current.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const emailLower = email.toLowerCase();
    
    // Demo Authentication Logic
    if (emailLower.includes('manager') || emailLower === 'sarah@teamos.ai') {
      setCurrentRole('Manager');
      router.push('/');
    } else if (emailLower.includes('leader') || emailLower === 'aisha@teamos.ai') {
      setCurrentRole('Leader');
      router.push('/');
    } else if (emailLower.includes('staff') || emailLower === 'priya@teamos.ai') {
      setCurrentRole('Staff');
      router.push('/');
    } else {
      setError('Tài khoản không tồn tại. Vui lòng nhập manager@uef.marcom, leader@... hoặc staff@...');
    }
  };

  return (
    <div className="w-full flex-1 bg-black text-white min-h-screen font-['Barlow_Condensed'] overflow-hidden">
      {/* Video Background */}
      <div className="fixed inset-0 z-0 overflow-hidden bg-black pointer-events-none">
        <video 
          ref={videoRef}
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 vignette-overlay" />
        <div className="absolute top-0 left-0 w-full gradient-fade-top z-10" />
        <div className="absolute bottom-0 left-0 w-full gradient-fade-bottom z-10" />
      </div>

      {/* Main Content */}
      <main className="relative z-20 flex min-h-screen items-center justify-center px-[20px] md:px-[80px]">
        {/* Login Card */}
        <div 
          ref={cardRef}
          className="w-full max-w-[440px] liquid-glass-strong rounded-[28px] p-10 md:p-12 transition-transform duration-75 ease-out"
          style={{ perspective: '1000px' }}
        >
          <header className="mb-10 text-center">
            <h1 className="font-['Instrument_Serif'] text-[48px] leading-[56px] italic tracking-tighter text-white mb-2">
              UEF Marcom
            </h1>
            <p className="text-[#c4c7c8] text-[12px] leading-[16px] tracking-[0.1em] font-semibold uppercase">
              Truy cập vào không gian sáng tạo
            </p>
          </header>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1.5">
              <label className="block text-[12px] leading-[16px] tracking-[0.1em] font-semibold text-[#8e9192] px-1" htmlFor="email">
                EMAIL HOẶC ID
              </label>
              <input 
                id="email" 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="manager@uef.marcom" 
                className="w-full h-14 px-5 rounded-[16px] text-white placeholder-white/30 input-glass text-[16px] tracking-[0.02em]" 
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="block text-[12px] leading-[16px] tracking-[0.1em] font-semibold text-[#8e9192]" htmlFor="password">
                  MẬT KHẨU
                </label>
                <a href="#" className="text-[12px] leading-[16px] tracking-[0.1em] font-semibold text-[#c4c7c8] hover:text-white transition-colors">
                  Bạn quên mật khẩu?
                </a>
              </div>
              <input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full h-14 px-5 rounded-[16px] text-white placeholder-white/30 input-glass text-[16px] tracking-[0.02em]" 
                required
              />
            </div>

            {error && (
              <div className="text-red-400 text-[14px] text-center px-2 py-1 bg-red-900/20 rounded-md border border-red-500/30">
                {error}
              </div>
            )}
            
            <button 
              type="submit" 
              className="btn-premium w-full h-14 bg-white text-black font-semibold rounded-[16px] flex items-center justify-center gap-2 group mt-2"
            >
              <span className="text-[20px] tracking-[0.01em]">Đăng nhập</span>
              <span className="material-symbols-outlined text-xl group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                arrow_outward
              </span>
            </button>
          </form>
          
          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <a href="#" className="inline-block text-[#c4c7c8] hover:text-white text-[16px] transition-colors group">
              Tạo ID UEF Marcom mới
              <div className="h-px bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left mt-0.5"></div>
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 w-full z-30">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-[20px] md:px-[80px] py-[24px] max-w-[1440px] mx-auto border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="font-['Instrument_Serif'] text-[32px] italic text-white md:hidden mb-4">
            UEF Marcom
          </div>
          <div className="text-[12px] tracking-[0.1em] font-semibold text-[#8e9192] order-3 md:order-1">
            © 2026 UEF Marcom Studio. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-8 mb-4 md:mb-0 order-2">
            <a href="#" className="text-[#8e9192] hover:text-white transition-colors text-[12px] tracking-[0.1em] font-semibold uppercase">Privacy</a>
            <a href="#" className="text-[#8e9192] hover:text-white transition-colors text-[12px] tracking-[0.1em] font-semibold uppercase">Terms</a>
            <a href="#" className="text-[#8e9192] hover:text-white transition-colors text-[12px] tracking-[0.1em] font-semibold uppercase">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
