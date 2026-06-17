'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@retailpulse.ai');
  const [password, setPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    setError('');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#f5f5f5' }}>
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-teal-600 flex items-center justify-center mx-auto mb-4" style={{ background: '#1B5E5E' }}>
            <span className="text-3xl">⚡</span>
          </div>
          <h1 className="text-4xl font-bold" style={{ color: '#0f172a' }}>RetailPulse AI</h1>
          <p className="mt-1 text-sm font-semibold uppercase tracking-widest" style={{ color: '#64748b' }}>Dynamic Price Intelligence Platform</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg p-8" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.07)', border: '1px solid #e2e8f0' }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#0f172a' }}>Sign in to your account</h2>
          <p className="text-sm mb-6" style={{ color: '#64748b' }}>Enter your credentials to access the dashboard</p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#0f6b6b' }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                style={{ color: '#1e293b', background: '#ffffff' }}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#0f6b6b' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                style={{ color: '#1e293b', background: '#ffffff' }}
              />
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-teal-600 cursor-pointer"
                />
                <span style={{ color: '#0f6b6b' }}>Remember me</span>
              </label>
              <a href="#" className="font-medium" style={{ color: '#0f6b6b' }}>
                Forgot password?
              </a>
            </div>

            {error && <p className="text-sm text-rose-600">{error}</p>}

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg font-bold text-white transition-all duration-200 mt-6"
              style={{ background: '#1B5E5E' }}
              onMouseEnter={e => { (e.target as HTMLElement).style.background = '#0f4d4d'; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.background = '#1B5E5E'; }}
            >
              Sign In
            </button>
          </form>

          {/* Demo Note */}
          <p className="text-center text-xs mt-6" style={{ color: '#64748b' }}>
            Demo credentials pre-filled — just click <span className="font-semibold">Sign In</span>
          </p>
        </div>
      </div>
    </div>
  );
}
